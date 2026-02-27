import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogOut, AlertCircle, User, Star, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const socket = io('http://localhost:3000');

export default function AdminDashboard({ setUser, setRole }) {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('http://localhost:3000/api/tickets');
      setTickets(res.data);
    };
    fetch();
    socket.on('new_ticket', t => setTickets(prev => [t, ...prev]));
    socket.on('ticket_updated', u => setTickets(prev => prev.map(t => t._id === u._id ? u : t)));
    return () => { socket.off('new_ticket'); socket.off('ticket_updated'); };
  }, []);

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', padding: '40px', color: theme.text }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: theme.border, paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
            <LayoutDashboard size={32} color={theme.primary} /> ADMIN PANEL
          </h1>
          <button onClick={() => { setUser(null); setRole(''); navigate('/login'); }} style={theme.logoutBtn}><LogOut size={18} /> Logout</button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <AnimatePresence>
            {tickets.map(t => (
              <motion.div key={t._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: theme.card, borderRadius: '24px', padding: '30px', border: theme.border,
                  borderLeft: `10px solid ${t.priority.includes('Critical') ? theme.danger : theme.primary}`,
                  boxShadow: theme.shadow, backdropFilter: 'blur(20px)'
                }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: theme.primary, letterSpacing: '2px' }}>{t.category.toUpperCase()}</span>
                    <h3 style={{ margin: '8px 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}><User size={20} /> {t.residentName} <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 'normal' }}>• Age {t.residentAge}</span></h3>
                  </div>
                  <div style={{ color: t.priority.includes('Critical') ? theme.danger : theme.warning, fontWeight: '900', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '8px 16px', borderRadius: '12px' }}>
                    <AlertCircle size={16} /> {t.priority.toUpperCase()}
                  </div>
                </div>

                <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.6' }}>"{t.description}"</p>
                
                {/* IMAGE PROPORTION FIX */}
                {t.image && (
                  <div style={{ width: '100%', height: '350px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={t.image} alt="Incident Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.95rem' }}>ASSIGNEE: <strong style={{ color: theme.primary }}>{t.assignedTo}</strong> <span style={{ margin: '0 10px', color: '#475569' }}>|</span> STATUS: <strong style={{ color: t.status === 'Resolved' ? theme.success : theme.warning }}>{t.status}</strong></span>
                  {t.location !== 'Not tagged' && <a href={`https://www.google.com/maps?q=${t.location}`} target="_blank" rel="noreferrer" style={{ background: theme.primary, color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>OPEN MAP 📍</a>}
                </div>

                {t.rating > 0 && (
                  <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: `1px solid ${theme.success}` }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: theme.success, display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={16} fill={theme.warning} color={theme.warning} /> Resident Review: {t.rating}/5</p>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#94a3b8', display: 'flex', gap: '8px' }}><MessageSquare size={16} style={{ marginTop: '3px' }}/> "{t.feedback}"</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}