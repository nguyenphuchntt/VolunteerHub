package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.*;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Event;
import com.uet.VolunteerHub.entity.Post;
import com.uet.VolunteerHub.enums.PostStatus;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.mapper.PostMapper;
import com.uet.VolunteerHub.repository.AccountRepository;
import com.uet.VolunteerHub.repository.EventRepository;
import com.uet.VolunteerHub.repository.PostRepository;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Log
@AllArgsConstructor
@Service
public class PostWriteService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;

    private Post findPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
    }

    /**
     * Creates a new post associated with an event and creator account.
     * Sets initial status to CREATED.
     * 
     * @param dto post creation data with event and account IDs
     * @return PostReadDTO with created post details
     * @throws ResourceNotFoundException if event or account not found
     */
    @Transactional
    public PostReadDTO createPost(PostCreateDTO dto) {
        Post post = postMapper.toPostEntity(dto);
        
        // Set default postStatus for new posts
        post.setPostStatus(PostStatus.PUBLISHED);
        
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Error: Event not found with id " + dto.getEventId()));

        Account account = accountRepository.findById(dto.getCreateByAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Error: Account not found with id " + dto.getCreateByAccountId()));
        post.setEvent(event);
        post.setCreatedByAccount(account);
        Post savedPost = postRepository.save(post);
        return postMapper.toPostReadDTO(savedPost);
    }

    @Transactional
    public PostReadDTO updatePostContent(Long postId, PostContentUpdateDTO dto) {
        Post post = findPostById(postId);
        post.setContent(dto.getContent());
        return postMapper.toPostReadDTO(postRepository.save(post));
    }

    @Transactional
    public PostReadDTO updatePostType(Long postId, PostTypeUpdateDTO dto) {
        Post post = findPostById(postId);
        post.setPostType(dto.getType());
        return postMapper.toPostReadDTO(postRepository.save(post));
    }

    @Transactional
    public PostReadDTO updatePostEvent(Long postId, PostEventUpdateDTO dto) {
        Post post = findPostById(postId);
        Event newEvent = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + dto.getEventId()));
        post.setEvent(newEvent);
        return postMapper.toPostReadDTO(postRepository.save(post));
    }

    /**
     * Updates post status (CREATED, PUBLISHED, DELETED).
     * 
     * @param postId the post ID to update
     * @param dto status update data
     * @return PostReadDTO with updated post
     * @throws ResourceNotFoundException if post not found
     */
    @Transactional
    public PostReadDTO updatePostStatus(Long postId, PostStatusUpdateDTO dto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        post.setPostStatus(dto.getPostStatus());
        Post savedPost = postRepository.save(post);
        return postMapper.toPostReadDTO(savedPost);
    }

    /**
     * Soft deletes a post by setting status to DELETED.
     * 
     * @param postId the post ID to delete
     * @return true if post was found and deleted, false otherwise
     */
    @Transactional
    public boolean deletePost(Long postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isEmpty()) {
            return false;
        }
        Post post = optionalPost.get();
        post.setPostStatus(PostStatus.DELETED);
        postRepository.save(post);
        return true;
    }
}
