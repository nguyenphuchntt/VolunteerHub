package com.uet.VolunteerHub.common.pagination;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uet.VolunteerHub.exception.InvalidCursorException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests for {@link CursorCodec}. No Spring context — the codec only needs a plain
 * {@link ObjectMapper}.
 */
class CursorCodecTest {

    private static final String SCOPE = "post.search.createAt";
    private static final Instant TIMESTAMP = Instant.parse("2026-01-31T10:15:30Z");

    private final CursorCodec codec = new CursorCodec(new ObjectMapper());

    @Test
    @DisplayName("round-trips a key through encode/decode")
    void roundTrip() {
        CursorKey key = new CursorKey(TIMESTAMP, 42L);

        CursorKey decoded = codec.decode(codec.encode(SCOPE, key), SCOPE);

        assertThat(decoded).isEqualTo(key);
    }

    @Test
    @DisplayName("encodes as base64url without padding")
    void encodingIsUrlSafe() {
        String encoded = codec.encode(SCOPE, new CursorKey(TIMESTAMP, 1L));

        assertThat(encoded).doesNotContain("+", "/", "=");
        assertThat(Base64.getUrlDecoder().decode(encoded)).isNotEmpty();
    }

    @Test
    @DisplayName("null or blank cursor means first page, not an error")
    void nullCursorIsFirstPage() {
        assertThat(codec.decode(null, SCOPE)).isNull();
        assertThat(codec.decode("", SCOPE)).isNull();
        assertThat(codec.decode("   ", SCOPE)).isNull();
    }

    @Test
    @DisplayName("rejects a cursor issued for a different listing")
    void rejectsScopeMismatch() {
        String encoded = codec.encode("comment.byPost.createdAt", new CursorKey(TIMESTAMP, 7L));

        assertThatThrownBy(() -> codec.decode(encoded, SCOPE))
                .isInstanceOf(InvalidCursorException.class)
                .hasMessageContaining("different listing");
    }

    @Test
    @DisplayName("rejects a cursor whose version is not the current one")
    void rejectsUnknownVersion() {
        String encoded = encodeJson("{\"v\":99,\"scope\":\"" + SCOPE + "\",\"ts\":\""
                + TIMESTAMP + "\",\"id\":1}");

        assertThatThrownBy(() -> codec.decode(encoded, SCOPE))
                .isInstanceOf(InvalidCursorException.class)
                .hasMessageContaining("Unsupported cursor version");
    }

    @Test
    @DisplayName("rejects a cursor that is not valid base64url")
    void rejectsMalformedBase64() {
        assertThatThrownBy(() -> codec.decode("not!valid!base64!", SCOPE))
                .isInstanceOf(InvalidCursorException.class)
                .hasMessageContaining("base64url");
    }

    @Test
    @DisplayName("rejects a cursor whose payload is not JSON")
    void rejectsNonJsonPayload() {
        String encoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("not json at all".getBytes(StandardCharsets.UTF_8));

        assertThatThrownBy(() -> codec.decode(encoded, SCOPE))
                .isInstanceOf(InvalidCursorException.class)
                .hasMessageContaining("JSON");
    }

    @Test
    @DisplayName("names the missing field instead of failing with a NullPointerException")
    void reportsMissingField() {
        String encoded = encodeJson("{\"v\":1,\"scope\":\"" + SCOPE + "\"}");

        assertThatThrownBy(() -> codec.decode(encoded, SCOPE))
                .isInstanceOf(InvalidCursorException.class)
                .hasMessageContaining("'ts'");
    }

    @Test
    @DisplayName("rejects a non-ISO-8601 timestamp")
    void rejectsBadTimestamp() {
        String encoded = encodeJson("{\"v\":1,\"scope\":\"" + SCOPE + "\",\"ts\":\"yesterday\",\"id\":1}");

        assertThatThrownBy(() -> codec.decode(encoded, SCOPE))
                .isInstanceOf(InvalidCursorException.class)
                .hasMessageContaining("ISO-8601");
    }

    @Test
    @DisplayName("a blank scope is a server bug, not a client error")
    void blankScopeIsServerError() {
        assertThatThrownBy(() -> codec.encode("", new CursorKey(TIMESTAMP, 1L)))
                .isInstanceOf(IllegalStateException.class);
    }

    private static String encodeJson(String json) {
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(json.getBytes(StandardCharsets.UTF_8));
    }
}
