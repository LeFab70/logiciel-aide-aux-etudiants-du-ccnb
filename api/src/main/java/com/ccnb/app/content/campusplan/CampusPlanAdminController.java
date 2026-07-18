package com.ccnb.app.content.campusplan;

import com.ccnb.app.common.ApiException;
import com.ccnb.app.user.Campus;
import com.ccnb.app.user.CampusRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/campus-plan")
public class CampusPlanAdminController {

    private final CampusPlanRepository campusPlanRepository;
    private final PlanPointRepository planPointRepository;
    private final CampusRepository campusRepository;

    public CampusPlanAdminController(
            CampusPlanRepository campusPlanRepository,
            PlanPointRepository planPointRepository,
            CampusRepository campusRepository) {
        this.campusPlanRepository = campusPlanRepository;
        this.planPointRepository = planPointRepository;
        this.campusRepository = campusRepository;
    }

    /** Creates the campus plan for this campus if it doesn't exist yet, otherwise updates it. */
    @PostMapping("/{campusId}")
    public CampusPlanResponse upsert(@PathVariable Long campusId, @Valid @RequestBody CampusPlanRequest request) {
        CampusPlan plan = campusPlanRepository.findByCampusId(campusId).orElseGet(() -> {
            Campus campus = campusRepository
                    .findById(campusId)
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Campus invalide"));
            CampusPlan newPlan = new CampusPlan();
            newPlan.setCampus(campus);
            return newPlan;
        });
        plan.setImageUrl(request.imageUrl());
        plan.setDescription(request.description());
        plan = campusPlanRepository.save(plan);
        List<PlanPoint> points = planPointRepository.findByCampusPlanIdOrderById(plan.getId());
        return CampusPlanResponse.from(plan, points);
    }

    @PostMapping("/{campusId}/points")
    public ResponseEntity<PlanPointResponse> addPoint(
            @PathVariable Long campusId, @Valid @RequestBody PlanPointRequest request) {
        CampusPlan plan = requirePlan(campusId);
        PlanPoint point = new PlanPoint();
        point.setCampusPlan(plan);
        applyRequest(point, request);
        point = planPointRepository.save(point);
        return ResponseEntity.status(HttpStatus.CREATED).body(PlanPointResponse.from(point));
    }

    @PutMapping("/{campusId}/points/{pointId}")
    public PlanPointResponse updatePoint(
            @PathVariable Long campusId, @PathVariable Long pointId, @Valid @RequestBody PlanPointRequest request) {
        requirePlan(campusId);
        PlanPoint point = planPointRepository
                .findById(pointId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Point introuvable"));
        applyRequest(point, request);
        return PlanPointResponse.from(planPointRepository.save(point));
    }

    @DeleteMapping("/{campusId}/points/{pointId}")
    public ResponseEntity<Void> deletePoint(@PathVariable Long campusId, @PathVariable Long pointId) {
        requirePlan(campusId);
        if (!planPointRepository.existsById(pointId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Point introuvable");
        }
        planPointRepository.deleteById(pointId);
        return ResponseEntity.noContent().build();
    }

    private CampusPlan requirePlan(Long campusId) {
        return campusPlanRepository
                .findByCampusId(campusId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Plan de campus introuvable"));
    }

    private void applyRequest(PlanPoint point, PlanPointRequest request) {
        point.setLabel(request.label());
        point.setXPercent(request.xPercent());
        point.setYPercent(request.yPercent());
        point.setCategory(request.category());
        point.setDescription(request.description());
    }
}
