import { ActiveOrdersList } from "@/shared/components/dashboard/ActiveOrdersList";
import { KPICard } from "@/shared/components/dashboard/KPICard";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { getWorkshopDashboard } from "@/workshop/api/workshop.api";
import { useQuery } from "@tanstack/react-query";
import {
  Car,
  CheckCircle,
  DollarSign,
  UserRoundCog,
  Wrench,
} from "lucide-react";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["workshop-dashboard"],
    queryFn: getWorkshopDashboard,
  });
  const activeOrders = data?.activeOrders ?? [];
  const activeEmployees = data?.activeEmployees ?? [];

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {isLoading && (
          <div className="text-sm text-muted-foreground">
            Cargando métricas...
          </div>
        )}
        {isError && (
          <div className="text-sm text-destructive">
            No se pudieron cargar las métricas.
          </div>
        )}
        {/* KPIs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Vehículos Hoy"
            value={data?.totalVehicles ?? 0}
            change=""
            changeType="positive"
            icon={Car}
            iconColor="bg-primary"
          />
          <KPICard
            title="En Proceso"
            value={data?.inProcess ?? 0}
            icon={Wrench}
            iconColor="bg-status-progress"
          />
          <KPICard
            title="Completados Hoy"
            value={data?.deliveredToday ?? 0}
            change=""
            changeType="positive"
            icon={CheckCircle}
            iconColor="bg-status-ready"
          />
          <KPICard
            title="Ingresos del Mes"
            value={`S/.${data?.monthlyIncome ? data.monthlyIncome.toLocaleString() : "0"}`}
            change=""
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-accent"
          />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Orders - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ActiveOrdersList orders={activeOrders} />
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="bg-card shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Resumen por Etapa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-status-info" />
                    <span className="text-sm">Abierto</span>
                  </div>
                  <span className="font-semibold">
                    {activeOrders.filter((o) => o.status === "OPEN").length}
                  </span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-status-progress" />
                    <span className="text-sm">Diagnóstico</span>
                  </div>
                  <span className="font-semibold">{data.activeOrders.filter(o => o.status === 'diagnostico').length}</span>
                </div> */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-status-progress" />
                    <span className="text-sm">En progreso</span>
                  </div>
                  <span className="font-semibold">
                    {
                      activeOrders.filter((o) => o.status === "IN_PROGRESS")
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span className="text-sm">Listo</span>
                  </div>
                  <span className="font-semibold">
                    {activeOrders.filter((o) => o.status === "READY").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-status-ready" />
                    <span className="text-sm">Cerrados</span>
                  </div>
                  <span className="font-semibold">
                    {
                      activeOrders.filter((o) => o.status === "DELIVERED")
                        .length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Mecánicos Activos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeEmployees.map((e, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">
                        {e.fullName
                          .split(" ")
                          .slice(0, 2)
                          .map((name) => name.charAt(0).toUpperCase())
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{e.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.activeOrders} tareas activa
                        {e.activeOrders !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-status-ready" />
                  </div>
                ))}

                {activeEmployees.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserRoundCog className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No hay mecánicos activos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
