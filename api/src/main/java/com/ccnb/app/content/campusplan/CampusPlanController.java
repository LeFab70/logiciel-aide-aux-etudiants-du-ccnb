package com.ccnb.app.content.campusplan;

import com.ccnb.app.common.ApiException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/campus-plan")
public class CampusPlanController {

    private final CampusPlanRepository campusPlanRepository;
    private final PlanPointRepository planPointRepository;

    public CampusPlanController(
            CampusPlanRepository campusPlanRepository, PlanPointRepository planPointRepository) {
        this.campusPlanRepository = campusPlanRepository;
        this.planPointRepository = planPointRepository;
    }

    @GetMapping("/{campusId}")
    public CampusPlanResponse get(@PathVariable Long campusId) {
        CampusPlan plan = campusPlanRepository
                .findByCampusId(campusId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Plan de campus introuvable"));
        List<PlanPoint> points = planPointRepository.findByCampusPlanIdOrderById(plan.getId());
        return CampusPlanResponse.from(plan, points);
    }
}
