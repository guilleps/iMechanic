import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Clients from "./pages/Clients";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MechanicProfile from "./pages/MechanicProfile";
import MechanicView from "./pages/MechanicView";
import NotFound from "./pages/NotFound";
import OrderDetail from "./pages/OrderDetail";
import OrdersKanban from "./pages/OrdersKanban";
import Register from "./pages/Register";
import Staff from "./pages/Staff";
import Vehicles from "./pages/Vehicles";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import RoleProtectedRoute from "./shared/auth/RoleProtectedRoute";
import { AuthProvider } from "./shared/auth/AuthProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/check-email" element={<VerifyEmailNotice />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Admin Routes */}
          <Route
            element={
              <RoleProtectedRoute allowedRoles={["ROLE_WORKSHOP_ADMIN"]} />
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersKanban />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/customers" element={<Clients />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/configuration" element={<Dashboard />} />
          </Route>

          {/* Mechanic Routes */}
          <Route
            element={<RoleProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]} />}
          >
            <Route path="/employee" element={<MechanicView />} />
            <Route path="/employee/profile" element={<MechanicProfile />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
