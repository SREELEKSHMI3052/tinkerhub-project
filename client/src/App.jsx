import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ResidentDashboard from './pages/ResidentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/resident" element={user && role === 'resident' ? <ResidentDashboard user={user} setRole={setRole} setUser={setUser}/> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && role === 'admin' ? <AdminDashboard setRole={setRole} setUser={setUser}/> : <Navigate to="/login" />} />
        <Route path="/technician" element={user && role === 'technician' ? <TechnicianDashboard setRole={setRole} setUser={setUser}/> : <Navigate to="/login" />} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}