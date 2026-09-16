package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.dto.Media.MediaDeleteResponse;
import com.uet.VolunteerHub.dto.Media.MediaReadDTO;
import com.uet.VolunteerHub.dto.Media.MediaUploadResponse;
import com.uet.VolunteerHub.entity.*;
import com.uet.VolunteerHub.enums.UserRole;
import com.uet.VolunteerHub.enums.MediaStatus;
import com.uet.VolunteerHub.enums.MediaType;
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

    /**
     * Uploads a file and creates a media record in the database.
     * Stores physical file using FileStorageService and generates download URL.
     * 
     * @param file the multipart file to upload
     * @param uploader the account uploading the file
     * @return MediaUploadResponse with media metadata and success message
     */
    @Transactional
    public MediaUploadResponse uploadFile(MultipartFile file, Account uploader) {
        String storedFilename = fileStorageService.storeFile(file);
        String extension = fileStorageService.getFileExtension(file.getOriginalFilename());
        String mimeType = file.getContentType();
        Long sizeBytes = file.getSize();

        Media media = Media.builder()
                .owner(uploader)
                .type(resolveMediaType(mimeType))
                .mimeType(mimeType != null ? mimeType : "application/octet-stream")
                .storageKey(storedFilename)
                .fileName(file.getOriginalFilename())
                .fileSize(sizeBytes)
                .mediaStatus(MediaStatus.READY)
                .build();

        media = mediaRepository.save(media);

        return new MediaUploadResponse(
                media.getMediaId(),
                toDownloadUrl(media),
                media.getFileName(),
                extension,
                mimeType,
                sizeBytes,
                "File uploaded successfully");
    }

    /**
     * Uploads media and associates it with the uploader's account profile.
     * Creates both Media record and AccountMedia relationship for profile pictures.
     * 
     * @param file the multipart file to upload
     * @param uploader the account uploading and owning the media
     * @return MediaUploadResponse with upload details
     * @throws ResourceNotFoundException if account not found
     */
    @Transactional
    public MediaUploadResponse uploadAccountMedia(MultipartFile file, Account uploader) {
        UUID accountId = uploader.getAccountId();
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        MediaUploadResponse response = uploadFile(file, uploader);

        Media media = mediaRepository.findById(response.id())
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));

        AccountMedia accountMedia = new AccountMedia(accountId, response.id(), account, media);
        accountMediaRepository.save(accountMedia);

        return response;
    }

    /**
     * Uploads media and links it to a specific event.
     * Creates EventMedia relationship for event photos and attachments.
     * 
     * @param file the multipart file to upload
     * @param eventId the event ID to associate media with
     * @param uploader the account uploading the media
     * @return MediaUploadResponse with upload details
     * @throws ResourceNotFoundException if event not found
     */
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

    /**
     * Uploads media and attaches it to a specific post.
     * Creates PostMedia relationship for post images and attachments.
     * 
     * @param file the multipart file to upload
     * @param postId the post ID to associate media with
     * @param uploader the account uploading the media
     * @return MediaUploadResponse with upload details
     * @throws ResourceNotFoundException if post not found
     */
    @Transactional
    public MediaUploadResponse uploadPostMedia(MultipartFile file, Long postId, Account uploader) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        MediaUploadResponse response = uploadFile(file, uploader);

        Media media = mediaRepository.findById(response.id())
                .orElseThrow(() -> new ResourceNotFoundException("Media not found"));

        PostMedia postMedia = new PostMedia(response.id(), postId, nextPostMediaPosition(postId), media, post);
        postMediaRepository.save(postMedia);

        return response;
    }

    /**
     * Retrieves media details by ID and converts to DTO.
     * 
     * @param mediaId the UUID of the media to retrieve
     * @return MediaReadDTO containing media details
     * @throws ResourceNotFoundException if media not found
     */
    public MediaReadDTO getMediaById(UUID mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));

        return toMediaReadDTO(media);
    }

    /**
     * Deletes media file and database record with permission checks.
     * Only admins or the original uploader can delete media.
     * 
     * @param mediaId the UUID of the media to delete
     * @param requester the account requesting deletion
     * @return MediaDeleteResponse confirming deletion
     * @throws ResourceNotFoundException if media not found
     * @throws ForbiddenException if requester lacks permission
     */
    @Transactional
    public MediaDeleteResponse deleteMedia(UUID mediaId, Account requester) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));

        if (!canDeleteMedia(media, requester)) {
            throw new ForbiddenException("You don't have permission to delete this media");
        }

        fileStorageService.deleteFile(media.getStorageKey());
        mediaRepository.deleteById(mediaId);

        return new MediaDeleteResponse("Media deleted successfully", mediaId);
    }

    /**
     * Checks if requester has permission to delete media.
     * 
     * @param media the media to check permission for
     * @param requester the account requesting deletion
     * @return true if admin or original uploader, false otherwise
     */
    private boolean canDeleteMedia(Media media, Account requester) {
        if (requester.getRole() == UserRole.ADMIN) {
            return true;
        }
        return media.getOwner().getAccountId().equals(requester.getAccountId());
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
                    return toMediaReadDTO(m);
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
                    return toMediaReadDTO(m);
                });
    }

    @Transactional
    public void linkMediaToPost(UUID mediaId, Long postId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        PostMedia postMedia = new PostMedia(mediaId, postId, nextPostMediaPosition(postId), media, post);
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
                    return toMediaReadDTO(m);
                });
    }

    private String toDownloadUrl(Media media) {
        return baseUrl + "/api/media/download/" + media.getStorageKey();
    }

    private MediaReadDTO toMediaReadDTO(Media media) {
        return new MediaReadDTO(media.getMediaId(), toDownloadUrl(media), media.getType().name(),
                media.getMimeType(), media.getFileSize(), media.getCreatedAt(), media.getOwner().getAccountId());
    }

    private MediaType resolveMediaType(String mimeType) {
        if (mimeType == null) return MediaType.FILE;
        if (mimeType.startsWith("image/")) return MediaType.IMAGE;
        if (mimeType.startsWith("video/")) return MediaType.VIDEO;
        if (mimeType.startsWith("audio/")) return MediaType.AUDIO;
        return MediaType.FILE;
    }

    private int nextPostMediaPosition(Long postId) {
        return Math.toIntExact(postMediaRepository.countByPost_PostId(postId));
    }
}
