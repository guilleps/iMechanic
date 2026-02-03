import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { ActiveOrdersList } from '@/components/dashboard/ActiveOrdersList';
import { orders } from '@/data/mockData';
import { Car, DollarSign, Clock, CheckCircle, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const activeOrders = orders.filter(o => o.status !== 'listo');
  const completedToday = orders.filter(o => o.status === 'listo').length;
  const totalRevenue = orders.filter(o => o.status === 'listo').reduce((sum, o) => sum + o.total, 0);
  
  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* KPIs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Vehículos Hoy"
            value={orders.length}
            change="+2 vs ayer"
            changeType="positive"
            icon={Car}
            iconColor="bg-primary"
          />
          <KPICard
            title="En Proceso"
            value={activeOrders.length}
            icon={Wrench}
            iconColor="bg-status-progress"
          />
          <KPICard
            title="Completados Hoy"
            value={completedToday}
            change="100% eficiencia"
            changeType="positive"
            icon={CheckCircle}
            iconColor="bg-status-ready"
          />
          <KPICard
            title="Ingresos del Mes"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+15% vs mes anterior"
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-accent"
          />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Orders - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActiveOrdersList orders={orders} />
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="bg-card shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Resumen por Etapa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-status-info" />
                    <span className="text-sm">Recepción</span>
                  </div>
                  <span className="font-semibold">{orders.filter(o => o.status === 'recepcion').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-status-progress" />
                    <span className="text-sm">Diagnóstico</span>
                  </div>
                  <span className="font-semibold">{orders.filter(o => o.status === 'diagnostico').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-status-progress" />
                    <span className="text-sm">Reparación</span>
                  </div>
                  <span className="font-semibold">{orders.filter(o => o.status === 'reparacion').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span className="text-sm">Pruebas</span>
                  </div>
                  <span className="font-semibold">{orders.filter(o => o.status === 'pruebas').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-status-ready" />
                    <span className="text-sm">Listo</span>
                  </div>
                  <span className="font-semibold">{orders.filter(o => o.status === 'listo').length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Mecánicos Activos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">CM</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Carlos Mendoza</p>
                    <p className="text-xs text-muted-foreground">2 tareas activas</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-status-ready" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-xs font-medium text-accent-foreground">MA</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Miguel Ángel</p>
                    <p className="text-xs text-muted-foreground">1 tarea activa</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-status-ready" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-xs font-medium text-secondary-foreground">RG</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Roberto García</p>
                    <p className="text-xs text-muted-foreground">1 tarea activa</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-status-progress" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
