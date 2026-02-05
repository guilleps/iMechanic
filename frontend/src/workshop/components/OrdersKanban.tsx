import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { KanbanBoard } from '@/workshop/components/kanban/KanbanBoard';
import ModalCreateOrder from '@/workshop/components/modal/ModalCreateOrder';
import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function OrdersKanban() {
  const [open, setOpen] = useState(false);
  const handleCreate = (data: {
    plate: string;
    brand: string;
    model: string;
    year: string;
    customerFirstName: string;
    customerLastName: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'READY' | 'DELIVERED';
  }) => {
    // TODO: Integrate with create-order API
    console.log('Creating order:', data);
  };

  return (
    <MainLayout title="Gestión de Órdenes">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar orden..."
                className="pl-9 w-full sm:w-64 bg-card"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90" onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Orden
            </Button>
            <ModalCreateOrder open={open} onOpenChange={setOpen} onCreate={handleCreate} />
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard />
      </div>
    </MainLayout>
  );
}
