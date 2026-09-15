import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  Check, 
  AlertCircle, 
  X, 
  Image as ImageIcon,
  Sparkles,
  LayoutGrid,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { TeamMember, TeamSectionSettings } from '../../types';
import { SingleImageUpload } from '../../components/ImageUploadField';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

export const AdminTeamTab: React.FC = () => {
  const { settings, refreshData } = useApp();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Team Section & Group Photo Settings
  const [teamSettings, setTeamSettings] = useState<TeamSectionSettings>({
    enabled: true,
    sectionTitle: 'Our Dedicated Team & Leadership (আমাদের টিম)',
    sectionSubtitle: 'আমাদের কারিগরবৃন্দ, প্রোডাকশন ম্যানেজার ও কর্মীবাহিনীর সম্মিলিত প্রয়াস',
    displayLayout: 'square', // 'square' (Flipkart style) or 'wide' (YouTube style)
    groupPhotoEnabled: true,
    groupPhoto: '',
    groupPhotoTitle: 'Jit Prime MPC Production & Artisan Cluster Team',
    groupPhotoDescription: 'আমাদের বেলঘরিয়া, নিমতা ওয়ার্কশপের ৪০+ গ্রামীণ মহিলা কারিগর ও উৎপাদন টিম।'
  });

  // Modal State for Photo / Member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    caption: '',
    photo: '',
    bio: '',
    aspectRatio: 'square',
    orderIndex: 1,
    hidden: false
  });
  const [savingMember, setSavingMember] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load initial settings and team list
  useEffect(() => {
    if (settings?.teamSettings) {
      setTeamSettings({
        enabled: settings.teamSettings.enabled !== false,
        sectionTitle: settings.teamSettings.sectionTitle || 'Our Dedicated Team & Leadership (আমাদের টিম)',
        sectionSubtitle: settings.teamSettings.sectionSubtitle || 'আমাদের কারিগরবৃন্দ, প্রোডাকশন ম্যানেজার ও কর্মীবাহিনীর সম্মিলিত প্রয়াস',
        displayLayout: settings.teamSettings.displayLayout || 'square',
        groupPhotoEnabled: settings.teamSettings.groupPhotoEnabled !== false,
        groupPhoto: settings.teamSettings.groupPhoto || '',
        groupPhotoTitle: settings.teamSettings.groupPhotoTitle || 'Jit Prime MPC Production & Artisan Cluster Team',
        groupPhotoDescription: settings.teamSettings.groupPhotoDescription || 'আমাদের বেলঘরিয়া, নিমতা ওয়ার্কশপের ৪০+ গ্রামীণ মহিলা কারিগর ও উৎপাদন টিম।'
      });
    }
  }, [settings]);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await api.getTeam(true);
      setTeam(data || []);
    } catch (err) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  // Save Team Section & Layout Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      await api.updateSettings({
        teamSettings: teamSettings
      });
      await refreshData();
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save team settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  // Open Add Photo / Member
  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      caption: '',
      photo: '',
      bio: '',
      aspectRatio: teamSettings.displayLayout || 'square',
      orderIndex: team.length + 1,
      hidden: false
    });
    setMemberError(null);
    setIsModalOpen(true);
  };

  // Open Edit Photo / Member
  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      ...member,
      aspectRatio: member.aspectRatio || teamSettings.displayLayout || 'square'
    });
    setMemberError(null);
    setIsModalOpen(true);
  };

  // Save Photo / Member
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo?.trim()) {
      setMemberError('অনুগ্রহ করে ডিভাইসের ফাইল থেকে অথবা লিঙ্ক পেস্ট করে একটি ছবি দিন (Photo is required)');
      return;
    }

    setSavingMember(true);
    setMemberError(null);
    try {
      const payload: Partial<TeamMember> = {
        ...formData,
        name: formData.name?.trim() || formData.caption?.trim() || 'Team Member Photo',
        role: formData.role?.trim() || '',
        caption: formData.caption?.trim() || formData.name?.trim() || ''
      };

      if (editingMember) {
        await api.updateTeamMember(editingMember.id, payload);
      } else {
        await api.createTeamMember(payload);
      }
      await loadTeam();
      await refreshData();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save team member photo:', err);
      setMemberError(err.message || 'ছবি সেভ করতে সমস্যা হয়েছে');
    } finally {
      setSavingMember(false);
    }
  };

  // Toggle Hidden Status
  const handleToggleHidden = async (member: TeamMember) => {
    try {
      await api.updateTeamMember(member.id, { hidden: !member.hidden });
      await loadTeam();
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteTeamMember(deleteTarget.id);
      setTeam(prev => prev.filter(m => m.id !== deleteTarget.id));
      await refreshData();
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete team member photo:', err);
      alert('মুছে ফেলতে সমস্যা হয়েছে।');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>About Page &bull; Team Member Photos</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-heading">
            টিম মেম্বার ও টিম ফটো গ্যালারি (Our Team Photos)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            ওয়েবসাইটের About পেজে টিম মেম্বারদের বড় বড় সাইজের ছবি (Flipkart প্রোডাক্টের মতো বর্গাকার বা YouTube থাম্বনেল সাইজ) যত খুশি যোগ করুন। ডিভাইস থেকে সরাসরি ছবি আপলোড করতে পারবেন। নাম লেখা ঐচ্ছিক।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 bg-[#0B1A30] hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-sm transition-all cursor-pointer shrink-0 border border-amber-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন টিম ফটো যোগ করুন (Add Photo)</span>
        </button>
      </div>

      {/* 1. Display Settings: Flipkart Square vs YouTube Thumbnail */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                সেকশন প্রদর্শন ও ছবির সাইজ লেআউট (Display & Size Layout)
              </h3>
              <p className="text-xs text-slate-500">
                About পেজে টিমের ফটোগুলো কোন সাইজে বড় বড় করে দেখানো হবে তা নির্ধারণ করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={teamSettings.enabled}
                onChange={e => setTeamSettings({ ...teamSettings, enabled: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-700">
                {teamSettings.enabled ? 'সেকশন চালু (Enabled)' : 'সেকশন বন্ধ (Disabled)'}
              </span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সেকশন শিরোনাম (Section Title)
              </label>
              <input
                type="text"
                value={teamSettings.sectionTitle || ''}
                onChange={e => setTeamSettings({ ...teamSettings, sectionTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                placeholder="যেমন: Our Dedicated Team & Leadership"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সেকশন সাবটাইটেল (Section Subtitle)
              </label>
              <input
                type="text"
                value={teamSettings.sectionSubtitle || ''}
                onChange={e => setTeamSettings({ ...teamSettings, sectionSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                placeholder="যেমন: আমাদের কারিগর ও উৎপাদন টিম..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ছবির সাইজ ফরম্যাট (Photo Size Format)
              </label>
              <select
                value={teamSettings.displayLayout || 'square'}
                onChange={e => setTeamSettings({ ...teamSettings, displayLayout: e.target.value as 'square' | 'wide' })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
              >
                <option value="square">বড় বর্গাকার সাইজ (Flipkart Product 1:1 Square)</option>
                <option value="wide">থাম্বনেল সাইজ (YouTube Thumbnail 16:9 Widescreen)</option>
              </select>
            </div>
          </div>

          {/* Group Photo Option */}
          <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>সম্মিলিত অল-টিম গ্রুপ ব্যানার ফটো (All Team Collective Banner - ঐচ্ছিক)</span>
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  একটি বড় গ্রুপ ছবি আপলোড করে টিমের সম্মিলিত ব্যানার ফটো About পেজে হাইলাইট করতে পারেন।
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={teamSettings.groupPhotoEnabled}
                  onChange={e => setTeamSettings({ ...teamSettings, groupPhotoEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {teamSettings.groupPhotoEnabled && (
              <div className="space-y-4 pt-2">
                <SingleImageUpload
                  label="গ্রুপ ফটো আপলোড (Device বা URL থেকে আপলোড করুন)"
                  helperText="কম্পিউটার/মোবাইল থেকে সরাসরি গ্রুপ ছবি সিলেক্ট করুন।"
                  value={teamSettings.groupPhoto || ''}
                  onChange={url => setTeamSettings({ ...teamSettings, groupPhoto: url })}
                  aspectRatio="wide"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      গ্রুপ ছবির শিরোনাম (Group Photo Title)
                    </label>
                    <input
                      type="text"
                      value={teamSettings.groupPhotoTitle || ''}
                      onChange={e => setTeamSettings({ ...teamSettings, groupPhotoTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm"
                      placeholder="যেমন: Jit Prime MPC Production & Artisan Cluster Team"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      গ্রুপ ছবির বিবরণ (Caption / Description)
                    </label>
                    <input
                      type="text"
                      value={teamSettings.groupPhotoDescription || ''}
                      onChange={e => setTeamSettings({ ...teamSettings, groupPhotoDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm"
                      placeholder="যেমন: আমাদের বেলঘরিয়া, নিমতা ওয়ার্কশপের কারিগর ও উৎপাদন টিম"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {settingsSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> সেটিংস সফলভাবে সংরক্ষিত হয়েছে!
              </span>
            )}
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সেভ করুন'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Team Photos Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <span>টিম মেম্বারদের ছবি সমূহ ({team.length}টি ফটো সংরক্ষিত)</span>
            </h3>
            <p className="text-xs text-slate-500">
              যত খুশি টিম মেম্বারদের বড় বড় ছবি আপলোড করুন। ওয়েবসাইট About পেজে বড় কার্ডে প্রদর্শিত হবে।
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-[#0B1A30] hover:bg-slate-800 text-amber-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন টিম ফটো যোগ করুন</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium animate-pulse">
            টিম ফটো লোড হচ্ছে...
          </div>
        ) : team.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-600 font-bold">
              এখনও কোনো টিম মেম্বারের ছবি যোগ করা হয়নি।
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              উপরে &ldquo;নতুন টিম ফটো যোগ করুন&rdquo; বাটনে ক্লিক করে যত খুশি বড় বড় ছবি যোগ করুন।
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-2 inline-flex items-center gap-2 bg-[#0B1A30] text-amber-400 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>প্রথম টিম ফটো আপলোড করুন</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Photo Preview - Large format */}
                <div className={`w-full bg-slate-900 relative overflow-hidden ${
                  (member.aspectRatio || teamSettings.displayLayout) === 'wide'
                    ? 'aspect-16/9' 
                    : 'aspect-square'
                }`}>
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name || member.caption || 'Team Member'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs">কোনো ছবি নেই</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-amber-400 border border-amber-400/40">
                      {(member.aspectRatio || teamSettings.displayLayout) === 'wide' ? '16:9 Thumbnail' : '1:1 Square'}
                    </span>
                    {member.orderIndex !== undefined && (
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                        #{member.orderIndex}
                      </span>
                    )}
                  </div>

                  {member.hidden && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold">
                      Hidden
                    </div>
                  )}
                </div>

                {/* Caption / Information */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                      {member.name || member.caption || 'টিম মেম্বার ছবি'}
                    </h4>
                    {member.role && (
                      <p className="text-xs font-semibold text-amber-700 mt-0.5">
                        {member.role}
                      </p>
                    )}
                    {member.caption && member.caption !== member.name && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {member.caption}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                    <button
                      type="button"
                      onClick={() => handleToggleHidden(member)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1 ${
                        member.hidden 
                          ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {member.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{member.hidden ? 'Hidden' : 'Visible'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(member)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                        title="সম্পাদনা করুন (Edit)"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ id: member.id, name: member.name || member.caption || 'টিম মেম্বার ছবি' })}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                        title="স্থায়ীভাবে ডিলিট করুন (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Add / Edit Member Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-[#0B1A30] text-white flex items-center justify-between border-b border-amber-400/40">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base font-serif-heading text-white">
                  {editingMember ? 'টিম ফটো সম্পাদনা (Edit Team Photo)' : 'নতুন টিম ফটো যোগ করুন (Add Team Photo)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {memberError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{memberError}</span>
                </div>
              )}

              {/* Photo Upload with device & URL support */}
              <SingleImageUpload
                label="টিম মেম্বার / টিমের ছবি (Device Upload or Image URL) *"
                helperText="ডিভাইস (মোবাইল / কম্পিউটার) থেকে সরাসরি ছবি আপলোড করুন অথবা কোনো ছবির লিঙ্ক পেস্ট করুন।"
                value={formData.photo || ''}
                onChange={url => setFormData({ ...formData, photo: url })}
                aspectRatio={formData.aspectRatio === 'wide' ? 'wide' : 'square'}
              />

              {/* Size Ratio Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ছবির সাইজ রূপরেখা (Aspect Ratio / Size)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, aspectRatio: 'square' })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.aspectRatio !== 'wide'
                        ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="w-6 h-6 border-2 border-current rounded mx-auto mb-1.5"></div>
                    <span className="text-xs block">বড় বর্গাকার (Flipkart 1:1)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, aspectRatio: 'wide' })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.aspectRatio === 'wide'
                        ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="w-8 h-4.5 border-2 border-current rounded mx-auto mb-1.5"></div>
                    <span className="text-xs block">থাম্বনেল (YouTube 16:9)</span>
                  </button>
                </div>
              </div>

              {/* Caption or Title (Optional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ছবির শিরোনাম বা নাম (Caption / Name - ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value, caption: e.target.value })}
                  placeholder="যেমন: কারিগর ও উৎপাদন টিম, অথবা মেম্বারের নাম (ঐচ্ছিক)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  আলাদা আলাদা নাম লেখার কোনো বাধ্যবাধকতা নেই, চাইলে খালিও রাখতে পারেন।
                </p>
              </div>

              {/* Role / Designation (Optional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  পদবী বা সাব-টাইটেল (Role / Subtitle - ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  placeholder="যেমন: Production Specialist, Dokra Craft Team (ঐচ্ছিক)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {/* Bio / Description (Optional) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  সংক্ষিপ্ত ক্যাপশন বা বিবরণ (Description - ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={formData.bio || ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="কাজের ক্ষেত্র বা সংক্ষিপ্ত নোট..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ক্রমিক নম্বর (Order)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.orderIndex || 1}
                    onChange={e => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.hidden || false}
                      onChange={e => setFormData({ ...formData, hidden: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-700 text-xs">
                      লুকিয়ে রাখুন (Hide)
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={savingMember}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingMember ? 'সেভ হচ্ছে...' : 'ছবি সেভ করুন (Save)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Native in-app modal, works 100% in iframe) */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="টিম ফটো মুছে ফেলা (Delete Team Photo)"
        itemName={deleteTarget?.name}
        message="আপনি কি নিশ্চিত যে এই টিম ফটোটি ওয়েবসাইট থেকে স্থায়ীভাবে মুছে ফেলতে চান?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
