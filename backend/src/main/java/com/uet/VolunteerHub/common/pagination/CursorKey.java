package com.uet.VolunteerHub.common.pagination;

import java.time.Instant;

/**
 * Cursor key tuple for keyset pagination: the value of the sort column plus the
 * primary key as an unambiguous tie-breaker.
 *
 * <p>The sort column is chosen by the query, not by this record — {@code sortValue} is
 * {@code created_at} for most listings, but may be {@code start_at}, {@code registered_at}, …
 * The name is deliberately generic so a cursor issued for an event feed does not pretend to
 * carry a "createdAt".
 *
 * @param sortValue value of the column the listing is ordered by
 * @param id        primary key of the row, used to break ties on equal {@code sortValue}
 */
public record CursorKey(
    Instant sortValue,
    Long id
) {
    public CursorKey {
        if (sortValue == null || id == null) {
            throw new IllegalArgumentException("CursorKey fields cannot be null");
        }
    }
}
