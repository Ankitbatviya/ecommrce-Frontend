import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../../Stylesheet/Admin/AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    brand: '',
    category: 'Apparel',
    gender: 'Unisex',
    price: '',
    discount: '0',
    sizes: [],
    colors: [],
    stock: '',
    images: [],
    author: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, searchTerm]);

  const fetchProducts = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get('http://localhost:8000/api/products/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          category: categoryFilter === 'all' ? '' : categoryFilter,
          search: searchTerm
        }
      });

      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setNewProduct(prev => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('authToken');
      if (editingProduct) {
        const response = await axios.put(
          `http://localhost:8000/api/products/admin/${editingProduct._id}`,
          newProduct,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Product updated successfully');
          setShowAddForm(false);
          resetForm();
          fetchProducts();
        }
      } else {
        const response = await axios.post(
          'http://localhost:8000/api/products/admin',
          newProduct,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Product created successfully');
          setShowAddForm(false);
          resetForm();
          fetchProducts();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '', description: '', brand: '', category: 'Apparel',
      gender: 'Unisex', price: '', discount: '0', sizes: [],
      colors: [], stock: '', images: [], author: ''
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      gender: product.gender,
      price: product.price,
      discount: product.discount,
      sizes: product.sizes || [],
      colors: product.colors || [],
      stock: product.stock,
      images: product.images || [],
      author: product.author || 'Admin'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;
    try {
      const token = Cookies.get('authToken');
      const response = await axios.delete(`http://localhost:8000/api/products/admin/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) return (
    <div className="admin-loading">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="admin-products">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Dashboard
            </button>
            <div className="logo">
              <span className="logo-icon">◆</span>
              <span className="logo-text">AdminPanel</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Header */}
      <header className="page-header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your product catalog</p>
        </div>
        <button className="btn-add" onClick={() => setShowAddForm(true)}>
          + Add New Product
        </button>
      </header>

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => { setShowAddForm(false); resetForm(); }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={() => { setShowAddForm(false); resetForm(); }}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required placeholder="e.g. Cotton T-Shirt" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Brand *</label>
                      <input type="text" name="brand" value={newProduct.brand} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Author</label>
                      <input type="text" name="author" value={newProduct.author} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea name="description" value={newProduct.description} onChange={handleInputChange} rows="4" required />
                  </div>

                  <div className="form-group">
                    <label>Image URLs (one per line) *</label>
                    <textarea
                      value={newProduct.images.join('\n')}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, images: e.target.value.split('\n').filter(url => url.trim()) }))}
                      rows="4"
                      placeholder="https://example.com/image1.jpg"
                      required
                    />
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category *</label>
                      <select name="category" value={newProduct.category} onChange={handleInputChange} required>
                        <option value="Apparel">Apparel</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Gender *</label>
                      <select name="gender" value={newProduct.gender} onChange={handleInputChange} required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Discount (%)</label>
                      <input type="number" name="discount" value={newProduct.discount} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Stock *</label>
                    <input type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Sizes (comma separated)</label>
                    <input type="text" value={newProduct.sizes.join(', ')} onChange={(e) => handleArrayChange(e, 'sizes')} placeholder="S, M, L, XL" />
                  </div>

                  <div className="form-group">
                    <label>Colors (comma separated)</label>
                    <input type="text" value={newProduct.colors.join(', ')} onChange={(e) => handleArrayChange(e, 'colors')} placeholder="Black, White, Blue" />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => { setShowAddForm(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="controls-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Apparel">Apparel</option>
          <option value="Electronics">Electronics</option>
          <option value="Footwear">Footwear</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="table-container">
        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-cell">
                      <img src={product.images[0]} alt={product.name} className="product-img" />
                      <div>
                        <p className="product-name">{product.name}</p>
                        <p className="product-brand">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.gender}</td>
                  <td>
                    <div className="price-cell">
                      <span className="final-price">₹{(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                      {product.discount > 0 && <span className="original-price">₹{product.price}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(product._id, product.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;