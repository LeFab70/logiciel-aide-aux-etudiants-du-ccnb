package com.ccnb.app.content.campusplan;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PlanPointRequest(
        @NotBlank String label,
        @NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal xPercent,
        @NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal yPercent,
        @NotNull PlanPointCategory category,
        String description) {
}
