import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Clock, 
  X, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { BannerItem } from '../../types';
import { api } from '../../services/api';

export const AdminBannersTab: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    ctaText: '',
    ctaLink: '',
    countdownEnabled: true,
    countdownDeadline: '2026-10-15T00:00',
    active: true
  });

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await api.getBanners();
      setBanners(data || []);
    } catch (err) {
      console.error('Failed to load banners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      ctaText: 'Request Bulk Quote',
      ctaLink: '/bulk-orders',
      countdownEnabled: true,
      countdownDeadline: '2026-10-15T00:00',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BannerItem) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || '',
      image: b.image || '',
      ctaText: b.ctaText || 'Request Bulk Quote',
      ctaLink: b.ctaLink || '/bulk-orders',
      countdownEnabled: b.countdownEnabled ?? true,
      countdownDeadline: b.countdownDeadline ? b.countdownDeadline.substring(0, 16) : '2026-10-15T00:00',
      active: b.active ?? true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (editingBanner) {
        await api.updateBanner(editingBanner.id, formData);
        setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...formData } : b));
      } else {
        const newBan = await api.createBanner({
          ...formData,
          orderIndex: banners.length + 1
        });
        setBanners(prev => [...prev, newBan]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save banner:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this banner? / ব্যানারটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteBanner(id);
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Failed to delete banner:', err);
    }
  };

  const handleToggleActive = async (b: BannerItem) => {
    try {
      const updated = !b.active;
      await api.updateBanner(b.id, { active: updated });
      setBanners(prev => prev.map(item => item.id === b.id ? { ...item, active: updated } : item));
    } catch (err) {
      console.error('Failed to toggle active state:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Promotional Banners &amp; Timers &bull; ব্যানার ও অফার ব্যবস্থাপনা</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif-heading">
            Promotional &amp; Festive Banners
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            দুর্গাপূজা, দীপাবলি বা বিশেষ কালেকশনের জন্য কাউন্টডাউন টাইমার সহ অফার ব্যানার নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্যানার যুক্ত করুন (Add Banner)</span>
        </button>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <p className="text-sm">লোড হচ্ছে...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold">কোনো ব্যানার নেই।</p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600"
          >
            প্রথম ব্যানারটি তৈরি করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map(ban => (
            <div
              key={ban.id}
              className={`bg-white rounded-2xl border ${ban.active ? 'border-slate-200' : 'border-slate-300 opacity-60'} overflow-hidden shadow-xs flex flex-col justify-between`}
            >
              <div>
                {/* Banner Preview image */}
                {ban.image && (
                  <div className="h-40 bg-slate-900 overflow-hidden relative">
                    <img
                      src={ban.image}
                      alt={ban.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-bold text-sm text-amber-300">{ban.title}</h4>
                      {ban.subtitle && <p className="text-xs text-slate-200">{ban.subtitle}</p>}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-2">
                  {!ban.image && (
                    <>
                      <h3 className="text-base font-bold text-slate-900">{ban.title}</h3>
                      {ban.subtitle && <p className="text-xs text-slate-500">{ban.subtitle}</p>}
                    </>
                  )}

                  {ban.countdownEnabled && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold bg-amber-50 p-2 rounded-lg">
                      <Clock className="w-3.5 h-3.5" />
                      <span>কাউন্টডাউন শেষ: {ban.countdownDeadline ? new Date(ban.countdownDeadline).toLocaleString() : 'Active'}</span>
                    </div>
                  )}

                  <div className="text-xs text-slate-500 pt-1">
                    বাটন: <span className="font-semibold text-slate-700">{ban.ctaText || 'Request Quote'}</span> &rarr; {ban.ctaLink}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleActive(ban)}
                  className="flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  {ban.active ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>সক্রিয় (Active)</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <EyeOff className="w-4 h-4" />
                      <span>বন্ধ (Inactive)</span>
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(ban)}
                    className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ban.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                {editingBanner ? 'ব্যানার সম্পাদনা করুন (Edit Banner)' : 'নতুন ব্যানার তৈরি করুন (Add Banner)'}
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
                  ব্যানার শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: দুর্গাপূজা স্পেশাল কালেকশন ২০২৬"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  উপশিরোনাম (Subtitle)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: পাইকারি ও বাল্ক ক্রেতাদের জন্য বিশেষ ছাড়"
                  value={formData.subtitle || ''}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  ব্যানার ছবির লিঙ্ক (Image URL)
                </label>
                <input
                  type="url"
                  placeholder="https://... image url"
                  value={formData.image || ''}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
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
                    value={formData.ctaLink || ''}
                    onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 text-xs">
                  <input
                    type="checkbox"
                    checked={formData.countdownEnabled}
                    onChange={e => setFormData({ ...formData, countdownEnabled: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                  />
                  <span>কাউন্টডাউন টাইমার চালু রাখুন (Enable Countdown)</span>
                </label>

                {formData.countdownEnabled && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      কাউন্টডাউন শেষ হওয়ার তারিখ ও সময় (Deadline)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.countdownDeadline || ''}
                      onChange={e => setFormData({ ...formData, countdownDeadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="banActive"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                />
                <label htmlFor="banActive" className="font-semibold text-slate-800 text-xs cursor-pointer">
                  ব্যানারটি ওয়েবসাইটে সক্রিয় রাখুন (Active on Website)
                </label>
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
