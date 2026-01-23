package com.backend.imechanic.controller;

import com.backend.imechanic.controller.response.ItemResponse;
import com.backend.imechanic.controller.response.UploadEvidenceResponse;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.service.ItemService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/items/{itemId}")
@PreAuthorize("hasAuthority('ROLE_EMPLOYEE') or hasAuthority('ROLE_WORKSHOP_ADMIN')")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;

    @PatchMapping("/order/{orderId}")
    public ResponseEntity<@NonNull ItemResponse> updateStatus(
            @PathVariable Long itemId,
            @PathVariable Long orderId,
            Authentication auth
    ) {
        UserEntity employee = (UserEntity) auth.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(itemService.updateStatus(orderId, itemId, employee));
    }

    @PatchMapping
    public ResponseEntity<@NonNull UploadEvidenceResponse> uploadEvidence(
            @PathVariable Long itemId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description
    ) throws IOException {

        return ResponseEntity.status(HttpStatus.OK)
                .body(itemService.uploadEvidence(itemId, description, file));
    }
}
