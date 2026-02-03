import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceItem } from '@/types/orders';
import { Wrench, Clock, DollarSign, CheckCircle, Loader2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServicesListProps {
  services: ServiceItem[];
}

export function ServicesList({ services }: ServicesListProps) {
  const getStatusIcon = (status: ServiceItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-status-ready" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4 text-status-progress animate-spin" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: ServiceItem['status']) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in_progress':
        return 'En Proceso';
      default:
        return 'Pendiente';
    }
  };

  const getStatusColor = (status: ServiceItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-status-ready text-primary-foreground';
      case 'in_progress':
        return 'bg-status-progress text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          Servicios
          <Badge variant="secondary" className="ml-auto">
            {services.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>
              <Badge className={cn('shrink-0', getStatusColor(service.status))}>
                {getStatusLabel(service.status)}
              </Badge>
            </div>

            {/* Mechanic & Time */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {service.mechanic && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {service.mechanic.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">{service.mechanic.name}</span>
                </div>
              )}
              {service.estimatedTime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{service.estimatedTime}</span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>M.O: ${service.laborCost.toLocaleString()}</span>
                <span>Refacciones: ${service.partsCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-foreground">
                <DollarSign className="w-4 h-4" />
                <span>${service.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
