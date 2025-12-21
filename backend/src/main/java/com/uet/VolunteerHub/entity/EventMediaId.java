package com.uet.VolunteerHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventMediaId {
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID mediaId;
    private Long eventId;
}
