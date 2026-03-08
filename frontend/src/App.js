import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Login from './components/Login';
import './App.css';

const API = '/api/products';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, authHeaders);
      setProducts(res.data);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const handleLogin = (newToken, name, role) => {
    setToken(newToken);
    setUserName(name);
    setUserRole(role);

    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', name);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');

    setToken(null);
    setUserName(null);
    setUserRole(null);
    setProducts([]);
  };

  const handleAdd = async (data) => {
    const res = await axios.post(API, data, authHeaders);
    setProducts([res.data, ...products]);
    showToast('✅ Product added successfully!');
  };

  const handleUpdate = async (id, data) => {
    const res = await axios.put(`${API}/${id}`, data, authHeaders);
    setProducts(products.map(p => (p._id === id ? res.data : p)));
    setEditingProduct(null);
    showToast('✏️ Product updated!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    await axios.delete(`${API}/${id}`, authHeaders);
    setProducts(products.filter(p => p._id !== id));
    showToast('🗑️ Product deleted.', 'info');
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Price', 'Total Value', 'Barcode'];

    const rows = products.map(p => [
      p.name,
      p.category,
      p.quantity,
      p.price.toFixed(2),
      (p.price * p.quantity).toFixed(2),
      p.barcode || ''
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();

    URL.revokeObjectURL(url);

    showToast('📤 Exported to CSV!');
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;

    return matchSearch && matchCat;
  });

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div className="app">

      <div className="bg-orbs">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      <header className="header">
        <div className="header-inner">

          <div className="logo-area">
            <div className="logo-icon">📦</div>
            <div>
              <h1 className="logo-text">StockFlow</h1>
              <p className="logo-sub">Inventory Manager</p>
            </div>
          </div>

          <nav className="nav">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'products', label: '📋 Products' },
              { id: 'add', label: '➕ Add Product' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditingProduct(null);
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="user-area">
            <button className="export-btn" onClick={exportToCSV}>📤 CSV</button>

            <span className={`role-badge ${userRole === 'admin' ? 'admin' : 'staff'}`}>
              {userRole === 'admin' ? '👑 Admin' : '👤 Staff'}
            </span>

            <span className="user-name">Hi, {userName}!</span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

        </div>
      </header>

      <main className="main">

        {activeTab === 'dashboard' && (
          <div className="fade-in">
            <Dashboard products={products} onNavigate={setActiveTab} />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="fade-in">

            <div className="toolbar">

              <div className="search-wrap">
                <span className="search-icon">🔍</span>

                <input
                  className="search-input"
                  placeholder="Search by name or category..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />

                {search && (
                  <button className="clear-btn" onClick={() => setSearch('')}>
                    ✕
                  </button>
                )}
              </div>

              <div className="filter-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            <ProductList
              products={filtered}
              loading={loading}
              onDelete={handleDelete}
              onEdit={p => {
                setEditingProduct(p);
                setActiveTab('add');
              }}
              userRole={userRole}
            />

          </div>
        )}

        {activeTab === 'add' && (
          <div className="fade-in">
            <ProductForm
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              editingProduct={editingProduct}
              onCancel={() => {
                setEditingProduct(null);
                setActiveTab('products');
              }}
              userRole={userRole}
            />
          </div>
        )}

      </main>

      {toast.msg && (
        <div className={`toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}

    </div>
  );
}

export default App;