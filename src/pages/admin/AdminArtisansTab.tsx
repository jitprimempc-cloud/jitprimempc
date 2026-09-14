import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, MapPin, Award, X, Save, Eye, EyeOff, Globe } from 'lucide-react';
import { api } from '../../services/api';
import { Artisan } from '../../types';
import { useApp } from '../../context/AppContext';
import { SingleImageUpload } from '../../components/ImageUploadField';

export const AdminArtisansTab: React.FC = () => {
  const { settings, navigation, refreshData } = useApp();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<Artisan | null>(null);
  const [menuToggling, setMenuToggling] = useState(false);

  const isMenuVisible = settings?.showArtisansMenu !== false && !(navigation || []).find(n => n.route === '/our-artisans' || n.route === '/artisans')?.hidden;

  const handleToggleArtisansMenu = async () => {
    setMenuToggling(true);
    try {
      const nextVisible = !isMenuVisible;
      await api.updateSettings({ showArtisansMenu: nextVisible });
      if (navigation && navigation.length > 0) {
        const updatedNav = navigation.map(n => 
          (n.route === '/our-artisans' || n.route === '/artisans')
            ? { ...n, hidden: !nextVisible }
            : n
        );
        await api.updateNavigation(updatedNav);
      }
      await refreshData();
    } catch (err) {
      console.error('Failed to toggle menu:', err);
    } finally {
      setMenuToggling(false);
    }
  };

  const [formData, setFormData] = useState<Partial<Artisan>>({
    name: '',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    craft: 'Terracotta Sculpting & Moulding',
    broadLocation: 'Belghoria & Nimta, North 24 Parganas',
    experienceYears: 6,
    story: '',
    skills: ['Clay Preparation', 'Moulding', 'Firing'],
    hidden: false
  });

  const [skillsInput, setSkillsInput] = useState('Clay Preparation, Moulding, Firing');
  const [saving, setSaving] = useState(false);

  const loadArtisans = async () => {
    setLoading(true);
    try {
      const data = await api.getArtisans(true);
      setArtisans(data);
    } catch (err) {
      console.error('Failed to load artisans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtisans();
  }, []);

  const handleOpenAdd = () => {
    setEditingArtisan(null);
    setFormData({
      name: '',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      craft: 'Terracotta Jewellery Crafting',
      broadLocation: 'Nimta, Kolkata',
      experienceYears: 5,
      story: '',
      skills: ['Clay shaping', 'Organic pigmentation'],
      hidden: false
    });
    setSkillsInput('Clay shaping, Organic pigmentation');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Artisan) => {
    setEditingArtisan(a);
    setFormData({
      ...a,
      name: a.name || '',
      craft: a.craft || '',
      experienceYears: a.experienceYears ?? 1,
      broadLocation: a.broadLocation || '',
      story: a.story || '',
      hidden: a.hidden || false
    });
    setSkillsInput(Array.isArray(a.skills) ? a.skills.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this artisan profile?')) return;
    try {
      await api.deleteArtisan(id);
      setArtisans(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const skillsArr = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    try {
      if (editingArtisan) {
        const updated = await api.updateArtisan(editingArtisan.id, { ...formData, skills: skillsArr });
        setArtisans(prev => prev.map(a => a.id === editingArtisan.id ? updated : a));
      } else {
        const created = await api.createArtisan({ ...formData, skills: skillsArr });
        setArtisans(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Public Menu Visibility Control Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isMenuVisible
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : 'bg-amber-50/80 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isMenuVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
          }`}>
            {isMenuVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">
                ওয়েবসাইট মেনু স্ট্যাটাস: &ldquo;Our Artisans&rdquo;
              </h3>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isMenuVisible ? 'bg-emerald-200 text-emerald-900' : 'bg-red-100 text-red-700'
              }`}>
                {isMenuVisible ? 'চালু (Active / Visible)' : 'বন্ধ (Off / Hidden)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isMenuVisible
                ? 'ওয়েবসাইটের হেডার মেনু ও ফোটারে "আমাদের কারিগর" (Our Artisans) লিংক সক্রিয় আছে।'
                : 'ওয়েবসাইট থেকে "আমাদের কারিগর" মেনু লিংকটি বন্ধ করা আছে। (এখানে ডেমো প্রোফাইল সংরক্ষণ আছে, প্রয়োজনমতো চালু করতে পারেন)'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleArtisansMenu}
          disabled={menuToggling}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5 ${
            isMenuVisible
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isMenuVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>
            {menuToggling 
              ? 'আপডেট হচ্ছে...' 
              : isMenuVisible 
                ? 'মেনু বন্ধ করুন (Turn OFF Menu)' 
                : 'মেনু চালু করুন (Turn ON Menu)'}
          </span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
            Artisans & Cluster Profiles ({artisans.length})
          </h2>
          <p className="text-xs text-slate-500">
            Showcase the women artisans and master crafters behind the products.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Artisan Profile</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map(artisan => (
          <div key={artisan.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={artisan.photo}
                alt={artisan.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{artisan.name}</h4>
                <p className="text-xs text-amber-700 font-semibold">{artisan.craft}</p>
                <span className="text-[11px] text-slate-500 block">{artisan.broadLocation} &bull; {artisan.experienceYears} Yrs Exp</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 italic">
              &ldquo;{artisan.story}&rdquo;
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${artisan.hidden ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                {artisan.hidden ? 'Hidden' : 'Visible'}
              </span>

              <div className="space-x-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(artisan)}
                  className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg hover:bg-slate-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(artisan.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="bg-linear-to-r from-[#0B1A30] to-[#152E54] text-white p-5 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-base font-serif-heading">
                {editingArtisan ? 'Edit Artisan Profile' : 'Add Artisan Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <SingleImageUpload
                label="Artisan Portrait Photo (Upload from Device) *"
                value={formData.photo || ''}
                onChange={url => setFormData({ ...formData, photo: url })}
                aspectRatio="portrait"
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">Artisan Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Craft Focus</label>
                  <input
                    type="text"
                    value={formData.craft || ''}
                    onChange={e => setFormData({ ...formData, craft: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={formData.experienceYears ?? ''}
                    onChange={e => setFormData({ ...formData, experienceYears: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Area / Location</label>
                <input
                  type="text"
                  value={formData.broadLocation || ''}
                  onChange={e => setFormData({ ...formData, broadLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skillsInput || ''}
                  onChange={e => setSkillsInput(e.target.value)}
                  placeholder="Clay preparation, Firing, Moulding"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Artisan Craft Journey Story</label>
                <textarea
                  rows={3}
                  value={formData.story || ''}
                  onChange={e => setFormData({ ...formData, story: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
