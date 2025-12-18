package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.CommentReadDTO;
import com.uet.VolunteerHub.dto.Post.CreateCommentRequest;
import com.uet.VolunteerHub.dto.Post.CreateCommentResponse;
import com.uet.VolunteerHub.service.CommentService;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.uet.VolunteerHub.dto.CommentCreateDTO;

@Log
@RestController
@RequestMapping("api/comments")
public class CommentController {
    private final CommentService commentService;
    private final com.uet.VolunteerHub.service.CommentSecurityService commentSecurityService;

    @Autowired
    public CommentController(CommentService commentService, com.uet.VolunteerHub.service.CommentSecurityService commentSecurityService) {
        this.commentService = commentService;
        this.commentSecurityService = commentSecurityService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CommentReadDTO>> searchComment(
            @RequestParam(required = true) Long postId,
            @RequestParam(required = false, defaultValue = "true") boolean rootOnly,
            Pageable pageable) {
        Page<CommentReadDTO> comments = commentService.searchComments(postId, rootOnly, pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{parentCommentId}/replies")
    public ResponseEntity<Page<CommentReadDTO>> getCommentsByParent(
            @PathVariable Long parentCommentId,
            Pageable pageable) {
        Page<CommentReadDTO> comments = commentService.getRepliesForComment(parentCommentId, pageable);
        return ResponseEntity.ok(comments);
    }

    @PreAuthorize("hasRole('ADMIN') or @commentSecurityService.canCreateComment(#request.postId)")
    @PostMapping
    public ResponseEntity<CreateCommentResponse> createComment(
            @RequestBody @Valid CreateCommentRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.uet.VolunteerHub.entity.Account account) {
        CommentCreateDTO dto = CommentCreateDTO.builder()
                .content(request.getContent())
                .postId(request.getPostId())
                .parentCommentId(request.getParentCommentId())
                .createdByAccountId(account.getAccountId())
                .build();
        CommentReadDTO result = commentService.createComment(dto);
        return ResponseEntity.ok(CreateCommentResponse.builder()
                .id(result.getCommentId())
                .content(result.getContent())
                .createdAt(result.getCreateAt())
                .createdBy(result.getOwnerUsername())
                .build());
    }

    @PreAuthorize("hasRole('ADMIN') or @commentSecurityService.canModifyComment(#commentId)")
    @PatchMapping("/{commentId}/content")
    public ResponseEntity<CommentReadDTO> updateCommentContent(
            @PathVariable Long commentId,
            @RequestBody @Valid com.uet.VolunteerHub.dto.CommentUpdateContentDTO dto) {
        CommentReadDTO updatedComment = commentService.updateCommentContent(commentId, dto);
        return ResponseEntity.ok(updatedComment);
    }

    @PreAuthorize("hasRole('ADMIN') or @commentSecurityService.canDeleteComment(#commentId)")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        boolean isDeleted = commentService.deleteComment(commentId);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
