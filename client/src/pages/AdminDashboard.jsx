import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, Star, User, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import { theme } from '../theme';

const socket = io('http://localhost:3000');

export default function AdminDashboard({ setUser }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('http://localhost:3000/api/tickets');
      setTickets(res.data);
    };
    fetch();
    socket.on('new_ticket', (t) => setTickets(p => [t, ...p]));
    socket.on('ticket_updated', (u) => setTickets(p => p.map(t => t._id === u._id ? u : t)));
    return () => { socket.off('new_ticket'); socket.off('ticket_updated'); };
  }, []);

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', padding: '40px', color: theme.text }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}><LayoutDashboard color={theme.primary} /> Admin Control</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {tickets.map(t => (
            <motion.div key={t._id} layout style={{ background: theme.card, borderLeft: `10px solid ${t.priority.includes('Critical') ? theme.danger : theme.primary}`, padding: '30px', borderRadius: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}><User size={18} /> {t.residentName} (Age: {t.residentAge})</h3>
                <span style={{ color: t.priority.includes('Critical') ? theme.danger : theme.warning, fontWeight: 'bold' }}>{t.priority}</span>
              </div>
              <p style={{ margin: '15px 0' }}>"{t.description}"</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '15px' }}>
                <span>Worker: <strong>{t.assignedTo}</strong> | Status: <strong>{t.status}</strong></span>
                {t.location !== 'Not tagged' && <a href={`https://www.google.com/maps?q=${t.location}`} target="_blank" rel="noreferrer" style={{ color: theme.primary, textDecoration: 'none', fontWeight: 'bold' }}>📍 Map</a>}
              </div>

              {/* RESIDENT REVIEW DISPLAY */}
              {t.rating > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', border: `1px solid ${theme.success}`, borderRadius: '15px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: theme.success }}><Star size={14} fill={theme.warning} /> Review: {t.rating}/5</p>
                  <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', color: '#94a3b8' }}><MessageSquare size={14} /> "{t.feedback}"</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}