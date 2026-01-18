package com.backend.imechanic.controller.request;

import com.backend.imechanic.enums.CategoryService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@JsonIgnoreProperties
public record ServiceRequest(
        @NotBlank(message = "The field 'name' is required")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description,

        @NotNull(message = "The field 'category' is required")
        CategoryService category,

        @NotNull(message = "The field 'basePrice' is required")
        @DecimalMin(value = "0.00", inclusive = false, message = "The basePrice must be greater than 0")
        BigDecimal basePrice
) {
}
