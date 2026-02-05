import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { orders, mechanics } from '@/data/mockData';
import { MechanicTaskCard } from '@/shared/components/mechanic/MechanicTaskCard';
import { MobileNav } from '@/shared/components/layout/MobileNav';
import { Wrench, User, ClipboardList, ChevronRight } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

export default function MechanicView() {
  // const currentMechanic = mechanics[1]; // Simulating logged-in mechanic (Miguel Ángel with pending tasks)
  
  // Get all services assigned to this mechanic
  // const myTasks = orders.flatMap(order => 
  //   order.services
  //     .filter(s => s.mechanicId === currentMechanic.id)
  //     .map(service => ({
  //       ...service,
  //       orderId: order.id,
  //       orderNumber: order.orderNumber,
  //       vehicleInfo: `${order.vehicle.brand} ${order.vehicle.model} - ${order.vehicle.plate}`,
  //       clientName: order.client.name,
  //     }))
  // );

  // const pendingTasks = myTasks.filter(t => t.status !== 'completed');
  // const completedTasks = myTasks.filter(t => t.status === 'completed');

  const handleComplete = (serviceId: string) => {
    console.log('Completing task:', serviceId);
    // Here you would update the service status
  };

  const handleAddNote = (serviceId: string, note: string) => {
    console.log('Adding note to task:', serviceId, note);
    // Here you would add the note to the timeline
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                {/* <p className="font-semibold">{currentMechanic.name}</p>
                <p className="text-sm opacity-80">{currentMechanic.specialty}</p> */}
              </div>
            </div>
            <Link 
              to="/employee/profile" 
              className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              Ver perfil
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-3 py-2">
              <ClipboardList className="w-4 h-4" />
              <span className="text-sm">
                {/* <span className="font-bold">{pendingTasks.length}</span> pendientes */}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-3 py-2">
              <Wrench className="w-4 h-4" />
              <span className="text-sm">
                {/* <span className="font-bold">{completedTasks.length}</span> completadas */}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="pending" className="flex-1">
              Pendientes Hoy
              <Badge variant="secondary" className="ml-2">
                {/* {pendingTasks.length} */}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Completadas
              <Badge variant="secondary" className="ml-2">
                {/* {completedTasks.length} */}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* <TabsContent value="pending" className="space-y-4 mt-0">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <MechanicTaskCard
                  key={task.id}
                  service={task}
                  vehicleInfo={task.vehicleInfo}
                  onComplete={handleComplete}
                  onAddNote={handleAddNote}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No tienes tareas pendientes</p>
                <p className="text-sm">¡Excelente trabajo!</p>
              </div>
            )}
          </TabsContent> */}

          <TabsContent value="completed" className="space-y-4 mt-0">
            {/* {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <MechanicTaskCard
                  key={task.id}
                  service={task}
                  vehicleInfo={task.vehicleInfo}
                  onComplete={handleComplete}
                  onAddNote={handleAddNote}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Sin tareas completadas hoy</p>
              </div>
            )} */}
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  );
}
