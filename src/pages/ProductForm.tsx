import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import type { Product } from '../types';

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    navigate('/products');
  };

  const categories = ['Electronics', 'Accessories', 'Clothing', 'Home & Garden', 'Sports', 'Books'];

  return (
    <div className="page-container">
      <div className="flex items-center gap-md">
        <Link to="/products" className="btn-icon">
          <ArrowLeft size={24} />
        </Link>
        <h2 className="page-title">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          <div className="grid grid-cols-2">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Enter product description"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Product Image
              </label>
              <div className="flex items-center gap-md">
                <div style={{ width: '5rem', height: '5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} />
                  ) : (
                    <Upload size={24} style={{ color: 'var(--text-light)' }} />
                  )}
                </div>
                <button type="button" className="btn btn-secondary">
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-md" style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
            <button type="submit" disabled={isLoading} className="btn btn-primary">
              <Save size={20} />
              {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
            <Link to="/products" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
