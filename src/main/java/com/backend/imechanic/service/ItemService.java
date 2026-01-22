package com.backend.imechanic.service;

import com.backend.imechanic.config.media.CloudinaryService;
import com.backend.imechanic.controller.response.ItemResponse;
import com.backend.imechanic.controller.response.ServiceResponse;
import com.backend.imechanic.controller.response.UploadEvidenceResponse;
import com.backend.imechanic.enums.StatusItem;
import com.backend.imechanic.enums.StatusOrder;
import com.backend.imechanic.exception.EntityNotFoundException;
import com.backend.imechanic.model.*;
import com.backend.imechanic.repository.EmployeeRepository;
import com.backend.imechanic.repository.EvidenceRepository;
import com.backend.imechanic.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final EmployeeRepository employeeRepository;
    private final CloudinaryService cloudinaryService;
    private final EvidenceRepository evidenceRepository;

    @Transactional
    public ItemResponse updateStatus(Long orderId, Long itemId, UserEntity employeeAssigned) {
        Employee employee = employeeRepository
                .findByUser_Id(employeeAssigned.getId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        Long workshopId = employee.getWorkshop().getId();

        Item item = itemRepository
                .findByIdAndOrder_IdAndOrder_Workshop_IdAndEmployee_Id(itemId, orderId, workshopId, employee.getId())
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        if (item.getStatus() == StatusItem.PENDING) {
            item.setStatus(StatusItem.IN_PROGRESS);
        } else if (item.getStatus() == StatusItem.IN_PROGRESS) {
            item.setStatus(StatusItem.COMPLETED);
        } else {
            throw new IllegalArgumentException("Item is already completed");
        }

        verifiedStatus(item.getOrder());

        return new ItemResponse(
                item.getId(),
                new ServiceResponse(
                        item.getService().getName(),
                        item.getService().getDescription(),
                        item.getService().getCategory().toString(),
                        item.getService().getBasePrice(),
                        item.getService().isActive()
                ),
                item.getPrice()
        );
    }

    private void verifiedStatus(Order order) {

        boolean anyInProgress = order.getItems().stream()
                .anyMatch(item -> item.getStatus() == StatusItem.IN_PROGRESS);

        boolean allCompleted = order.getItems().stream()
                .allMatch(item -> item.getStatus() == StatusItem.COMPLETED);

        if (allCompleted) {
            order.setStatus(StatusOrder.READY);
        } else if (anyInProgress) {
            order.setStatus(StatusOrder.IN_PROGRESS);
        } else {
            order.setStatus(StatusOrder.OPEN);
        }
    }

    @Transactional
    public UploadEvidenceResponse uploadEvidence(Long itemId, String description, MultipartFile file) throws IOException {

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Evidence file is required");
        }

        Map<?, ?> result = cloudinaryService.uploadImage(file);
        String url = String.valueOf(result.get("secure_url"));

        Evidence evidence = Evidence.builder()
                .description(description)
                .mediaUrl(url)
                .order(item.getOrder())
                .item(item)
                .build();

        evidenceRepository.save(evidence);

        item.setEvidence(evidence);

        return new UploadEvidenceResponse(
                evidence.getId(),
                evidence.getMediaUrl(),
                evidence.getCreatedAt().toString(),
                evidence.getDescription()
        );
    }

}
