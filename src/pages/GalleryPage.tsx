import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Eye, 
  Package, 
  Search, 
  X, 
  Layers, 
  User, 
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { GalleryItem } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface GalleryPageProps {
  onNavigate?: (route: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = () => {
  const { openBulkModal, currentLanguage, dict } = useApp();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  // Load gallery items from server
  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await api.getGallery();
      setItems(data);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  // Collect available unique categories
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.artisanName && item.artisanName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.materials && item.materials.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-linear-to-br from-[#071426] via-[#0B1A30] to-[#142C4F] rounded-2xl p-8 sm:p-12 text-white border border-slate-800 shadow-md relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {currentLanguage === 'bn' 
                  ? 'মাস্টার কারিগরদের হস্তশিল্প সৃষ্টি' 
                  : currentLanguage === 'hi'
                  ? 'मास्टर कारीगरों का हस्तशिल्प प्रदर्शन'
                  : 'Master Artisan Craftsmanship Showcase'}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-serif-heading">
              {currentLanguage === 'bn' 
                ? 'হাতের কাজের এক্সক্লুসিভ গ্যালারি' 
                : currentLanguage === 'hi'
                ? 'हस्तशिल्प की विशिष्ट गैलरी'
                : 'Exclusive Handcrafted Masterpiece Gallery'}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {currentLanguage === 'bn' 
                ? 'বাংলার মাটির শিল্প, ঐতিহ্যবাহী টেরাকোটা, হস্তনির্মিত জুয়েলারি এবং ডোকরা শিল্পের প্রতিটি অনন্য সৃষ্টি। যেকোনো ডিজাইনের বাল্ক উৎপাদন ও কাস্টমাইজেশন সরাসরি কারিগরদের দিয়ে করানো সম্ভব।'
                : currentLanguage === 'hi'
                ? 'बंगाल की मिट्टी कला, पारंपरिक टेराकोटा, हस्तनिर्मित आभूषण और ढोकरा शिल्पों का संग्रह। किसी भी डिज़ाइन का थोक निर्माण सीधे कारीगरों द्वारा कराया जा सकता है।'
                : 'Explore authentic handcrafted terracotta art, designer clay jewellery, lost-wax Dokra sculptures, and cultural artifacts created by our skilled artisan clusters in Kolkata & West Bengal.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {currentLanguage === 'bn' ? '১০০% খাঁটি হাতের কাজ' : currentLanguage === 'hi' ? '100% प्रामाणिक हस्तशिल्प' : '100% Genuine Handcrafted'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {currentLanguage === 'bn' ? 'বাল্ক উৎপাদন সমর্থিত' : currentLanguage === 'hi' ? 'थोक निर्माण उपलब्ध' : 'Bulk Production Supported'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {dict.badge_workshop}
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0B1A30] text-amber-400 shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? dict.prod_all_cat : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLanguage === 'bn' 
                  ? 'হাতের কাজ বা কারিগরের নাম খুঁজুন...' 
                  : currentLanguage === 'hi'
                  ? 'शिल्प या कारीगर का नाम खोजें...'
                  : 'Search craft, artisan...'
              }
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-500 font-medium">
              {currentLanguage === 'bn' 
                ? 'গ্যালারির হাতের কাজ লোড হচ্ছে...' 
                : currentLanguage === 'hi'
                ? 'हस्तशिल्प लोड हो रहे हैं...'
                : 'Loading handcrafted gallery...'}
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {currentLanguage === 'bn' ? 'কোনো হাতের কাজ পাওয়া যায়নি' : currentLanguage === 'hi' ? 'कोई शिल्प नहीं मिला' : 'No craft items found'}
            </h3>
            <p className="text-xs text-slate-500">
              {currentLanguage === 'bn'
                ? 'অনুগ্রহ করে অন্য ক্যাটাগরি বা শব্দ দিয়ে অনুসন্ধান করুন।'
                : currentLanguage === 'hi'
                ? 'कृपया किसी अन्य श्रेणी या शब्द से खोजें।'
                : 'Please try searching with another keyword or reset the category filter.'}
            </p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
            >
              {currentLanguage === 'bn' ? 'সব ক্যাটাগরি রিসেট করুন' : currentLanguage === 'hi' ? 'सभी श्रेणियां रीसेट करें' : 'Reset all categories'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                {/* Image Container with zoom */}
                <div 
                  className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => setActiveModalItem(item)}
                >
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('unsplash')) {
                        target.src = 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80';
                      }
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide">
                      {item.category}
                    </span>
                  </div>

                  {/* Hover Quick View Overlay */}
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-950 text-xs font-semibold shadow-md">
                      <Eye className="w-3.5 h-3.5" />
                      {currentLanguage === 'bn' ? 'ছবি ও বিবরণ দেখুন' : currentLanguage === 'hi' ? 'विवरण देखें' : 'View Craft Details'}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 
                      onClick={() => setActiveModalItem(item)}
                      className="text-base font-bold text-slate-900 hover:text-amber-800 transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.title}
                    </h3>
                    
                    {item.artisanName && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {currentLanguage === 'bn' ? 'কারিগর: ' : currentLanguage === 'hi' ? 'कारीगर: ' : 'Artisan: '}
                          <strong className="font-semibold text-slate-700">{item.artisanName}</strong>
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {item.materials && (
                      <div className="mt-2.5 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                        <strong>{currentLanguage === 'bn' ? 'উপাদান: ' : currentLanguage === 'hi' ? 'सामग्री: ' : 'Materials: '}</strong>
                        {item.materials}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalItem(item)}
                      className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors text-center cursor-pointer"
                    >
                      {dict.prod_details_btn}
                    </button>
                    <button
                      type="button"
                      onClick={() => openBulkModal()}
                      className="py-1.5 px-3 bg-[#0B1A30] hover:bg-[#16335C] text-amber-400 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span>{dict.nav_get_quote}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom B2B Procurement CTA Banner */}
        <div className="bg-linear-to-r from-amber-50 to-amber-100/50 rounded-2xl p-6 sm:p-8 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
              {currentLanguage === 'bn' 
                ? 'আপনার নিজস্ব ডিজাইনে তৈরি করতে চান?' 
                : currentLanguage === 'hi'
                ? 'क्या आप अपने कस्टम डिज़ाइन में निर्माण चाहते हैं?'
                : 'Need Custom Artisanal Manufacturing?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              {currentLanguage === 'bn'
                ? 'আপনার নির্দিষ্ট ডিজাইন, কালার বা সাইজের স্যাম্পল অনুযায়ী কারিগরদের দিয়ে তৈরি করিয়ে সরবরাহ করতে প্রস্তুত জিত প্রাইম কোম্পানি।'
                : currentLanguage === 'hi'
                ? 'आपके विशिष्ट डिज़ाइन, रंग या आकार के अनुसार कारीगरों द्वारा निर्माण कर आपूर्ति करने के लिए तैयार है जीत प्राइम कंपनी।'
                : 'We produce custom designs, mementos, corporate gifts, and festive decor to your exact specifications with quality compliance and GST invoicing.'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openBulkModal()}
              className="px-5 py-3 bg-[#0B1A30] hover:bg-[#16335C] text-amber-400 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>{dict.nav_get_quote}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox / Modal for Craft Detail View */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  {activeModalItem.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 font-serif-heading">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="w-full aspect-16/10 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={activeModalItem.imageUrl || 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80'}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('unsplash')) {
                      target.src = 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80';
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentLanguage === 'bn' ? 'সৃষ্টি বিবরণ' : currentLanguage === 'hi' ? 'शिल्प विवरण' : 'Craft Description'}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeModalItem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 font-medium block">
                    {currentLanguage === 'bn' ? 'কারিগর:' : currentLanguage === 'hi' ? 'कारीगर:' : 'Artisan:'}
                  </span>
                  <span className="font-semibold text-slate-800">{activeModalItem.artisanName || 'Kolkata Cluster'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 font-medium block">
                    {currentLanguage === 'bn' ? 'উপাদান:' : currentLanguage === 'hi' ? 'सामग्री:' : 'Materials:'}
                  </span>
                  <span className="font-semibold text-slate-800">{activeModalItem.materials || 'Authentic Handcrafted'}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 hidden sm:inline">
                {currentLanguage === 'bn' ? 'পাইকারি ও কাস্টম অর্ডারের সুবিধা উপলব্ধ' : currentLanguage === 'hi' ? 'थोक व कस्टम ऑर्डर सुविधा उपलब्ध' : 'Wholesale and custom manufacturing available'}
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {currentLanguage === 'bn' ? 'বন্ধ করুন' : currentLanguage === 'hi' ? 'बंद करें' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalItem(null);
                    openBulkModal();
                  }}
                  className="px-4 py-2 bg-[#0B1A30] hover:bg-[#16335C] text-amber-400 text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>{dict.nav_get_quote}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
