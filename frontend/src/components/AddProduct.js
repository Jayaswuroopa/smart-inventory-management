import React, { useState } from 'react';

const AddProduct = ({ onAdd }) => {
  const [form, setForm] = useState({ name: '', category: '', quantity: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.category || !form.quantity || !form.price) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await onAdd({ ...form, quantity: Number(form.quantity), price: Number(form.price) });
      setForm({ name: '', category: '', quantity: '', price: '' });
    } catch (err) {
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>➕ Add New Product</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Product Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Wireless Mouse" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <input name="category" value={form.category} onChange={handleChange}
              placeholder="e.g. Electronics" style={styles.input} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Quantity</label>
            <input name="quantity" type="number" value={form.quantity} onChange={handleChange}
              placeholder="e.g. 50" style={styles.input} min="0" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Price ($)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange}
              placeholder="e.g. 29.99" style={styles.input} min="0" step="0.01" />
          </div>
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '28px' },
  title: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: '#1a1a2e' },
  error: { color: '#e53e3e', marginBottom: '12px', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#555' },
  input: { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' },
  button: { alignSelf: 'flex-start', background: '#4f46e5', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem' },
};

export default AddProduct;