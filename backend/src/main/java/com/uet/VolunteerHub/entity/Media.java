package com.uet.VolunteerHub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@Getter
@Setter
@Entity
@Table(name="media")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED, force=true)
public class Media {
    @Id
    @NotNull
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID id;

    @NotNull
    @Column(name="url")
    private String url;

    @NotNull
    @Column(name="file_path")
    private String filePath;

    @Column(name="file_type")
    private String fileType;

    @Column(name="mime_type")
    private String mimeType;

    @Column(name="size_bytes")
    private Long sizeBytes;

    @CreationTimestamp
    @Column(name="uploaded_at")
    private OffsetDateTime uploadedAt;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="uploaded_by", nullable = false)
    private Account uploadedBy;


}
