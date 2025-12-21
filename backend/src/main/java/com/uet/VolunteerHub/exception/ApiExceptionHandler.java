package com.uet.VolunteerHub.exception;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Global exception handler for REST API
 */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Handles resource not found exceptions
     * @param ex the exception
     * @param request web request
     * @return 404 response
     */
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<Object> handleResourceNotFoundException(RuntimeException ex, WebRequest request) {
        String bodyOfResponse = ex.getMessage();
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    /**
     * Handles resource already exists exceptions
     * @param ex the exception
     * @param request web request
     * @return 409 response
     */
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    ResponseEntity<Object> handleResourceAlreadyExistsException(RuntimeException ex, WebRequest request) {
        String bodyOfResponse = ex.getMessage();
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    /**
     * Handles illegal argument exceptions
     * @param ex the exception
     * @param request web request
     * @return 400 response
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Object> handleIllegalArgumentException(RuntimeException ex, WebRequest request) {
        String bodyOfResponse = ex.getMessage();
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    /**
     * Handles expired JWT token exceptions
     * @param ex the exception
     * @param request web request
     * @return 401 response
     */
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(ExpiredJwtException.class)
    ResponseEntity<Object> handleExpiredJwtException(ExpiredJwtException ex, WebRequest request) {
        String bodyOfResponse = ex.getMessage();
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }

    /**
     * Handles bad credentials exceptions
     * @param ex the exception
     * @param request web request
     * @return 401 response
     */
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(BadCredentialsException.class)
    ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex, WebRequest request) {
        return super.handleExceptionInternal(ex, "Invalid username or password", new HttpHeaders(), HttpStatus.UNAUTHORIZED,
                request);
    }

    /**
     * Handles file storage exceptions
     * @param ex the exception
     * @param request web request
     * @return 500 response
     */
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(FileStorageException.class)
    ResponseEntity<Object> handleFileStorageException(FileStorageException ex, WebRequest request) {
        String bodyOfResponse = ex.getMessage();
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR,
                request);
    }

    /**
     * Handles invalid file exceptions
     * @param ex the exception
     * @param request web request
     * @return 400 response
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidFileException.class)
    ResponseEntity<Object> handleInvalidFileException(InvalidFileException ex, WebRequest request) {
        String bodyOfResponse = ex.getMessage();
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    /**
     * Handles forbidden access exceptions
     * @param ex the exception
     * @param request web request
     * @return 403 response
     */
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(ForbiddenException.class)
    ResponseEntity<Object> handleForbiddenException(ForbiddenException ex, WebRequest request) {
        String bodyOfResponse = ex.getMessage();
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.FORBIDDEN, request);
    }

    /**
     * Handles disabled account exceptions
     * @param ex the exception
     * @param request web request
     * @return 403 response
     */
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(SelfRoleChangeException.class)
    ResponseEntity<Object> handleSelfRoleChangeException(SelfRoleChangeException ex, WebRequest request) {
        java.util.Map<String, Object> body = new java.util.HashMap<>();
        body.put("error", "SELF_ROLE_CHANGE_NOT_ALLOWED");
        body.put("message", ex.getMessage());
        return super.handleExceptionInternal(ex, body, new HttpHeaders(), HttpStatus.FORBIDDEN, request);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalStateException.class)
    ResponseEntity<Object> handleIllegalStateException(IllegalStateException ex, WebRequest request) {
        String bodyOfResponse = ex.getMessage();
        return super.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(DisabledException.class)
    ResponseEntity<Object> handleDisabledException(DisabledException ex, WebRequest request) {
        return super.handleExceptionInternal(ex,
                java.util.Map.of("message", "Your account should be activated before login"),
                new HttpHeaders(), HttpStatus.FORBIDDEN, request);
    }

    /**
     * Handles locked account exceptions
     * @param ex the exception
     * @param request web request
     * @return 403 response
     */
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(LockedException.class)
    ResponseEntity<Object> handleLockedException(LockedException ex, WebRequest request) {
        return super.handleExceptionInternal(ex,
                java.util.Map.of("message", "Your account has been banned"),
                new HttpHeaders(), HttpStatus.FORBIDDEN, request);
    }
}


