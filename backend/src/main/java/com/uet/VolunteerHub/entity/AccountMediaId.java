package com.uet.VolunteerHub.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountMediaId implements Serializable {
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID accountId;
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID mediaId;
}
