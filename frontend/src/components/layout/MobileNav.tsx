import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Wrench, User, Car, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Órdenes', url: '/orders', icon: ClipboardList },
  { title: 'Vehículos', url: '/vehicles', icon: Car },
  { title: 'Clientes', url: '/customers', icon: Users },
];

const mechanicNavItems = [
  { title: 'Tareas', url: '/mechanic', icon: Wrench },
  { title: 'Perfil', url: '/mechanic/profile', icon: User },
];

export function MobileNav() {
  const location = useLocation();
  
  // Determine if we're in mechanic mode based on the current route
  const isMechanicMode = location.pathname === '/mecanico' || location.pathname === '/perfil';
  const navItems = isMechanicMode ? mechanicNavItems : adminNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
