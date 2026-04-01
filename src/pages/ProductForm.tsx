import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react';
import type { Product } from '../types';
import type { AppDispatch, RootState } from '../store';
import { fetchProducts, createProduct, updateProduct } from '../store/slices/productsSlice';
import { generateUploadUrl, uploadImageToGCS, resetUpload } from '../store/slices/uploadSlice';

const quantityOptions = ['100gm', '200gm', '250gm', '500gm'];

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
    quantity: [],
    image_url: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleQuantityChange = (quantity: string) => {
    setFormData((prev) => {
      const currentQuantities = prev.quantity || [];
      const updatedQuantities = currentQuantities.includes(quantity)
        ? currentQuantities.filter((q) => q !== quantity)
        : [...currentQuantities, quantity];
      return { ...prev, quantities: updatedQuantities };
    });
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

    try {
      if (isEditMode && id) {
        await dispatch(updateProduct({ id, product: formData })).unwrap();
      } else {
        await dispatch(createProduct(formData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>)).unwrap();
      }
      navigate('/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isTempPreview = formData.image_url?.startsWith('blob:');

  // Fetch product data in edit mode
  useState(() => {
    if (isEditMode && id) {
      dispatch(fetchProducts()).then((result) => {
        if (result.payload?.products) {
          const product = result.payload.products.find((p: Product) => p.id === id);
          if (product) {
            setFormData(product);
          }
        }
      });
    }
  });


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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="form-group md:col-span-2">
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

            <div className="form-group md:col-span-2">
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
                className="form-input w-full"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Available Quantities *
              </label>
              <div className="flex flex-wrap gap-sm mt-2">
                {quantityOptions.map((qty) => (
                  <label
                    key={qty}
                    className="flex items-center gap-sm px-3 py-2 rounded-md cursor-pointer border transition-colors"
                    style={{
                      borderColor: (formData.quantity || []).includes(qty) ? 'var(--primary-color)' : 'var(--border-color)',
                      backgroundColor: (formData.quantities || []).includes(qty) ? 'var(--primary-light)' : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={(formData.quantities || []).includes(qty)}
                      onChange={() => handleQuantityChange(qty)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm">{qty}</span>
                  </label>
                ))}
              </div>
              {(formData.quantities || []).length === 0 && (
                <span style={{ color: 'var(--danger-color)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                  Please select at least one quantity
                </span>
              )}
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">
                Product Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-md">
                <div 
                  className="w-20 h-20 flex items-center justify-center relative overflow-hidden rounded-lg"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
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
                <div className="flex flex-col gap-sm w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-sm">
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
                            <span className="hidden sm:inline">Uploading...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            <span className="hidden sm:inline">Confirm Upload</span>
                            <span className="sm:hidden">Upload</span>
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

          <div className="flex flex-col sm:flex-row gap-md mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button 
              type="submit" 
              disabled={isLoading || (formData.quantities || []).length === 0} 
              className="btn btn-primary w-full sm:w-auto justify-center"
            >
              <Save size={20} />
              {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
            <Link to="/products" className="btn btn-secondary w-full sm:w-auto justify-center text-center">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
