import { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [products] = useState<Product[]>([]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'badge-danger' };
    if (stock < 20) return { label: 'Low Stock', class: 'badge-warning' };
    return { label: 'In Stock', class: 'badge-success' };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Products</h2>
        <Link to="/products/add" className="btn btn-primary">
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      <div className="search-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <p className="empty-state-title">No Products Found</p>
              <p className="empty-state-text">There are no products to display. Add your first product to get started.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-md">
                          <div style={{ width: '3rem', height: '3rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="text-secondary text-sm">IMG</span>
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-secondary text-sm" style={{ maxWidth: '20rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td className="font-medium">${product.price.toFixed(2)}</td>
                      <td>{product.stock} units</td>
                      <td>
                        <span className={`badge ${stockStatus.class}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-sm">
                          <Link to={`/products/edit/${product.id}`} className="btn-icon">
                            <Edit size={18} />
                          </Link>
                          <button className="btn-icon">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
