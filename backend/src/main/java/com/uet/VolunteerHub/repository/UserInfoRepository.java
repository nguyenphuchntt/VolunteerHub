package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserInfoRepository  extends JpaRepository<Profile, UUID> {
}
