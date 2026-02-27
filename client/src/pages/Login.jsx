import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

export default function Login({ setUser, setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('resident');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a hackathon, we mock the successful login logic
    setUser({ name: email.split('@')[0] || "User" });
    setRole(selectedRole);
    
    // Directing to the correct dashboard based on the selected role
    if (selectedRole === 'admin') navigate('/admin');
    else if (selectedRole === 'technician') navigate('/technician');
    else navigate('/resident');
  };

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '20px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          background: theme.card, 
          border: theme.border, 
          padding: '50px 40px', 
          borderRadius: '40px', 
          textAlign: 'center', 
          backdropFilter: 'blur(30px)', 
          width: '100%',
          maxWidth: '480px',
          boxShadow: theme.shadow 
        }}
      >
        {/* LOGO SECTION */}
        <div style={{ background: theme.accent, width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <ShieldCheck color="#fff" size={32} />
        </div>
        <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: '900', margin: '0 0 5px 0' }}>Smart<span style={{ color: theme.primary }}>Society</span></h1>
        <p style={{ color: '#94a3b8', marginBottom: '35px', fontSize: '1rem' }}>Access your AI-managed community dashboard</p>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          
          {/* ROLE SELECTOR (Simple Tab Style) */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '14px', marginBottom: '25px', border: theme.border }}>
            {['resident', 'admin', 'technician'].map((r) => (
              <button 
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                style={{ 
                  flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700',
                  background: selectedRole === r ? theme.primary : 'transparent',
                  color: selectedRole === r ? '#fff' : '#64748b',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize'
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* EMAIL INPUT */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '1px' }}>EMAIL ADDRESS</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color={theme.primary} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="name@society.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', padding: '15px 15px 15px 45px', background: 'rgba(255,255,255,0.03)', border: theme.border, 
                  borderRadius: '14px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
                }} 
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div style={{ marginBottom: '30px', position: 'relative' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '1px' }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color={theme.primary} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', padding: '15px 45px 15px 45px', background: 'rgba(255,255,255,0.03)', border: theme.border, 
                  borderRadius: '14px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
                }} 
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{ 
              width: '100%', padding: '18px', background: theme.accent, border: 'none', borderRadius: '16px', 
              color: '#fff', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', gap: '10px' 
            }}
          >
            Sign In <ArrowRight size={20} />
          </motion.button>
        </form>

        <p style={{ marginTop: '30px', color: '#475569', fontSize: '0.8rem' }}>
          Forgotten credentials? Contact your Society Admin.
        </p>
      </motion.div>
    </div>
  );
}