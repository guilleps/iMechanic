import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import Login from './auth/components/Login';
import Register from './auth/components/Register';
import VerifyEmail from './auth/components/VerifyEmail';
import VerifyEmailNotice from './auth/components/VerifyEmailNotice';
import ProtectedRoute from './shared/auth/ProtectedRoute';
import RoleProtectedRoute from './shared/auth/RoleProtectedRoute';
import DashboardW from './workshop/components/DashboardW';
import DashboardE from './employee/components/DashboardE';

function App() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<VerifyEmailNotice />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected Home Page</div>} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["ROLE_WORKSHOP_ADMIN"]} />}>
          <Route path="/dashboard-workshop" element={<DashboardW />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]} />}>
          <Route path="/dashboard-employee" element={<DashboardE />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
