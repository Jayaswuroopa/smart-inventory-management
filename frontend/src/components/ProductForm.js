import React, { useState, useEffect } from 'react';
import BarcodeScanner from './BarcodeScanner';

const ProductForm = ({ onAdd, onUpdate, editingProduct, onCancel, userRole }) => {
  const [form, setForm] = useState({ name: '', category: '', quantity: '', price: '', barcode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const isEditing = !!editingProduct;

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        category: editingProduct.category,
        quantity: editingProduct.quantity,
        price: editingProduct.price,
        barcode: editingProduct.barcode || '',
      });
    } else {
      setForm({ name: '', category: '', quantity: '', price: '', barcode: '' });
    }
  }, [editingProduct]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleScan = (barcode) => {
    setForm({ ...form, barcode });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.category || form.quantity === '' || form.price === '') {
      setError('Name, category, quantity and price are required.');
      return;
    }
    setLoading(true);
    try {
      const data = { ...form, quantity: Number(form.quantity), price: Number(form.price) };
      if (isEditing) {
        await onUpdate(editingProduct._id, data);
      } else {
        await onAdd(data);
        setForm({ name: '', category: '', quantity: '', price: '', barcode: '' });
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      <h2 className="form-title">{isEditing ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
      <p className="form-sub">
        {isEditing ? `Editing: ${editingProduct.name}` : 'Fill in the details to add a new product.'}
      </p>

      {error && <div className="form-error">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Product Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Wireless Mouse" className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Category</label>
            <input name="category" value={form.category} onChange={handleChange}
              placeholder="e.g. Electronics" className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Quantity</label>
            <input name="quantity" type="number" value={form.quantity} onChange={handleChange}
              placeholder="e.g. 50" min="0" className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Price ($)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange}
              placeholder="e.g. 29.99" min="0" step="0.01" className="form-input" />
          </div>
        </div>

        {/* Barcode field */}
        <div className="form-field" style={{ marginBottom: '24px' }}>
          <label className="form-label">Barcode (Optional)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input name="barcode" value={form.barcode} onChange={handleChange}
              placeholder="Scan or type barcode..." className="form-input" style={{ flex: 1 }} />
            <button type="button" onClick={() => setShowScanner(true)} style={styles.scanBtn}>
              📷 Scan
            </button>
          </div>
        </div>

        {/* Role badge */}
        <div style={styles.roleBadge}>
          {userRole === 'admin'
            ? '👑 You are Admin — full access'
            : '👤 You are Staff — can add products only'}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? '✏️ Update Product' : '➕ Add Product'}
          </button>
          {isEditing && (
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
};

const styles = {
  scanBtn: {
    padding: '13px 18px', borderRadius: '10px',
    border: '1px solid rgba(77,150,255,0.3)',
    background: 'rgba(77,150,255,0.1)', color: '#4d96ff',
    fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  roleBadge: {
    padding: '10px 16px', borderRadius: '10px', marginBottom: '20px',
    background: 'rgba(77,150,255,0.08)', border: '1px solid rgba(77,150,255,0.15)',
    color: '#a7a9be', fontSize: '0.85rem',
  },
};

export default ProductForm;