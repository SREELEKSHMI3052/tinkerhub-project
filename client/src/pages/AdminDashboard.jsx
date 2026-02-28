import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, LogOut, AlertCircle, User, Star, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { API_BASE_URL, SOCKET_URL } from '../api/ApiConfig';

const socket = io(SOCKET_URL);

export default function AdminDashboard({ setUser, setRole }) {
  const [tickets, setTickets] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/tickets`);
      setTickets(res.data);
    };
    fetch();
    socket.on('new_ticket', t => setTickets(prev => [t, ...prev]));
    socket.on('ticket_updated', u => setTickets(prev => prev.map(t => t._id === u._id ? u : t)));
    return () => { socket.off('new_ticket'); socket.off('ticket_updated'); };
  }, []);

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', padding: isMobile ? '20px' : '40px', color: theme.text }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '30px', borderBottom: theme.border, paddingBottom: '20px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '15px' : '0' }}>
          <h1 style={{ fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px', margin: 0, flexWrap: 'wrap' }}>
            <LayoutDashboard size={isMobile ? 28 : 32} color={theme.primary} /> ADMIN PANEL
          </h1>
          <button onClick={() => { setUser(null); setRole(''); navigate('/login'); }} style={{...theme.logoutBtn, fontSize: isMobile ? '0.8rem' : '0.9rem', padding: isMobile ? '8px 16px' : '10px 20px' }}><LogOut size={isMobile ? 16 : 18} /> Logout</button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '15px' : '25px' }}>
          <AnimatePresence>
            {tickets.map(t => (
              <motion.div key={t._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: theme.card, borderRadius: isMobile ? '16px' : '24px', padding: isMobile ? '20px' : '30px', border: theme.border,
                  borderLeft: `10px solid ${t.priority.includes('Critical') ? theme.danger : theme.primary}`,
                  boxShadow: theme.shadow, backdropFilter: 'blur(20px)'
                }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-start', marginBottom: '20px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '15px' : '0' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: isMobile ? '0.65rem' : '0.7rem', fontWeight: '900', color: theme.primary, letterSpacing: '2px' }}>{t.category.toUpperCase()}</span>
                    <h3 style={{ margin: '8px 0', fontSize: isMobile ? '1.1rem' : '1.4rem', display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '10px', flexWrap: 'wrap' }}><User size={isMobile ? 18 : 20} /> {t.residentName} <span style={{ color: '#64748b', fontSize: isMobile ? '0.8rem' : '0.9rem', fontWeight: 'normal' }}>• Age {t.residentAge}</span></h3>
                  </div>
                  <div style={{ color: t.priority.includes('Critical') ? theme.danger : theme.warning, fontWeight: '900', fontSize: isMobile ? '0.7rem' : '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: isMobile ? '6px 12px' : '8px 16px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                    <AlertCircle size={isMobile ? 14 : 16} /> {t.priority.toUpperCase()}
                  </div>
                </div>

                <p style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.6' }}>"{t.description}"</p>
                
                {t.image && (
                  <div style={{ width: '100%', height: isMobile ? '250px' : '350px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={t.image} alt="Incident Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', background: 'rgba(0,0,0,0.2)', padding: isMobile ? '15px' : '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '15px' : '0' }}>
                  <span style={{ fontSize: isMobile ? '0.85rem' : '0.95rem' }}>ASSIGNEE: <strong style={{ color: theme.primary }}>{t.assignedTo}</strong> <span style={{ margin: isMobile ? '0 5px' : '0 10px', color: '#475569' }}>|</span> STATUS: <strong style={{ color: t.status === 'Resolved' ? theme.success : theme.warning }}>{t.status}</strong></span>
                  {t.location !== 'Not tagged' && <a href={`https://www.google.com/maps?q=${t.location}`} target="_blank" rel="noreferrer" style={{ background: theme.primary, color: '#fff', padding: isMobile ? '8px 16px' : '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.85rem', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)', whiteSpace: 'nowrap' }}>OPEN MAP 📍</a>}
                </div>

                {t.rating > 0 && (
                  <div style={{ marginTop: '20px', padding: isMobile ? '15px' : '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: `1px solid ${theme.success}` }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: theme.success, display: 'flex', alignItems: 'center', gap: '8px', fontSize: isMobile ? '0.9rem' : '1rem' }}><Star size={16} fill={theme.warning} color={theme.warning} /> Resident Review: {t.rating}/5</p>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#94a3b8', display: 'flex', gap: '8px', fontSize: isMobile ? '0.85rem' : '0.9rem' }}><MessageSquare size={16} style={{ marginTop: '3px' }}/> "{t.feedback}"</p>
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