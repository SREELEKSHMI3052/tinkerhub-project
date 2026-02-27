import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ padding: '40px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2>Create Account</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
          <input type="text" placeholder="Full Name" required style={{ padding: '10px' }} />
          <input type="email" placeholder="Email" required style={{ padding: '10px' }} />
          <select style={{ padding: '10px' }}>
            <option value="resident">Resident</option>
            <option value="technician">Technician</option>
            <option value="committee_member">Committee Admin</option>
          </select>
          <input type="password" placeholder="Password" required style={{ padding: '10px' }} />
          <button type="button" onClick={() => navigate('/login')} style={{ padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Register</button>
        </form>
      </div>
    </div>
  );
}