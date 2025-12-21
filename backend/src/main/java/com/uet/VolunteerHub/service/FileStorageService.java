package com.uet.VolunteerHub.service;

import com.uet.VolunteerHub.exception.FileStorageException;
import com.uet.VolunteerHub.exception.InvalidFileException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final long maxFileSize;
    private final Set<String> allowedExtensions;

    public FileStorageService(
            @Value("${file.upload-dir:${user.home}/volunteer-hub-uploads}") String uploadDir,
            @Value("${file.max-size:10485760}") long maxFileSize,
            @Value("${file.allowed-extensions:jpg,jpeg,png,gif,bmp,webp,pdf,doc,docx,xls,xlsx,txt,zip,mp4,mp3}") String allowedExtensions) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.maxFileSize = maxFileSize;
        this.allowedExtensions = Arrays.stream(allowedExtensions.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    /**
     * Initializes the file storage directory on application startup.
     * Creates the upload directory if it doesn't exist.
     * 
     * @throws FileStorageException if directory creation fails
     */
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new FileStorageException("Could not create upload directory", ex);
        }
    }

    /**
     * Validates uploaded file against security and size constraints.
     * Checks file emptiness, size limit, extension whitelist, and path traversal.
     * 
     * @param file the multipart file to validate
     * @throws InvalidFileException if validation fails
     */
    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new InvalidFileException("File size exceeds maximum limit of " + (maxFileSize / 1024 / 1024) + "MB");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new InvalidFileException("Invalid filename");
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!allowedExtensions.contains(extension)) {
            throw new InvalidFileException("File type not allowed: " + extension);
        }

        if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new InvalidFileException("Invalid filename");
        }
    }

    /**
     * Stores uploaded file to the configured directory with unique filename.
     * Validates file first, then generates UUID-prefixed filename to prevent conflicts.
     * 
     * @param file the multipart file to store
     * @return the stored filename
     * @throws FileStorageException if file cannot be stored
     */
    public String storeFile(MultipartFile file) {
        validateFile(file);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);
        String storedFilename = UUID.randomUUID().toString() + "_" + originalFilename;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return storedFilename;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFilename, ex);
        }
    }

    /**
     * Loads a stored file as a Spring Resource for download or streaming.
     * Resolves filename to full path and validates file exists and is readable.
     * 
     * @param filename the name of the file to load
     * @return the file as a Resource
     * @throws FileStorageException if file not found or path is malformed
     */
    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("File not found: " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new FileStorageException("File not found: " + filename, ex);
        }
    }

    /**
     * Deletes a file from the storage directory.
     * Silently succeeds if file doesn't exist.
     * 
     * @param filename the name of the file to delete
     * @throws FileStorageException on IO errors
     */
    public void deleteFile(String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete file: " + filename, ex);
        }
    }

    /**
     * Determines MIME content type based on file extension.
     * Supports common image, document, video, and audio formats.
     * 
     * @param filename the filename to determine content type for
     * @return the MIME type, or octet-stream for unknown extensions
     */
    public String getContentType(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "bmp" -> "image/bmp";
            case "webp" -> "image/webp";
            case "pdf" -> "application/pdf";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls" -> "application/vnd.ms-excel";
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "txt" -> "text/plain";
            case "zip" -> "application/zip";
            case "mp4" -> "video/mp4";
            case "mp3" -> "audio/mpeg";
            default -> "application/octet-stream";
        };
    }

    public String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
