import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialLogo } from './SocialLogo';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, navigation, categories, currentLanguage, dict } = useApp();

  const companyName = settings?.companyName || 'JIT PRIME MPC COMPANY';
  const ownerName = settings?.ownerName || 'MONOJIT DEY';
  const tagline = settings?.tagline || 'Your Trust Our Priority';
  const primaryPhone = settings?.phone || '+91 82405 85219';
  const secondaryPhone = settings?.secondaryPhone || '+91 80738 36537';
  const tertiaryPhone = settings?.tertiaryPhone || '+91 89068 01895';
  const email = settings?.email || 'monojitdey189@gmail.com';
  const fullAddress = settings?.fullAddress || 'Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.';
  const businessHours = settings?.businessHours || '24/7 (Open 24 Hours, 7 Days a Week)';

  // Check if Our Artisans menu is enabled from admin
  const isArtisansMenuEnabled = settings?.showArtisansMenu !== false && !(navigation || []).find(n => n.route === '/our-artisans' || n.route === '/artisans')?.hidden;

  // Normalize social profiles from settings.socialProfiles or fallback to settings.socialLinks
  const activeSocialProfiles = React.useMemo(() => {
    if (Array.isArray(settings?.socialProfiles) && settings.socialProfiles.length > 0) {
      return settings.socialProfiles.filter(p => p.enabled !== false && p.url && p.url.trim() !== '');
    }
    const fallbackList: Array<{ id: string; platform: string; label: string; url: string }> = [];
    const links = settings?.socialLinks;
    if (links?.instagram) fallbackList.push({ id: 'fallback-ig', platform: 'instagram', label: 'Instagram', url: links.instagram });
    if (links?.facebook) fallbackList.push({ id: 'fallback-fb', platform: 'facebook', label: 'Facebook', url: links.facebook });
    if (links?.youtube) fallbackList.push({ id: 'fallback-yt', platform: 'youtube', label: 'YouTube', url: links.youtube });
    if (links?.whatsapp) fallbackList.push({ id: 'fallback-wa', platform: 'whatsapp', label: 'WhatsApp', url: links.whatsapp });
    if (links?.linkedin) fallbackList.push({ id: 'fallback-li', platform: 'linkedin', label: 'LinkedIn', url: links.linkedin });
    return fallbackList;
  }, [settings]);

  const handleNav = (route: string) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071324] text-slate-300 pt-16 pb-12 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Company & Visiting Card Core */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0B1A30] border border-amber-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
                <img 
                  src={settings?.logoUrl || '/logo.svg'} 
                  alt={companyName} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.endsWith('/logo.svg')) {
                      target.src = '/logo.svg';
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base tracking-wide uppercase font-serif-heading">
                  {companyName}
                </h3>
                <p className="text-amber-400 text-xs font-semibold">
                  {currentLanguage === 'bn' ? 'মালিক:' : currentLanguage === 'hi' ? 'मालिक:' : 'Proprietor:'} {ownerName}
                </p>
              </div>
            </div>

            <div className="inline-block bg-[#0B1A30] border border-amber-500/30 rounded-md px-3 py-1 text-xs text-amber-300 font-medium italic">
              &ldquo;{tagline}&rdquo;
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {currentLanguage === 'bn'
                ? 'আমরা খাঁটি ভারতীয় হস্তশিল্পকে বাল্ক, প্রাতিষ্ঠানিক ও আন্তর্জাতিক ক্রেতাদের সাথে সংযুক্ত করি এবং গ্রামীণ মহিলা কারিগরদের বাস্তব কাজের সুযোগ তৈরি করি।'
                : currentLanguage === 'hi'
                ? 'हम प्रामाणिक भारतीय हस्तशिल्प को थोक, संस्थागत और अंतरराष्ट्रीय खरीदारों से जोड़ते हैं, जिससे महिला कारीगरों के लिए सम्मानजनक अवसर बनते हैं।'
                : 'Connecting authentic Indian handcrafted products with bulk, institutional and international buyers while creating meaningful production opportunities for women artisans.'}
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-[#0E223D] px-3 py-2 rounded-md border border-[#1A365D]">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{dict.hero_tag}</span>
            </div>

            {/* Column 1 Social Icons Row */}
            {activeSocialProfiles.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 font-medium block mb-2">
                  {currentLanguage === 'bn' ? 'সোশ্যাল প্রোফাইল:' : currentLanguage === 'hi' ? 'सोशल प्रोफाइल:' : 'Official Social Handles:'}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {activeSocialProfiles.map(profile => (
                    <a
                      key={profile.id}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-[#0B1A30] hover:bg-slate-800 border border-slate-700 hover:border-amber-400 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-xs"
                      title={profile.label || profile.platform}
                    >
                      <SocialLogo platform={profile.platform} size={16} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2 font-serif-heading">
              {currentLanguage === 'bn' ? 'প্ল্যাটফর্ম নেভিগেশন' : currentLanguage === 'hi' ? 'वेबसाइट नेविगेशन' : 'Explore Platform'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('/')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dict.nav_home}</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('/about')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dict.nav_about}</span>
                </button>
              </li>
              {isArtisansMenuEnabled && (
                <li>
                  <button 
                    type="button" 
                    onClick={() => handleNav('/our-artisans')} 
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                    <span>{dict.nav_artisans}</span>
                  </button>
                </li>
              )}
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('/products')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dict.nav_products}</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('/bulk-orders')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dict.nav_bulk}</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('/government-institutional')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dict.nav_govt}</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('/training-livelihood')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dict.nav_training}</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('/gallery')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dict.nav_gallery}</span>
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleNav('/international-buyers')} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dict.nav_intl}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Craft Categories */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2 font-serif-heading">
              {currentLanguage === 'bn' ? 'হস্তশিল্প সামগ্রী' : currentLanguage === 'hi' ? 'हस्तशिल्प उत्पाद' : 'Hasta Shilpa Crafts'}
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleNav(`/products?category=${cat.id}`)}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-300 cursor-pointer"
                  >
                    <span>&bull;</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => handleNav('/bulk-orders')}
                  className="text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{dict.nav_get_quote}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Verified Contact & Address */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2 font-serif-heading">
              {dict.nav_contact}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-slate-300">
                  {fullAddress}
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a 
                    href={`tel:${primaryPhone.replace(/\s+/g, '')}`} 
                    className="block hover:text-amber-300 transition-colors font-semibold text-white"
                  >
                    {primaryPhone} <span className="text-[10px] text-amber-400 font-normal">({ownerName})</span>
                  </a>
                  <div className="text-slate-400 text-[11px] space-y-0.5">
                    <a href={`tel:${secondaryPhone.replace(/\s+/g, '')}`} className="block hover:text-amber-300 transition-colors">
                      {secondaryPhone}
                    </a>
                    <a href={`tel:${tertiaryPhone.replace(/\s+/g, '')}`} className="block hover:text-amber-300 transition-colors">
                      {tertiaryPhone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a 
                  href={`mailto:${email}`} 
                  className="hover:text-amber-300 transition-colors text-slate-300 break-all"
                >
                  {email}
                </a>
              </div>

              {/* Business Hours 24/7 */}
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Business Hours:</span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      24/7
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                    {businessHours}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${primaryPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${ownerName}, I would like to inquire about handcrafted products from ${companyName}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md transition-colors text-xs shadow-sm"
                >
                  <span>WhatsApp {ownerName}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Social Media Channels Showcase (Instagram, Facebook, YouTube, etc.) */}
        {activeSocialProfiles.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl bg-linear-to-r from-[#0B1A30] via-[#0E223D] to-[#0B1A30] border border-amber-500/20 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center md:text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold font-serif-heading">
                    {currentLanguage === 'bn' 
                      ? 'সোশ্যাল মিডিয়ায় আমাদের সাথে যুক্ত থাকুন' 
                      : currentLanguage === 'hi' 
                        ? 'सोशल मीडिया पर हमारे साथ जुड़ें' 
                        : 'Connect With Jit Prime MPC on Social Media'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {currentLanguage === 'bn' 
                      ? 'আমাদের গ্রামীণ কারিগরদের হস্তশিল্প ভিডিও, নতুন কালেকশন ও রিয়েল-টাইম কাজের আপডেট' 
                      : currentLanguage === 'hi' 
                        ? 'हमारे कारीगरों के नए हस्तशिल्प वीडियो, फोटो व लेटेस्ट अपडेट देखें' 
                        : 'Official handicraft releases, artisan workshop reels, and live craft updates'}
                  </p>
                </div>
              </div>

              {/* Dynamic Logo Buttons Managed by Admin */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {activeSocialProfiles.map(profile => (
                  <a
                    key={profile.id}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400 text-slate-200 hover:text-white transition-all shadow-xs cursor-pointer"
                    title={profile.label || profile.platform}
                  >
                    <span className="text-amber-400 group-hover:scale-115 transition-transform">
                      <SocialLogo platform={profile.platform} size={18} />
                    </span>
                    <span className="text-xs font-semibold capitalize">
                      {profile.label || profile.platform}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Legal & Policy Links */}
        <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => handleNav('/legal/privacy-policy')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>&bull;</span>
            <button type="button" onClick={() => handleNav('/legal/terms-and-conditions')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <span>&bull;</span>
            <button type="button" onClick={() => handleNav('/legal/shipping-policy')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Shipping Policy
            </button>
            <span>&bull;</span>
            <button type="button" onClick={() => handleNav('/legal/returns-and-refund')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Returns & Refund
            </button>
            <span>&bull;</span>
            <button type="button" onClick={() => handleNav('/legal/disclaimer')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Disclaimer
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav('/admin')}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Management</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-6 pt-4 border-t border-slate-900 text-center text-[11px] text-slate-500 space-y-1.5">
          <p>
            &copy; {new Date().getFullYear()} {companyName} &bull; {currentLanguage === 'bn' ? 'মালিক' : currentLanguage === 'hi' ? 'मालिक' : 'Proprietor'}: {ownerName}. All Rights Reserved.
          </p>
          <p className="max-w-3xl mx-auto text-slate-500">
            {currentLanguage === 'bn'
              ? 'আন্তর্জাতিক শিপিং ও নথি নির্দিষ্ট অর্ডারের পরিমাণের ওপর ভিত্তি করে নির্ধারিত হয়। হস্তশিল্প উৎপাদন ও উপার্জন বাজার ও উৎসবের বাস্তব অর্ডারের ওপর নির্ভরশীল।'
              : currentLanguage === 'hi'
              ? 'अंतरराष्ट्रीय शिपिंग और दस्तावेज ऑर्डर की मात्रा पर निर्भर करते हैं। उत्पादन और आय वास्तविक ऑर्डर से जुड़े हैं।'
              : 'International shipping, documentation and delivery schedules are arranged per confirmed quotation. Production opportunities are linked to actual customer orders.'}
          </p>
          <p className="pt-2 text-slate-400 font-medium">
            Design by : <a href="tel:9475388085" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">DigiMoms Agency (9475388085)</a>
          </p>
          <div className="pt-2 text-[10px] text-slate-600/40 select-none tracking-widest uppercase font-mono">
            version 1.4
          </div>
        </div>
      </div>
    </footer>
  );
};
