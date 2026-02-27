import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ResidentDashboard from './pages/ResidentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} setRole={setRole} />} />
        <Route path="/resident" element={user && role === 'resident' ? <ResidentDashboard user={user} setUser={setUser} setRole={setRole} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && role === 'admin' ? <AdminDashboard user={user} setUser={setUser} setRole={setRole} /> : <Navigate to="/login" />} />
        <Route path="/technician" element={user && role === 'technician' ? <TechnicianDashboard user={user} setUser={setUser} setRole={setRole} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}