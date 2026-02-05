import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Vehicle, Client } from '@/types/orders';
import { Car, User, Phone, Mail, Calendar, Palette } from 'lucide-react';

interface VehicleClientInfoProps {
  vehicle: Vehicle;
  client: Client;
}

export function VehicleClientInfo({ vehicle, client }: VehicleClientInfoProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Vehicle Card */}
      <Card className="bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Vehículo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">
              {vehicle.brand} {vehicle.model}
            </span>
            <Badge variant="secondary" className="font-mono">
              {vehicle.plate}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Año:</span>
              <span className="font-medium">{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Color:</span>
              <span className="font-medium">{vehicle.color}</span>
            </div>
          </div>

          {vehicle.vin && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">VIN</p>
              <p className="font-mono text-sm">{vehicle.vin}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Card */}
      <Card className="bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-lg font-medium text-primary-foreground">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold">{client.name}</p>
              <p className="text-sm text-muted-foreground">Cliente frecuente</p>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                {client.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                {client.email}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
