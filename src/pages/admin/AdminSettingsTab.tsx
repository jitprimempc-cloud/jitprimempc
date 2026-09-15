import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Globe, 
  Clock, 
  Share2, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { SingleImageUpload } from '../../components/ImageUploadField';
import { SocialLogo } from '../../components/SocialLogo';
import { SocialProfile } from '../../types';

export const AdminSettingsTab: React.FC = () => {
  const { settings, navigation, refreshData } = useApp();

  const getInitialSocialProfiles = (): SocialProfile[] => {
    if (Array.isArray(settings?.socialProfiles) && settings.socialProfiles.length > 0) {
      return settings.socialProfiles;
    }
    const list: SocialProfile[] = [];
    const links = settings?.socialLinks;
    if (links?.instagram) {
      list.push({ id: 'soc-ig', platform: 'instagram', label: 'Instagram', url: links.instagram, enabled: true });
    }
    if (links?.facebook) {
      list.push({ id: 'soc-fb', platform: 'facebook', label: 'Facebook', url: links.facebook, enabled: true });
    }
    if (links?.youtube) {
      list.push({ id: 'soc-yt', platform: 'youtube', label: 'YouTube', url: links.youtube, enabled: true });
    }
    if (links?.whatsapp) {
      list.push({ id: 'soc-wa', platform: 'whatsapp', label: 'WhatsApp', url: links.whatsapp, enabled: true });
    }
    if (list.length === 0) {
      list.push(
        { id: 'soc-1', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/', enabled: true },
        { id: 'soc-2', platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/', enabled: true },
        { id: 'soc-3', platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/', enabled: true }
      );
    }
    return list;
  };

  const [formData, setFormData] = useState({
    companyName: settings?.companyName || 'JIT PRIME MPC COMPANY',
    ownerName: settings?.ownerName || 'MONOJIT DEY',
    visitingCardTagline: settings?.visitingCardTagline || settings?.tagline || 'Your Trust Our Priority',
    phone: settings?.phone || '+91 82405 85219',
    secondaryPhone: settings?.secondaryPhone || '+91 80738 36537',
    tertiaryPhone: settings?.tertiaryPhone || '+91 89068 01895',
    whatsappNumber: settings?.whatsappNumber || '+91 82405 85219',
    email: settings?.email || 'monojitdey189@gmail.com',
    fullAddress: settings?.fullAddress || 'Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.',
    businessHours: settings?.businessHours || '24/7 (Open 24 Hours, 7 Days a Week)',
    logoUrl: settings?.logoUrl || '/logo.svg',
    shippingDisclaimer: settings?.shippingDisclaimer || settings?.internationalShippingDisclaimer || 'International shipping, duties, and timelines confirmed per quotation.',
    generalMoq: settings?.generalMoq ?? 25,
    bulkMoq: settings?.bulkMoq ?? 1000,
    showArtisansMenu: settings?.showArtisansMenu ?? true,
    socialProfiles: getInitialSocialProfiles()
  });

  React.useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        companyName: settings.companyName || prev.companyName || '',
        ownerName: settings.ownerName || prev.ownerName || '',
        visitingCardTagline: settings.visitingCardTagline || settings.tagline || prev.visitingCardTagline || '',
        phone: settings.phone || prev.phone || '',
        secondaryPhone: settings.secondaryPhone || prev.secondaryPhone || '',
        tertiaryPhone: settings.tertiaryPhone || prev.tertiaryPhone || '',
        whatsappNumber: settings.whatsappNumber || prev.whatsappNumber || '',
        email: settings.email || prev.email || '',
        fullAddress: settings.fullAddress || prev.fullAddress || '',
        businessHours: settings.businessHours || prev.businessHours || '24/7 (Open 24 Hours, 7 Days a Week)',
        logoUrl: settings.logoUrl || prev.logoUrl || '',
        shippingDisclaimer: settings.shippingDisclaimer || settings.internationalShippingDisclaimer || prev.shippingDisclaimer || '',
        generalMoq: settings.generalMoq ?? prev.generalMoq ?? 25,
        bulkMoq: settings.bulkMoq ?? prev.bulkMoq ?? 1000,
        showArtisansMenu: settings.showArtisansMenu ?? prev.showArtisansMenu ?? true,
        socialProfiles: (Array.isArray(settings.socialProfiles) && settings.socialProfiles.length > 0)
          ? settings.socialProfiles
          : prev.socialProfiles
      }));
    }
  }, [settings]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Social Profile Helpers
  const handleAddSocialProfile = () => {
    const newProfile: SocialProfile = {
      id: `soc-${Date.now()}`,
      platform: 'instagram',
      label: 'New Profile',
      url: 'https://',
      enabled: true
    };
    setFormData(prev => ({
      ...prev,
      socialProfiles: [...prev.socialProfiles, newProfile]
    }));
  };

  const handleUpdateSocialProfile = (index: number, updates: Partial<SocialProfile>) => {
    setFormData(prev => {
      const list = [...prev.socialProfiles];
      list[index] = { ...list[index], ...updates };
      return { ...prev, socialProfiles: list };
    });
  };

  const handleRemoveSocialProfile = (index: number) => {
    setFormData(prev => {
      const list = [...prev.socialProfiles];
      list.splice(index, 1);
      return { ...prev, socialProfiles: list };
    });
  };

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Factory Reset State
  const [resetPassword, setResetPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters / পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match / নতুন পাসওয়ার্ড ও নিশ্চিতকরণ মেলেনি।');
      return;
    }

    setChangingPassword(true);
    try {
      localStorage.setItem('jit_admin_custom_pwd', newPassword);
      await api.changePassword(newPassword);
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleFactoryReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(false);

    if (!resetPassword) {
      setResetError('Please enter admin password / অ্যাডমিন পাসওয়ার্ড দিন।');
      return;
    }

    if (!window.confirm('WARNING: This will delete ALL products, categories, orders, videos, team members etc. Company settings will remain. Are you absolutely sure? / সতর্কীকরণ: এটি সমস্ত পণ্য, ভিডিও, অর্ডার ইত্যাদি মুছে ফেলবে। আপনি কি নিশ্চিত?')) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await api.factoryReset(resetPassword);
      if (res.success) {
        setResetSuccess(true);
        setResetPassword('');
        alert('Factory reset successful! All data cleared.');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setResetError(res.message);
      }
    } catch (err: any) {
      setResetError(err.message || 'Factory reset failed');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      // Synchronize socialLinks object for backward compatibility
      const socialLinks: Record<string, string> = { ...(settings?.socialLinks || {}) };
      formData.socialProfiles.forEach(p => {
        if (p.platform && ['instagram', 'facebook', 'youtube', 'whatsapp', 'linkedin', 'twitter'].includes(p.platform)) {
          socialLinks[p.platform] = p.url;
        }
      });

      await api.updateSettings({
        ...formData,
        socialLinks
      });

      // Synchronize navigation array if loaded
      try {
        const navItems = await api.getNavigation(true);
        if (navItems && navItems.length > 0) {
          const updatedNav = navItems.map(n => 
            (n.route === '/our-artisans' || n.route === '/artisans')
              ? { ...n, hidden: !formData.showArtisansMenu }
              : n
          );
          await api.updateNavigation(updatedNav);
        }
      } catch (navErr) {
        console.warn('Navigation sync skipped:', navErr);
      }

      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
          Company Identity & Visiting Card Settings
        </h2>
        <p className="text-xs text-slate-500">
          Sync physical business card details, contact numbers, and office addresses across the entire application.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm">
        
        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings successfully saved and synchronized across the website!</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Logo Upload */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-800">
              Company Logo / Brand Emblem
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoUrl: '/logo.svg' })}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Use Official Logo (/logo.svg)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoUrl: '/logo-emblem.svg' })}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Use Emblem (/logo-emblem.svg)
              </button>
            </div>
          </div>
          <SingleImageUpload
            value={formData.logoUrl || ''}
            onChange={url => setFormData({ ...formData, logoUrl: url })}
            aspectRatio="square"
            helperText="Upload any image from phone/laptop (auto-compressed) or paste any image URL."
          />
        </div>

        {/* Company & Owner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={formData.companyName || ''}
              onChange={e => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Owner / Proprietor Name *</label>
            <input
              type="text"
              required
              value={formData.ownerName || ''}
              onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
            />
          </div>
        </div>

        {/* Tagline */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Visiting Card Motto / Tagline *</label>
          <input
            type="text"
            required
            value={formData.visitingCardTagline || ''}
            onChange={e => setFormData({ ...formData, visitingCardTagline: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
          />
        </div>

        {/* Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone || ''}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Secondary Phone (2nd Contact)</label>
            <input
              type="tel"
              value={formData.secondaryPhone || ''}
              onChange={e => setFormData({ ...formData, secondaryPhone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tertiary Phone (3rd Contact)</label>
            <input
              type="tel"
              value={formData.tertiaryPhone || ''}
              onChange={e => setFormData({ ...formData, tertiaryPhone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">WhatsApp Hotline *</label>
            <input
              type="tel"
              required
              value={formData.whatsappNumber || ''}
              onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* MOQs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50/60 border border-amber-200 rounded-2xl">
          <div>
            <label className="block font-bold text-slate-800 mb-1">General Minimum Order Quantity (General MOQ)</label>
            <input
              type="number"
              value={formData.generalMoq ?? ''}
              onChange={e => setFormData({ ...formData, generalMoq: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Default: 25 pcs for retail &amp; wholesale sample orders.</span>
          </div>
          <div>
            <label className="block font-bold text-slate-800 mb-1">Bulk Minimum Order Quantity (Bulk MOQ)</label>
            <input
              type="number"
              value={formData.bulkMoq ?? ''}
              onChange={e => setFormData({ ...formData, bulkMoq: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Default: 1000 pcs for institutional &amp; tender bulk batches.</span>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Physical Workshop & Office Address *</label>
          <textarea
            rows={3}
            required
            value={formData.fullAddress || ''}
            onChange={e => setFormData({ ...formData, fullAddress: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Business Hours *</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, businessHours: '24/7 (Open 24 Hours, 7 Days a Week)' })}
                className="text-[11px] text-amber-600 hover:text-amber-800 font-bold underline cursor-pointer"
              >
                Set 24/7 Open
              </button>
            </div>
            <input
              type="text"
              value={formData.businessHours || ''}
              onChange={e => setFormData({ ...formData, businessHours: e.target.value })}
              placeholder="e.g. 24/7 (Open 24 Hours, 7 Days a Week)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Displayed in header bar, contact page, and footer.
            </span>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">International Shipping Disclaimer</label>
            <input
              type="text"
              value={formData.shippingDisclaimer || ''}
              onChange={e => setFormData({ ...formData, shippingDisclaimer: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* Website Navigation Menu Controls (Our Artisans page toggle) */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  ওয়েবসাইট মেনু নিয়ন্ত্রণ: &ldquo;Our Artisans&rdquo; পেজ
                </h4>
                <p className="text-xs text-slate-600">
                  ওয়েবসাইটের হেডার নেভিগেশন ও ফুটার মেনুতে &ldquo;Our Artisans&rdquo; (আমাদের কারিগরবৃন্দ) লিংকটি প্রদর্শন করবেন কি না নির্বাচন করুন।
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={formData.showArtisansMenu}
                onChange={e => setFormData({ ...formData, showArtisansMenu: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
          <div className="text-xs flex items-center gap-2">
            <span className="font-semibold text-slate-700">বর্তমান অবস্থা:</span>
            {formData.showArtisansMenu ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                <Eye className="w-3 h-3" /> মেনু চালু আছে (Visible in Menu)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> মেনু বন্ধ আছে (Hidden from Menu)
              </span>
            )}
          </div>
        </div>

        {/* Footer Social Media Profiles Manager */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Footer Social Media Handles & Logos &bull; ফুটার সোশ্যাল মিডিয়া লিংক ও লোগো
                </h4>
                <p className="text-xs text-slate-500">
                  Instagram, Facebook, YouTube সহ যত খুশি সোশ্যাল মিডিয়া প্রোফাইল যোগ করুন। সবকটির অফিসিয়াল লোগো ফুটারে ফুটে উঠবে।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddSocialProfile}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Profile (নতুন প্রোফাইল যোগ)</span>
            </button>
          </div>

          {/* Social Profiles Dynamic List */}
          <div className="space-y-3">
            {formData.socialProfiles.map((item, idx) => (
              <div 
                key={item.id || idx}
                className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center gap-3"
              >
                {/* Visual Vector Logo Preview */}
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                  <SocialLogo platform={item.platform} size={20} />
                </div>

                {/* Platform Selector */}
                <div className="w-full md:w-36">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Platform / লোগো</label>
                  <select
                    value={item.platform}
                    onChange={e => {
                      const platform = e.target.value as any;
                      const defaultLabels: Record<string, string> = {
                        instagram: 'Instagram',
                        facebook: 'Facebook',
                        youtube: 'YouTube',
                        whatsapp: 'WhatsApp',
                        linkedin: 'LinkedIn',
                        twitter: 'X / Twitter',
                        pinterest: 'Pinterest',
                        telegram: 'Telegram',
                        website: 'Website'
                      };
                      handleUpdateSocialProfile(idx, { 
                        platform, 
                        label: defaultLabels[platform] || item.label || 'Social Link' 
                      });
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 capitalize"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="pinterest">Pinterest</option>
                    <option value="telegram">Telegram</option>
                    <option value="website">Official Website</option>
                    <option value="other">Other Link</option>
                  </select>
                </div>

                {/* Display Label */}
                <div className="w-full md:w-44">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Title / নাম</label>
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={e => handleUpdateSocialProfile(idx, { label: e.target.value })}
                    placeholder="e.g. Official Instagram"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>

                {/* URL Input */}
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">URL / লিংক</label>
                  <input
                    type="url"
                    value={item.url || ''}
                    onChange={e => handleUpdateSocialProfile(idx, { url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>

                {/* Active Checkbox & Remove Button */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0 pt-1 md:pt-4">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled !== false}
                      onChange={e => handleUpdateSocialProfile(idx, { enabled: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>সক্রিয়</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveSocialProfile(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {formData.socialProfiles.length === 0 && (
              <div className="p-4 text-center border-2 border-dashed border-slate-300 rounded-xl text-xs text-slate-500">
                কোনো সোশ্যাল মিডিয়া প্রোফাইল যোগ করা নেই। &ldquo;Add Profile&rdquo; বোতাম টিপে যোগ করুন।
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

      {/* Admin Password Change Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 font-serif-heading">
            Admin Login Password &bull; পাসওয়ার্ড পরিবর্তন
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          বর্তমান পাসওয়ার্ড: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold">Jit@123</span> (আপনি চাইলে নিজের পছন্দের পাসওয়ার্ড পরিবর্তন করতে পারেন)।
        </p>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! পরবর্তী লগইনে নতুন পাসওয়ার্ডটি ব্যবহার করুন।</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              নতুন পাসওয়ার্ড (New Password) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="কমপক্ষে ৬টি অক্ষর"
              value={newPassword || ''}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পাসওয়ার্ড নিশ্চিত করুন (Confirm New Password) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="পাসওয়ার্ডটি পুনরায় লিখুন"
              value={confirmPassword || ''}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {changingPassword ? 'আপডেট হচ্ছে...' : 'পাসওয়ার্ড আপডেট করুন (Update Password)'}
          </button>
        </form>
      </div>

      {/* Factory Reset Card */}
      <div className="bg-red-50 rounded-3xl p-6 sm:p-8 border border-red-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-600" />
          <h3 className="text-base font-bold text-red-900 font-serif-heading">
            Factory Reset &bull; ডেটা রিসেট করুন
          </h3>
        </div>
        <p className="text-xs text-red-700 leading-relaxed max-w-2xl">
          সতর্কীকরণ: এই বাটনে ক্লিক করলে ওয়েবসাইটের সমস্ত ডেটা (প্রোডাক্ট, ভিডিও, অর্ডার, কুপন ইত্যাদি) মুছে যাবে এবং নতুন ফ্রেশ ওয়েবসাইট তৈরি হবে। শুধুমাত্র কোম্পানি ডিটেইলস (Company Identity) অক্ষত থাকবে। এটি বাতিল করা যায় না।
        </p>

        {resetSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>ফ্যাক্টরি রিসেট সফল হয়েছে! পেজটি রিলোড হচ্ছে...</span>
          </div>
        )}

        {resetError && (
          <div className="p-3 bg-red-100 text-red-800 text-xs rounded-xl border border-red-300">
            {resetError}
          </div>
        )}

        <form onSubmit={handleFactoryReset} className="space-y-4 max-w-md pt-2">
          <div>
            <label className="block text-xs font-bold text-red-900 mb-1">
              রিসেট করতে অ্যাডমিন পাসওয়ার্ড দিন (Admin Password) *
            </label>
            <input
              type="password"
              required
              placeholder="অ্যাডমিন পাসওয়ার্ড"
              value={resetPassword}
              onChange={e => setResetPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={isResetting}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {isResetting ? 'রিসেট হচ্ছে...' : 'Factory Reset (সব মুছে ফেলুন)'}
          </button>
        </form>
      </div>

    </div>
  );
};
