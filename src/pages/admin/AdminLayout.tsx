import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Flame, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Settings, 
  Image, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  Layers,
  FileText,
  Bot,
  GraduationCap,
  Star,
  Video,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminCouponsTab } from './AdminCouponsTab';
import { AdminCategoriesTab } from './AdminCategoriesTab';
import { AdminLeadsTab } from './AdminLeadsTab';
import { AdminArtisansTab } from './AdminArtisansTab';
import { AdminWorkersTab } from './AdminWorkersTab';
import { AdminVideosTab } from './AdminVideosTab';
import { AdminBannersTab } from './AdminBannersTab';
import { AdminCustomSectionsTab } from './AdminCustomSectionsTab';
import { AdminTrainingTab } from './AdminTrainingTab';
import { AdminTendersTab } from './AdminTendersTab';
import { AdminCampaignTab } from './AdminCampaignTab';
import { AdminLegalTab } from './AdminLegalTab';
import { AdminAIKnowledgeTab } from './AdminAIKnowledgeTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminMediaTab } from './AdminMediaTab';
import { AdminGalleryTab } from './AdminGalleryTab';
import { AdminBengaliGuideTab } from './AdminBengaliGuideTab';
import { AdminTestimonialsTab } from './AdminTestimonialsTab';

interface AdminLayoutProps {
  onNavigate: (route: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onNavigate }) => {
  const { logout, authUser, settings } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'guide', label: '📖 বাংলা সহায়িকা ও নিয়মাবলী', icon: BookOpen, badge: 'Guide' },
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Catalogue', icon: Package },
    { id: 'coupons', label: 'Coupons & Promo Codes (কুপন কোড)', icon: Tag, badge: 'New' },
    { id: 'gallery', label: 'Craft Gallery (হাতের কাজ)', icon: Image },
    { id: 'videos', label: 'Work & Craft Videos (কাজের ভিডিও)', icon: Video },
    { id: 'categories', label: 'Categories & Groups', icon: Layers },
    { id: 'leads', label: 'B2B Wholesale Leads', icon: Flame },
    { id: 'workers', label: 'Worker Applications (মহিলা আবেদন)', icon: Users },
    { id: 'artisans', label: 'Women Artisans Network', icon: Users },
    { id: 'training', label: 'Training & Livelihood', icon: GraduationCap },
    { id: 'banners', label: 'Banners & Countdown (অফার ব্যানার)', icon: Sparkles },
    { id: 'sections', label: 'Custom Sections (কাস্টম সেকশন)', icon: Layers },
    { id: 'tenders', label: 'Govt. Tenders & RFP', icon: ShieldCheck },
    { id: 'testimonials', label: 'Client Reviews (গ্রাহক রিভিউ)', icon: Star },
    { id: 'campaign', label: 'Durga Puja Campaign', icon: Sparkles },
    { id: 'knowledge', label: 'AI Knowledge & FAQs', icon: Bot },
    { id: 'legal', label: 'Legal & Policies', icon: FileText },
    { id: 'media', label: 'Media & Asset Library', icon: Image },
    { id: 'settings', label: 'Company Identity & Passwords', icon: Settings }
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#0B1A30] text-white border-b-2 border-amber-400 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#071324] border border-amber-400/60 p-0.5 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              <img 
                src={settings?.logoUrl || '/logo.svg'} 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith('/logo.svg')) target.src = '/logo.svg';
                }}
              />
            </div>
            <div>
              <span className="font-extrabold text-sm font-serif-heading tracking-wide block leading-tight">
                {settings?.companyName || 'JIT PRIME MPC COMPANY'}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold block">
                Proprietor: {settings?.ownerName || 'MONOJIT DEY'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>সিস্টেম অনলাইন ও সুরক্ষিত (System Active)</span>
          </div>

          <button
            type="button"
            onClick={() => handleSelectTab('guide')}
            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors px-3 py-1.5 rounded-lg border cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'text-amber-300 bg-amber-400/20 hover:bg-amber-400/30 border-amber-400/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>বাংলা সহায়িকা (User Guide)</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => { logout(); onNavigate('/'); }}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-300 hover:text-red-200 bg-red-950/40 hover:bg-red-900/50 px-3 py-1.5 rounded-lg border border-red-800/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Left Sidebar */}
        <aside className={`
          md:w-64 shrink-0 space-y-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs self-start
          ${mobileMenuOpen ? 'block' : 'hidden md:block'}
        `}>
          <div className="p-2.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            Management Modules
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1A30] text-amber-400 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Tab Content View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'guide' && <AdminBengaliGuideTab onSwitchTab={handleSelectTab} />}
          {activeTab === 'dashboard' && <AdminDashboardTab onSwitchTab={handleSelectTab} />}
          {activeTab === 'products' && <AdminProductsTab />}
          {activeTab === 'coupons' && <AdminCouponsTab />}
          {activeTab === 'gallery' && <AdminGalleryTab />}
          {activeTab === 'videos' && <AdminVideosTab />}
          {activeTab === 'categories' && <AdminCategoriesTab />}
          {activeTab === 'leads' && <AdminLeadsTab />}
          {activeTab === 'workers' && <AdminWorkersTab />}
          {activeTab === 'artisans' && <AdminArtisansTab />}
          {activeTab === 'banners' && <AdminBannersTab />}
          {activeTab === 'sections' && <AdminCustomSectionsTab />}
          {activeTab === 'training' && <AdminTrainingTab />}
          {activeTab === 'tenders' && <AdminTendersTab />}
          {activeTab === 'testimonials' && <AdminTestimonialsTab />}
          {activeTab === 'campaign' && <AdminCampaignTab />}
          {activeTab === 'knowledge' && <AdminAIKnowledgeTab />}
          {activeTab === 'legal' && <AdminLegalTab />}
          {activeTab === 'media' && <AdminMediaTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
        </main>

      </div>

    </div>
  );
};
