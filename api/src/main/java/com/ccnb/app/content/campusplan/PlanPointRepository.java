package com.ccnb.app.content.campusplan;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanPointRepository extends JpaRepository<PlanPoint, Long> {

    List<PlanPoint> findByCampusPlanIdOrderById(Long campusPlanId);
}
