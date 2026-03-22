import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { Product } from '../types';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity: number[]) => {
    const totalStock = quantity.reduce((sum, qty) => sum + qty, 0);
    if (totalStock === 0) return { label: 'Out of Stock', class: 'badge-danger' };
    if (totalStock < 20) return { label: 'Low Stock', class: 'badge-warning' };
    return { label: 'In Stock', class: 'badge-success' };
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <Loader2 size={40} className="spin" style={{ color: 'var(--primary-color)', animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <p className="empty-state-title text-danger">Error</p>
              <p className="empty-state-text">{error}</p>
              <button className="btn btn-primary mt-md" onClick={fetchProducts}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          placeholder="Search products by name or description..."
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
              <p className="empty-state-text">
                {searchTerm ? 'No products match your search.' : 'There are no products to display. Add your first product to get started.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="table-container desktop-only">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.quantity);
                    const totalStock = product.quantity.reduce((sum, qty) => sum + qty, 0);
                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="flex items-center gap-md">
                            <div style={{ width: '3rem', height: '3rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span className="text-secondary text-sm">IMG</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-secondary text-sm" style={{ maxWidth: '20rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="font-medium">{formatPrice(product.price)}</td>
                        <td>{totalStock} units</td>
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

          {/* Mobile Card View */}
          <div className="product-grid mobile-only">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.quantity);
              const totalStock = product.quantity.reduce((sum, qty) => sum + qty, 0);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-card-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <div className="product-card-no-image">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="product-card-content">
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-description">{product.description}</p>
                    <div className="product-card-details">
                      <span className="product-card-price">{formatPrice(product.price)}</span>
                      <span className={`badge ${stockStatus.class}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                    <div className="product-card-stock">{totalStock} units in stock</div>
                  </div>
                  <div className="product-card-actions">
                    <Link to={`/products/edit/${product.id}`} className="btn btn-secondary">
                      <Edit size={18} />
                      Edit
                    </Link>
                    <button className="btn btn-danger">
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
