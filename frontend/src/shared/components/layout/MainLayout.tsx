import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/shared/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { MobileNav } from './MobileNav';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between px-4 md:px-6 h-16">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hidden md:flex" />
                {title && (
                  <h1 className="text-lg md:text-xl font-semibold text-foreground">
                    {title}
                  </h1>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar órdenes, clientes..."
                    className="pl-9 w-64 bg-muted border-0"
                  />
                </div>
                
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-progress rounded-full" />
                </Button>

                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">AD</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
            {children}
          </main>
        </SidebarInset>
      </div>
      
      <MobileNav />
    </SidebarProvider>
  );
}
