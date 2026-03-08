import React from 'react';

const COLORS = ['#4d96ff', '#ff6b6b', '#6bcb77', '#ffd93d', '#ff922b', '#cc5de8'];

const Dashboard = ({ products, onNavigate }) => {
  const totalProducts = products.length;
  const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
  const totalQty = products.reduce((s, p) => s + p.quantity, 0);
  const lowStock = products.filter(p => p.quantity <= 5);

  const catMap = {};
  products.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
  const categories = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxCat = categories[0]?.[1] || 1;

  const topByValue = [...products]
    .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
    .slice(0, 5);

  return (
    <div>
      <div className="dashboard-greeting">
        <h2>Welcome back! 👋</h2>
        <p>Here's what's happening with your inventory today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div className="stat-value">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="stat-label">Total Value</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">🏷️</div>
          <div className="stat-value">{totalQty}</div>
          <div className="stat-label">Total Items in Stock</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{lowStock.length}</div>
          <div className="stat-label">Low Stock Alerts</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📊 Products by Category</div>
          {categories.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No data yet. Add products!</p>
          ) : (
            <div className="bar-chart">
              {categories.map(([cat, count], i) => (
                <div className="bar-row" key={cat}>
                  <div className="bar-label" title={cat}>{cat}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(count / maxCat) * 100}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                  <div className="bar-count">{count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-title">💎 Top Products by Value</div>
          {topByValue.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No data yet. Add products!</p>
          ) : (
            <div className="donut-wrap">
              {topByValue.map((p, i) => (
                <div className="donut-item" key={p._id}>
                  <div className="donut-dot" style={{ background: COLORS[i % COLORS.length] }} />
                  <div className="donut-name" title={p.name}>{p.name}</div>
                  <div className="donut-val" style={{ color: COLORS[i % COLORS.length] }}>${(p.price * p.quantity).toFixed(0)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-title">⚠️ Low Stock Alert (≤5 items)</div>
          {lowStock.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>✅ All products are well stocked!</p>
          ) : (
            <div className="low-stock-list">
              {lowStock.map(p => (
                <div className="low-stock-item" key={p._id}>
                  <span className="low-stock-name">{p.name}</span>
                  <span className="low-stock-qty">{p.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-title">⚡ Quick Actions</div>
          <div className="quick-actions" style={{ flexDirection: 'column' }}>
            <button className="quick-btn" onClick={() => onNavigate('add')}>➕ Add New Product</button>
            <button className="quick-btn" onClick={() => onNavigate('products')}>📋 View All Products</button>
            <button className="quick-btn" onClick={() => onNavigate('products')}>🔍 Search Products</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;