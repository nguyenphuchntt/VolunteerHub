package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.MediaDeleteResponse;
import com.uet.VolunteerHub.dto.MediaReadDTO;
import com.uet.VolunteerHub.dto.MediaUploadResponse;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.FileStorageService;
import com.uet.VolunteerHub.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

/**
 * REST controller for media upload and management
 */
@RestController
@RequestMapping("/api/media")
@PreAuthorize("isAuthenticated()")
public class MediaController {

    private final MediaService mediaService;
    private final FileStorageService fileStorageService;

    @Autowired
    public MediaController(MediaService mediaService, FileStorageService fileStorageService) {
        this.mediaService = mediaService;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Upload a file
     * @param file file to upload
     * @param account authenticated account
     * @return upload response with media details
     */
    @PostMapping("/upload")
    public ResponseEntity<MediaUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Account account) {
        MediaUploadResponse response = mediaService.uploadFile(file, account);
        return ResponseEntity.ok(response);
    }

    /**
     * Upload account profile media
     * @param file file to upload
     * @param account authenticated account
     * @return upload response
     */
    @PostMapping("/upload/account")
    public ResponseEntity<MediaUploadResponse> uploadAccountMedia(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Account account) {
        MediaUploadResponse response = mediaService.uploadAccountMedia(file, account);
        return ResponseEntity.ok(response);
    }

    /**
     * Upload event media
     * @param file file to upload
     * @param eventId event ID
     * @param account authenticated account
     * @return upload response
     */
    @PostMapping("/upload/event/{eventId}")
    @PreAuthorize("@eventSecurityService.isCreatorOfEvent(#eventId)")
    public ResponseEntity<MediaUploadResponse> uploadEventMedia(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long eventId,
            @AuthenticationPrincipal Account account) {
        MediaUploadResponse response = mediaService.uploadEventMedia(file, eventId, account);
        return ResponseEntity.ok(response);
    }

    /**
     * Upload post media
     * @param file file to upload
     * @param postId post ID
     * @param account authenticated account
     * @return upload response
     */
    @PostMapping("/upload/post/{postId}")
    @PreAuthorize("@postSecurityService.isOwnerOfPost(#postId)")
    public ResponseEntity<MediaUploadResponse> uploadPostMedia(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long postId,
            @AuthenticationPrincipal Account account) {
        MediaUploadResponse response = mediaService.uploadPostMedia(file, postId, account);
        return ResponseEntity.ok(response);
    }

    /**
     * Download a file by filename
     * @param filename file name
     * @return file resource
     */
    @GetMapping("/download/{filename:.+}")
    @PreAuthorize("true")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource resource = fileStorageService.loadFileAsResource(filename);
        String contentType = fileStorageService.getContentType(filename);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    /**
     * Get media by ID
     * @param id media ID
     * @return media details
     */
    @GetMapping("/{id}")
    public ResponseEntity<MediaReadDTO> getMediaById(@PathVariable UUID id) {
        MediaReadDTO response = mediaService.getMediaById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete media
     * @param id media ID
     * @param account authenticated account
     * @return delete response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MediaDeleteResponse> deleteMedia(
            @PathVariable UUID id,
            @AuthenticationPrincipal Account account) {
        MediaDeleteResponse response = mediaService.deleteMedia(id, account);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/link/account/{accountId}/{mediaId}")
    public ResponseEntity<Void> linkMediaToAccount(
            @PathVariable UUID accountId,
            @PathVariable UUID mediaId) {
        mediaService.linkMediaToAccount(mediaId, accountId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/link/account/{accountId}/{mediaId}")
    public ResponseEntity<Void> unlinkMediaFromAccount(
            @PathVariable UUID accountId,
            @PathVariable UUID mediaId) {
        mediaService.unlinkMediaFromAccount(mediaId, accountId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-account/{accountId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Page<MediaReadDTO>> getMediaByAccount(
            @PathVariable UUID accountId,
            Pageable pageable) {
        Page<MediaReadDTO> response = mediaService.getMediaByAccount(accountId, pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/link/event/{eventId}/{mediaId}")
    public ResponseEntity<Void> linkMediaToEvent(
            @PathVariable Long eventId,
            @PathVariable UUID mediaId) {
        mediaService.linkMediaToEvent(mediaId, eventId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/link/event/{eventId}/{mediaId}")
    public ResponseEntity<Void> unlinkMediaFromEvent(
            @PathVariable Long eventId,
            @PathVariable UUID mediaId) {
        mediaService.unlinkMediaFromEvent(mediaId, eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-event/{eventId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Page<MediaReadDTO>> getMediaByEvent(
            @PathVariable Long eventId,
            Pageable pageable) {
        Page<MediaReadDTO> response = mediaService.getMediaByEvent(eventId, pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/link/post/{postId}/{mediaId}")
    public ResponseEntity<Void> linkMediaToPost(
            @PathVariable Long postId,
            @PathVariable UUID mediaId) {
        mediaService.linkMediaToPost(mediaId, postId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/link/post/{postId}/{mediaId}")
    public ResponseEntity<Void> unlinkMediaFromPost(
            @PathVariable Long postId,
            @PathVariable UUID mediaId) {
        mediaService.unlinkMediaFromPost(mediaId, postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-post/{postId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Page<MediaReadDTO>> getMediaByPost(
            @PathVariable Long postId,
            Pageable pageable) {
        Page<MediaReadDTO> response = mediaService.getMediaByPost(postId, pageable);
        return ResponseEntity.ok(response);
    }
}
