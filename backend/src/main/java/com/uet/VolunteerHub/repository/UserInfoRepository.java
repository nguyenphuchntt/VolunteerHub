package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.UserInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserInfoRepository  extends JpaRepository<UserInfo, UUID> {
}
