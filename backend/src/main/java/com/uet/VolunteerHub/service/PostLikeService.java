package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.PostLikeDTO;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.LikeId;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.entity.PostLike;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.PostLikeRepository;
import com.uet.VolunteerHub.repository.PostRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime; // Hoặc Instant, tùy bạn


@Service
@Log
@AllArgsConstructor
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final AccountRepository accountRepository;


    @Transactional(readOnly = true)
    public Long countPostLikeByPost(Long postId) {
        return postLikeRepository.countByPost_PostId(postId);
    }

    @Transactional
    public boolean toggleLikePost(PostLikeDTO dto) {
        LikeId likeId = new LikeId(dto.getPostId(), dto.getAccountId());

        if (postLikeRepository.existsById(likeId)) {
            postLikeRepository.deleteById(likeId);
            return false;
        } else {
            Post post = postRepository.findById(dto.getPostId())
                    .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + dto.getPostId()));
            Account account = accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + dto.getAccountId()));
            PostLike newLike = new PostLike();
            newLike.setLikeId(likeId);
            newLike.setPost(post);
            newLike.setAccount(account);
            newLike.setCreateAt(OffsetDateTime.now());

            postLikeRepository.save(newLike);
            return true;
        }
    }

    public boolean isPostLiked(Account account, Long postId) {
        PostLikeDTO dto = new PostLikeDTO();
        dto.setAccountId(account.getAccountId());
        dto.setPostId(postId);
        LikeId likeId = new LikeId(dto.getPostId(), dto.getAccountId());
        return postLikeRepository.existsById(likeId);
    }
}