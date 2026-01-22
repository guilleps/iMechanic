package com.backend.imechanic.controller.response;

import java.util.List;

public record TimelineResponse(
        Long orderId,
        String vehicle,
        String currentStatus,
        int progressPercentage,
        List<ItemTimelineResponse> timeline
) {
    public record ItemTimelineResponse(
            Long itemId,
            String serviceName,
            String employeeName,
            String status,
            String timestamp,
            EvidenceResponse evidence
    ){}

    public record EvidenceResponse(
            String url,
            String description
    ) {}
}
