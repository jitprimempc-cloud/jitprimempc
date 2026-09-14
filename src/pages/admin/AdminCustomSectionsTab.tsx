import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  X, 
  Check, 
  Sparkles,
  Layout
} from 'lucide-react';
import { CustomSection } from '../../types';
import { api } from '../../services/api';

export const AdminCustomSectionsTab: React.FC = () => {
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'text' as CustomSection['type'],
    content: '',
    imageUrl: '',
    videoUrl: '',
    ctaText: '',
    ctaLink: '',
    hidden: false
  });

  const loadSections = async () => {
    setLoading(true);
    try {
      const data = await api.getCustomSections();
      setSections(data || []);
    } catch (err) {
      console.error('Failed to load custom sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleOpenAdd = () => {
    setEditingSection(null);
    setFormData({
      title: '',
      subtitle: '',
      type: 'text',
      content: '',
      imageUrl: '',
      videoUrl: '',
      ctaText: '',
      ctaLink: '',
      hidden: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: CustomSection) => {
    setEditingSection(s);
    setFormData({
      title: s.title,
      subtitle: s.subtitle || '',
      type: s.type || 'text',
      content: s.content || '',
      imageUrl: s.imageUrl || '',
      videoUrl: s.videoUrl || '',
      ctaText: s.ctaText || '',
      ctaLink: s.ctaLink || '',
      hidden: s.hidden || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingSection) {
        await api.updateCustomSection(editingSection.id, formData);
        setSections(prev => prev.map(s => s.id === editingSection.id ? { ...s, ...formData } : s));
      } else {
        const newSec = await api.createCustomSection({
          ...formData,
          orderIndex: sections.length + 1
        });
        setSections(prev => [...prev, newSec]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save section:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this section? / এই সেকশনটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteCustomSection(id);
      setSections(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete section:', err);
    }
  };

  const handleToggleHidden = async (s: CustomSection) => {
    try {
      const updated = !s.hidden;
      await api.updateCustomSection(s.id, { hidden: updated });
      setSections(prev => prev.map(item => item.id === s.id ? { ...item, hidden: updated } : item));
    } catch (err) {
      console.error('Failed to toggle hidden:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Dynamic Custom Sections &bull; কাস্টম সেকশন ব্যবস্থাপনা</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif-heading">
            Custom Website Sections
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            ওয়েবসাইটে যেকোনো নতুন ঘোষণা, বিশেষ কারিগর গল্প, বা প্রমোশনাল টেক্সট সেকশন সহজেই তৈরি করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সেকশন যোগ করুন (Add Section)</span>
        </button>
      </div>

      {/* Sections List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <p className="text-sm">লোড হচ্ছে...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <Layout className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold">কোনো কাস্টম সেকশন তৈরি করা হয়নি।</p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600"
          >
            প্রথম সেকশনটি তৈরি করুন
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map(sec => (
            <div
              key={sec.id}
              className={`bg-white rounded-2xl border ${sec.hidden ? 'border-slate-300 opacity-60' : 'border-slate-200'} p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    Type: {sec.type}
                  </span>
                  {sec.hidden && (
                    <span className="text-[10px] bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded">
                      লুকানো (Hidden)
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {sec.title}
                </h3>
                {sec.subtitle && (
                  <p className="text-xs text-amber-700 font-medium">
                    {sec.subtitle}
                  </p>
                )}
                {sec.content && (
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">
                    {sec.content}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleHidden(sec)}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
                  title={sec.hidden ? 'Show' : 'Hide'}
                >
                  {sec.hidden ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(sec)}
                  className="p-2 text-slate-600 hover:text-amber-600 rounded-lg"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sec.id)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                {editingSection ? 'সেকশন সম্পাদনা করুন (Edit Section)' : 'নতুন সেকশন তৈরি করুন (Add Section)'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  শিরোনাম (Section Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বিশেষ হ্যান্ডমেড কালেকশন"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    উপশিরোনাম (Subtitle)
                  </label>
                  <input
                    type="text"
                    placeholder="সংক্ষিপ্ত উপশিরোনাম"
                    value={formData.subtitle || ''}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    লেআউট ধরন (Type)
                  </label>
                  <select
                    value={formData.type || 'text'}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="text">Text Only</option>
                    <option value="image_text">Image + Text</option>
                    <option value="banner">Promotional Banner</option>
                    <option value="cta">Action / Call to Action</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  ছবি বা ব্যানার লিঙ্ক (Image URL)
                </label>
                <input
                  type="url"
                  placeholder="https://... image url"
                  value={formData.imageUrl || ''}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  মূল বিবরণ বা টেক্সট (Content / Text)
                </label>
                <textarea
                  rows={3}
                  placeholder="বিস্তারিত বিবরণ লিখুন..."
                  value={formData.content || ''}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    বাটনের লেখা (Button Text)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: বিস্তারিত জানুন"
                    value={formData.ctaText || ''}
                    onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    বাটন লিঙ্ক (Button Link)
                  </label>
                  <input
                    type="text"
                    placeholder="/bulk-orders or /products"
                    value={formData.ctaLink || ''}
                    onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
