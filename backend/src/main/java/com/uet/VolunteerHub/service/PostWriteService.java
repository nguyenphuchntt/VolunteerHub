//package com.uet.VolunteerHub.service;
//
//import com.uet.VolunteerHub.dto.PostCreateDTO;
//import com.uet.VolunteerHub.dto.PostReadDTO;
//import com.uet.VolunteerHub.entity.Post;
//import com.uet.VolunteerHub.mapper.PostMapper;
//import com.uet.VolunteerHub.repository.PostRepository;
//import lombok.AllArgsConstructor;
//import lombok.extern.java.Log;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Log
//@AllArgsConstructor
//@Service
//public class PostWriteService {
//    private final PostRepository postRepository;
//    private final PostMapper postMapper;
//
//    @Transactional
//    public PostReadDTO createPost(PostCreateDTO dto) {
//        Post post = postMapper.toPostEntity(dto);
//        Event event = eventRepository.findById(dto.getEventId())
//                .orElseThrow(() -> new RuntimeException("Error: Event not found with id " + dto.getEventId()));
//
//        Account account = accountRepository.findById(dto.getCreatedByAccountId())
//                .orElseThrow(() -> new RuntimeException("Error: Account not found with id " + dto.getCreatedByAccountId()));
//
//        // 3. Thiết lập các mối quan hệ (associations)
//        post.setEvent(event);
//        post.setCreatedByAccount(account);
//
//        Post savedPost = postRepository.save(post);
//
//        return postMapper.toPostReadDTO(savedPost);
//    }
//}
