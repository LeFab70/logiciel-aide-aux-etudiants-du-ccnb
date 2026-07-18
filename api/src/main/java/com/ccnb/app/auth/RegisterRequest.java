package com.ccnb.app.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "doit contenir au moins 8 caractères") String password,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotNull Long campusId) {
}
