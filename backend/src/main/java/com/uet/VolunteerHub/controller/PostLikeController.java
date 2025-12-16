package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.PostLikeDTO;
import com.uet.VolunteerHub.service.PostLikeService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Log
@RestController
@AllArgsConstructor
@RequestMapping("api/postlike")
public class PostLikeController {

    private final PostLikeService postLikeService;

    @GetMapping("/count")
    public ResponseEntity<Long> getLikeCount(@RequestParam Long postId) {
        Long count = postLikeService.countPostLikeByPost(postId);
        return ResponseEntity.ok(count);
    }

    @PostMapping("")
    public ResponseEntity<Map<String, Boolean>> toggleLike(@RequestBody @Valid PostLikeDTO dto) {
        boolean isNowLiked = postLikeService.toggleLikePost(dto);
        return ResponseEntity.ok(Map.of("isLiked", isNowLiked));
    }

    // TODO: Get total likes for event
}
