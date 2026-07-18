package com.ccnb.app.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank
                @Pattern(
                        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                        message = "8 caractères minimum, avec une majuscule, une minuscule et un chiffre")
                String password,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotNull Long campusId) {
}
