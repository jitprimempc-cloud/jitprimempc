import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Upload, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search, 
  Filter, 
  Sparkles, 
  User, 
  Layers, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { api } from '../../services/api';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

const PREDEFINED_CATEGORIES = [
  'Handmade Jewellery',
  'Terracotta & Clay Art',
  'Dokra & Metal Craft',
  'Puja & Festive Decor',
  'Kantha & Handloom',
  'Wooden Craft',
  'Other Artisanal'
];

export const AdminGalleryTab: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [customCategoryMode, setCustomCategoryMode] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: PREDEFINED_CATEGORIES[0],
    customCategory: '',
    description: '',
    imageUrl: '',
    artisanName: '',
    materials: '',
    featured: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load items from API
  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await api.getGallery();
      setItems(data);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setCustomCategoryMode(false);
    setFormData({
      title: '',
      category: PREDEFINED_CATEGORIES[0],
      customCategory: '',
      description: '',
      imageUrl: '',
      artisanName: 'Monojit Dey Cluster',
      materials: 'Terracotta Clay',
      featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    const isPredefined = PREDEFINED_CATEGORIES.includes(item.category);
    setCustomCategoryMode(!isPredefined);
    setFormData({
      title: item.title || '',
      category: isPredefined ? item.category : PREDEFINED_CATEGORIES[0],
      customCategory: !isPredefined ? (item.category || '') : '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      artisanName: item.artisanName || '',
      materials: item.materials || '',
      featured: !!item.featured
    });
    setIsModalOpen(true);
  };

  // Handle device file upload
  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadFile(file);
      if (res.success && res.url) {
        setFormData(prev => ({ ...prev, imageUrl: res.url }));
      } else {
        alert('ছবি আপলোড ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে।');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('অনুগ্রহ করে হাতের কাজের শিরোনাম (Title) লিখুন।');
      return;
    }
    if (!formData.imageUrl.trim()) {
      alert('অনুগ্রহ করে একটি ছবি আপলোড করুন বা লিংক দিন।');
      return;
    }

    const finalCategory = customCategoryMode 
      ? (formData.customCategory.trim() || 'Handicrafts') 
      : formData.category;

    const payload: Partial<GalleryItem> = {
      title: formData.title,
      category: finalCategory,
      description: formData.description,
      imageUrl: formData.imageUrl,
      artisanName: formData.artisanName,
      materials: formData.materials,
      featured: formData.featured
    };

    try {
      if (editingItem) {
        await api.updateGalleryItem(editingItem.id, payload);
      } else {
        await api.createGalleryItem(payload);
      }
      setIsModalOpen(false);
      loadGallery();
    } catch (err) {
      console.error('Failed to save gallery item:', err);
      alert('হাতের কাজের তথ্য সংরক্ষণ করা যায়নি।');
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteTarget({ id, name: title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteGalleryItem(deleteTarget.id);
      setDeleteTarget(null);
      loadGallery();
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('মুছে ফেলতে সমস্যা হয়েছে।');
    } finally {
      setIsDeleting(false);
    }
  };

  // Unique categories for filter
  const allCategories = ['All', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  const filteredItems = items.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchQuery = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.artisanName && item.artisanName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-600" />
            <span>হাতের কাজের গ্যালারি ম্যানেজমেন্ট (Craft Gallery)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            ডিভাইস (ফোন বা কম্পিউটার) থেকে হস্তশিল্পের ছবি আপলোড করুন এবং ক্যাটাগরি অনুযায়ী সাজান।
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>নতুন হাতের কাজ যোগ করুন (Add Photo)</span>
        </button>
      </div>

      {/* Bengali Guide Box (সহায়িকা) */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-amber-100 text-amber-800 rounded-md shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-slate-900">
              বাংলা নির্দেশিকা: কীভাবে ডিভাইস থেকে ছবি যোগ ও ক্যাটাগরি সেট করবেন?
            </div>
            <p className="text-slate-600 leading-relaxed">
              ১. উপরের <strong>&ldquo;নতুন হাতের কাজ যোগ করুন&rdquo;</strong> বাটনে ক্লিক করুন। <br />
              ২. <strong>&ldquo;ডিভাইস থেকে ছবি আপলোড (Upload Device Image)&rdquo;</strong> বাটনে চাপ দিয়ে আপনার মোবাইল বা কম্পিউটারের ফাইল থেকে ছবি নির্বাচন করুন। ছবি সাথে সাথে আপলোড হয়ে প্রিভিউ দেখাবে। <br />
              ৩. <strong>ক্যাটাগরি</strong> ড্রপডাউন থেকে সিলেক্ট করুন (যেমন: Handmade Jewellery, Terracotta ইত্যাদি) অথবা নতুন ক্যাটাগরি লিখতে চাইলে &ldquo;কাস্টম ক্যাটাগরি লিখুন&rdquo; অপশনে ক্লিক করুন। <br />
              ৪. শিরোনাম ও কারিগরের নাম লিখে <strong>&ldquo;সংরক্ষণ করুন&rdquo;</strong> বাটনে চাপুন। ওয়েবসাইটে তাৎক্ষণিক গ্যালারিতে লাইভ হয়ে যাবে।
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {allCategories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'সব কাজ (All)' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম বা কারিগর দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Gallery Items Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">ছবিগুলো লোড হচ্ছে...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">কোনো হাতের কাজের ছবি পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            আপনার ডিভাইস থেকে নতুন হস্তশিল্পের ছবি আপলোড করতে উপরের বাটনে ক্লিক করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium">
                      {item.category}
                    </span>
                  </div>
                  {item.featured && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>
                  {item.artisanName && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Artisan: <strong>{item.artisanName}</strong></span>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  {item.materials && (
                    <div className="text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      উপাদান: {item.materials}
                    </div>
                  )}
                </div>
              </div>

              {/* Action bar */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteClick(item.id, item.title)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>ডিলিট</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'হাতের কাজের ছবি ও বিবরণ এডিট করুন' : 'নতুন হাতের কাজের ছবি আপলোড করুন (Add to Gallery)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  হাতের কাজের ছবি (Image from Device / Link) <span className="text-red-500">*</span>
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleDeviceUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span>{uploadingImage ? 'ছবি আপলোড হচ্ছে...' : 'ডিভাইস থেকে ছবি আপলোড (Device File)'}</span>
                  </button>
                  <span className="text-[11px] text-slate-400">বা নিচের বক্সে ছবির লিঙ্ক দিন</span>
                </div>

                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://... অথবা ডিভাইস থেকে আপলোডকৃত লিংক"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />

                {formData.imageUrl && (
                  <div className="mt-2 relative w-32 aspect-4/3 rounded-lg overflow-hidden border border-slate-200 shadow-xs">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                      প্রিভিউ
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  হাতের কাজের শিরোনাম (Craft Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="যেমন: হ্যান্ডপেইন্টেড টেরাকোটা নেকলেস সেট"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    ক্যাটাগরি (Category) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomCategoryMode(!customCategoryMode)}
                    className="text-[11px] text-amber-700 hover:underline font-medium"
                  >
                    {customCategoryMode ? 'ড্রপডাউন লিস্ট থেকে বাছুন' : '+ নতুন কাস্টম ক্যাটাগরি লিখুন'}
                  </button>
                </div>

                {!customCategoryMode ? (
                  <select
                    value={formData.category || PREDEFINED_CATEGORIES[0]}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  >
                    {PREDEFINED_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.customCategory || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                    placeholder="নতুন ক্যাটাগরির নাম লিখুন (যেমন: Cane & Bamboo)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                )}
              </div>

              {/* Artisan Name & Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    কারিগর বা ক্লাস্টারের নাম (Artisan)
                  </label>
                  <input
                    type="text"
                    value={formData.artisanName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, artisanName: e.target.value }))}
                    placeholder="যেমন: Kakali Mondal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    ব্যবহৃত উপাদান (Materials)
                  </label>
                  <input
                    type="text"
                    value={formData.materials || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                    placeholder="যেমন: Terracotta Clay, Brass"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  বিবরণ (Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="কাজের বৈশিষ্ট্য, ঐতিহ্য ও কারুকার্যের বর্ণনা..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="featured-check" className="text-xs text-slate-700 font-medium">
                  গ্যালারির শুরুতে ফিচার্ড হিসেবে প্রদর্শন করুন (Featured Item)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  বাতিল করুন (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>সংরক্ষণ করুন (Save to Gallery)</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="গ্যালারি ছবি মুছে ফেলা (Delete Gallery Item)"
        itemName={deleteTarget?.name}
        message="আপনি কি নিশ্চিত যে এই গ্যালারি আইটেমটি স্থায়ীভাবে মুছে ফেলতে চান?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};
