package com.ccnb.app.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateProfileRequest(
        @NotBlank String firstName, @NotBlank String lastName, @NotNull Long campusId) {
}
