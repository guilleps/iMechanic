import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Order } from '@/types/orders';
import { Clock, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { DashboardOrderItem } from '@/workshop/models/workshop';
import { statusColors, statusLabels } from '@/shared/data/status';

export function ActiveOrdersList({ orders }: { orders: DashboardOrderItem[] }) {
  const navigate = useNavigate();

  return (
    <Card className="bg-card shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Órdenes Activas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/order/${order.id}`)}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Car className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">{order.brand} {order.model}</p>
                <p className="text-xs text-muted-foreground">{order.plate} • {order.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn(
                'text-xs font-medium border-0',
                statusColors[order.status],
                order.status === 'DELIVERED' ? 'text-primary-foreground' : 'text-primary-foreground'
              )}>
                {statusLabels[order.status]}
              </Badge>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay órdenes activas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
