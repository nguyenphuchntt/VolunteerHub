package com.uet.VolunteerHub.common.pagination;

import java.util.List;

/**
 * Cursor-based pagination response envelope. Replaces Spring's {@code Page<T>} for the long
 * listings that use keyset pagination.
 *
 * <p>Deliberately absent: {@code totalElements} and {@code totalPages}. Computing them would
 * require the {@code COUNT(*)} query that keyset pagination exists to avoid, and they are
 * meaningless while a client is scrolling a feed that keeps growing.
 *
 * @param content    items of this page; may be shorter than {@code size} on the last page
 * @param nextCursor token to pass back as {@code ?cursor=} for the next page; {@code null} when
 *                   {@code hasNext} is {@code false}
 * @param hasNext    whether another page exists
 * @param size       page size that was <em>requested</em> — not the number of items in
 *                   {@code content}
 * @param <T>        content type
 */
public record CursorPage<T>(
        List<T> content,
        String nextCursor,
        boolean hasNext,
        int size
) {
    public CursorPage {
        content = content == null ? List.of() : List.copyOf(content);
    }
}
