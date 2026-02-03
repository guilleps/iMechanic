import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types/orders';
import { CheckCircle, Receipt, CreditCard, Printer } from 'lucide-react';

interface CloseOrderModalProps {
  order: Order;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CloseOrderModal({ order, open, onClose, onConfirm }: CloseOrderModalProps) {
  const laborTotal = order.services.reduce((sum, s) => sum + s.laborCost, 0);
  const partsTotal = order.services.reduce((sum, s) => sum + s.partsCost, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Cerrar Orden - {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Vehicle Info */}
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="font-medium">{order.vehicle.brand} {order.vehicle.model}</p>
            <p className="text-sm text-muted-foreground">
              {order.vehicle.plate} • {order.client.name}
            </p>
          </div>

          {/* Services Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Servicios Realizados</h4>
            {order.services.map((service) => (
              <div key={service.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{service.name}</span>
                <span className="font-medium">${service.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mano de Obra</span>
              <span>${laborTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Refacciones</span>
              <span>${partsTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">IVA (16%)</span>
              <span>${order.tax.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">
                ${order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto bg-status-ready hover:bg-status-ready/90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirmar Cierre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
