package com.uet.VolunteerHub.dto;

import com.uet.VolunteerHub.enums.AccountStatus;
import com.uet.VolunteerHub.enums.UserRole;
import lombok.Data;

@Data
public class UserSearchCriteriaDTO {
    private String username;
    private String email;
    private AccountStatus accountStatus;
    private UserRole role;
    private String country;
    private String city;
    private String organization;
    private String firstName;
    private String lastName;

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        if (username != null) sb.append("userName: ").append(username).append("\n");
        if (email != null) sb.append("email: ").append(email).append("\n");
        if (accountStatus != null) sb.append("accountStatus: ").append(accountStatus).append("\n");
        if (role != null) sb.append("role: ").append(role).append("\n");
        if (country != null) sb.append("country: ").append(country).append("\n");
        if (city != null) sb.append("city: ").append(city).append("\n");
        if (organization != null) sb.append("organization: ").append(organization).append("\n");
        if (firstName != null) sb.append("firstName: ").append(firstName).append("\n");
        if (lastName != null) sb.append("lastName: ").append(lastName).append("\n");
        return sb.toString();
    }
}
