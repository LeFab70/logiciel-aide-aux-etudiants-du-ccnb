package com.ccnb.app.content.campusplan;

import java.math.BigDecimal;

public record PlanPointResponse(
        Long id, String label, BigDecimal xPercent, BigDecimal yPercent, PlanPointCategory category, String description) {

    public static PlanPointResponse from(PlanPoint point) {
        return new PlanPointResponse(
                point.getId(),
                point.getLabel(),
                point.getXPercent(),
                point.getYPercent(),
                point.getCategory(),
                point.getDescription());
    }
}
