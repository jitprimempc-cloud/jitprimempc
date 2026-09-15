import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Package, 
  X, 
  Check, 
  AlertCircle,
  Save,
  Layers,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { SingleImageUpload, MultipleImageUpload } from '../../components/ImageUploadField';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

export const AdminProductsTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    category: 'Terracotta Jewellery',
    subcategory: '',
    shortDescription: '',
    fullDescription: '',
    craftStory: '',
    primaryImage: '',
    images: [],
    materials: ['Natural terracotta clay', 'Organic pigments'],
    dimensions: '',
    weight: '',
    colours: ['Earth Brown', 'Natural Terracotta'],
    sku: '',
    moq: 50,
    retailPrice: 250,
    bulkPrice: 120,
    priceOnRequest: false,
    tags: ['terracotta', 'jewellery', 'handmade'],
    productionStatus: 'In Stock for Bulk Dispatch',
    leadTime: '7 - 10 Days',
    featured: true,
    hidden: false
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts({ includeHidden: true }),
        api.getCategories(true)
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const randomSku = `JP-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      name: '',
      slug: '',
      category: categories[0]?.id || 'Terracotta Jewellery',
      subcategory: '',
      shortDescription: '',
      fullDescription: '',
      craftStory: '',
      primaryImage: 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=800&q=80',
      images: [],
      materials: ['Natural terracotta clay', 'Organic pigments'],
      dimensions: 'Custom',
      weight: '40g',
      colours: ['Natural Clay'],
      sku: randomSku,
      moq: 50,
      retailPrice: 250,
      bulkPrice: 120,
      priceOnRequest: false,
      tags: ['handmade', 'hastashilpa'],
      productionStatus: 'Made to Order',
      leadTime: '10 - 14 Days',
      featured: false,
      hidden: false
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      ...p,
      name: p.name || '',
      sku: p.sku || '',
      category: p.category || (categories[0]?.id ?? 'terracotta-jewellery'),
      productionStatus: p.productionStatus || '',
      moq: p.moq ?? 50,
      bulkPrice: p.bulkPrice ?? 0,
      leadTime: p.leadTime || '',
      shortDescription: p.shortDescription || '',
      craftStory: p.craftStory || '',
      featured: p.featured || false,
      hidden: p.hidden || false
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteTarget({ id: product.id, name: product.name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteProduct(deleteTarget.id);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('প্রোডাক্ট মুছতে সমস্যা হয়েছে');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async (p: Product) => {
    try {
      const updated = await api.updateProduct(p.id, { featured: !p.featured });
      setProducts(prev => prev.map(item => item.id === p.id ? updated : item));
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleToggleHidden = async (p: Product) => {
    try {
      const updated = await api.updateProduct(p.id, { hidden: !p.hidden });
      setProducts(prev => prev.map(item => item.id === p.id ? updated : item));
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      setError('Product Name and SKU are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, formData);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        const created = await api.createProduct(formData);
        setProducts(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(p => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
            Products & Handcrafted Catalogue
          </h2>
          <p className="text-xs text-slate-500">
            Manage product specs, real device images, MOQ, wholesale prices, and visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Bengali Quick Guide Box */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-slate-700 flex items-start gap-2.5">
        <div className="p-1 bg-amber-100 text-amber-800 rounded shrink-0 mt-0.5">
          <BookOpen className="w-3.5 h-3.5" />
        </div>
        <div className="leading-relaxed">
          <strong className="text-slate-900 font-bold">বাংলা গাইড (Product Guide):</strong> নতুন হস্তশিল্প যোগ করতে <strong>Add New Product</strong> বাটনে চাপুন। পণ্যের নাম, ক্যাটাগরি, খুচরা দাম (Retail), পাইকারি দাম (Bulk) ও সর্বনিম্ন কত পিস (MOQ) অর্ডার নেওয়া যাবে তা লিখুন। ডিভাইস থেকে সরাসরি ছবি আপলোড করা যাবে।
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search || ''}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-hidden focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Category:</span>
          <select
            value={selectedCat || 'all'}
            onChange={e => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-hidden"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Product & SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">MOQ</th>
                <th className="p-3.5">Wholesale Price</th>
                <th className="p-3.5">Production Status</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5">Visibility</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.primaryImage || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('unsplash')) {
                            target.src = 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80';
                          }
                        }}
                      />
                      <div>
                        <span className="font-bold text-slate-900 block line-clamp-1">{product.name}</span>
                        <span className="text-[11px] text-amber-700 font-semibold uppercase">SKU: {product.sku}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-medium text-slate-700">
                    {product.category}
                  </td>

                  <td className="p-3.5 font-bold text-slate-900">
                    {product.moq} pcs
                  </td>

                  <td className="p-3.5 font-bold text-slate-900">
                    {product.priceOnRequest ? "On Request" : `₹${product.bulkPrice || product.retailPrice}`}
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {product.productionStatus || 'Made to Order'}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(product)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        product.featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>

                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleHidden(product)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        product.hidden ? 'text-red-500 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                      }`}
                      title={product.hidden ? 'Product is Hidden' : 'Product is Visible'}
                    >
                      {product.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </td>

                  <td className="p-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-lg"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(product)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
            
            <div className="bg-linear-to-r from-[#0B1A30] to-[#152E54] text-white p-5 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base font-serif-heading">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Handcrafted Product'}
                </h3>
                <p className="text-xs text-slate-300">Upload high-res photos and set wholesale parameters</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {/* IMAGE UPLOADS: MANDATORY FROM DEVICE */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>Product Photos (Upload from Device: Mobile, Tablet, PC)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SingleImageUpload
                    label="Primary Featured Image *"
                    value={formData.primaryImage || ''}
                    onChange={url => setFormData({ ...formData, primaryImage: url })}
                    helperText="This image is displayed in product cards and search results."
                    aspectRatio="square"
                  />
                  <div>
                    <MultipleImageUpload
                      label="Additional Gallery Images"
                      images={formData.images || []}
                      primaryImage={formData.primaryImage || ''}
                      onImagesChange={imgs => setFormData({ ...formData, images: imgs })}
                      onPrimaryChange={pUrl => setFormData({ ...formData, primaryImage: pUrl })}
                    />
                  </div>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Bengal Terracotta Necklace Set"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="JP-1001"
                    value={formData.sku || ''}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              {/* Category & Production Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Craft Category</label>
                  {categories.length > 0 ? (
                    <select
                      value={formData.category || ''}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-medium">
                      No categories found. Please add a category in the Categories tab first before adding a product.
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Production Status</label>
                  <input
                    type="text"
                    placeholder="e.g. In Stock / Ready for Bulk Dispatch / Made to Order"
                    value={formData.productionStatus || ''}
                    onChange={e => setFormData({ ...formData, productionStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Pricing & MOQ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MOQ (Units) *</label>
                  <input
                    type="number"
                    required
                    value={formData.moq ?? ''}
                    onChange={e => setFormData({ ...formData, moq: parseInt(e.target.value, 10) || 50 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wholesale / Bulk Price (₹)</label>
                  <input
                    type="number"
                    value={formData.bulkPrice ?? ''}
                    onChange={e => setFormData({ ...formData, bulkPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lead Time</label>
                  <input
                    type="text"
                    placeholder="7 - 14 Days"
                    value={formData.leadTime || ''}
                    onChange={e => setFormData({ ...formData, leadTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description (for cards)</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription || ''}
                  onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Craft Story & Cultural Heritage</label>
                <textarea
                  rows={2}
                  placeholder="The story behind this artisan technique..."
                  value={formData.craftStory || ''}
                  onChange={e => setFormData({ ...formData, craftStory: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hidden}
                    onChange={e => setFormData({ ...formData, hidden: e.target.checked })}
                    className="w-4 h-4 text-red-500 rounded"
                  />
                  <span>Hide Product from Public Site</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="প্রোডাক্ট মুছে ফেলা (Delete Product)"
        itemName={deleteTarget?.name}
        message="আপনি কি নিশ্চিত যে এই প্রোডাক্টটি ক্যাটালগ ও ওয়েবসাইট থেকে স্থায়ীভাবে মুছে ফেলতে চান?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};
