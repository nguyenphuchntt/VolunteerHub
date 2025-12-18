package com.uet.VolunteerHub.dto.ManagerDashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationTimelineDTO {
    private LocalDate date;
    private Long count;
}
