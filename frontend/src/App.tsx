import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import Login from './auth/components/Login';
import Register from './auth/components/Register';
import VerifyEmail from './auth/components/VerifyEmail';
import VerifyEmailNotice from './auth/components/VerifyEmailNotice';

function App() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<VerifyEmailNotice />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </>
  )
}

export default App
