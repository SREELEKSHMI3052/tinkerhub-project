import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

export default function Login({ setUser, setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('resident');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: email.split('@')[0] || "User" });
    setRole(selectedRole);
    navigate(`/${selectedRole}`);
  };

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: theme.card, border: theme.border, padding: '50px 40px', borderRadius: '40px', textAlign: 'center', backdropFilter: 'blur(30px)', width: '450px', boxShadow: theme.shadow }}>
        <div style={{ background: theme.accent, width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <ShieldCheck color="#fff" size={32} />
        </div>
        <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: '900' }}>Smart<span style={{ color: theme.primary }}>Society</span></h1>
        <form onSubmit={handleLogin} style={{ textAlign: 'left', marginTop: '30px' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '14px', marginBottom: '25px', border: theme.border }}>
            {['resident', 'admin', 'technician'].map((r) => (
              <button key={r} type="button" onClick={() => setSelectedRole(r)} 
                style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', background: selectedRole === r ? theme.primary : 'transparent', color: selectedRole === r ? '#fff' : '#64748b', textTransform: 'capitalize' }}>{r}</button>
            ))}
          </div>
          <input type="email" placeholder="Email Address" onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: theme.border, borderRadius: '14px', color: '#fff', marginBottom: '15px' }} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: theme.border, borderRadius: '14px', color: '#fff', marginBottom: '25px' }} />
          <motion.button whileHover={{ scale: 1.02 }} type="submit" style={{ width: '100%', padding: '18px', background: theme.accent, border: 'none', borderRadius: '16px', color: '#fff', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            Sign In <ArrowRight size={20} />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}