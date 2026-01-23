package com.backend.imechanic.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.OffsetDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record BodyError(
        String code,
        String message,
        int status,
        String path,
        OffsetDateTime timestamp,
        List<FieldError> fieldErrors) {
    public record FieldError(String field, String message) {
    }
}
