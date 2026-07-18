package com.ccnb.app.user;

import java.util.Set;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        CampusResponse campus,
        Set<Role> roles) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                CampusResponse.from(user.getCampus()),
                user.getRoles());
    }
}
