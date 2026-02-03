import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, User, Wrench, CheckCircle, Clock } from 'lucide-react';
import { mechanics, orders } from '@/data/mockData';

// Calculate mechanics data with availability
const mechanicsData = mechanics.map(mechanic => {
  const activeTasks = orders.flatMap(order => 
    order.services.filter(s => s.mechanicId === mechanic.id && s.status !== 'completed')
  ).length;
  
  return {
    ...mechanic,
    activeTasks,
    isAvailable: activeTasks === 0,
  };
});

const specialties = [
  'Motor y transmisión',
  'Frenos y suspensión',
  'Eléctrico y diagnóstico',
  'Carrocería y pintura',
  'Afinación y mantenimiento',
  'Aire acondicionado',
];

export default function Staff() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMechanic, setNewMechanic] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '',
  });

  const handleCreateMechanic = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating mechanic:', newMechanic);
    setIsModalOpen(false);
    setNewMechanic({ name: '', specialty: '', email: '', phone: '' });
  };

  return (
    <MainLayout title="Gestión de Mecánicos">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-status-ready" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-status-progress" />
              <span>Ocupado</span>
            </div>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Mecánico
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Mecánico</DialogTitle>
                <DialogDescription>
                  Registra un nuevo miembro del equipo
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateMechanic} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Carlos Mendoza"
                      className="pl-10"
                      value={newMechanic.name}
                      onChange={(e) => setNewMechanic({ ...newMechanic, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad *</Label>
                  <Select 
                    value={newMechanic.specialty} 
                    onValueChange={(value) => setNewMechanic({ ...newMechanic, specialty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mecanico@taller.com"
                    value={newMechanic.email}
                    onChange={(e) => setNewMechanic({ ...newMechanic, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+52 555 123 4567"
                    value={newMechanic.phone}
                    onChange={(e) => setNewMechanic({ ...newMechanic, phone: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Agregar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mechanics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mechanicsData.map((mechanic) => (
            <Card key={mechanic.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    {/* Availability indicator */}
                    <div 
                      className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-card flex items-center justify-center ${
                        mechanic.isAvailable ? 'bg-status-ready' : 'bg-status-progress'
                      }`}
                    >
                      {mechanic.isAvailable ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <Clock className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="mt-3 font-semibold text-foreground">{mechanic.name}</h3>

                  {/* Specialty Badge */}
                  <Badge variant="secondary" className="mt-2">
                    <Wrench className="w-3 h-3 mr-1" />
                    {mechanic.specialty}
                  </Badge>

                  {/* Status */}
                  <div className="mt-4 text-sm">
                    {mechanic.isAvailable ? (
                      <span className="text-status-ready font-medium">Disponible</span>
                    ) : (
                      <span className="text-status-progress font-medium">
                        {mechanic.activeTasks} {mechanic.activeTasks === 1 ? 'tarea activa' : 'tareas activas'}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span>Total: {mechanicsData.length} mecánicos</span>
          <span>Disponibles: {mechanicsData.filter(m => m.isAvailable).length}</span>
          <span>Ocupados: {mechanicsData.filter(m => !m.isAvailable).length}</span>
        </div>
      </div>
    </MainLayout>
  );
}
