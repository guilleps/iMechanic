import { getOrdersByStatus, statusLabels } from "@/shared/data/status";
import { Order, OrderStatus } from "@/types/orders";
import { KanbanColumn } from "./KanbanColumn";
import { useEffect, useState } from "react";
import { getWorkshopOrders } from "@/workshop/api/order.api";

const columns = Object.keys(statusLabels) as Array<OrderStatus>;

export function KanbanBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getWorkshopOrders();
        if (mounted) setOrders(data);
      } catch (e) {
        if (mounted) setError("No se pudieron cargar las órdenes");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Cargando órdenes…</div>;
  }
  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
      {columns.map((status) => (
        <KanbanColumn
          key={status}
          status={status as OrderStatus}
          orders={getOrdersByStatus(status as OrderStatus, orders)}
        />
      ))}
    </div>
  );
}
