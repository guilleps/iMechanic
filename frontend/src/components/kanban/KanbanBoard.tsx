import { orders, getOrdersByStatus } from '@/data/mockData';
import { KanbanColumn } from './KanbanColumn';
import { OrderStatus } from '@/types/orders';

const columns: OrderStatus[] = ['recepcion', 'diagnostico', 'reparacion', 'pruebas', 'listo'];

export function KanbanBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
      {columns.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          orders={getOrdersByStatus(status)}
        />
      ))}
    </div>
  );
}
