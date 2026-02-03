import { MobileNav } from '@/components/layout/MobileNav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Wrench, 
  CheckCircle, 
  Calendar, 
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { mechanics, orders } from '@/data/mockData';

export default function MechanicProfile() {
  const currentMechanic = mechanics[1]; // Simulating logged-in mechanic (Miguel Ángel)
  
  // Calculate stats for this mechanic
  const myTasks = orders.flatMap(order => 
    order.services.filter(s => s.mechanicId === currentMechanic.id)
  );
  
  const completedThisWeek = myTasks.filter(t => t.status === 'completed').length;
  const totalCompleted = myTasks.filter(t => t.status === 'completed').length;
  const pendingTasks = myTasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground pt-8 pb-16 px-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary-foreground/20 flex items-center justify-center border-4 border-primary-foreground/30">
              <User className="w-12 h-12" />
            </div>
            <h1 className="mt-4 text-xl font-bold">{currentMechanic.name}</h1>
            <Badge variant="secondary" className="mt-2 bg-primary-foreground/20 text-primary-foreground border-0">
              <Wrench className="w-3 h-3 mr-1" />
              {currentMechanic.specialty}
            </Badge>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 -mt-10">
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-status-ready/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-status-ready" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{completedThisWeek}</p>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-status-progress/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-status-progress" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{pendingTasks}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{totalCompleted}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 mt-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-foreground">Información Personal</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">ID Empleado</span>
                <span className="font-medium">MEC-{currentMechanic.id.padStart(3, '0')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Rol</span>
                <Badge variant="outline">Mecánico</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Especialidad</span>
                <span className="font-medium">{currentMechanic.specialty}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Estado</span>
                <Badge variant="secondary" className="bg-status-ready/10 text-status-ready border-0">
                  Activo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4">
        <Card>
          <CardContent className="p-2">
            <button className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Configuración</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors text-status-error">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          </CardContent>
        </Card>
      </div>

      <MobileNav />
    </div>
  );
}
