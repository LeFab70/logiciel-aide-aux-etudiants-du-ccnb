package com.ccnb.app.content.campusplan;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "plan_point")
@Getter
@Setter
@NoArgsConstructor
public class PlanPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_plan_id", nullable = false)
    private CampusPlan campusPlan;

    @Column(nullable = false)
    private String label;

    @Column(name = "x_percent", nullable = false)
    private BigDecimal xPercent;

    @Column(name = "y_percent", nullable = false)
    private BigDecimal yPercent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanPointCategory category = PlanPointCategory.OTHER;

    private String description;
}
