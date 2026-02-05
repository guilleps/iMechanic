import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Mail, Phone, Plus, Search, User } from 'lucide-react';
import { useState } from 'react';

// Extract unique clients and count their vehicles
// const clientsMap = new Map<string, { client: typeof orders[0]['customer']; vehicleCount: number }>();
// orders.forEach(order => {
//   const existing = clientsMap.get(order.customer.id);
//   if (existing) {
//     existing.vehicleCount += 1;
//   } else {
//     clientsMap.set(order.customer.id, { client: order.customer, vehicleCount: 1 });
//   }
// });
// const clientsData = Array.from(clientsMap.values());

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // const filteredClients = clientsData.filter(({ client }) =>
  //   client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   client.phone.includes(searchTerm)
  // );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating client:', newClient);
    setIsModalOpen(false);
    setNewClient({ name: '', phone: '', email: '' });
  };

  return (
    <MainLayout title="Directorio de Clientes">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Cliente</DialogTitle>
                <DialogDescription>
                  Ingresa los datos del nuevo cliente
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateClient} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      className="pl-10"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+52 555 123 4567"
                      className="pl-10"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@email.com"
                      className="pl-10"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Registrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clients Grid */}
        {/* {filteredClients.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map(({ client, vehicleCount }) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{client.firstName} {client.lastName}</h3>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          <span className="truncate">{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-sm">
                        <Car className="w-4 h-4 text-secondary" />
                        <span className="text-muted-foreground">
                          {vehicleCount} {vehicleCount === 1 ? 'vehículo' : 'vehículos'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No se encontraron clientes</p>
            {searchTerm && (
              <p className="text-sm text-muted-foreground">
                Intenta con otra búsqueda
              </p>
            )}
          </div>
        )} */}

        {/* Summary */}
        {/* <div className="text-sm text-muted-foreground">
          Mostrando {filteredClients.length} de {clientsData.length} clientes
        </div> */}
      </div>
    </MainLayout>
  );
}
