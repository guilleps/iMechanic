package com.backend.imechanic.controller.response;

import java.util.List;

public record EmployeeWithServiceResponse(
        String nameEmployee,
        List<ServiceResponse> serviceList
) {
}
