package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.*;
import com.uet.VolunteerHub.dto.Post.CommentCountResponse;
import com.uet.VolunteerHub.dto.Post.LikeCountResponse;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.CommentService;
import com.uet.VolunteerHub.service.PostLikeService;
import com.uet.VolunteerHub.service.PostReadService;
import com.uet.VolunteerHub.service.PostWriteService;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for post-related operations
 */
@Log
@RestController
@RequestMapping("api/posts")
public class PostController {
    private final PostReadService postReadService;
    private final PostWriteService postWriteService;
    private final PostLikeService postLikeService;
    private final CommentService commentService;

    @Autowired
    public PostController(PostReadService postReadService, PostWriteService postWriteService, PostLikeService postLikeService, CommentService commentService) {
        this.postReadService = postReadService;
        this.postWriteService = postWriteService;
        this.postLikeService = postLikeService;
        this.commentService = commentService;
    }

    /**
     * Get post by ID
     * @param postId post ID
     * @return post details
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostReadDTO> searchPostById(@PathVariable("id") Long postId) {
        PostReadDTO result = postReadService.findPostById(postId);
        return ResponseEntity.ok(result);
    }

    /**
     * Search posts with filters
     * @param content filter by content
     * @param ownerUsername filter by owner
     * @param eventId filter by event
     * @param pageable pagination
     * @return page of posts
     */
    @GetMapping("/search")
    public ResponseEntity<Page<PostReadDTO>> searchPosts(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) String ownerUsername,
            @RequestParam(required = false) Long eventId,
            Pageable pageable) {
        Page<PostReadDTO> postsPage = postReadService.searchPost(content, ownerUsername, eventId, pageable);
        return ResponseEntity.ok(postsPage);
    }

    /**
     * Get posts by event
     * @param eventId event ID
     * @param pageable pagination
     * @return page of posts
     */
    @GetMapping("/by-event/{eventId}")
    public ResponseEntity<Page<PostReadDTO>> getPostByEvent(
            @PathVariable Long eventId,
            Pageable pageable) {
        Page<PostReadDTO> posts = postReadService.findPostByEvent(eventId, pageable);
        return ResponseEntity.ok(posts);
    }

    /**
     * Get posts by owner username
     * @param username owner username
     * @param pageable pagination
     * @return page of posts
     */
    @GetMapping("/by-account/{username}")
    public ResponseEntity<Page<PostReadDTO>> getPostsByOwner(
            @PathVariable String username,
            Pageable pageable) {
        Page<PostReadDTO> postsPage = postReadService.findPostByOwner(username, pageable);
        return ResponseEntity.ok(postsPage);
    }

    /**
     * Get posts liked by an account (Admin only)
     * @param accountId account ID
     * @param pageable pagination
     * @return page of liked posts
     */
    @GetMapping("/liked-by/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PostReadDTO>> getPostsLikedByAccount(
            @PathVariable java.util.UUID accountId,
            Pageable pageable) {
        Page<PostReadDTO> postsPage = postReadService.getPostsLikedByAccount(accountId, pageable);
        return ResponseEntity.ok(postsPage);
    }

    /**
     * Get like count for a post
     * @param postId post ID
     * @return like count
     */
    @GetMapping("{id}/like-count")
    public ResponseEntity<LikeCountResponse> getPostLikeCount(
            @PathVariable("id") Long postId) {
        return ResponseEntity.ok(LikeCountResponse.builder()
                        .count(postLikeService.countPostLikeByPost(postId))
                .build());
    }

    /**
     * Toggle like on a post
     * @param dto like data
     * @return current like status
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping("{id}/toggle-like")
    public ResponseEntity<Map<String, Boolean>> toggleLike(@RequestBody @Valid PostLikeDTO dto) {
        boolean isNowLiked = postLikeService.toggleLikePost(dto);
        return ResponseEntity.ok(Map.of("isLiked", isNowLiked));
    }

    /**
     * Check if post is liked by user
     * @param account authenticated account
     * @param postId post ID
     * @return true if liked
     */
    @PostMapping("{id}/is-liked")
    public ResponseEntity<Map<String, Boolean>> isPostLiked(@AuthenticationPrincipal Account account,
                                                             @PathVariable("id") Long postId) {
        boolean isLiked = postLikeService.isPostLiked(account, postId);
        return ResponseEntity.ok(Map.of("isLiked", isLiked));
    }

    /**
     * Get comments for a post
     * @param postId post ID
     * @param pageable pagination
     * @return page of comments
     */
    @GetMapping("{id}/comments")
    public ResponseEntity<Page<CommentReadDTO>> getCommentsByPost(
            @PathVariable("id") Long postId,
            Pageable pageable) {
        Page<CommentReadDTO> comments = commentService.findAllByPost(postId, pageable);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get comment count for a post
     * @param postId post ID
     * @return comment count
     */
    @GetMapping("{id}/comments/count")
    public ResponseEntity<CommentCountResponse> getCommentCount(
            @PathVariable("id") Long postId) {
        return ResponseEntity.ok(CommentCountResponse.builder()
                .count(commentService.countCommentsByPost(postId))
                .build());
    }

    /**
     * Create a new post
     * @param postCreateDTO post data
     * @return created post
     */
    @PreAuthorize("hasRole('ADMIN') or @postSecurityService.canCreatePost(#postCreateDTO.eventId)")
    @PostMapping
    public ResponseEntity<PostReadDTO> createPost(@RequestBody @Valid PostCreateDTO postCreateDTO) {
        PostReadDTO newPost = postWriteService.createPost(postCreateDTO);
        return new ResponseEntity<>(newPost, HttpStatus.CREATED);
    }

    /**
     * Update post content
     * @param id post ID
     * @param dto updated content
     * @return updated post
     */
    @PreAuthorize("hasRole('ADMIN') or @postSecurityService.canModifyPost(#id)")
    @PatchMapping("/{id}/content")
    public ResponseEntity<PostReadDTO> updatePostContent(
            @PathVariable Long id,
            @RequestBody @Valid PostContentUpdateDTO dto) {
        PostReadDTO updatedPost = postWriteService.updatePostContent(id, dto);
        return ResponseEntity.ok(updatedPost);
    }

    /**
     * Update post type
     * @param id post ID
     * @param dto new type
     * @return updated post
     */
    @PreAuthorize("hasRole('ADMIN') or @postSecurityService.canModifyPost(#id)")
    @PatchMapping("/{id}/type")
    public ResponseEntity<PostReadDTO> updatePostType(
            @PathVariable Long id,
            @RequestBody @Valid PostTypeUpdateDTO dto) {
        PostReadDTO updatedPost = postWriteService.updatePostType(id, dto);
        return ResponseEntity.ok(updatedPost);
    }

    /**
     * Update post's associated event
     * @param id post ID
     * @param dto new event
     * @return updated post
     */
    @PreAuthorize("hasRole('ADMIN') or @postSecurityService.canModifyPost(#id)")
    @PatchMapping("/{id}/event")
    public ResponseEntity<PostReadDTO> updatePostEvent(
            @PathVariable Long id,
            @RequestBody @Valid PostEventUpdateDTO dto) {
        PostReadDTO updatedPost = postWriteService.updatePostEvent(id, dto);
        return ResponseEntity.ok(updatedPost);
    }

    /**
     * Update post status
     * @param id post ID
     * @param dto new status
     * @return updated post
     */
    @PreAuthorize("hasRole('ADMIN') or @postSecurityService.canModifyPost(#id)")
    @PatchMapping("/{id}/status")
    public ResponseEntity<PostReadDTO> updatePostStatus(
            @PathVariable Long id,
            @RequestBody @Valid PostStatusUpdateDTO dto) {
        PostReadDTO updatedPost = postWriteService.updatePostStatus(id, dto);
        return ResponseEntity.ok(updatedPost);
    }

    /**
     * Delete a post
     * @param postId post ID
     * @return void
     */
    @PreAuthorize("hasRole('ADMIN') or @postSecurityService.canModifyPost(#postId)")
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        boolean isDeleted = postWriteService.deletePost(postId);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
