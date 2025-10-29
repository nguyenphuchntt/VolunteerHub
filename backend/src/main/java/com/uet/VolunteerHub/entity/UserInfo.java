    package com.uet.VolunteerHub.entity;

    import com.uet.VolunteerHub.enums.AccountStatus;
    import com.uet.VolunteerHub.enums.UserRole;
    import jakarta.persistence.*;
    import jakarta.validation.constraints.NotNull;
    import lombok.*;

    import java.util.Date;
    import java.util.UUID;

    @Data
    @Entity
    @Table(name = "user_info")
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor(access = AccessLevel.PROTECTED, force = true)
    public class UserInfo {

        @Id
        @Column(name="account_id", updatable = false, nullable = false)
        private UUID accountId;

        private String firstName;

        private String lastName;

        private Date dateOfBirth;

        private String country;

        private String city;

        private String address;

        private String organization;

        @NotNull
        @OneToOne(fetch = FetchType.LAZY)
        @MapsId
        @JoinColumn(name = "account_id")
        @PrimaryKeyJoinColumn
        private Account account;
    }
