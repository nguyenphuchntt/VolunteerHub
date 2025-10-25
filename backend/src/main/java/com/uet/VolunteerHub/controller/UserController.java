package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.UserDTO;
import com.uet.VolunteerHub.service.UserDTOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserDTOService userDTOService;

    @Autowired
    public UserController(UserDTOService userDTOService) {
        this.userDTOService = userDTOService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUserByUserName(@PathVariable String username) {
        Optional<UserDTO> userDTO =  userDTOService.getUserByUserName(username);
        return userDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
