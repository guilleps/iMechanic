import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export function KPICard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor }: KPICardProps) {
  return (
    <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={cn(
                'text-xs font-medium',
                changeType === 'positive' && 'text-status-ready',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}>
                {change}
              </p>
            )}
          </div>
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            iconColor || 'bg-primary/10'
          )}>
            <Icon className={cn(
              'w-6 h-6',
              iconColor ? 'text-card-foreground' : 'text-primary'
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
