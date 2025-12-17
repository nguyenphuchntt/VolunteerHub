package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.MediaDeleteResponse;
import com.uet.VolunteerHub.dto.MediaReadDTO;
import com.uet.VolunteerHub.dto.MediaUploadResponse;
import com.uet.VolunteerHub.entity.Account;
import com.uet.VolunteerHub.entity.Media;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.exception.ForbiddenException;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.AccountMediaRepository;
import com.uet.VolunteerHub.repository.EventMediaRepository;
import com.uet.VolunteerHub.repository.MediaRepository;
import com.uet.VolunteerHub.repository.PostMediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final AccountMediaRepository accountMediaRepository;
    private final PostMediaRepository postMediaRepository;
    private final EventMediaRepository eventMediaRepository;
    private final FileStorageService fileStorageService;

    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;

    @Autowired
    public MediaService(MediaRepository mediaRepository,
            AccountMediaRepository accountMediaRepository,
            PostMediaRepository postMediaRepository,
            EventMediaRepository eventMediaRepository,
            FileStorageService fileStorageService) {
        this.mediaRepository = mediaRepository;
        this.accountMediaRepository = accountMediaRepository;
        this.postMediaRepository = postMediaRepository;
        this.eventMediaRepository = eventMediaRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public MediaUploadResponse uploadFile(MultipartFile file, Account uploader) {
        String storedFilename = fileStorageService.storeFile(file);
        String extension = fileStorageService.getFileExtension(file.getOriginalFilename());
        String mimeType = file.getContentType();
        Long sizeBytes = file.getSize();

        String downloadUrl = baseUrl + "/api/media/download/" + storedFilename;

        Media media = new Media(
                UUID.randomUUID(),
                downloadUrl,
                storedFilename,
                extension,
                mimeType,
                sizeBytes,
                null,
                uploader);

        mediaRepository.save(media);

        return new MediaUploadResponse(
                media.getId(),
                media.getUrl(),
                storedFilename,
                extension,
                mimeType,
                sizeBytes,
                "File uploaded successfully");
    }

    public MediaReadDTO getMediaById(UUID mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));

        return new MediaReadDTO(
                media.getId(),
                media.getUrl(),
                media.getFileType(),
                media.getMimeType(),
                media.getSizeBytes(),
                media.getUploadedAt(),
                media.getUploadedBy().getAccountId());
    }

    @Transactional
    public MediaDeleteResponse deleteMedia(UUID mediaId, Account requester) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));

        if (!canDeleteMedia(media, requester)) {
            throw new ForbiddenException("You don't have permission to delete this media");
        }

        fileStorageService.deleteFile(media.getFilePath());
        mediaRepository.deleteById(mediaId);

        return new MediaDeleteResponse("Media deleted successfully", mediaId);
    }

    private boolean canDeleteMedia(Media media, Account requester) {
        if (requester.getRole() == UserRole.ADMIN) {
            return true;
        }
        return media.getUploadedBy().getAccountId().equals(requester.getAccountId());
    }
}
