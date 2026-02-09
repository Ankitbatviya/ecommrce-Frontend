import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productSlice.js';
import { ArrowRight, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';

const CollectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isDark = useSelector((state) => state.theme.isDark);
  const { items: productList, status } = useSelector((state) => state.products);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGender, setActiveGender] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const filteredProducts = useMemo(() => {
    setCurrentPage(1);
    return productList.filter(p => {
      const categoryMatch = activeCategory === "All" || p.category === activeCategory;
      const genderMatch = activeGender === "All" || p.gender === activeGender || p.gender === "All";
      return categoryMatch && genderMatch;
    });
  }, [productList, activeCategory, activeGender]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const theme = isDark
    ? { bg: 'bg-[#050505]', text: 'text-white', border: 'border-white/5', card: 'bg-[#0f0f0f]' }
    : { bg: 'bg-[#fafafa]', text: 'text-black', border: 'border-gray-100', card: 'bg-white' };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pt-32 pb-20 transition-all duration-700 font-sans`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <header className="mb-16 space-y-2 text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Essential Archive</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Our <span className="font-serif not-italic font-light text-amber-600">Editions</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-12 sticky top-36 h-fit">
            <FilterSection title="Hierarchy" options={["All", "Apparel", "Footwear", "Jewelry", "Electronics"]} active={activeCategory} setter={setActiveCategory} />
            <FilterSection title="Gender" options={["All", "Male", "Female"]} active={activeGender} setter={setActiveGender} />
          </aside>

          {/* Product Feed */}
          <main className="lg:col-span-9">
            {status === 'loading' && productList.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[3/4] rounded-[2.5rem] bg-gray-500/10 animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-500/10 animate-pulse rounded-full" />
                    <div className="h-10 w-full bg-gray-500/10 animate-pulse rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-in fade-in duration-700">
                  {currentItems.map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col h-full"
                    >
                      {/* Image Area - Static, No Hover Effects */}
                      <div className={`relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border ${theme.border} ${theme.card} shadow-sm transition-shadow duration-300`}>
                        <img
                          src={product.images?.[0]}
                          className="w-full h-full object-cover"
                          alt={product.name}
                        />
                        {/* Subtle Category Badge on Image */}
                        <div className="absolute top-6 left-6">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-black shadow-sm">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Product Info & Action Area */}
                      <div className="mt-6 px-2 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h4 className={`text-sm font-black uppercase italic tracking-tight ${theme.text}`}>
                              {product.name}
                            </h4>
                            <p className="text-lg font-black tracking-tighter text-amber-600">
                              ₹{product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Action Button - Fixed navigation to use URL parameters */}
                        <button
                          onClick={() => navigate(`/productdetail/${product._id}`)}
                          className={`mt-auto w-full py-4 rounded-2xl border ${theme.border} flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 group hover:bg-black hover:text-white dark:hover:bg-amber-600 dark:hover:text-black dark:hover:border-amber-600`}
                        >
                          See Detail
                          <ArrowRight size={14} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-24 flex items-center justify-center gap-8">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className={`group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-10 ${isDark ? 'text-white' : 'text-black'}`}
                    >
                      <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Prev
                    </button>

                    <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className={`group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-10 ${isDark ? 'text-white' : 'text-black'}`}
                    >
                      Next <ChevronLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Null Results State */
              <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <SearchX size={60} strokeWidth={1} className="text-amber-500/50" />
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black uppercase italic">Null Results</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No entities match your current hierarchy.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ title, options, active, setter }) => (
  <div className="space-y-6">
    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">{title}</h5>
    <div className="flex flex-col gap-4">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => setter(opt)}
          className={`text-left text-[11px] font-black uppercase tracking-widest transition-all relative w-fit ${active === opt ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'}`}
        >
          {opt}
          {active === opt && (
            <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  </div>
);

export default CollectionPage;