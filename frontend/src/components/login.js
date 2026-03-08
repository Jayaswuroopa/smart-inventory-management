import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister
        ? { name: form.name, email: form.email, password: form.password, role: form.role }
        : { email: form.email, password: form.password };

      const res = await axios.post(url, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.name);
      localStorage.setItem('userRole', res.data.role);
      onLogin(res.data.token, res.data.name, res.data.role);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg}>
        <div style={{ ...styles.orb, background: '#4d96ff', top: '-100px', left: '-100px' }} />
        <div style={{ ...styles.orb, background: '#ff6b6b', bottom: '-100px', right: '-100px' }} />
      </div>

      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>📦</div>
          <h1 style={styles.logoText}>StockFlow</h1>
          <p style={styles.logoSub}>Inventory Manager</p>
        </div>

        <h2 style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back!'}</h2>
        <p style={styles.sub}>{isRegister ? 'Register to manage your inventory' : 'Login to your account'}</p>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. John Doe" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Role</label>
                <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
                  <option value="staff">👤 Staff — View & Add only</option>
                  <option value="admin">👑 Admin — Full Access</option>
                </select>
              </div>
            </>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="e.g. john@email.com" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="Min 6 characters" style={styles.input} />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? '🚀 Create Account' : '🔐 Login'}
          </button>
        </form>

        <p style={styles.toggle}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button style={styles.toggleBtn} onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? ' Login' : ' Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', background: '#0f0e17',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif",
  },
  bg: { position: 'fixed', inset: 0, pointerEvents: 'none' },
  orb: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15 },
  card: {
    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px', padding: '48px 40px', width: '100%', maxWidth: '440px',
    position: 'relative', zIndex: 1, boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  logoWrap: { textAlign: 'center', marginBottom: '32px' },
  logoIcon: {
    width: '60px', height: '60px', margin: '0 auto 12px',
    background: 'linear-gradient(135deg, #4d96ff, #ff6b6b)',
    borderRadius: '16px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '1.8rem',
  },
  logoText: { color: '#fffffe', fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', fontWeight: 800 },
  logoSub: { color: '#a7a9be', fontSize: '0.85rem', marginTop: '4px' },
  title: { color: '#fffffe', fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 700, textAlign: 'center' },
  sub: { color: '#a7a9be', fontSize: '0.9rem', textAlign: 'center', marginTop: '6px', marginBottom: '28px' },
  error: {
    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
    color: '#ff6b6b', padding: '12px 16px', borderRadius: '10px',
    fontSize: '0.85rem', marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#a7a9be', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: {
    padding: '13px 16px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
    color: '#fffffe', fontSize: '0.95rem', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    marginTop: '8px', padding: '14px',
    background: 'linear-gradient(135deg, #4d96ff, #7b61ff)',
    border: 'none', borderRadius: '12px', color: 'white',
    fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 4px 20px rgba(77,150,255,0.3)',
  },
  toggle: { textAlign: 'center', marginTop: '24px', color: '#a7a9be', fontSize: '0.9rem' },
  toggleBtn: { background: 'none', border: 'none', color: '#4d96ff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' },
};

export default Login;