import { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { ServiceItem } from '@/types/orders';
import { Camera, CheckCircle, Clock, MessageSquare, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MechanicTaskCardProps {
  service: ServiceItem;
  vehicleInfo: string;
  onComplete: (serviceId: string) => void;
  onAddNote: (serviceId: string, note: string) => void;
}

export function MechanicTaskCard({ service, vehicleInfo, onComplete, onAddNote }: MechanicTaskCardProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState('');

  const handleAddNote = () => {
    if (note.trim()) {
      onAddNote(service.id, note);
      setNote('');
      setShowNoteInput(false);
    }
  };

  const getStatusColor = (status: ServiceItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-status-ready';
      case 'in_progress':
        return 'bg-status-progress';
      default:
        return 'bg-muted';
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

  return (
    <Card className="bg-card shadow-md">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge className={cn('mb-2', getStatusColor(service.status), 'text-primary-foreground')}>
              {getStatusLabel(service.status)}
            </Badge>
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-sm font-medium">{vehicleInfo}</p>
        </div>

        {/* Time Estimate */}
        {service.estimatedTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Tiempo estimado: {service.estimatedTime}</span>
          </div>
        )}

        {/* Actions */}
        {service.status !== 'completed' && (
          <div className="space-y-3 pt-2 border-t border-border">
            {/* Photo Upload */}
            <Button variant="outline" className="w-full justify-start gap-2">
              <Camera className="w-4 h-4" />
              Subir Foto de Evidencia
              <Upload className="w-4 h-4 ml-auto" />
            </Button>

            {/* Add Note */}
            {showNoteInput ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Escribe una nota o comentario..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowNoteInput(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleAddNote}
                  >
                    Guardar Nota
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setShowNoteInput(true)}
              >
                <MessageSquare className="w-4 h-4" />
                Agregar Nota
              </Button>
            )}

            {/* Complete Task */}
            <Button
              onClick={() => onComplete(service.id)}
              className="w-full bg-status-ready hover:bg-status-ready/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Marcar como Completado
            </Button>
          </div>
        )}

        {/* Completed State */}
        {service.status === 'completed' && (
          <div className="flex items-center gap-2 pt-2 border-t border-border text-status-ready">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Tarea completada</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
