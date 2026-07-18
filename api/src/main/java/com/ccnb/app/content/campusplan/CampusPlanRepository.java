package com.ccnb.app.content.campusplan;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampusPlanRepository extends JpaRepository<CampusPlan, Long> {

    Optional<CampusPlan> findByCampusId(Long campusId);
}
