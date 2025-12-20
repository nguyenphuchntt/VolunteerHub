package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.FcmToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FcmTokenRepository extends JpaRepository<FcmToken, Long> {

    Optional<FcmToken> findByToken(String token);

    List<FcmToken> findAllByAccountId(UUID accountId);

    List<FcmToken> findAllByAccountIdIn(List<UUID> accountIds);
}
