package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.*;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.service.PostReadService;
import com.uet.VolunteerHub.service.PostWriteService;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log
@RestController
@RequestMapping("api/posts")
public class PostController {
    private final PostReadService postReadService;
    private final PostWriteService postWriteService;

    @Autowired
    public PostController(PostReadService postReadService, PostWriteService postWriteService) {
        this.postReadService = postReadService;
        this.postWriteService = postWriteService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostReadDTO> searchPostById(@PathVariable("id") Long postId) {
        PostReadDTO result = postReadService.findPostById(postId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostReadDTO>> searchPosts(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) String ownerUsername,
            @RequestParam(required = false) Long eventId,
            Pageable pageable) {
        Page<PostReadDTO> postsPage = postReadService.searchPost(content, ownerUsername, eventId, pageable);
        return ResponseEntity.ok(postsPage);
    }

    @GetMapping("/by-event/{eventId}")
    public ResponseEntity<Page<PostReadDTO>> getPostByEvent(
            @PathVariable Long eventId,
            Pageable pageable) {
        Page<PostReadDTO> posts = postReadService.findPostByEvent(eventId, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/by-account/{username}")
    public ResponseEntity<Page<PostReadDTO>> getPostsByOwner(
            @PathVariable String username,
            Pageable pageable) {
        Page<PostReadDTO> postsPage = postReadService.findPostByOwner(username, pageable);
        return ResponseEntity.ok(postsPage);
    }

    @PostMapping
    public ResponseEntity<PostReadDTO> createPost(@RequestBody @Valid PostCreateDTO postCreateDTO) {
        PostReadDTO newPost = postWriteService.createPost(postCreateDTO);
        return new ResponseEntity<>(newPost, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/content")
    public ResponseEntity<PostReadDTO> updatePostContent(
            @PathVariable Long id,
            @RequestBody @Valid PostContentUpdateDTO dto) {
        PostReadDTO updatedPost = postWriteService.updatePostContent(id, dto);
        return ResponseEntity.ok(updatedPost);
    }

    @PatchMapping("/{id}/type")
    public ResponseEntity<PostReadDTO> updatePostType(
            @PathVariable Long id,
            @RequestBody @Valid PostTypeUpdateDTO dto) {
        PostReadDTO updatedPost = postWriteService.updatePostType(id, dto);
        return ResponseEntity.ok(updatedPost);
    }

    @PatchMapping("/{id}/event")
    public ResponseEntity<PostReadDTO> updatePostEvent(
            @PathVariable Long id,
            @RequestBody @Valid PostEventUpdateDTO dto) {
        PostReadDTO updatedPost = postWriteService.updatePostEvent(id, dto);
        return ResponseEntity.ok(updatedPost);
    }

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
