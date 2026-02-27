import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle, Navigation, Clock, LogOut, User } from 'lucide-react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const socket = io('http://localhost:3000');

export default function TechnicianDashboard({ setUser, setRole }) {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => { setUser(null); setRole(''); navigate('/login'); };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/tickets');
        setTickets(res.data);
      } catch (err) { console.error("Fetch failed"); }
    };
    fetchTickets();

    socket.on('new_ticket', (t) => setTickets((prev) => [t, ...prev]));
    socket.on('ticket_updated', (updated) => {
      setTickets((prev) => prev.map(t => t._id === updated._id ? updated : t));
    });

    return () => { socket.off('new_ticket'); socket.off('ticket_updated'); };
  }, []);

  const handleResolve = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/tickets/${id}/status`, { status: 'Resolved' });
      alert("Task Synced: Status set to Resolved");
    } catch (err) { alert("Status update failed"); }
  };

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', padding: '40px', color: theme.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: theme.border, paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
            <Wrench size={32} color={theme.warning} /> Technician <span style={{ color: theme.warning }}>Dispatch</span>
          </h1>
          <button onClick={handleLogout} style={{ background: 'transparent', color: theme.danger, border: `1px solid ${theme.danger}`, padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={18} /> Logout
          </button>
        </header>

        {/* TASK LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence>
            {tickets.map((t) => (
              <motion.div key={t._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  background: theme.card, 
                  border: theme.border, 
                  padding: '30px', 
                  borderRadius: '24px', 
                  backdropFilter: 'blur(10px)',
                  borderLeft: `8px solid ${t.status === 'Resolved' ? theme.success : theme.warning}`,
                  opacity: t.status === 'Resolved' ? 0.6 : 1
                }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '900', color: theme.primary, letterSpacing: '1px' }}>{t.category.toUpperCase()}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <Clock size={14} /> {new Date(t.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={18} /> {t.residentName}
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.5', fontSize: '1rem', marginBottom: '20px' }}>"{t.description}"</p>

                {t.image && (
                  <img src={t.image} alt="Proof" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }} />
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  {t.status !== 'Resolved' ? (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleResolve(t._id)}
                      style={{ flex: 1, padding: '14px', background: theme.success, border: 'none', color: '#fff', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                      <CheckCircle size={20} /> MARK RESOLVED
                    </motion.button>
                  ) : (
                    <div style={{ flex: 1, padding: '14px', background: 'rgba(16, 185, 129, 0.1)', color: theme.success, border: `1px solid ${theme.success}`, borderRadius: '14px', fontWeight: '800', textAlign: 'center' }}>
                      JOB COMPLETED ✅
                    </div>
                  )}

                  {t.location !== 'Not tagged' && (
                    <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      href={`https://www.google.com/maps?q=${t.location}`} target="_blank" rel="noreferrer" 
                      style={{ padding: '14px', background: 'rgba(255,255,255,0.05)', border: theme.border, color: '#fff', borderRadius: '14px', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <Navigation size={20} /> DIRECTIONS
                    </motion.a>
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