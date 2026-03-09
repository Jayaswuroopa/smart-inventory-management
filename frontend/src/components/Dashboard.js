import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4d96ff', '#ff6b6b', '#6bcb77', '#ffd93d', '#ff922b', '#cc5de8'];

const Dashboard = ({ products, onNavigate }) => {
  const totalProducts = products.length;
  const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
  const totalQty = products.reduce((s, p) => s + p.quantity, 0);
  const lowStock = products.filter(p => p.quantity <= 5);

  const catMap = {};
  products.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
  const categoryData = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const topByValue = [...products]
    .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
    .slice(0, 5)
    .map(p => ({
      name: p.name,
      value: p.price * p.quantity
    }));

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

      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px', marginTop: '20px' }}>
        
        {/* Bar Chart: Products by Category */}
        <div className="chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div className="chart-title" style={{ marginBottom: '15px', fontWeight: 'bold' }}>📊 Products by Category</div>
          {categoryData.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No data yet. Add products!</p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                  <XAxis dataKey="name" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="count" fill="#4d96ff" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie Chart: Top Products by Value */}
        <div className="chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div className="chart-title" style={{ marginBottom: '15px', fontWeight: 'bold' }}>💎 Top Products by Value</div>
          {topByValue.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No data yet. Add products!</p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={topByValue}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {topByValue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Low Stock List */}
        <div className="chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div className="chart-title" style={{ marginBottom: '15px', fontWeight: 'bold' }}>⚠️ Low Stock Alert (≤5 items)</div>
          {lowStock.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>✅ All products are well stocked!</p>
          ) : (
            <div className="low-stock-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lowStock.slice(0, 6).map(p => (
                <div className="low-stock-item" key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#fff5f5', borderRadius: '8px', borderLeft: '4px solid #ff6b6b' }}>
                  <span className="low-stock-name" style={{ fontWeight: '500', color: '#333' }}>{p.name}</span>
                  <span className="low-stock-qty" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{p.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div className="chart-title" style={{ marginBottom: '15px', fontWeight: 'bold' }}>⚡ Quick Actions</div>
          <div className="quick-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="quick-btn" onClick={() => onNavigate('add')} style={{ padding: '12px', background: '#f8f9fc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: 'all 0.2s', ':hover': { background: '#edf2f7' } }}>➕ Add New Product</button>
            <button className="quick-btn" onClick={() => onNavigate('products')} style={{ padding: '12px', background: '#f8f9fc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: 'all 0.2s' }}>📋 View All Products</button>
            <button className="quick-btn" onClick={() => onNavigate('products')} style={{ padding: '12px', background: '#f8f9fc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '500', transition: 'all 0.2s' }}>🔍 Search Products</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;