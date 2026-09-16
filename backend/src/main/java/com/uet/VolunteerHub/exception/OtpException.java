package com.uet.VolunteerHub.exception;

import com.uet.VolunteerHub.enums.OtpErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class OtpException extends RuntimeException {

    private final String code;
    private final HttpStatus status;
    private final Integer remainingAttempts;

    public OtpException(OtpErrorCode errorCode, HttpStatus status, String message) {
        this(errorCode, status, message, null);
    }

    public OtpException(OtpErrorCode errorCode, HttpStatus status, String message, Integer remainingAttempts) {
        super(message);
        this.code = errorCode.name();
        this.status = status;
        this.remainingAttempts = remainingAttempts;
    }
}
