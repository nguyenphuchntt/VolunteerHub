package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.PostReadDTO;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.mapper.PostMapper;
import com.uet.VolunteerHub.repository.PostRepository;
import com.uet.VolunteerHub.repository.specification.PostSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Log
@AllArgsConstructor
@Service
public class PostReadService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final PostSpecification postSpecification;

    @Transactional(readOnly = true)
    public PostReadDTO findPostById(Long postId) {
        Optional<Post> postOptional = postRepository.findByPostId(postId);
        if (postOptional.isEmpty()) {
            throw new RuntimeException("Not found post by ID: " + postId);
        }
        Post post = postOptional.get();
        return postMapper.toPostReadDTO(post);
    }

    @Transactional(readOnly = true)
    public Page<PostReadDTO> searchPost(String content, String ownerUsername, Long eventId, Pageable pageable) {
        Specification<Post> spec = Specification
                .where(postSpecification.contentLike(content)
                        .and(postSpecification.hasOwner(ownerUsername))
                        .and(postSpecification.isInEvent(eventId)));
        Page<Post> posts = postRepository.findAll(spec, pageable);
        return posts.map(postMapper::toPostReadDTO);
    }

    @Transactional(readOnly = true)
    public Page<PostReadDTO> findPostByOwner(String ownerUsername, Pageable pageable) {
        Specification<Post> spec = Specification
                .where(postSpecification.hasOwner(ownerUsername));
        Page<Post> posts = postRepository.findAll(spec, pageable);
        return posts.map(postMapper::toPostReadDTO);
    }

    @Transactional(readOnly = true)
    public Page<PostReadDTO> findPostByEvent(Long eventId, Pageable pageable) {
        Page<Post> posts = postRepository.findByEvent_EventId(eventId, pageable);
        return posts.map(postMapper::toPostReadDTO);
    }
}
