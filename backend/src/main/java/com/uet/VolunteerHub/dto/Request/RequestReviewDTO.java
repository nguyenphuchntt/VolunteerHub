package com.uet.VolunteerHub.dto.Request;

import com.uet.VolunteerHub.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestReviewDTO {

    @NotNull(message = "Status is required")
    private RequestStatus status;

    @Size(max = 1000, message = "Admin response must not exceed 1000 characters")
    private String adminResponse;
}
