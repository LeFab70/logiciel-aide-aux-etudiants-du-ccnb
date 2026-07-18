package com.ccnb.app.content.directory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DirectoryContactRequest(
        @NotNull Long campusId,
        @NotBlank String name,
        String role,
        String department,
        String email,
        String phone,
        String officeLocation) {
}
