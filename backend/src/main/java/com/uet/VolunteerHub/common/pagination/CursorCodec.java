package com.uet.VolunteerHub.common.pagination;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.uet.VolunteerHub.exception.InvalidCursorException;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Base64;

/**
 * Encodes/decodes a {@link CursorKey} as an opaque base64url (no padding) JSON token.
 *
 * <p>Payload format:
 * <pre>{"v":1,"scope":"post.search.createAt","ts":"2026-01-31T10:15:30Z","id":123}</pre>
 *
 * <p>Every cursor is bound to a <em>scope</em> — a string identifying the listing that issued it.
 * {@link #decode(String, String)} rejects a cursor whose scope does not match the scope of the
 * endpoint being called. Without this, a client that keeps a cursor while changing filters (a
 * different {@code eventId}, a different username, …) would silently receive wrong data instead of
 * an error.
 *
 * <p>Failure modes are deliberately split:
 * <ul>
 *   <li>decode failure → {@link InvalidCursorException} → HTTP 400 (the client sent garbage)</li>
 *   <li>encode failure → {@link IllegalStateException} → HTTP 500 (a server-side bug; the client
 *       cannot cause it)</li>
 * </ul>
 */
@Component
public class CursorCodec {

    private static final int CURRENT_VERSION = 1;

    private static final String FIELD_VERSION = "v";
    private static final String FIELD_SCOPE = "scope";
    private static final String FIELD_TIMESTAMP = "ts";
    private static final String FIELD_ID = "id";

    private final ObjectMapper objectMapper;

    public CursorCodec(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Encode a cursor key into an opaque token bound to {@code scope}.
     *
     * @param scope identifies the listing + sort that issued this cursor
     * @param key   position of the last row of the page
     * @return base64url token, safe to hand to a client
     * @throws IllegalStateException if serialization fails — a server bug, not a client error
     */
    public String encode(String scope, CursorKey key) {
        if (scope == null || scope.isBlank()) {
            throw new IllegalStateException("Cursor scope must not be blank");
        }
        try {
            ObjectNode node = objectMapper.createObjectNode();
            node.put(FIELD_VERSION, CURRENT_VERSION);
            node.put(FIELD_SCOPE, scope);
            node.put(FIELD_TIMESTAMP, key.sortValue().toString());
            node.put(FIELD_ID, key.id());
            String json = objectMapper.writeValueAsString(node);
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(json.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to encode cursor", e);
        }
    }

    /**
     * Decode a cursor token previously issued for {@code expectedScope}.
     *
     * @param cursor        the raw token; {@code null} or blank means "first page" and yields {@code null}
     * @param expectedScope scope of the listing being requested; must match the scope embedded in the token
     * @return the decoded key, or {@code null} for the first page
     * @throws InvalidCursorException if the token is malformed, from another version, or issued for a
     *                                different listing
     */
    public CursorKey decode(String cursor, String expectedScope) {
        if (cursor == null || cursor.isBlank()) {
            return null;
        }

        JsonNode node;
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(cursor);
            node = objectMapper.readTree(new String(decoded, StandardCharsets.UTF_8));
        } catch (IllegalArgumentException e) {
            throw new InvalidCursorException("Cursor is not valid base64url", e);
        } catch (Exception e) {
            throw new InvalidCursorException("Cursor payload is not valid JSON", e);
        }

        if (node == null || !node.isObject()) {
            throw new InvalidCursorException("Cursor payload must be a JSON object");
        }

        int version = requireInt(node, FIELD_VERSION);
        if (version != CURRENT_VERSION) {
            throw new InvalidCursorException("Unsupported cursor version: " + version);
        }

        String scope = requireText(node, FIELD_SCOPE);
        if (expectedScope != null && !expectedScope.equals(scope)) {
            throw new InvalidCursorException(
                    "Cursor was issued for a different listing; restart from the first page");
        }

        Instant sortValue;
        try {
            sortValue = Instant.parse(requireText(node, FIELD_TIMESTAMP));
        } catch (DateTimeParseException e) {
            throw new InvalidCursorException("Cursor timestamp is not a valid ISO-8601 instant", e);
        }

        return new CursorKey(sortValue, requireLong(node, FIELD_ID));
    }

    private static JsonNode require(JsonNode node, String field) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) {
            throw new InvalidCursorException("Cursor is missing the '" + field + "' field");
        }
        return value;
    }

    private static int requireInt(JsonNode node, String field) {
        JsonNode value = require(node, field);
        if (!value.canConvertToInt()) {
            throw new InvalidCursorException("Cursor field '" + field + "' must be an integer");
        }
        return value.asInt();
    }

    private static long requireLong(JsonNode node, String field) {
        JsonNode value = require(node, field);
        if (!value.canConvertToLong()) {
            throw new InvalidCursorException("Cursor field '" + field + "' must be a number");
        }
        return value.asLong();
    }

    private static String requireText(JsonNode node, String field) {
        JsonNode value = require(node, field);
        if (!value.isTextual() || value.asText().isBlank()) {
            throw new InvalidCursorException("Cursor field '" + field + "' must be a non-empty string");
        }
        return value.asText();
    }
}
