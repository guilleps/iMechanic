import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { VehicleClientInfo } from '@/components/order-detail/VehicleClientInfo';
import { ServicesList } from '@/components/order-detail/ServicesList';
import { OrderTimeline } from '@/components/order-detail/OrderTimeline';
import { CloseOrderModal } from '@/components/order-detail/CloseOrderModal';
import { orders, statusLabels, statusColors } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCloseModal, setShowCloseModal] = useState(false);

  const order = orders.find(o => o.id === id);

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
                  {order.orderNumber}
                </h1>
                <Badge className={cn(
                  'text-sm font-medium border-0',
                  statusColors[order.status],
                  'text-primary-foreground'
                )}>
                  {statusLabels[order.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Creada el {new Date(order.createdAt).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            {order.status !== 'listo' && (
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
                <p className="font-semibold">${order.total.toLocaleString()}</p>
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
                <p className="font-semibold">
                  {order.estimatedCompletion
                    ? new Date(order.estimatedCompletion).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                      })
                    : 'Por definir'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle & Client Info */}
        <VehicleClientInfo vehicle={order.vehicle} client={order.client} />

        {/* Services & Timeline Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ServicesList services={order.services} />
          <OrderTimeline events={order.timeline} />
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
