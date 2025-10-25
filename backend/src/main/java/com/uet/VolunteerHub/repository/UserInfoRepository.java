package com.uet.VolunteerHub.repository;

import com.uet.VolunteerHub.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserInfoRepository  extends JpaRepository<UserInfo, UUID> {
    List<UserInfo> readUserInfoByFirstNameContainingIgnoreCase(String firstName);
    List<UserInfo> readUserInfoByLastNameContainingIgnoreCase(String lastName);
    List<UserInfo> readUserInfoByCountryContainingIgnoreCase(String country);
    List<UserInfo> readUserInfoByCityContainingIgnoreCase(String city);
    List<UserInfo> readUserInfoByOrganizationContainingIgnoreCase(String organization);
    List<UserInfo> readUserInfoByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}
