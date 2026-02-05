import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { Toaster } from "@/shared/components/ui/toaster";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./auth/components/Login";
import Register from "./auth/components/Register";
import VerifyEmail from "./auth/components/VerifyEmail";
import VerifyEmailNotice from "./auth/components/VerifyEmailNotice";
import MechanicProfile from "./employee/components/MechanicProfile";
import MechanicView from "./employee/components/MechanicView";
import { AuthProvider } from "./shared/auth/AuthProvider";
import RoleProtectedRoute from "./shared/auth/RoleProtectedRoute";
import NotFound from "./shared/components/NotFound";
import Customers from "./workshop/components/Customers";
import Dashboard from "./workshop/components/Dashboard";
import OrderDetail from "./workshop/components/OrderDetail";
import OrdersKanban from "./workshop/components/OrdersKanban";
import Services from "./workshop/components/Services";
import Staff from "./workshop/components/Staff";
import Vehicles from "./workshop/components/Vehicles";

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
              <Route path="/services" element={<Services />} />
              <Route path="/orders" element={<OrdersKanban />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/customers" element={<Customers />} />
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
