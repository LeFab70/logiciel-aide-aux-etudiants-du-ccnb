package com.ccnb.app.content.faq;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FaqRepository extends JpaRepository<Faq, Long> {

    @Query(
            "select f from Faq f where f.campus.id = :campusId or f.campus is null order by f.displayOrder, f.id")
    List<Faq> findVisibleForCampus(Long campusId);

    @Query("select f from Faq f where f.campus is null order by f.displayOrder, f.id")
    List<Faq> findVisibleForAllCampuses();
}
