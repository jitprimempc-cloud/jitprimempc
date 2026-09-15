import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  Plus, 
  Check, 
  AlertCircle,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { Category } from '../../types';
import { SingleImageUpload } from '../../components/ImageUploadField';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

export const AdminCategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    hidden: false,
    orderIndex: 1
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories(true);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=800&q=80',
      hidden: false,
      orderIndex: categories.length + 1
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({
      ...c,
      name: c.name || '',
      slug: c.slug || '',
      description: c.description || '',
      image: c.image || '',
      hidden: c.hidden ?? false,
      orderIndex: c.orderIndex ?? 1
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteTarget({ id: category.id, name: category.name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteCategory(deleteTarget.id);
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleHidden = async (c: Category) => {
    try {
      const updated = await api.updateCategory(c.id, { hidden: !c.hidden });
      setCategories(prev => prev.map(item => item.id === c.id ? updated : item));
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Category name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      if (editingCategory) {
        const updated = await api.updateCategory(editingCategory.id, {
          ...formData,
          slug
        });
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updated : c));
      } else {
        const created = await api.createCategory({
          ...formData,
          slug
        });
        setCategories(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <span>Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Catalogue Structure</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-slate-900">
            Categories & Collections
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize handmade jewellery, terracotta, Dokra brass, and textile product groups.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#0B1A30] hover:bg-[#152E54] text-amber-400 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(c => (
          <div
            key={c.id}
            className={`bg-white rounded-2xl border ${c.hidden ? 'border-dashed border-slate-300 opacity-60' : 'border-slate-200'} overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between`}
          >
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                  No Banner Image
                </div>
              )}

              {c.hidden && (
                <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Hidden from Public
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">
                  ID: {c.id} &bull; Slug: /{c.slug}
                </span>
                <h3 className="font-bold text-base text-slate-900">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {c.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleHidden(c)}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    c.hidden ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title={c.hidden ? "Publish Category" : "Hide Category"}
                >
                  {c.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{c.hidden ? 'Hidden' : 'Visible'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(c)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-[#0B1A30] text-white p-5 flex items-center justify-between border-b-2 border-amber-400">
              <h3 className="font-bold text-base">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Terracotta Jewellery, Dokra Brass Art"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Custom Slug (Optional)</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated from name if left empty"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for catalogues and website navigation..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Banner Image Upload with Device Support */}
              <SingleImageUpload
                label="Category Banner Image"
                helperText="Upload JPG, PNG or WEBP from Mobile, Tablet, or PC."
                value={formData.image || ''}
                onChange={url => setFormData({ ...formData, image: url })}
                aspectRatio="wide"
              />

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catHidden"
                  checked={formData.hidden || false}
                  onChange={e => setFormData({ ...formData, hidden: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 border-slate-300 focus:ring-amber-400"
                />
                <label htmlFor="catHidden" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Hide this category from public browsing
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="ক্যাটাগরি মুছে ফেলা (Delete Category)"
        itemName={deleteTarget?.name}
        message="আপনি কি নিশ্চিত যে এই ক্যাটাগরি এবং এর সম্পর্কিত তথ্য স্থায়ীভাবে মুছে ফেলতে চান?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};
