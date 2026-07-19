package com.ccnb.app.auth;

import com.ccnb.app.common.PasswordPolicy;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Pattern(regexp = PasswordPolicy.PATTERN, message = PasswordPolicy.MESSAGE) String password,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotNull Long campusId) {
}
