import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/productSlice.js';
import {
  ArrowRight,
  ChevronLeft,
  SearchX
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const CollectionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isDark = useSelector((state) => state.theme.isDark);
  const { items: productList, status } = useSelector((state) => state.products);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGender, setActiveGender] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  /* Fetch products */
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  /* Reset page when filters change (CORRECT place) */
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeGender]);

  /* Filter products (PURE computation) */
  const filteredProducts = useMemo(() => {
    return productList.filter((p) => {
      const categoryMatch =
        activeCategory === 'All' || p.category === activeCategory;

      const genderMatch =
        activeGender === 'All' ||
        p.gender === activeGender ||
        p.gender === 'All';

      return categoryMatch && genderMatch;
    });
  }, [productList, activeCategory, activeGender]);

  /* Pagination */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* Theme */
  const theme = isDark
    ? {
        bg: 'bg-[#050505]',
        text: 'text-white',
        border: 'border-white/5',
        card: 'bg-[#0f0f0f]',
      }
    : {
        bg: 'bg-[#fafafa]',
        text: 'text-black',
        border: 'border-gray-100',
        card: 'bg-white',
      };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pt-32 pb-20 transition-all duration-700`}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <header className="mb-16 space-y-2 text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">
            Essential Archive
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
            Our <span className="font-serif not-italic font-light text-amber-600">Editions</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-12 sticky top-36 h-fit">
            <FilterSection
              title="Hierarchy"
              options={['All', 'Apparel', 'Footwear', 'Jewelry', 'Electronics']}
              active={activeCategory}
              setter={setActiveCategory}
            />
            <FilterSection
              title="Gender"
              options={['All', 'Male', 'Female']}
              active={activeGender}
              setter={setActiveGender}
            />
          </aside>

          {/* Products */}
          <main className="lg:col-span-9">

            {/* Loading */}
            {status === 'loading' && productList.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4 animate-pulse">
                    <div className="aspect-[3/4] rounded-[2.5rem] bg-gray-500/10" />
                    <div className="h-4 w-3/4 bg-gray-500/10 rounded-full" />
                    <div className="h-10 w-full bg-gray-500/10 rounded-2xl" />
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {currentItems.map((product) => (
                    <div key={product._id} className="flex flex-col">

                      <div className={`relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border ${theme.border} ${theme.card}`}>
                        <img
                          src={product.images?.[0] || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-6 left-6 px-3 py-1 bg-white/90 rounded-full text-[8px] font-black uppercase tracking-widest text-black">
                          {product.category}
                        </span>
                      </div>

                      <div className="mt-6 px-2 flex flex-col flex-grow">
                        <h4 className="text-sm font-black uppercase italic">
                          {product.name}
                        </h4>
                        <p className="text-lg font-black tracking-tighter text-amber-600">
                          ₹{Number(product.price || 0).toLocaleString()}
                        </p>

                        <button
                          onClick={() => navigate(`/productdetail?id=${product._id}`)}
                          className="mt-auto w-full py-4 rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
                        >
                          See Detail
                          <ArrowRight size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-24 flex justify-center gap-8">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="text-[10px] font-black uppercase tracking-widest disabled:opacity-20"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <span className="text-[11px] font-black tracking-[0.4em] opacity-40">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="text-[10px] font-black uppercase tracking-widest disabled:opacity-20"
                    >
                      Next <ChevronLeft size={16} className="rotate-180" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Empty */}
            {filteredProducts.length === 0 && status !== 'loading' && (
              <div className="flex flex-col items-center py-32">
                <SearchX size={60} className="text-amber-500/50" />
                <h3 className="text-2xl font-black uppercase italic mt-6">
                  Null Results
                </h3>
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
    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
      {title}
    </h5>
    <div className="flex flex-col gap-4">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setter(opt)}
          className={`text-left text-[11px] font-black uppercase tracking-widest ${
            active === opt ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default CollectionPage;
