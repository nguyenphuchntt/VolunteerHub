package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.common.pagination.CursorCodec;
import com.uet.VolunteerHub.common.pagination.CursorKey;
import com.uet.VolunteerHub.common.pagination.CursorPage;
import com.uet.VolunteerHub.common.pagination.CursorPageRequest;
import com.uet.VolunteerHub.common.pagination.CursorSliceMapper;
import com.uet.VolunteerHub.dto.Post.PostReadDTO;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.entity.PostLike;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.mapper.PostMapper;
import com.uet.VolunteerHub.repository.PostLikeRepository;
import com.uet.VolunteerHub.repository.PostRepository;
import com.uet.VolunteerHub.repository.specification.PostSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.java.Log;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


/**
 * Service for reading post data
 */
@Log
@AllArgsConstructor
@Service
public class PostReadService {

    /**
     * Cursor scopes. A cursor is bound to the listing that issued it, so a token minted for one
     * filter set cannot be replayed against another. Keep these values stable — changing one
     * invalidates every cursor already handed out for that listing.
     */
    static final String SCOPE_SEARCH = "post.search.createAt";
    static final String SCOPE_BY_EVENT = "post.byEvent.createAt";
    static final String SCOPE_BY_OWNER = "post.byOwner.createAt";

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostMapper postMapper;
    private final PostSpecification postSpecification;
    private final CursorCodec cursorCodec;
    private final CursorSliceMapper cursorSliceMapper;

    /**
     * Find post by ID
     * @param postId post ID
     * @return post details
     */
    @Transactional(readOnly = true)
    public PostReadDTO findPostById(Long postId) {
        Optional<Post> postOptional = postRepository.findByPostId(postId);
        if (postOptional.isEmpty()) {
            throw new ResourceNotFoundException("Not found post by ID: " + postId);
        }
        Post post = postOptional.get();
        return postMapper.toPostReadDTO(post);
    }

    /**
     * Search posts with filters, newest first, using keyset pagination.
     *
     * @param content filter by content
     * @param ownerUsername filter by owner
     * @param eventId filter by event
     * @param request cursor + page size
     * @return one page of posts plus the cursor for the next page
     */
    @Transactional(readOnly = true)
    public CursorPage<PostReadDTO> searchPostsAfter(String content, String ownerUsername, Long eventId,
                                                    CursorPageRequest request) {
        Specification<Post> spec = combine(
                postSpecification.contentLike(content),
                postSpecification.hasOwner(ownerUsername),
                postSpecification.isInEvent(eventId),
                postSpecification.isNotDeleted());
        return fetchPage(spec, request, SCOPE_SEARCH);
    }

    /**
     * Find posts by owner username, newest first, using keyset pagination.
     *
     * @param ownerUsername owner username
     * @param request cursor + page size
     * @return one page of posts plus the cursor for the next page
     */
    @Transactional(readOnly = true)
    public CursorPage<PostReadDTO> findPostsByOwnerAfter(String ownerUsername, CursorPageRequest request) {
        Specification<Post> spec = combine(
                postSpecification.hasOwner(ownerUsername),
                postSpecification.isNotDeleted());
        return fetchPage(spec, request, SCOPE_BY_OWNER);
    }

    /**
     * Find posts by event ID, newest first, using keyset pagination.
     *
     * @param eventId event ID
     * @param request cursor + page size
     * @return one page of posts plus the cursor for the next page
     */
    @Transactional(readOnly = true)
    public CursorPage<PostReadDTO> findPostsByEventAfter(Long eventId, CursorPageRequest request) {
        Specification<Post> spec = combine(
                postSpecification.isInEvent(eventId),
                postSpecification.isNotDeleted());
        return fetchPage(spec, request, SCOPE_BY_EVENT);
    }

    /**
     * Shared keyset read: decode the cursor, add the "after this position" condition, fetch one row
     * more than requested to detect whether a further page exists, then trim and map.
     */
    private CursorPage<PostReadDTO> fetchPage(Specification<Post> spec,
                                              CursorPageRequest request,
                                              String scope) {
        CursorKey key = cursorCodec.decode(request.cursor(), scope);
        Sort sort = Sort.by(request.direction(),
                PostSpecification.SORT_FIELD_TIME,
                PostSpecification.SORT_FIELD_ID);

        List<Post> rows = postRepository.findSlice(
                combine(spec, postSpecification.cursorAfter(key, request.direction())),
                sort,
                request.size() + 1);

        return cursorSliceMapper.toPage(rows, request.size(), scope,
                post -> new CursorKey(post.getCreateAt(), post.getPostId()),
                postMapper::toPostReadDTO);
    }

    /**
     * Combine specifications, skipping the {@code null} entries that the individual filter methods
     * return when their parameter is absent.
     */
    @SafeVarargs
    private static Specification<Post> combine(Specification<Post>... specs) {
        List<Specification<Post>> present = new ArrayList<>(specs.length);
        for (Specification<Post> spec : specs) {
            if (spec != null) {
                present.add(spec);
            }
        }
        if (present.isEmpty()) {
            return null;
        }
        Specification<Post> combined = present.get(0);
        for (int i = 1; i < present.size(); i++) {
            combined = combined.and(present.get(i));
        }
        return combined;
    }

    /**
     * Get posts liked by an account
     * @param accountId account ID
     * @param pageable pagination
     * @return page of liked posts
     */
    @Transactional(readOnly = true)
    public Page<PostReadDTO> getPostsLikedByAccount(UUID accountId, Pageable pageable) {
        Page<PostLike> postLikes = postLikeRepository.findAllByAccount_AccountId(accountId, pageable);
        return postLikes.map(postLike -> postMapper.toPostReadDTO(postLike.getPost()));
    }
}
