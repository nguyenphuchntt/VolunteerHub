package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.Account.*;
import com.uet.VolunteerHub.service.UserSearchService;
import com.uet.VolunteerHub.service.UserWriteService;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Log
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserSearchService userSearchService;
    private final UserWriteService userWriteService;

    @Autowired
    public UserController(UserSearchService userSearchService, UserWriteService userWriteService) {
        this.userSearchService = userSearchService;
        this.userWriteService = userWriteService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserSearchDTO>> searchUsers(UserSearchCriteriaDTO criteria,
                                                           @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<UserSearchDTO> userSearchDTOPage = userSearchService.findUsersBySpecification(criteria, pageable);
        return ResponseEntity.ok(userSearchDTOPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSearchDTO> searchUserById(@PathVariable("id") UUID id) {
        return userSearchService.findUserById(id)
                .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<UserSearchDTO> registerAccount(@Valid @RequestBody AccountUserRegisterDTO accountUserRegisterDTO) {
        UserSearchDTO userSearchDTO = userWriteService.registerAccount(accountUserRegisterDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(userSearchDTO);
    }

}
