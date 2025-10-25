package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.UserSearchDTO;
import com.uet.VolunteerHub.dto.UserSearchCriteriaDTO;
import com.uet.VolunteerHub.dto.UserProfileUpdateDTO;
import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.service.UserSearchService;
import com.uet.VolunteerHub.service.UserWriteService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Page<UserSearchDTO>> searchUsers(UserSearchCriteriaDTO criteria, @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<UserSearchDTO> userDTOPage = userSearchService.findUsersBySpecification(criteria, pageable);
        return ResponseEntity.ok(userDTOPage);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserSearchDTO> updateUser(@PathVariable("id") UUID id, @Valid @RequestBody UserProfileUpdateDTO userProfileUpdateDTO) {
        try {
            UserSearchDTO userSearchDTO = userWriteService.updateUser(id, userProfileUpdateDTO);
            return ResponseEntity.ok(userSearchDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserSearchDTO> deleteUser(@PathVariable("id") UUID id) {
        try {
            UserSearchDTO userSearchDTO = userWriteService.deleteUser(id);
            return ResponseEntity.ok(userSearchDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserSearchDTO> changeUserRole(@PathVariable("id") UUID id, @RequestBody UserRole newRole) {
        try {
            UserSearchDTO userSearchDTO = userWriteService.changeRole(id, newRole);
            return ResponseEntity.ok(userSearchDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserSearchDTO> changeAccountStatus(@PathVariable("id") UUID id, @Valid @RequestBody AccountStatus newStatus) {
        try {
            UserSearchDTO userSearchDTO = userWriteService.changeAccountStatus(id, newStatus);
            return ResponseEntity.ok(userSearchDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
