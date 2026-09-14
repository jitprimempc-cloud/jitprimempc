import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Package, 
  ArrowUpDown, 
  ArrowRight, 
  Check, 
  Bot, 
  MessageCircle, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Product, Category } from '../types';

interface ProductsPageProps {
  onNavigate: (route: string) => void;
  initialCategory?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate, initialCategory }) => {
  const { categories, openBulkModal, openChatWithContext } = useApp();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'moq'>('featured');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getProducts({ includeHidden: false });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter & sort logic
  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.materials && p.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.bulkPrice || a.retailPrice) - (b.bulkPrice || b.retailPrice);
    if (sortBy === 'price-desc') return (b.bulkPrice || b.retailPrice) - (a.bulkPrice || a.retailPrice);
    if (sortBy === 'moq') return (a.moq || 0) - (b.moq || 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="bg-linear-to-r from-[#0B1A30] to-[#16335C] rounded-3xl p-6 sm:p-10 text-white border-2 border-amber-400 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Handmade in India &bull; Direct Wholesale</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-heading">
            Hasta Shilpa & Handcrafted Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Explore terracotta jewellery, dokra brass art, handcrafted plaques, home decor, and puja artefacts crafted by skilled Bengal women artisans.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openBulkModal()}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <span>Request Custom Bulk Quote</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, SKU, material (e.g. Terracotta)..."
              value={searchQuery || ''}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              Sort:
            </span>
            <select
              value={sortBy || 'featured'}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="featured">Featured & Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="moq">Lowest MOQ</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0B1A30] text-amber-400 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0B1A30] text-amber-400 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading authentic handcrafted collection...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No products match your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or filter, or contact us directly for custom craft fabrication.
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Container */}
              <div 
                className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => onNavigate(`/products/${product.slug || product.id}`)}
              >
                <img
                  src={product.primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-[#0B1A30]/90 text-amber-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                    MOQ: {product.moq} pcs
                  </span>
                  {product.productionStatus && (
                    <span className="bg-emerald-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {product.productionStatus}
                    </span>
                  )}
                </div>

                {/* Additional gallery count pill */}
                {product.galleryImages && product.galleryImages.length > 0 && (
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    +{product.galleryImages.length}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1">
                    <span>SKU: {product.sku}</span>
                    {product.leadTime && <span className="text-slate-400 lowercase">{product.leadTime}</span>}
                  </div>
                  <h3 
                    onClick={() => onNavigate(`/products/${product.slug || product.id}`)}
                    className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Pricing & Actions */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Wholesale Rate
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {product.priceOnRequest ? "Price on Request" : `₹${product.bulkPrice || product.retailPrice}/pc`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openChatWithContext(`I would like more information on ${product.name} (SKU: ${product.sku})`, product)}
                      className="text-slate-500 hover:text-amber-600 p-1.5 rounded-md hover:bg-amber-50 text-xs font-semibold flex items-center gap-1"
                      title="Ask AI Assistant"
                    >
                      <Bot className="w-4 h-4 text-amber-500" />
                      <span className="hidden sm:inline">Ask AI</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/products/${product.slug || product.id}`)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors text-center"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => openBulkModal(product)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors text-center shadow-xs cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
