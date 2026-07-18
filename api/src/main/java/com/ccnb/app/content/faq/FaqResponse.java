package com.ccnb.app.content.faq;

public record FaqResponse(
        Long id, Long campusId, String question, String answer, String category, int displayOrder) {

    public static FaqResponse from(Faq faq) {
        return new FaqResponse(
                faq.getId(),
                faq.getCampus() != null ? faq.getCampus().getId() : null,
                faq.getQuestion(),
                faq.getAnswer(),
                faq.getCategory(),
                faq.getDisplayOrder());
    }
}
