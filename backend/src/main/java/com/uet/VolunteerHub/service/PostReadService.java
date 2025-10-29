package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.repository.PostRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Log
@Service
public class PostReadService {
    private final PostRepository postRepository;

    @Autowired
    public PostReadService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }




}
