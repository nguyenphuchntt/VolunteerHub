package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.PostReadDTO;
import com.uet.VolunteerHub.service.PostReadService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Log
@RestController
@RequestMapping("api/posts")
public class PostController {
    private final PostReadService postReadService;

    @Autowired
    public PostController(PostReadService postReadService) {
        this.postReadService = postReadService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostReadDTO> searchPostByTitle(@PathVariable("id") Long postId) {
        PostReadDTO result = postReadService.findPostById(postId);
        return ResponseEntity.ok(result);
    }
}
