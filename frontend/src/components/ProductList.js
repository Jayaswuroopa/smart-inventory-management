import React from 'react';

const getStockStatus = (qty) => {
  if (qty <= 5) return { label: 'Low', cls: 'stock-low' };
  if (qty <= 20) return { label: 'Medium', cls: 'stock-mid' };
  return { label: 'Good', cls: 'stock-ok' };
};

const ProductList = ({ products, onDelete, onEdit, loading, userRole }) => {

  if (loading) return (
    <div className="table-card">
      <div className="empty-state">
        <div className="empty-icon">⏳</div>
        <p>Loading products...</p>
      </div>
    </div>
  );

  return (
    <div className="table-card">

      <div className="table-header">
        <span className="table-title">📋 All Products</span>
        <span className="table-count">{products.length} items</span>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No products found. Try a different search or add a new product!</p>
        </div>
      ) : (

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Barcode</th>
              <th>Quantity</th>
              <th>Stock Status</th>
              <th>Price</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => {
              const stock = getStockStatus(p.quantity);

              return (
                <tr key={p._id}>

                  <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                    {i + 1}
                  </td>

                  <td>
                    <strong>{p.name}</strong>
                  </td>

                  <td>
                    <span className="cat-badge">{p.category}</span>
                  </td>

                  <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                    {p.barcode || '—'}
                  </td>

                  <td>{p.quantity}</td>

                  <td>
                    <span className={`stock-badge ${stock.cls}`}>
                      {stock.label}
                    </span>
                  </td>

                  <td>
                    ${Number(p.price).toFixed(2)}
                  </td>

                  <td style={{ color: 'var(--c3)', fontWeight: 600 }}>
                    ${(p.price * p.quantity).toFixed(2)}
                  </td>

                  <td>
                    <div className="action-btns">

                      {userRole === 'admin' ? (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => onEdit(p)}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="del-btn"
                            onClick={() => onDelete(p._id)}
                          >
                            🗑️
                          </button>
                        </>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                          👁️ View only
                        </span>
                      )}

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>

      )}

    </div>
  );
};

export default ProductList;