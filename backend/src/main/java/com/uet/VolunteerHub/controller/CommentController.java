package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.CommentReadDTO;
import com.uet.VolunteerHub.entity.Comment;
import com.uet.VolunteerHub.service.CommentService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

    @Log
    @RestController
    @RequestMapping("api/comments")
    public class CommentController {
        private final CommentService commentService;

        @Autowired
        public CommentController(CommentService commentService) {
            this.commentService = commentService;
        }

        @GetMapping("/search")
        public ResponseEntity<Page<CommentReadDTO>> searchComment (
                @RequestParam(required = true) Long postId,
                @RequestParam(required = false, defaultValue = "true") boolean rootOnly,
                Pageable pageable) {
            Page<CommentReadDTO> comments = commentService.searchComments(postId, rootOnly, pageable);
            return ResponseEntity.ok(comments);
        }

        @GetMapping("/{parentCommentId}/replies")
        public ResponseEntity<Page<CommentReadDTO>> getCommentsByParent (
                @PathVariable Long parentCommentId,
                Pageable pageable) {
            Page<CommentReadDTO> comments = commentService.getRepliesForComment(parentCommentId, pageable);
            return ResponseEntity.ok(comments);
        }

        @GetMapping("/{postId}")
        public ResponseEntity<Page<CommentReadDTO>> getCommentsByPost (
                @PathVariable Long postId,
                Pageable pageable) {
            Page<CommentReadDTO> comments = commentService.findAllByPost(postId, pageable);
            return ResponseEntity.ok(comments);
        }

        @DeleteMapping("/{commentId}")
        public ResponseEntity<Void> deleteComment (@PathVariable Long commentId) {
            boolean isDeleted = commentService.deleteComment(commentId);
            if (isDeleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    }
