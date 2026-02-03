import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import OrdersKanban from "./pages/OrdersKanban";
import OrderDetail from "./pages/OrderDetail";
import MechanicView from "./pages/MechanicView";
import MechanicProfile from "./pages/MechanicProfile";
import Vehicles from "./pages/Vehicles";
import Clients from "./pages/Clients";
import Staff from "./pages/Staff";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import VerifyEmail from "./pages/VerifyEmail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/check-email" element={<VerifyEmailNotice />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<OrdersKanban />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/customers" element={<Clients />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/configuration" element={<Dashboard />} />

          {/* Mechanic Routes */}
          <Route path="/mechanic" element={<MechanicView />} />
          <Route path="/mechanic/profile" element={<MechanicProfile />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
