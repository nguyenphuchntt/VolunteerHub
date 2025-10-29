package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.PostReadDTO;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.repository.PostRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Log
@Service
public class PostReadService {
    private final PostRepository postRepository;

    @Autowired
    public PostReadService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional(readOnly = true)
    public PostReadDTO findPostById(Long postId) {
        Optional<Post> postOptional = postRepository.findByPostId(postId);
        if (postOptional.isEmpty()) {
            throw new RuntimeException("Not found post by ID: " + postId);
        }
        Post post = postOptional.get();
        return convertToDTO(post);
    }

    private PostReadDTO convertToDTO(Post post) {
        PostReadDTO dto = new PostReadDTO();
        dto.setPostId(post.getPostId());
        dto.setContent(post.getContent());

        return dto;
    }

}
