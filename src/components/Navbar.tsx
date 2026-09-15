import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ChevronDown, 
  ChevronRight, 
  HeartHandshake,
  Package,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { settings, navigation, currentLanguage, setLanguage, dict, openBulkModal, isAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const primaryPhone = settings?.phone || '+91 82405 85219';
  const secondaryPhone = settings?.secondaryPhone || '+91 80738 36537';
  const tertiaryPhone = settings?.tertiaryPhone || '+91 89068 01895';
  const companyName = settings?.companyName || 'JIT PRIME MPC COMPANY';
  const ownerName = settings?.ownerName || 'MONOJIT DEY';

  const tagline = currentLanguage === 'bn' 
    ? 'আপনার বিশ্বাস আমাদের অগ্রাধিকার' 
    : currentLanguage === 'hi' 
      ? 'आपका विश्वास हमारी प्राथमिकता' 
      : (settings?.visitingCardTagline || 'Your Trust Our Priority');

  // Primary visible links
  const primaryLinks = [
    { label: dict.nav_home, route: '/' },
    { label: dict.nav_products, route: '/products' },
    { label: dict.nav_gallery, route: '/gallery', isNew: true },
    { label: dict.nav_women_work, route: '/training-livelihood', highlight: true },
    { label: dict.nav_bulk, route: '/bulk-orders' },
  ];

  // Check if Our Artisans is enabled from admin
  const isArtisansMenuEnabled = settings?.showArtisansMenu !== false && !(navigation || []).find(n => n.route === '/our-artisans' || n.route === '/artisans')?.hidden;

  // Secondary links grouped neatly in dropdown
  const secondaryLinks = [
    { label: dict.nav_govt, route: '/government-institutional' },
    { label: dict.nav_international, route: '/international-buyers' },
    { label: dict.nav_about, route: '/about' },
    { label: dict.nav_contact, route: '/contact' },
  ];

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) {
        setPhoneDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSecondaryActive = secondaryLinks.some(link => link.route === currentRoute);

  return (
    <header className="w-full sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Ultra-compact Top Bar with 3 Contacts and Language Selector */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 font-medium text-amber-400">
              <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Hasta Shilpa &bull; Govt Tender</span>
            </span>
            <span className="text-slate-700 hidden md:inline">|</span>

            {/* Primary Phone */}
            <a 
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`} 
              className="inline-flex items-center gap-1 hover:text-white transition-colors text-slate-200 font-medium"
              title="Primary Contact"
            >
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{primaryPhone}</span>
            </a>

            {/* Additional Contact Numbers Dropdown */}
            <div className="relative hidden sm:inline-block" ref={phoneRef}>
              <button
                type="button"
                onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>+2 Lines</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>

              {phoneDropdownOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-xl z-50 text-xs">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 px-1 font-semibold">
                    {dict.all_contacts_label}
                  </div>
                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800 text-slate-200 font-semibold"
                  >
                    <span>{primaryPhone}</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded">Primary</span>
                  </a>
                  <a
                    href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800 text-slate-300"
                  >
                    <span>{secondaryPhone}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded">Secondary</span>
                  </a>
                  <a
                    href={`tel:${tertiaryPhone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800 text-slate-300"
                  >
                    <span>{tertiaryPhone}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded">Tertiary</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Business Hours Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-[10px]">
              <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{settings?.businessHours || '24/7 (Always Open)'}</span>
            </div>

            {/* Language Selector: English / বাংলা / हिन्दी */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-md p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  currentLanguage === 'en' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Switch to English"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  currentLanguage === 'bn' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
                title="বাংলা ভাষায় দেখুন"
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  currentLanguage === 'hi' 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
                title="हिन्दी भाषा में देखें"
              >
                हिन्दी
              </button>
            </div>

            {/* Admin link */}
            <button
              type="button"
              onClick={() => handleNav('/admin')}
              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors ${
                isAdmin 
                  ? 'bg-emerald-700 text-white font-medium' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-2.5 h-2.5" />
              <span>{isAdmin ? 'Admin' : dict.nav_admin}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand identity / Logo */}
        <button 
          type="button"
          onClick={() => handleNav('/')}
          className="text-left flex items-center gap-3 focus:outline-hidden group shrink-0 cursor-pointer"
        >
          {/* Brand identity / Logo */}
          <div className="h-10 w-10 sm:w-11 sm:h-11 shrink-0 rounded-xl overflow-hidden bg-[#0B1A30] border border-amber-500/40 p-1 flex items-center justify-center shadow-xs">
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
            <div className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors uppercase font-serif-heading">
              {companyName}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-normal">
              <span className="font-semibold text-slate-700">{ownerName}</span>
              <span>&bull;</span>
              <span className="text-amber-700 font-medium italic">{tagline}</span>
            </div>
          </div>
        </button>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {primaryLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNav(item.route)}
                className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'text-slate-950 font-semibold bg-slate-100'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                } ${item.highlight ? 'text-amber-800 font-semibold' : ''}`}
              >
                {item.highlight && <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />}
                {item.route === '/gallery' && <ImageIcon className="w-3.5 h-3.5 text-slate-600" />}
                <span>{item.label}</span>
                {item.isNew && (
                  <span className="text-[9px] px-1 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-xs ml-0.5">
                    NEW
                  </span>
                )}
              </button>
            );
          })}

          {/* More Dropdown for secondary pages */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                isSecondaryActive
                  ? 'text-slate-950 font-semibold bg-slate-100'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <span>{dict.nav_more}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {secondaryLinks.map((link) => {
                  const isActive = currentRoute === link.route;
                  return (
                    <button
                      key={link.route}
                      type="button"
                      onClick={() => handleNav(link.route)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-slate-100 text-slate-950 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Primary Action Button (Right Side) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => openBulkModal()}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-md shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>{dict.nav_get_quote}</span>
          </button>
        </div>

        {/* Mobile menu trigger & Quick CTA */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => openBulkModal()}
            className="px-2.5 py-1.5 bg-slate-900 text-white font-medium text-[11px] rounded-md flex items-center gap-1"
          >
            <Package className="w-3 h-3 text-amber-400" />
            <span>{dict.nav_get_quote}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 shadow-md max-h-[85vh] overflow-y-auto">
          {/* Mobile Language Selector */}
          <div className="pb-2 border-b border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Language / ভাষা / भाषा
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-1.5 text-xs rounded font-medium text-center ${
                  currentLanguage === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-700'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`py-1.5 text-xs rounded font-medium text-center ${
                  currentLanguage === 'bn' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-700'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-1.5 text-xs rounded font-medium text-center ${
                  currentLanguage === 'hi' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-700'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            Menu Navigation
          </div>
          
          {primaryLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNav(item.route)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                  isActive 
                    ? 'bg-slate-100 text-slate-950 font-semibold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.highlight && <HeartHandshake className="w-4 h-4 text-amber-600" />}
                  {item.route === '/gallery' && <ImageIcon className="w-4 h-4 text-slate-600" />}
                  <span>{item.label}</span>
                </div>
                {item.isNew && (
                  <span className="text-[9px] px-1 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-xs">
                    NEW
                  </span>
                )}
              </button>
            );
          })}

          <div className="border-t border-slate-100 my-1 pt-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 py-1">
              Company &amp; Institutional
            </div>
            {secondaryLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleNav(item.route)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                    isActive 
                      ? 'bg-slate-100 text-slate-950 font-semibold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 mt-2 space-y-2">
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); openBulkModal(); }}
              className="w-full py-2 bg-slate-900 text-white font-medium text-sm rounded-md shadow-xs text-center flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>{dict.nav_get_quote}</span>
            </button>
            <div className="text-xs text-slate-500 px-2 pt-2 border-t border-slate-100 space-y-1">
              <p className="font-semibold text-slate-800">{companyName}</p>
              <p>Proprietor: {ownerName}</p>
              <p className="text-slate-700 font-medium">📞 {primaryPhone} | {secondaryPhone}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
