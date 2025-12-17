package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.MediaDeleteResponse;
import com.uet.VolunteerHub.dto.MediaReadDTO;
import com.uet.VolunteerHub.dto.MediaUploadResponse;
import com.uet.VolunteerHub.entity.*;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.exception.ForbiddenException;
import com.uet.VolunteerHub.exception.ResourceNotFoundException;
import com.uet.VolunteerHub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final AccountMediaRepository accountMediaRepository;
    private final PostMediaRepository postMediaRepository;
    private final EventMediaRepository eventMediaRepository;
    private final AccountRepository accountRepository;
    private final PostRepository postRepository;
    private final EventRepository eventRepository;
    private final FileStorageService fileStorageService;

    @Value("${server.base-url:http://localhost:8080}")
    private String baseUrl;

    @Autowired
    public MediaService(MediaRepository mediaRepository,
            AccountMediaRepository accountMediaRepository,
            PostMediaRepository postMediaRepository,
            EventMediaRepository eventMediaRepository,
            AccountRepository accountRepository,
            PostRepository postRepository,
            EventRepository eventRepository,
            FileStorageService fileStorageService) {
        this.mediaRepository = mediaRepository;
        this.accountMediaRepository = accountMediaRepository;
        this.postMediaRepository = postMediaRepository;
        this.eventMediaRepository = eventMediaRepository;
        this.accountRepository = accountRepository;
        this.postRepository = postRepository;
        this.eventRepository = eventRepository;
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

    @Transactional
    public MediaUploadResponse uploadAccountMedia(MultipartFile file, UUID accountId, Account uploader) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        MediaUploadResponse response = uploadFile(file, uploader);

        Media media = mediaRepository.findById(response.id())
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));

        AccountMedia accountMedia = new AccountMedia(accountId, response.id(), account, media);
        accountMediaRepository.save(accountMedia);

        return response;
    }

    @Transactional
    public MediaUploadResponse uploadEventMedia(MultipartFile file, Long eventId, Account uploader) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        MediaUploadResponse response = uploadFile(file, uploader);

        Media media = mediaRepository.findById(response.id())
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));

        EventMedia eventMedia = new EventMedia(eventId, response.id(), event, media);
        eventMediaRepository.save(eventMedia);

        return response;
    }

    @Transactional
    public MediaUploadResponse uploadPostMedia(MultipartFile file, Long postId, Account uploader) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        MediaUploadResponse response = uploadFile(file, uploader);

        Media media = mediaRepository.findById(response.id())
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));

        PostMedia postMedia = new PostMedia(response.id(), postId, media, post);
        postMediaRepository.save(postMedia);

        return response;
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

    @Transactional
    public void linkMediaToAccount(UUID mediaId, UUID accountId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        AccountMedia accountMedia = new AccountMedia(accountId, mediaId, account, media);
        accountMediaRepository.save(accountMedia);
    }

    @Transactional
    public void unlinkMediaFromAccount(UUID mediaId, UUID accountId) {
        AccountMediaId id = new AccountMediaId(accountId, mediaId);
        if (!accountMediaRepository.existsById(id)) {
            throw new ResourceNotFoundException("AccountMedia link not found");
        }
        accountMediaRepository.deleteById(id);
    }

    public Page<MediaReadDTO> getMediaByAccount(UUID accountId, Pageable pageable) {
        return accountMediaRepository.findAllByAccount_AccountId(accountId, pageable)
                .map(am -> {
                    Media m = am.getMedia();
                    return new MediaReadDTO(m.getId(), m.getUrl(), m.getFileType(), m.getMimeType(),
                            m.getSizeBytes(), m.getUploadedAt(), m.getUploadedBy().getAccountId());
                });
    }

    @Transactional
    public void linkMediaToEvent(UUID mediaId, Long eventId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        EventMedia eventMedia = new EventMedia(eventId, mediaId, event, media);
        eventMediaRepository.save(eventMedia);
    }

    @Transactional
    public void unlinkMediaFromEvent(UUID mediaId, Long eventId) {
        EventMediaId id = new EventMediaId(mediaId, eventId);
        if (!eventMediaRepository.existsById(id)) {
            throw new ResourceNotFoundException("EventMedia link not found");
        }
        eventMediaRepository.deleteById(id);
    }

    public Page<MediaReadDTO> getMediaByEvent(Long eventId, Pageable pageable) {
        return eventMediaRepository.findAllByEvent_EventId(eventId, pageable)
                .map(em -> {
                    Media m = em.getMedia();
                    return new MediaReadDTO(m.getId(), m.getUrl(), m.getFileType(), m.getMimeType(),
                            m.getSizeBytes(), m.getUploadedAt(), m.getUploadedBy().getAccountId());
                });
    }

    @Transactional
    public void linkMediaToPost(UUID mediaId, Long postId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        PostMedia postMedia = new PostMedia(mediaId, postId, media, post);
        postMediaRepository.save(postMedia);
    }

    @Transactional
    public void unlinkMediaFromPost(UUID mediaId, Long postId) {
        PostMediaId id = new PostMediaId(mediaId, postId);
        if (!postMediaRepository.existsById(id)) {
            throw new ResourceNotFoundException("PostMedia link not found");
        }
        postMediaRepository.deleteById(id);
    }

    public Page<MediaReadDTO> getMediaByPost(Long postId, Pageable pageable) {
        return postMediaRepository.findAllByPost_PostId(postId, pageable)
                .map(pm -> {
                    Media m = pm.getMedia();
                    return new MediaReadDTO(m.getId(), m.getUrl(), m.getFileType(), m.getMimeType(),
                            m.getSizeBytes(), m.getUploadedAt(), m.getUploadedBy().getAccountId());
                });
    }
}
