import React, { useEffect, useState } from 'react';
import '../Stylesheet/Product//ProductPage.css';
import Loader from '../components/global/Loader';
import SupLoader from '../components/global/SupLoader';
import { useNavigate } from 'react-router-dom';

const CollectionPage = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGender, setActiveGender] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  // Controls the mobile drawer visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:8000/api/products');
        const data = await res.json();
        setProductList(data.data || data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  const categories = ["All", "Apparel", "Footwear", "Accessories", "Jewelry"];
  const genders = ["All", "Male", "Female"];

  const filteredProducts = productList.filter(p => {
    const categoryMatch = activeCategory === "All" || p.category === activeCategory;
    const genderMatch = activeGender === "All" || p.gender === activeGender || p.gender === "All";
    return categoryMatch && genderMatch;
  });

  const handleReset = () => {
    setActiveCategory('All');
    setActiveGender('All');
  };

  const handleFilterSelect = (filterType, value) => {
    if (filterType === 'gender') {
      setActiveGender(value);
    } else if (filterType === 'category') {
      setActiveCategory(value);
    }
    // Close drawer on mobile after selection
    if (window.innerWidth <= 1024) {
      setIsFilterOpen(false);
    }
  };

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="group animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300/30 to-transparent"></div>
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      </div>

      {/* Product Info Skeleton */}
      <div className="space-y-3">
        {/* Category */}
        <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        
        {/* Product Name */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
        
        {/* Price */}
        <div className="h-5 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="CollectionContainer">
      <header className="CollectionHeader">
        <span className="SectionLabel">NEW ARRIVALS</span>
        <h1 className="CollectionTitle">The <span>2026</span> Collection</h1>
      </header>

      {/* MOBILE TRIGGER BUTTON */}
      <button className="MobileFilterTrigger" onClick={() => setIsFilterOpen(true)}>
        FILTER BY
      </button>

      {/* DIMMED OVERLAY - CLICKING THIS ALSO CLOSES DRAWER */}
      <div 
        className={`DrawerOverlay ${isFilterOpen ? 'active' : ''}`} 
        onClick={() => setIsFilterOpen(false)}
      ></div>

      <div className="CollectionLayout">
        {/* ASIDE - DRAWER LOGIC */}
        <aside className={`FilterSidebar ${isFilterOpen ? 'open' : ''}`}>
          <div className="DrawerHeader">
            <span>FILTER BY</span>
            <button className="CloseBtn" onClick={() => setIsFilterOpen(false)}>&times;</button>
          </div>

          <div className="FilterGroupsContainer">
            <div className="FilterGroup">
              <h5>GENDER</h5>
              <ul>
                {genders.map(g => (
                  <li 
                    key={g} 
                    className={activeGender === g ? 'active-filter' : ''} 
                    onClick={() => handleFilterSelect('gender', g)}
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div className="FilterGroup">
              <h5>CATEGORIES</h5>
              <ul>
                {categories.map(cat => (
                  <li 
                    key={cat} 
                    className={activeCategory === cat ? 'active-filter' : ''} 
                    onClick={() => handleFilterSelect('category', cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
            
            <button className="ResetLink" onClick={handleReset}>Clear All Filters</button>
          </div>
          
          <button className="ApplyResultsBtn" onClick={() => setIsFilterOpen(false)}>
            VIEW {filteredProducts.length} ITEMS
          </button>
        </aside>

        <main className="ProductMain">
          {!isLoading && (
            <div className="ProductResultsHeader">
              <div className="ActiveFiltersDisplay">
                {activeGender !== "All" && <span className="FilterBadge">{activeGender}</span>}
                {activeCategory !== "All" && <span className="FilterBadge">{activeCategory}</span>}
              </div>
              <div className="ResultsCount">{filteredProducts.length} items</div>
            </div>
          )}

          <div className="BrandGrid">
            {isLoading ? (
              // Show skeleton cards while loading
              [...Array(12)].map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : (
              // Show actual products
              filteredProducts.map(product => (
                <div key={product._id} className="BrandCard">
                  <div className="BrandImageArea">
                    <img src={product.images?.[0]} alt={product.name} className="ProductImg" />
                    <div className="ViewDetailsOverlay">
                      <button className="DetailsBtn" onClick={() => navigate(`/productdetail?id=${product._id}`)}>View</button>
                    </div>
                  </div>
                  <div className="BrandInfo">
                    <span className="CategoryLabel">{product.category}</span>
                    <h4>{product.name}</h4>
                    <p className="PriceText">${product.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CollectionPage;