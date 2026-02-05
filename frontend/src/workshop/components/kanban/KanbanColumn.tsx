import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { statusColors, statusLabels } from "@/shared/data/status";
import { Order, OrderStatus } from "@/types/orders";
import { Car, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface KanbanColumnProps {
  status: OrderStatus;
  orders: Order[];
}

export function KanbanColumn({ status, orders }: KanbanColumnProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-w-[280px] md:min-w-[300px]">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("w-3 h-3 rounded-full", statusColors[status])} />
        <h3 className="font-semibold text-foreground">
          {statusLabels[status]}
        </h3>
        <Badge variant="secondary" className="ml-auto text-xs">
          {orders.length}
        </Badge>
      </div>

      {/* Cards Container */}
      <div className="flex-1 space-y-3 pb-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            onClick={() => navigate(`/order/${order.id}`)}
            className="bg-card shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 border border-border/50"
          >
            <CardContent className="p-4">
              {/* Order Number */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-muted-foreground">
                  {/* {order.orderNumber} */}ORD-2026-001
                </span>
                <Badge
                  className={cn(
                    "text-xs font-medium border-0",
                    statusColors[order.status],
                    "text-primary-foreground",
                  )}
                >
                  {statusLabels[order.status]}
                </Badge>
              </div>

              {/* Vehicle Info */}
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm">
                  {order.vehicle.brand} {order.vehicle.model}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {order.vehicle.plate} • {order.vehicle.year}
              </p>

              {/* Client */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {order.customer.firstName} {order.customer.lastName}
                </span>
              </div>

              {/* Services Preview */}
              <div className="space-y-1.5 mb-3">
                {order.services.slice(0, 2).map((service, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        service.status === "COMPLETED"
                          ? "bg-status-ready"
                          : service.status === "IN_PROGRESS"
                            ? "bg-status-progress"
                            : "bg-muted-foreground",
                      )}
                    />
                    <span className="text-xs text-muted-foreground truncate">
                      {service.name}
                    </span>
                  </div>
                ))}
                {order.services.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{order.services.length - 2} más
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {/* <span className="text-xs">
                    {new Date(order.createdAt).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span> */}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  S/.{order.totalCost.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
            <Car className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">Sin órdenes</p>
          </div>
        )}
      </div>
    </div>
  );
}
