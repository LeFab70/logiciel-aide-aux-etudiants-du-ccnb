package com.ccnb.app.content.campusplan;

import java.util.List;

public record CampusPlanResponse(
        Long id, Long campusId, String imageUrl, String description, List<PlanPointResponse> points) {

    public static CampusPlanResponse from(CampusPlan plan, List<PlanPoint> points) {
        return new CampusPlanResponse(
                plan.getId(),
                plan.getCampus().getId(),
                plan.getImageUrl(),
                plan.getDescription(),
                points.stream().map(PlanPointResponse::from).toList());
    }
}
