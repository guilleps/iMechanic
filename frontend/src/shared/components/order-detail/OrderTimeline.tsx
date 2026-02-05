import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TimelineEvent } from '@/types/orders';
import { 
  Clock, 
  MessageSquare, 
  Camera, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderTimelineProps {
  events: TimelineEvent[];
}

export function OrderTimeline({ events }: OrderTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'status_change':
        return <ArrowRight className="w-4 h-4" />;
      case 'note':
        return <MessageSquare className="w-4 h-4" />;
      case 'photo':
        return <Camera className="w-4 h-4" />;
      case 'service_update':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'status_change':
        return 'bg-primary text-primary-foreground';
      case 'note':
        return 'bg-secondary text-secondary-foreground';
      case 'photo':
        return 'bg-accent text-accent-foreground';
      case 'service_update':
        return 'bg-status-ready text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className="bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Línea de Tiempo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-border" />

          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div className={cn(
                'relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                getEventColor(event.type)
              )}>
                {getEventIcon(event.type)}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Author */}
                <p className="text-xs text-muted-foreground mt-1">
                  Por: {event.author}
                </p>

                {/* Images */}
                {event.images && event.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {event.images.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`Evidencia ${imgIndex + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
