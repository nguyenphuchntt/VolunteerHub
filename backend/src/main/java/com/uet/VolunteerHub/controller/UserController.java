package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.UserDTO;
import com.uet.VolunteerHub.dto.UserSearchCriteriaDTO;
import com.uet.VolunteerHub.service.UserDTOService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Log
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserDTOService userDTOService;

    @Autowired
    public UserController(UserDTOService userDTOService) {
        this.userDTOService = userDTOService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserDTO>> searchUsers(UserSearchCriteriaDTO criteria, @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<UserDTO> userDTOPage = userDTOService.findUsersBySpecification(criteria, pageable);
        if (userDTOPage.hasContent()) {
            return ResponseEntity.ok(userDTOPage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
