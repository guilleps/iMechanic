package com.backend.imechanic.controller.response;

public record EmployeeResponse(
        String firstName,
        String lastName,
        String phone,
        boolean available
) {
}
