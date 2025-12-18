package com.uet.VolunteerHub.dto.ManagerDashboard;

import com.uet.VolunteerHub.enums.EventUserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantsByStatusDTO {
    private EventUserStatus status;
    private Long count;
}
