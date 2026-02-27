import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle, LogOut, User, Navigation } from 'lucide-react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const socket = io('http://localhost:3000');

export default function TechnicianDashboard({ setUser, setRole }) {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('http://localhost:3000/api/tickets');
      setTickets(res.data);
    };
    fetch();
    socket.on('new_ticket', t => setTickets(p => [t, ...p]));
    socket.on('ticket_updated', u => setTickets(p => p.map(t => t._id === u._id ? u : t)));
    return () => { socket.off('new_ticket'); socket.off('ticket_updated'); };
  }, []);

  const resolveJob = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/tickets/${id}/status`, { status: 'Resolved' });
      alert("Job Completed successfully!");
    } catch (err) { alert("Status update failed"); }
  };

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', padding: '40px', color: theme.text }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: theme.border, paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
            <Wrench size={32} color={theme.warning} /> Technician Dispatch
          </h1>
          <button onClick={() => { setUser(null); setRole(''); navigate('/login'); }} style={theme.logoutBtn}><LogOut size={18} /> Logout</button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence>
            {tickets.map(t => (
              <motion.div key={t._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ background: theme.card, border: theme.border, padding: '30px', borderRadius: '24px', borderLeft: `8px solid ${t.status === 'Resolved' ? theme.success : theme.warning}`, opacity: t.status === 'Resolved' ? 0.65 : 1, backdropFilter: 'blur(10px)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '900', color: theme.primary, letterSpacing: '1px' }}>{t.category.toUpperCase()}</span>
                  <span style={{ fontWeight: 'bold', color: t.priority.includes('Critical') ? theme.danger : theme.warning }}>{t.priority}</span>
                </div>

                <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><User size={18} /> {t.residentName}</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.5', marginBottom: '20px', fontSize: '1.05rem' }}>"{t.description}"</p>

                {t.image && (
                  <div style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={t.image} alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '15px' }}>
                  {t.status !== 'Resolved' ? (
                    <button onClick={() => resolveJob(t._id)} style={{ flex: 1, padding: '15px', background: theme.success, border: 'none', color: '#fff', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={18} /> MARK AS RESOLVED
                    </button>
                  ) : (
                    <div style={{ flex: 1, padding: '15px', border: `1px solid ${theme.success}`, color: theme.success, textAlign: 'center', borderRadius: '12px', fontWeight: 'bold' }}>
                      JOB COMPLETED ✅
                    </div>
                  )}
                  {t.location !== 'Not tagged' && (
                    <a href={`https://www.google.com/maps?q=${t.location}`} target="_blank" rel="noreferrer" style={{ padding: '15px 25px', background: 'rgba(255,255,255,0.05)', border: theme.border, color: '#fff', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Navigation size={18} /> MAP
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}