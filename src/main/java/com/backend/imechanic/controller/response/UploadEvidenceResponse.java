package com.backend.imechanic.controller.response;

public record UploadEvidenceResponse(
        Long evidenceId,
        String mediaUrl,
        String createdAt,
        String description
) {
}
