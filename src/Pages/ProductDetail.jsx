// ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cartService } from '../services/cartService';
import { isAuthenticated } from '../utils/auth';
import '../Stylesheet/ProductDetail.css';

const ProductDetail = () => {
    const [searchParams] = useSearchParams();
    const Id = searchParams.get("id");
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!Id) {
            toast.error('Product ID is missing');
            navigate('/products');
            return;
        }

        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8000/api/products/${Id}`);
                
                if (!res.ok) {
                    throw new Error('Failed to fetch product');
                }
                
                const data = await res.json();

                if (data?.success && data?.data) {
                    const fetchedProduct = data.data;
                    setProduct(fetchedProduct);
                    
                    // Set default size if available
                    if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
                        setSelectedSize(fetchedProduct.sizes[0]);
                    }
                    
                    // Set default color if available
                    if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
                        setSelectedColor(fetchedProduct.colors[0]);
                    }
                } else {
                    toast.error('Product not found');
                    setTimeout(() => navigate('/products'), 2000);
                }
            } catch (err) {
                console.error('Product fetch error:', err);
                setError('Unable to load product details');
                toast.error('Failed to load product. Redirecting...');
                setTimeout(() => navigate('/products'), 2000);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [Id, navigate]);

    const handleAddToCart = async () => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            toast.warning('Please login to add items to cart');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        // Check if product exists
        if (!product) {
            toast.error('Product not found');
            return;
        }

        // Validate product is active
        if (!product.isActive) {
            toast.error('This product is currently unavailable');
            return;
        }

        // Validate stock
        if (product.stock < quantity) {
            toast.warning(`Only ${product.stock} items available in stock`);
            return;
        }

        // Validate size selection if required
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.warning('Please select a size');
            return;
        }

        try {
            setIsAdding(true);
            
            const response = await cartService.addToCart(
                product._id,
                quantity,
                selectedSize || undefined,
                selectedColor || undefined
            );

            // Success feedback
            toast.success(`${product.name} added to cart!`, {
                position: "top-right",
                autoClose: 2000,
            });
            
            console.log('Cart updated:', response.data);

        } catch (err) {
            console.error('Add to cart error:', err);
            
            // Handle specific error messages from backend
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else if (err.message) {
                toast.error(err.message);
            } else {
                toast.error('Failed to add item to cart. Please try again.');
            }
        } finally {
            setIsAdding(false);
        }
    };

    const handleDirectBuy = async () => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            toast.warning('Please login to proceed with checkout');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        // Check if product exists
        if (!product) {
            toast.error('Product not found');
            return;
        }

        // Validate product is active
        if (!product.isActive) {
            toast.error('This product is currently unavailable');
            return;
        }

        // Validate stock
        if (product.stock < quantity) {
            toast.warning(`Only ${product.stock} items available in stock`);
            return;
        }

        // Validate size selection if required
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast.warning('Please select a size');
            return;
        }

        // Add to cart first, then navigate to checkout
        try {
            setIsAdding(true);
            
            await cartService.addToCart(
                product._id,
                quantity,
                selectedSize || undefined,
                selectedColor || undefined
            );

            toast.success('Redirecting to checkout...', {
                autoClose: 1000,
            });

            // Navigate to checkout after a short delay
            setTimeout(() => navigate('/checkout'), 1000);

        } catch (err) {
            console.error('Direct buy error:', err);
            
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else if (err.message) {
                toast.error(err.message);
            } else {
                toast.error('Failed to proceed. Please try again.');
            }
            
            setIsAdding(false);
        }
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        
        if (newQuantity < 1) {
            return;
        }
        
        if (!product) return;
        
        if (newQuantity > product.stock) {
            toast.warning(`Only ${product.stock} items available in stock`);
            return;
        }
        
        setQuantity(newQuantity);
    };

    if (loading) {
        return (
            <div className="PDP-Loading">
                <div className="PDP-Spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="PDP-Error">
                <div className="PDP-Error-Icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                </div>
                <h2>{error || 'Product Not Found'}</h2>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <button className="PDP-Error-Btn" onClick={() => navigate('/products')}>
                    Back to Products
                </button>
            </div>
        );
    }

    const discountedPrice = product.price * (1 - (product.discount / 100));

    return (
        <div className="PDP-Hero-Container">
            <button className="PDP-BackBtn" onClick={() => navigate(-1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                </svg>
                <span>Back</span>
            </button>

            <div className="PDP-Split-Layout">
                <section className="PDP-Image-Section">
                    {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} />
                    ) : (
                        <div className="PDP-Image-Placeholder">
                            No Image Available
                        </div>
                    )}
                </section>

                <section className="PDP-Content-Section">
                    <div className="PDP-Content-Wrapper">
                        <span className="PDP-Brand-Label">{product.brand || 'Unknown Brand'}</span>
                        <h1 className="PDP-Main-Title">{product.name || 'Unnamed Product'}</h1>

                        <div className="PDP-Price-Group">
                            <span className="PDP-Current-Price">₹{discountedPrice.toFixed(0)}</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="PDP-Old-Price">₹{product.price}</span>
                                    <span className="PDP-Discount-Badge">
                                        {product.discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="PDP-Stock-Status">
                            {product.stock > 0 ? (
                                <span className="in-stock">
                                    ✓ In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="out-of-stock">✗ Out of Stock</span>
                            )}
                        </div>

                        <p className="PDP-Brief">{product.description}</p>

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="PDP-Selection-Area">
                                <span className="PDP-Sub-Label">
                                    Select Size {selectedSize && `(${selectedSize})`}
                                </span>
                                <div className="PDP-Size-Grid">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`PDP-Size-Button ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                            type="button"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="PDP-Selection-Area">
                                <span className="PDP-Sub-Label">
                                    Select Color {selectedColor && `(${selectedColor})`}
                                </span>
                                <div className="PDP-Color-Grid">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            className={`PDP-Color-Button ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            style={{ 
                                                backgroundColor: color.toLowerCase(),
                                                border: selectedColor === color ? '3px solid #121212' : '1px solid #eee'
                                            }}
                                            title={color}
                                            type="button"
                                        >
                                            {selectedColor === color && '✓'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="PDP-Quantity-Row">
                            <span className="PDP-Sub-Label">Quantity</span>
                            <div className="PDP-Quantity-Selector">
                                <button 
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    type="button"
                                >
                                    —
                                </button>
                                <span>{quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stock}
                                    type="button"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="PDP-Action-Stack">
                            <button
                                className={`PDP-Add-Cart-Btn ${isAdding ? 'loading' : ''}`}
                                onClick={handleAddToCart}
                                disabled={isAdding || product.stock === 0}
                                type="button"
                            >
                                {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                            </button>

                            <button 
                                className="PDP-Direct-Buy-Btn" 
                                onClick={handleDirectBuy}
                                disabled={isAdding || product.stock === 0}
                                type="button"
                            >
                                Buy It Now
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className="PDP-Product-Info">
                            <p><strong>Category:</strong> {product.category}</p>
                            <p><strong>Gender:</strong> {product.gender}</p>
                            {product.rating > 0 && (
                                <p>
                                    <strong>Rating:</strong> ⭐ {product.rating.toFixed(1)} 
                                    ({product.reviewsCount} reviews)
                                </p>
                            )}
                        </div>

                        {/* Additional Info if available */}
                        <div className="PDP-Additional-Info">
                            {product.isActive === false && (
                                <p className="inactive-warning">
                                    ⚠️ This product is currently inactive and cannot be purchased.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductDetail;