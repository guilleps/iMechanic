package com.backend.imechanic.service;

import com.backend.imechanic.config.media.CloudinaryService;
import com.backend.imechanic.controller.request.OrderRequest;
import com.backend.imechanic.controller.response.*;
import com.backend.imechanic.enums.Role;
import com.backend.imechanic.enums.StatusItem;
import com.backend.imechanic.enums.StatusOrder;
import com.backend.imechanic.exception.EntityNotFoundException;
import com.backend.imechanic.exception.IllegalArgumentException;
import com.backend.imechanic.model.*;
import com.backend.imechanic.repository.*;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final VehicleRepository vehicleRepository;
    private final CatalogRepository catalogRepository;
    private final WorkshopRepository workshopRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeCatalogAssignmentRepository assignmentRepository;
    private final CloudinaryService cloudinaryService;
    private final EvidenceRepository evidenceRepository;

    @Transactional
    public OrderResponse create(OrderRequest request, UserEntity creator) {

        validateRequest(request);

        Workshop workshop = findWorkshopOfCreator(creator);
        Vehicle vehicle = findVehicle(request.plate());

        List<Long> serviceIds = request.items().stream()
                .map(OrderRequest.OrderItemRequest::serviceId)
                .toList();
        List<Long> employeeIds = request.items().stream()
                .map(OrderRequest.OrderItemRequest::employeeId)
                .toList();

        List<Catalog> services = findServicesForWorkshop(serviceIds, workshop.getId());
        List<Employee> employees = findEmployeesForWorkshop(employeeIds, workshop.getId());

        // TODO: evaluar disponibilidad del employee x item
        validateAssignments(employeeIds, serviceIds, request.items());

        Order order = Order.builder()
                .description(request.description())
                .status(StatusOrder.OPEN)
                .vehicle(vehicle)
                .workshop(workshop)
                .build();

        List<Item> items = buildItems(order, request.items(), services, employees);

        order.setItems(items);

        BigDecimal totalCost = items.stream()
                .map(Item::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalCost(totalCost);

        orderRepository.save(order);

        return new OrderResponse(
                new OrderResponse.VehicleResponse(
                        vehicle.getId(),
                        vehicle.getPlate(),
                        new OrderResponse.CustomerResponse(
                                vehicle.getCustomer().getId(),
                                vehicle.getCustomer().getFullName()
                        )
                ),
                items.stream().map(
                        item -> new ItemResponse(
                                item.getId(),
                                new ServiceResponse(
                                        item.getService().getName(),
                                        item.getService().getDescription(),
                                        item.getService().getCategory().toString(),
                                        item.getService().getBasePrice(),
                                        item.getService().isActive()
                                ),
                                item.getPrice()
                        )
                ).toList(),
                totalCost.toString());
    }

    @Transactional
    public UploadEvidenceResponse uploadEvidence(Long orderId, String description, MultipartFile file, UserEntity user) throws IOException {
        Workshop workshop = workshopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found"));

        Order order = orderRepository.findOrderByIdAndWorkshop_Id(orderId, workshop.getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        Map<?, ?> result = cloudinaryService.uploadImage(file);
        String url = String.valueOf(result.get("secure_url"));

        Evidence evidence = Evidence.builder()
                .description(description)
                .mediaUrl(url)
                .order(order)
                .build();

        order.getEvidences().add(evidence);

        evidenceRepository.save(evidence);

        return new UploadEvidenceResponse(
                evidence.getId(),
                evidence.getMediaUrl(),
                evidence.getCreatedAt().toString(),
                evidence.getDescription()
        );
    }

    @Transactional(readOnly = true)
    public TimelineResponse getTimeline(Long orderId, UserEntity user) {

        Order order;

        if (user.getRole() == Role.ROLE_WORKSHOP_ADMIN) {
            order = orderRepository.findOrderByIdAndWorkshop_User_Id(orderId, user.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        } else if (user.getRole() == Role.ROLE_EMPLOYEE) {
            order = orderRepository.findOrderVisibleToEmployee(orderId, user.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        } else if (user.getRole() == Role.ROLE_CUSTOMER) {
            order = orderRepository.findOrderByIdAndVehicle_Customer_Id(orderId, user.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        } else {
            throw new IllegalArgumentException("Role not allowed");
        }

        Vehicle vehicle = order.getVehicle();

        String vehicleResponse = vehicle.getBrand() + " " + vehicle.getModel() + " - " + vehicle.getPlate();

        int totalItems = order.getItems().size();
        long countItemCompleted = order.getItems().stream()
                .filter(item -> item.getStatus() == StatusItem.COMPLETED)
                .count();

        int progressPercentage = totalItems == 0
                ? 0
                : (int) Math.round((countItemCompleted * 100.0) / totalItems);

        List<TimelineResponse.ItemTimelineResponse> timeline = order.getItems().stream()
                .map(item -> {
                    Profile profileEmployee = item.getEmployee().getUser().getProfile();

                    return new TimelineResponse.ItemTimelineResponse(
                            item.getId(),
                            item.getService().getName(),
                            profileEmployee.getFirstName() + " " + profileEmployee.getLastName(),
                            item.getStatus().toString(),
                            item.getCreatedAt().toString(),
                            item.getEvidence() == null
                                    ? null
                                    : new TimelineResponse.EvidenceResponse(
                                    item.getEvidence().getMediaUrl(),
                                    item.getEvidence().getDescription()
                            )
                    );
                })
                .toList();

        return new TimelineResponse(
                order.getId(),
                vehicleResponse,
                order.getStatus().toString(),
                progressPercentage,
                timeline
        );
    }

    @Transactional
    public CloseOrderResponse closeOrder(Long orderId, UserEntity user) {

        Workshop workshop = workshopRepository.findByUserId(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found"));

        Order order = orderRepository.findOrderByIdAndWorkshop_Id(orderId, workshop.getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        Profile profile = order.getVehicle().getCustomer();
        String customerName = profile.getFirstName() + " " + profile.getLastName();

        BigDecimal totalCost = order.getItems().stream()
                .map(Item::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CloseOrderResponse.ServiceResponse> items = order.getItems().stream()
                .map(item -> new CloseOrderResponse.ServiceResponse(
                        item.getService().getName(),
                        item.getService().getCategory().toString(),
                        item.getService().getBasePrice()
                ))
                .toList();

        boolean allCompleted = order.getItems().stream()
                .allMatch(i -> i.getStatus() == StatusItem.COMPLETED);

        if (!allCompleted) {
            throw new IllegalArgumentException("Order cannot be closed until all items are completed");
        }

        order.setStatus(StatusOrder.READY);
        orderRepository.save(order);

        return new CloseOrderResponse(
                order.getId(),
                customerName,
                order.getUpdatedAt().toString(),
                new CloseOrderResponse.BreakdownResponse(
                        BigDecimal.ZERO,
                        totalCost
                ),
                items
        );
    }

    private List<Item> buildItems(
            Order order,
            List<OrderRequest.OrderItemRequest> items,
            List<Catalog> services,
            List<Employee> employees
    ) {
        Map<Long, Catalog> serviceById = services.stream()
                .collect(Collectors.toMap(Catalog::getId, s -> s));

        Map<Long, Employee> employeeById = employees.stream()
                .collect(Collectors.toMap(Employee::getId, e -> e));

        return items.stream()
                .map(s -> {
                            Catalog service = serviceById.get(s.serviceId());
                            Employee employee = employeeById.get(s.employeeId());

                            return Item.builder()
                                    .order(order)
                                    .status(StatusItem.PENDING)
                                    .service(service)
                                    .employee(employee)
                                    .price(service.getBasePrice())
                                    .build();
                        }
                ).toList();
    }

    public List<OrderKanbanResponse> getOrders(UserEntity admin) {
        Workshop workshop = workshopRepository.findByUserId(admin.getId())
                .orElseThrow(() -> new IllegalArgumentException("Workshop not found"));

        List<Order> orders = workshop.getOrders();

        List<OrderKanbanResponse.OrderKanbanItemResponse> items = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .map(i -> {
                    Catalog service = i.getService();
                    return new OrderKanbanResponse.OrderKanbanItemResponse(service.getName(), i.getStatus());
                })
                .toList();

        return orders.stream()
                .map(o -> {
                    Vehicle v = o.getVehicle();
                    Profile customer = v.getCustomer();

                    return new OrderKanbanResponse(
                            "ORD-" + o.getId(),
                            new OrderKanbanResponse.VehicleResponse(
                                    v.getId(),
                                    v.getPlate(),
                                    v.getBrand(),
                                    v.getModel(),
                                    v.getYear()
                            ),
                            new OrderKanbanResponse.CustomerResponse(
                                    customer.getId(),
                                    customer.getFirstName(),
                                    customer.getLastName()
                            ),
                            o.getStatus(),
                            items,
                            o.getTotalCost()
                    );
                }).toList();
    }

    private void validateAssignments(
            List<Long> employeeIds,
            List<Long> serviceIds,
            List<OrderRequest.OrderItemRequest> request
    ) {
        List<EmployeeCatalogAssignment> assignments = assignmentRepository
                .findAllByEmployee_IdInAndService_IdIn(employeeIds, serviceIds);

        Set<String> pairs = assignments.stream()
                .map(a -> a.getEmployee().getId() + ":" + a.getService().getId())
                .collect(Collectors.toSet());

        for (OrderRequest.OrderItemRequest pair : request) {
            String key = pair.employeeId() + ":" + pair.serviceId();
            if (!pairs.contains(key))
                throw new IllegalArgumentException("Employee " + pair.employeeId() + " is not assigned to service " + pair.serviceId());
        }

    }

    private List<Employee> findEmployeesForWorkshop(List<Long> employeeIds, Long id) {
        return employeeRepository
                .findAllByIdInAndWorkshop_Id(employeeIds, id)
                .orElseThrow(() -> new EntityNotFoundException("One or more employees were not found for this workshop"));
    }

    private List<Catalog> findServicesForWorkshop(List<Long> serviceIds, Long id) {
        return catalogRepository
                .findAllByIdInAndWorkshop_IdAndActiveTrue(serviceIds, id)
                .orElseThrow(() -> new EntityNotFoundException("One or more services were not found for this workshop"));
    }

    private Vehicle findVehicle(@NotBlank(message = "The field 'plate' is required") String plate) {
        return vehicleRepository.findVehicleByPlate(plate)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
    }

    private Workshop findWorkshopOfCreator(UserEntity creator) {
        return workshopRepository.findByUserId(creator.getId())
                .orElseThrow(() -> new EntityNotFoundException("Workshop not found"));
    }

    private void validateRequest(OrderRequest request) {
        if (request == null || request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
        if (request.plate() == null || request.plate().isBlank()) {
            throw new IllegalArgumentException("Plate is required");
        }
    }

}
