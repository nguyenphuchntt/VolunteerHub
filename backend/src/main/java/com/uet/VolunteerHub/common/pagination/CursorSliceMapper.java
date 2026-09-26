package com.uet.VolunteerHub.common.pagination;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;

/**
 * Assembles a {@link CursorPage} from a raw row list fetched with the "probe row" trick.
 *
 * <p>Callers ask the repository for {@code size + 1} rows. The extra row is never returned to the
 * client — it exists only to answer "is there another page?" without running a {@code COUNT(*)}
 * query, which is the whole point of keyset pagination.
 *
 * <p>The single subtle rule lives here: <strong>the next cursor must be built from the last row of
 * the trimmed page</strong> (index {@code size - 1}), never from the probe row. Using the probe row
 * would silently skip one item per page.
 */
@Component
public class CursorSliceMapper {

    private final CursorCodec cursorCodec;

    public CursorSliceMapper(CursorCodec cursorCodec) {
        this.cursorCodec = cursorCodec;
    }

    /**
     * @param rows         rows fetched with a limit of {@code size + 1}
     * @param size         page size requested by the client
     * @param scope        listing scope, embedded into the emitted cursor
     * @param keyExtractor extracts the cursor key from an entity
     * @param mapper       converts an entity into its API DTO
     * @return the page, with {@code hasNext} derived from the probe row
     */
    public <E, D> CursorPage<D> toPage(List<E> rows,
                                       int size,
                                       String scope,
                                       Function<E, CursorKey> keyExtractor,
                                       Function<E, D> mapper) {
        boolean hasNext = rows.size() > size;
        List<E> page = hasNext
                ? List.copyOf(rows.subList(0, size))
                : List.copyOf(rows);

        String nextCursor = null;
        if (hasNext) {
            E last = page.get(page.size() - 1);
            nextCursor = cursorCodec.encode(scope, keyExtractor.apply(last));
        }

        return new CursorPage<>(
                page.stream().map(mapper).toList(),
                nextCursor,
                hasNext,
                size);
    }
}
