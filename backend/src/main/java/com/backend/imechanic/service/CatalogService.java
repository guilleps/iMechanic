package com.backend.imechanic.service;

import com.backend.imechanic.controller.request.ServiceRequest;
import com.backend.imechanic.controller.response.ServiceResponse;
import com.backend.imechanic.exception.EntityNotFoundException;
import com.backend.imechanic.exception.IllegalArgumentException;
import com.backend.imechanic.model.Catalog;
import com.backend.imechanic.model.UserEntity;
import com.backend.imechanic.model.Workshop;
import com.backend.imechanic.repository.CatalogRepository;
import com.backend.imechanic.repository.WorkshopRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CatalogService {
    private final CatalogRepository catalogRepository;
    private final WorkshopRepository workshopRepository;

    @Transactional
    public ServiceResponse create(ServiceRequest request, UserEntity admin) {

        Workshop workshop = workshopRepository.findByUserId(admin.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found"));

        if (request.basePrice() == null || request.basePrice().signum() < 0) {
            throw new IllegalArgumentException("basePrice must be >= 0");
        }

        Catalog newService = Catalog.builder()
                .name(request.name())
                .description(request.description())
                .category(request.category())
                .basePrice(request.basePrice())
                .active(true)
                .workshop(workshop)
                .build();

        catalogRepository.save(newService);

        return new ServiceResponse(
                newService.getName(),
                newService.getDescription(),
                newService.getCategory().toString(),
                newService.getBasePrice(),
                newService.isActive()
        );
    }

    @Transactional(readOnly = true)
    public ServiceResponse getService(Long serviceId, UserEntity admin) {

        Catalog service = catalogRepository.findByIdAndWorkshop_User_Id(serviceId, admin.getId())
                .orElseThrow(() -> new EntityNotFoundException("Service not found"));

        return new ServiceResponse(
                service.getName(),
                service.getDescription(),
                service.getCategory().toString(),
                service.getBasePrice(),
                service.isActive()
        );
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServicesByWorkshop(UserEntity admin) {

        return catalogRepository.findAllByWorkshop_User_IdOrderByCreatedAtDesc(admin.getId())
                .stream()
                .map(service -> {
                    return new ServiceResponse(
                            service.getName(),
                            service.getDescription(),
                            service.getCategory().toString(),
                            service.getBasePrice(),
                            service.isActive()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ServiceResponse update(Long serviceId, ServiceRequest request, UserEntity admin) {

        Catalog service = catalogRepository.findByIdAndWorkshop_User_Id(serviceId, admin.getId())
                .orElseThrow(() -> new EntityNotFoundException("Service not found"));

        service.setName(request.name());
        service.setDescription(request.description());
        service.setCategory(request.category());
        service.setBasePrice(request.basePrice());

        return new ServiceResponse(
                service.getName(),
                service.getDescription(),
                service.getCategory().toString(),
                service.getBasePrice(),
                service.isActive()
        );
    }

    @Transactional
    public String toggleAvailability(Long serviceId, UserEntity admin) {

        Catalog service = catalogRepository.findByIdAndWorkshop_User_Id(serviceId, admin.getId())
                .orElseThrow(() -> new EntityNotFoundException("Service not found"));

        boolean nowActive = !service.isActive();
        service.setActive(nowActive);

        return nowActive
                ? "Service: " + service.getName() + " is active"
                : "Service: " + service.getName() + " is inactive";
    }
}
