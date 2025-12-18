package com.uet.VolunteerHub.dto.ManagerDashboard;

import com.uet.VolunteerHub.enums.EventUserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantsByRoleDTO {
    private EventUserRole role;
    private Long count;
}
