package com.ccnb.app.content.faq;

import jakarta.validation.constraints.NotBlank;

public record FaqRequest(
        Long campusId, @NotBlank String question, @NotBlank String answer, String category, int displayOrder) {
}
