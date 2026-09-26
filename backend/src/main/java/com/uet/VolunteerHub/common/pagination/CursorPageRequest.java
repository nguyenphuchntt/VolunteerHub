package com.uet.VolunteerHub.common.pagination;

import org.springframework.data.domain.Sort;

/**
 * Validated request parameters for a cursor-paginated endpoint.
 *
 * @param cursor    opaque token from the previous page; {@code null}/blank means first page
 * @param size      number of items to return, between {@value #MIN_SIZE} and {@value #MAX_SIZE}
 * @param direction sort direction of the listing's time column. Ties are always broken by the
 *                  primary key in the same direction.
 */
public record CursorPageRequest(
        String cursor,
        int size,
        Sort.Direction direction
) {

    public static final int DEFAULT_SIZE = 20;
    public static final int MAX_SIZE = 100;
    public static final int MIN_SIZE = 1;

    public CursorPageRequest {
        if (size < MIN_SIZE || size > MAX_SIZE) {
            throw new IllegalArgumentException(
                    "size must be between " + MIN_SIZE + " and " + MAX_SIZE + " but was " + size);
        }
        if (direction == null) {
            direction = Sort.Direction.DESC;
        }
    }

    /**
     * Build a request for a descending (newest-first) listing — the default for feeds.
     */
    public static CursorPageRequest of(String cursor, int size) {
        return new CursorPageRequest(cursor, size, Sort.Direction.DESC);
    }

    /**
     * Build a request for an ascending (oldest-first) listing, e.g. comment replies.
     */
    public static CursorPageRequest ascending(String cursor, int size) {
        return new CursorPageRequest(cursor, size, Sort.Direction.ASC);
    }
}
