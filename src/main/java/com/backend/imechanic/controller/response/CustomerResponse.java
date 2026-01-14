package com.backend.imechanic.controller.response;

public record CustomerResponse(String email, String password, String firstName, String lastName, String phone) {}
