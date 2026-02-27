import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, Star, User, Activity, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import ImageUploader from '../components/ImageUploader';
import Geolocation from '../components/Geolocation';

export default function ResidentDashboard({ user, setUser, setRole }) {
  const [age, setAge] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('');
  const [media, setMedia] = useState('');
  const [locationCoords, setLocationCoords] = useState('');
  const [myTickets, setMyTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get(`http://localhost:3000/api/tickets?residentName=${user.name}`);
      setMyTickets(res.data);
    };
    if (user?.name) fetchHistory();
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/tickets', { 
        residentName: user.name, residentAge: Number(age), description: desc, image: media, location: locationCoords 
      });
      setMyTickets([res.data, ...myTickets]);
      setDesc(''); setMedia(''); setStatus(''); setAge('');
    } catch (err) { alert("Submission failed"); }
  };

  const submitFeedback = async (id, e) => {
    e.preventDefault();
    const rating = e.target.rating.value;
    const feedback = e.target.feedback.value;
    try {
      const res = await axios.put(`http://localhost:3000/api/tickets/${id}/feedback`, { rating, feedback });
      setMyTickets(myTickets.map(t => t._id === id ? res.data : t));
    } catch (err) { alert("Sync failed"); }
  };

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', padding: '40px', color: theme.text, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><Activity color={theme.primary} /> Welcome, {user.name}</h2>
          <button onClick={() => { setUser(null); navigate('/login'); }} style={{ background: 'transparent', border: theme.border, color: theme.danger, padding: '10px 20px', borderRadius: '12px', cursor: 'pointer' }}>Logout</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
          {/* INPUT SECTION */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ background: theme.card, border: theme.border, padding: '30px', borderRadius: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>New Incident</h3>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} required style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: theme.border, borderRadius: '12px', color: '#fff' }} />
              <textarea placeholder="Description..." value={desc} onChange={e => setDesc(e.target.value)} required style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', border: theme.border, borderRadius: '12px', color: '#fff', height: '100px' }} />
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.1)', borderRadius: '20px' }}>
                <ImageUploader onUploadSuccess={setMedia} />
                <Geolocation onTagSuccess={(tag) => { setStatus('Tagged 📍'); setLocationCoords(`${tag.lat},${tag.lng}`); }} />
              </div>
              <button type="submit" style={{ padding: '15px', background: theme.accent, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Broadcast Report</button>
            </form>
          </motion.div>

          {/* HISTORY SECTION */}
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ background: 'rgba(30, 41, 59, 0.4)', border: theme.border, padding: '30px', borderRadius: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>My Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '600px', overflowY: 'auto' }}>
              <AnimatePresence>
                {myTickets.map(t => (
                  <motion.div key={t._id} style={{ background: 'rgba(255,255,255,0.03)', border: theme.border, padding: '20px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: theme.primary, fontWeight: 'bold', fontSize: '0.8rem' }}>{t.category.toUpperCase()}</span>
                      <span style={{ color: t.status === 'Resolved' ? theme.success : theme.warning, fontWeight: 'bold' }}>● {t.status}</span>
                    </div>
                    <p style={{ margin: '10px 0', color: '#cbd5e1' }}>{t.description}</p>
                    
                    {/* FEEDBACK SYSTEM */}
                    {t.status === 'Resolved' && t.rating === 0 && (
                      <form onSubmit={(e) => submitFeedback(t._id, e)} style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                        <select name="rating" required style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: theme.border, borderRadius: '8px', marginBottom: '10px' }}>
                          <option value="">Rate Service...</option><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option><option value="2">⭐⭐</option><option value="1">⭐</option>
                        </select>
                        <input name="feedback" placeholder="Comments..." required style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: theme.border, borderRadius: '8px' }} />
                        <button type="submit" style={{ marginTop: '10px', width: '100%', padding: '10px', background: theme.success, border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Submit Rating</button>
                      </form>
                    )}
                    {t.rating > 0 && <p style={{ color: theme.success, fontWeight: 'bold' }}>Rated: {t.rating}/5 ⭐</p>}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}