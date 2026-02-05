import { cn } from '@/lib/utils';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { CloseOrderModal } from '@/shared/components/order-detail/CloseOrderModal';
import { OrderTimeline } from '@/shared/components/order-detail/OrderTimeline';
import { ServicesList } from '@/shared/components/order-detail/ServicesList';
import { VehicleClientInfo } from '@/shared/components/order-detail/VehicleClientInfo';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { statusColors, statusLabels } from '@/shared/data/status';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Edit } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkshopOrders } from '@/workshop/api/order.api';
import type { Order } from '@/types/orders';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCloseModal, setShowCloseModal] = useState(false);
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
        if (mounted) setError('No se pudo cargar la orden');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const order = useMemo(() => orders.find(o => o.id === id), [orders, id]);

  if (loading) {
    return (
      <MainLayout title="Cargando orden…">
        <div className="p-6 text-sm text-muted-foreground">Cargando…</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Error">
        <div className="p-6 text-sm text-destructive">{error}</div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout title="Orden no encontrada">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">La orden solicitada no existe.</p>
          <Button onClick={() => navigate('/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Órdenes
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleCloseOrder = () => {
    setShowCloseModal(false);
    navigate('/orders');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/orders')}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  ORD-{order.id}
                </h1>
                <Badge className={cn(
                  'text-sm font-medium border-0',
                  statusColors[order.status],
                  'text-primary-foreground'
                )}>
                  {statusLabels[order.status]}
                </Badge>
              </div>
              {/* <p className="text-sm text-muted-foreground">
                Creada el {new Date(order.createdAt).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p> */}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            {order.status !== 'READY' && order.status !== 'DELIVERED' && (
              <Button
                onClick={() => setShowCloseModal(true)}
                className="bg-status-ready hover:bg-status-ready/90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Cerrar Orden
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <p className="font-semibold">{statusLabels[order.status]}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-ready/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-status-ready" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Servicios</p>
                <p className="font-semibold">{order.services.length} items</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold">S/.{order.totalCost.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-progress/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-status-progress" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entrega Est.</p>
                <p className="font-semibold">Por definir</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle & Client Info */}
        {/* <VehicleClientInfo 
          vehicle={order.vehicle} 
          // Map current customer to expected client shape
          client={{ 
            id: order.customer.id, 
            name: `${order.customer.firstName} ${order.customer.lastName}`, 
            phone: '', 
            email: '' 
          } as unknown as any} 
        /> */}

        {/* Services & Timeline Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ServicesList services={order.services} />
          {/* <OrderTimeline events={order.timeline} /> */}
        </div>

        {/* Close Order Modal */}
        <CloseOrderModal
          order={order}
          open={showCloseModal}
          onClose={() => setShowCloseModal(false)}
          onConfirm={handleCloseOrder}
        />
      </div>
    </MainLayout>
  );
}
