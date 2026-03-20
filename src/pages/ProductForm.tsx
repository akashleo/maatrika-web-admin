import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react';
import type { Product } from '../types';
import type { AppDispatch, RootState } from '../store';
import { generateUploadUrl, uploadImageToGCS, resetUpload } from '../store/slices/uploadSlice';

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = Boolean(id);

  const { uploadUrl, publicUrl, loading: uploadLoading, error: uploadError } = useSelector(
    (state: RootState) => state.upload
  );

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      // Create temporary preview
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const productId = id || `temp-${Date.now()}`;
    const fileName = `${Date.now()}-${selectedFile.name}`;

    try {
      // Step 1: Generate signed upload URL
      const result = await dispatch(
        generateUploadUrl({
          fileName,
          contentType: selectedFile.type,
          productId,
          fileSize: selectedFile.size,
        })
      ).unwrap();

      // Step 2: Upload file to GCS using the signed URL
      await dispatch(
        uploadImageToGCS({
          file: selectedFile,
          uploadUrl: result.uploadUrl,
        })
      ).unwrap();

      // Step 3: Update form with public URL
      setFormData((prev) => ({ ...prev, imageUrl: result.publicUrl }));
      setSelectedFile(null);
      dispatch(resetUpload());
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    setSelectedFile(null);
    dispatch(resetUpload());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const isTempPreview = formData.imageUrl?.startsWith('blob:');

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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div className="flex items-center gap-md">
                <div 
                  style={{ 
                    width: '5rem', 
                    height: '5rem', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    borderRadius: '0.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {formData.imageUrl ? (
                    <>
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover', 
                          borderRadius: '0.5rem',
                          opacity: isTempPreview ? 0.7 : 1
                        }} 
                      />
                      {isTempPreview && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                          }}
                        >
                          Preview
                        </div>
                      )}
                    </>
                  ) : (
                    <Upload size={24} style={{ color: 'var(--text-light)' }} />
                  )}
                </div>
                <div className="flex flex-col gap-sm">
                  <div className="flex items-center gap-sm">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-secondary"
                      disabled={uploadLoading}
                    >
                      {formData.imageUrl ? 'Change Image' : 'Upload Image'}
                    </button>
                    {selectedFile && !uploadUrl && (
                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploadLoading}
                        className="btn btn-primary"
                      >
                        {uploadLoading ? (
                          <>
                            <Loader2 size={16} className="spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Confirm Upload
                          </>
                        )}
                      </button>
                    )}
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="btn-icon"
                        style={{ color: 'var(--danger-color)' }}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  {uploadError && (
                    <span style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>
                      {uploadError}
                    </span>
                  )}
                  {selectedFile && (
                    <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                  {publicUrl && !isTempPreview && (
                    <span style={{ color: 'var(--success-color)', fontSize: '0.875rem' }}>
                      Image uploaded successfully!
                    </span>
                  )}
                </div>
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
