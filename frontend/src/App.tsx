import { Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './auth/components/Register';
import { Toaster } from 'sonner';

function App() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
