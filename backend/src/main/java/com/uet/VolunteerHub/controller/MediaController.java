package com.uet.VolunteerHub.controller;

import com.uet.VolunteerHub.dto.MediaDeleteResponse;
import com.uet.VolunteerHub.dto.MediaReadDTO;
import com.uet.VolunteerHub.dto.MediaUploadResponse;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.service.FileStorageService;
import com.uet.VolunteerHub.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final MediaService mediaService;
    private final FileStorageService fileStorageService;

    @Autowired
    public MediaController(MediaService mediaService, FileStorageService fileStorageService) {
        this.mediaService = mediaService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<MediaUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Account account) {
        MediaUploadResponse response = mediaService.uploadFile(file, account);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource resource = fileStorageService.loadFileAsResource(filename);
        String contentType = fileStorageService.getContentType(filename);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaReadDTO> getMediaById(@PathVariable UUID id) {
        MediaReadDTO response = mediaService.getMediaById(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MediaDeleteResponse> deleteMedia(
            @PathVariable UUID id,
            @AuthenticationPrincipal Account account) {
        MediaDeleteResponse response = mediaService.deleteMedia(id, account);
        return ResponseEntity.ok(response);
    }
}
