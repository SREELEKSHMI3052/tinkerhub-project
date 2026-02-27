import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, History, Star, Activity, LogOut } from 'lucide-react';
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

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/tickets', { 
        residentName: user.name, residentAge: Number(age), description: desc, image: media, location: locationCoords 
      });
      setMyTickets([res.data, ...myTickets]);
      setDesc(''); setAge(''); setMedia(''); setStatus('');
      alert("AI Priority Assigned & Broadcasted!");
    } catch (err) { alert("Failed to connect to backend"); }
  };

  const handleFeedback = async (id, e) => {
    e.preventDefault();
    const rating = e.target.rating.value;
    const feedback = e.target.feedback.value;
    try {
      const res = await axios.put(`http://localhost:3000/api/tickets/${id}/feedback`, { rating, feedback });
      setMyTickets(myTickets.map(t => t._id === id ? res.data : t));
    } catch (err) { alert("Feedback failed"); }
  };

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', color: theme.text, padding: '40px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: theme.border, paddingBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}><Activity color={theme.primary} /> Resident Hub: {user.name}</h2>
          <button onClick={() => { setUser(null); setRole(''); navigate('/login'); }} style={theme.logoutBtn}><LogOut size={18} /> Logout</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ background: theme.card, border: theme.border, padding: '30px', borderRadius: '30px', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Report Incident</h3>
            <form onSubmit={submitReport} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} required style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', border: theme.border, borderRadius: '14px', color: '#fff' }} />
              <textarea placeholder="Description..." value={desc} onChange={e => setDesc(e.target.value)} required style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', border: theme.border, borderRadius: '14px', color: '#fff', height: '120px', resize: 'none' }} />
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.1)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <ImageUploader onUploadSuccess={setMedia} />
                <Geolocation onTagSuccess={tag => { setStatus('📍 Tagged'); setLocationCoords(`${tag.lat},${tag.lng}`); }} />
                {status && <p style={{ color: theme.success, fontWeight: 'bold', margin: '10px 0 0 0', textAlign: 'center' }}>{status}</p>}
              </div>
              <button type="submit" style={{ padding: '15px', background: theme.accent, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}><Send size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Broadcast Report</button>
            </form>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ background: 'rgba(15,23,42,0.4)', padding: '30px', borderRadius: '30px', border: theme.border }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><History size={20} color={theme.primary} /> Activity History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '650px', overflowY: 'auto', paddingRight: '10px' }}>
              <AnimatePresence>
                {myTickets.map(t => (
                  <motion.div key={t._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(255,255,255,0.03)', border: theme.border, padding: '25px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <span style={{ color: theme.primary, fontWeight: '900', fontSize: '0.8rem', letterSpacing: '1px' }}>{t.category.toUpperCase()}</span>
                      <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', background: t.status === 'Resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(251,191,36,0.1)', color: t.status === 'Resolved' ? theme.success : theme.warning }}>● {t.status}</span>
                    </div>
                    <p style={{ margin: '0 0 15px 0', lineHeight: '1.5', fontSize: '1.05rem' }}>{t.description}</p>
                    
                    {t.status === 'Resolved' && t.rating === 0 && (
                      <form onSubmit={e => handleFeedback(t._id, e)} style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: theme.border }}>
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '0.85rem', color: theme.primary }}>Rate the Repair Service:</p>
                        <select name="rating" required style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: theme.border, borderRadius: '10px', marginBottom: '12px' }}>
                          <option value="">Select Stars...</option>
                          <option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option><option value="2">⭐⭐</option><option value="1">⭐</option>
                        </select>
                        <input name="feedback" placeholder="Leave a comment for Admin..." required style={{ width: '100%', padding: '12px', background: '#0f172a', border: theme.border, color: '#fff', borderRadius: '10px', boxSizing: 'border-box' }} />
                        <button type="submit" style={{ width: '100%', marginTop: '12px', padding: '12px', background: theme.success, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', color: '#fff' }}>Submit Feedback</button>
                      </form>
                    )}
                    {t.rating > 0 && <p style={{ color: theme.success, fontWeight: 'bold', margin: '15px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Star size={16} fill={theme.warning} color={theme.warning} /> Rating: {t.rating}/5</p>}
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