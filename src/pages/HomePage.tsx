import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Package, 
  ArrowRight, 
  Phone, 
  CheckCircle2, 
  Star, 
  ChevronDown, 
  MessageSquarePlus, 
  Bot, 
  Video, 
  Play, 
  HeartHandshake, 
  ShieldCheck, 
  Globe2, 
  Users, 
  PackageCheck, 
  Building2, 
  Wrench, 
  Palette, 
  Layers, 
  Sliders, 
  FileCheck, 
  PhoneCall, 
  BookOpen, 
  Award, 
  Flame, 
  Briefcase, 
  Truck, 
  Coins, 
  TrendingUp, 
  ArrowUpRight, 
  MessageCircle,
  Clapperboard,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  HomepageContent, 
  Product, 
  FAQ, 
  Testimonial, 
  GalleryItem, 
  VideoItem, 
  BannerItem, 
  CustomSection 
} from '../types';
import { WriteReviewModal } from '../components/WriteReviewModal';
import { SectionHeaderDecor } from '../components/SectionHeaderDecor';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

// Icon helper
const getIcon = (name: string) => {
  switch (name) {
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
    case 'Users': return <Users className="w-5 h-5 text-amber-500" />;
    case 'PackageCheck': return <PackageCheck className="w-5 h-5 text-amber-500" />;
    case 'Building2': return <Building2 className="w-5 h-5 text-amber-500" />;
    case 'Wrench': return <Wrench className="w-5 h-5 text-amber-500" />;
    case 'Globe2': return <Globe2 className="w-5 h-5 text-amber-500" />;
    case 'Palette': return <Palette className="w-6 h-6 text-amber-500" />;
    case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-amber-500" />;
    case 'Layers': return <Layers className="w-6 h-6 text-amber-500" />;
    case 'Sliders': return <Sliders className="w-6 h-6 text-amber-500" />;
    case 'FileCheck': return <FileCheck className="w-6 h-6 text-amber-500" />;
    case 'PhoneCall': return <PhoneCall className="w-6 h-6 text-amber-500" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5 text-amber-500" />;
    case 'Award': return <Award className="w-5 h-5 text-amber-500" />;
    case 'Flame': return <Flame className="w-5 h-5 text-amber-500" />;
    case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-amber-500" />;
    case 'Briefcase': return <Briefcase className="w-5 h-5 text-amber-500" />;
    case 'Truck': return <Truck className="w-5 h-5 text-amber-500" />;
    case 'Coins': return <Coins className="w-5 h-5 text-amber-500" />;
    case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-amber-500" />;
    default: return <Sparkles className="w-5 h-5 text-amber-500" />;
  }
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings, categories, openBulkModal, openChatWithContext, currentLanguage, dict } = useApp();
  
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [selectedVideoModal, setSelectedVideoModal] = useState<VideoItem | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [homeData, prodData, faqData, testData, galData, vidsData, bansData, secsData] = await Promise.all([
          api.getHomepageContent(),
          api.getProducts({ featured: true }),
          api.getFaqs(),
          api.getTestimonials(),
          api.getGallery(),
          api.getVideos({ featured: true }),
          api.getBanners(),
          api.getCustomSections()
        ]);
        setContent(homeData);
        setProducts(prodData);
        setFaqs(faqData);
        setTestimonials(testData);
        setGalleryItems(galData || []);
        setVideos(vidsData || []);
        setBanners(bansData || []);
        setCustomSections(secsData || []);
      } catch (e) {
        console.error('Failed to load homepage resources:', e);
      }
    }
    load();
  }, []);

  const primaryPhone = settings?.phone || '+91 82405 85219';
  const secondaryPhone = settings?.secondaryPhone || '+91 80738 36537';
  const tertiaryPhone = settings?.tertiaryPhone || '+91 89068 01895';
  const ownerName = settings?.ownerName || 'MONOJIT DEY';
  const companyName = settings?.companyName || 'JIT PRIME MPC COMPANY';

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Localized Trust Badges
  const trustBadges = [
    { title: dict.badge_gst, subtitle: currentLanguage === 'bn' ? 'স্বচ্ছ কর চালান' : currentLanguage === 'hi' ? 'पारदर्शी बिलिंग' : 'Transparent Invoicing', icon: 'FileCheck' },
    { title: dict.badge_workshop, subtitle: currentLanguage === 'bn' ? 'নিমতা, বেলঘরিয়া' : currentLanguage === 'hi' ? 'निमता, बेलघरिया' : 'Nimta, Belghoria', icon: 'Building2' },
    { title: dict.badge_gem, subtitle: currentLanguage === 'bn' ? 'সরকারি টেন্ডার' : currentLanguage === 'hi' ? 'सरकारी टेंडर' : 'Institutional Orders', icon: 'ShieldCheck' },
    { title: dict.badge_women, subtitle: currentLanguage === 'bn' ? 'দক্ষ কারিগর দল' : currentLanguage === 'hi' ? 'कुशल कारीगर समूह' : 'Skilled Clusters', icon: 'Users' },
    { title: dict.badge_custom, subtitle: currentLanguage === 'bn' ? 'লোগো ও স্মারক' : currentLanguage === 'hi' ? 'लोगो और स्मृति चिन्ह' : 'Trophies & Motifs', icon: 'Palette' },
    { title: dict.badge_dispatch, subtitle: currentLanguage === 'bn' ? 'নিরাপদ প্যাকেজিং' : currentLanguage === 'hi' ? 'सुरक्षित पैकेजिंग' : 'Damaged-Free Box', icon: 'Truck' },
  ];

  // Localized 8-step Workflow
  const workflowSteps = [
    { step: currentLanguage === 'bn' ? '১. মহিলা কারিগর' : currentLanguage === 'hi' ? '१. महिला कारीगर' : '1. Women Artisans', sub: currentLanguage === 'bn' ? 'স্থানীয় মেধা' : currentLanguage === 'hi' ? 'स्थानीय प्रतिभा' : 'Local Talent' },
    { step: currentLanguage === 'bn' ? '২. ঐতিহ্যবাহী কাজ' : currentLanguage === 'hi' ? '२. पारंपरिक हुनर' : '2. Heritage Craft', sub: currentLanguage === 'bn' ? 'খাঁটি পদ্ধতি' : currentLanguage === 'hi' ? 'पारंपरिक विधि' : 'Authentic Methods' },
    { step: currentLanguage === 'bn' ? '৩. হস্তশিল্প পণ্য' : currentLanguage === 'hi' ? '३. हस्तशिल्प निर्माण' : '3. Product Creation', sub: currentLanguage === 'bn' ? 'মাটি ও ডোকরা' : currentLanguage === 'hi' ? 'मिट्टी व ढोकरा' : 'Clay & Dokra Art' },
    { step: currentLanguage === 'bn' ? '৪. মান পরীক্ষা' : currentLanguage === 'hi' ? '४. गुणवत्ता जांच' : '4. Quality Check', sub: currentLanguage === 'bn' ? 'নিখুঁত ফিনিশিং' : currentLanguage === 'hi' ? 'सटीक फिनिशिंग' : 'Precise Finishing' },
    { step: currentLanguage === 'bn' ? '৫. বাল্ক অর্ডার' : currentLanguage === 'hi' ? '५. बल्क ऑर्डर' : '5. Bulk Orders', sub: currentLanguage === 'bn' ? 'প্রাতিষ্ঠানিক চুক্তি' : currentLanguage === 'hi' ? 'संस्थागत आपूर्ति' : 'Institutional B2B' },
    { step: currentLanguage === 'bn' ? '৬. বাজার সংযোগ' : currentLanguage === 'hi' ? '६. बाजार पहुंच' : '6. Market Access', sub: currentLanguage === 'bn' ? 'দেশ ও বিদেশ' : currentLanguage === 'hi' ? 'देश व विदेश' : 'Domestic & Export' },
    { step: currentLanguage === 'bn' ? '৭. উৎপাদনভিত্তিক আয়' : currentLanguage === 'hi' ? '७. उत्पादन आधारित आय' : '7. Order-Based Income', sub: currentLanguage === 'bn' ? 'ন্যায্য মূল্য' : currentLanguage === 'hi' ? 'उचित पारिश्रमिक' : 'Fair Compensation' },
    { step: currentLanguage === 'bn' ? '৮. স্থায়ী অগ্রগতি' : currentLanguage === 'hi' ? '८. निरंतर विकास' : '8. Sustainable Growth', sub: currentLanguage === 'bn' ? 'আস্থার মেলবন্ধন' : currentLanguage === 'hi' ? 'सशक्त भविष्य' : 'Dignified Craft' }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 bg-white">
      
      {/* 1. HERO SECTION (Artisanal Deep Navy & Terracotta Gold Theme) */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#071426] via-[#0B1A30] to-[#142C4F] text-white py-16 sm:py-24 lg:py-28 border-b-4 border-amber-500">
        {/* Craft decorative texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162D4E] border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-inner">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{dict.hero_tag}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-serif-heading text-white">
                {dict.hero_heading}
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {dict.hero_sub}
              </p>

              {/* Priority CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => openBulkModal()}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Package className="w-5 h-5 text-slate-950" />
                  <span>{dict.hero_cta_bulk}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/training-livelihood')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 font-semibold text-sm sm:text-base rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <HeartHandshake className="w-5 h-5 text-amber-400" />
                  <span>{dict.hero_cta_learn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/products')}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm sm:text-base rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{dict.nav_products}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Direct Call & Phone Lines */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
                <a 
                  href={`tel:${primaryPhone.replace(/\s+/g, '')}`} 
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{dict.hero_cta_call}: {primaryPhone} ({ownerName})</span>
                </a>
                <span className="text-slate-600 hidden sm:inline">&bull;</span>
                <span className="text-slate-400">
                  {dict.all_contacts_label}: {secondaryPhone} | {tertiaryPhone}
                </span>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-500/40 shadow-2xl">
                  <img
                    src={content?.hero.backgroundImage || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80"}
                    alt="Authentic Indian Hasta Shilpa Clay Art & Jewellery"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  
                  {/* Floating Visiting Card Badge */}
                  <div className="p-4 bg-slate-950/95 backdrop-blur-xs text-white border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-serif-heading">
                          {companyName}
                        </p>
                        <p className="text-xs text-slate-300">
                          Proprietor: <span className="text-white font-semibold">{ownerName}</span>
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold text-xs rounded">
                        Kolkata Hub
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="pt-3 lg:pt-0 lg:px-3 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2 shadow-xs text-amber-600">
                  {getIcon(badge.icon)}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  {badge.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DUAL CORE PILLARS: WOMEN LIVELIHOOD & BULK SUPPLY */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <SectionHeaderDecor
            icon="terracotta-diamond"
            badgeText={dict.pillars_tag}
            heading={dict.pillars_title}
            subheading={dict.pillars_sub}
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* PILLAR 1: WOMEN & HANDMADE WORK */}
          <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-10 border-2 border-amber-500/30 shadow-lg flex flex-col justify-between relative overflow-hidden group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  <span>{dict.women_tag}</span>
                </span>
                <span className="text-[11px] font-medium text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                  {dict.women_puja_tag}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-serif-heading">
                {dict.women_title}
              </h3>
              <p className="text-amber-400 font-medium text-sm mb-4">
                {dict.women_sub}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                {dict.women_puja_desc}
              </p>

              {/* Bullet Features */}
              <div className="space-y-3 mb-8 text-xs sm:text-sm">
                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      {currentLanguage === 'bn' ? 'বিনামূল্যে কাঁচামাল ও ছাঁচ প্রশিক্ষণ' : currentLanguage === 'hi' ? 'मुफ्त कच्चा माल और प्रशिक्षण' : 'Free Raw Materials & Mould Training'}
                    </span>
                    <span className="text-slate-300 text-xs">
                      {currentLanguage === 'bn' ? 'কোনো রেজিস্ট্রেশন ফি নেই। মাটি, রং ও প্রয়োজনীয় সরঞ্জাম কর্মশালায় সরবরাহ করা হয়।' : currentLanguage === 'hi' ? 'कोई पंजीकरण शुल्क नहीं। मिट्टी, रंग व औजार कार्यशाला में दिए जाते हैं।' : 'No registration fee. Clay, natural pigments and carving tools provided.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      {currentLanguage === 'bn' ? 'অর্ডারভিত্তিক উৎপাদন ও সংগ্রহ' : currentLanguage === 'hi' ? 'ऑर्डर आधारित उत्पादन और खरीद' : 'Order-Based Production & Procurement'}
                    </span>
                    <span className="text-slate-300 text-xs">
                      {currentLanguage === 'bn' ? 'তৈরি করা মানসম্মত পণ্য পূজা ও প্রাতিষ্ঠানিক অর্ডারের জন্য ন্যায্য মূল্যে নেওয়া হয়।' : currentLanguage === 'hi' ? 'तैयार गुणवत्तापूर्ण उत्पाद पूजा व संस्थागत ऑर्डर के लिए उचित मूल्य पर खरीदे जाते हैं।' : 'Finished quality-checked craft is procured for confirmed festive and institutional orders.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      {currentLanguage === 'bn' ? 'সহায়ক কর্মশালা ও কাজের পরিবেশ' : currentLanguage === 'hi' ? 'सहायक कार्यशाला और काम का माहौल' : 'Supportive Workshop & Working Hours'}
                    </span>
                    <span className="text-slate-300 text-xs">
                      {currentLanguage === 'bn' ? 'সংসার সামলে সুবিধাজনক সময়ে কাজ করার সুযোগ।' : currentLanguage === 'hi' ? 'घरेलू जिम्मेदारियों के साथ सुविधाजनक समय पर काम करने का अवसर।' : 'Flexible hours allowing women to balance family responsibilities with craft production.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 1 CTA Buttons */}
            <div className="pt-4 border-t border-slate-700/60 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/training-livelihood')}
                className="flex-1 px-5 py-3 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{dict.women_cta_participate}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a
                href={`https://wa.me/${primaryPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Monojit Dey, I want to inquire about handmade work and craft opportunities for women artisans.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* PILLAR 2: BULK & B2B PRODUCT ORDERS */}
          <div className="rounded-2xl bg-white text-slate-900 p-6 sm:p-10 border-2 border-slate-200 hover:border-amber-400/80 shadow-lg flex flex-col justify-between relative overflow-hidden group transition-colors">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span>B2B &bull; {dict.govt_tag}</span>
                </span>
                <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {currentLanguage === 'bn' ? 'সরাসরি কারখানা থেকে' : currentLanguage === 'hi' ? 'सीधे कारखाने से' : 'Direct Workshop'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 mb-2 font-serif-heading">
                {dict.nav_bulk}
              </h3>
              <p className="text-slate-600 font-medium text-sm mb-4">
                {currentLanguage === 'bn' ? 'পাইকারি মূল্য ও নিশ্চিত গুণমান — পূজা ও উপহার' : currentLanguage === 'hi' ? 'थोक मूल्य और गारंटीकृत गुणवत्ता — पूजा और उपहार' : 'Direct Wholesale Rates & Quality Verification for Gifting & Retail'}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                {currentLanguage === 'bn' 
                  ? 'কলকাতা ও বাংলার কারিগরদের থেকে সরাসরি হস্তশিল্প সংগ্রহ করুন। কর্পোরেট গিফট, পূজার স্যুভেনির, এক্সপোর্ট বুটিক এবং সরকারি টেন্ডারের উপযুক্ত।'
                  : currentLanguage === 'hi'
                  ? 'कोलकाता व बंगाल के कारीगरों से सीधे हस्तशिल्प प्राप्त करें। कॉर्पोरेट उपहार, पूजा स्मृति चिन्ह, एक्सपोर्ट बुटीक और सरकारी टेंडर के लिए उपयुक्त।'
                  : 'Source authentic handcrafted Hasta Shilpa items directly from our Kolkata artisan hub. Perfect for corporate gifting, Durga Puja souvenirs, export boutiques, and government tenders.'}
              </p>

              {/* Bullet Features */}
              <div className="space-y-3 mb-8 text-xs sm:text-sm">
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      {currentLanguage === 'bn' ? 'সরাসরি পাইকারি রেট (কোনো দালাল নেই)' : currentLanguage === 'hi' ? 'सीधा थोक मूल्य (कोई बिचौलिया नहीं)' : 'Direct Wholesale Rates (No Middlemen)'}
                    </span>
                    <span className="text-slate-600 text-xs">
                      {currentLanguage === 'bn' ? 'স্বচ্ছ রেট এবং ২৫-৫০ পিসের ন্যূনতম অর্ডারে বিশেষ ছাড়।' : currentLanguage === 'hi' ? 'पारदर्शी दरें और 25-50 पीस से आकर्षक थोक छूट।' : 'Transparent pricing with volume discounts starting at low MOQ (25–50 pcs).'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      {currentLanguage === 'bn' ? 'কাস্টমাইজেশন ও প্রাতিষ্ঠানিক ব্র্যান্ডিং' : currentLanguage === 'hi' ? 'कस्टमाइजेशन और संस्थागत ब्रांडिंग' : 'Customization & Institutional Branding'}
                    </span>
                    <span className="text-slate-600 text-xs">
                      {currentLanguage === 'bn' ? 'নির্দিষ্ট মাপ, লোগো খোদাই ও প্রিমিয়াম উপহার বক্স সুবিধা।' : currentLanguage === 'hi' ? 'विशिष्ट आयाम, लोगो उत्कीर्णन और उपहार बॉक्स पैकेजिंग।' : 'Custom dimensions, festival motifs, brass plaques, and gift packaging.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {currentLanguage === 'bn' ? 'জিএসটি বিল ও নিরাপদ দেশব্যাপী ডেলিভারি' : currentLanguage === 'hi' ? 'जीएसटी बिल और सुरक्षित राष्ट्रव्यापी डिलीवरी' : 'GST Invoice & Safe Nationwide Dispatch'}
                    </span>
                    <span className="text-slate-600 text-xs">
                      {currentLanguage === 'bn' ? 'ভাঙাচোরা রোধক শক্ত কার্টনে ভারত ও আন্তর্জাতিক পোর্টে পাঠানো হয়।' : currentLanguage === 'hi' ? 'मजबूत पैकेजिंग में भारत और अंतरराष्ट्रीय पोर्ट्स तक सुरक्षित परिवहन।' : 'Damage-resistant corrugated packing across India and export terminals.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 2 CTA Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openBulkModal()}
                className="flex-1 px-5 py-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4 text-slate-950" />
                <span>{dict.nav_get_quote}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/products')}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>{dict.prod_view_all}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WORKFLOW & STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-linear-to-r from-[#0B1A30] to-[#122B4D] rounded-3xl p-8 sm:p-12 text-white border border-[#1E3E6B] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              {currentLanguage === 'bn' ? 'আমাদের কাজের যাত্রা' : currentLanguage === 'hi' ? 'हमारी कार्य यात्रा' : 'Our Authentic Craft Journey'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-heading">
              &ldquo;{currentLanguage === 'bn' ? 'কাজ থেকে বাজার। শিল্প থেকে জীবিকা।' : currentLanguage === 'hi' ? 'हुनर से बाजार तक। शिल्प से अवसर तक।' : 'From Skill to Market. From Craft to Opportunity.'}&rdquo;
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {currentLanguage === 'bn' 
                ? 'আমরা খাঁটি ভারতীয় হস্তশিল্পকে বাল্ক, প্রাতিষ্ঠানিক ও আন্তর্জাতিক ক্রেতাদের সাথে সংযুক্ত করি এবং গ্রামীণ মহিলা কারিগরদের বাস্তব উৎপাদনভিত্তিক কাজের সুযোগ তৈরি করি।'
                : currentLanguage === 'hi'
                ? 'हम प्रामाणिक भारतीय हस्तशिल्प को थोक, संस्थागत और अंतरराष्ट्रीय खरीदारों से जोड़ते हैं, जिससे महिला कारीगरों के लिए वास्तविक उत्पादन-आधारित अवसर बनते हैं।'
                : 'We connect authentic Indian handcrafted products with bulk, institutional and international buyers while creating meaningful production opportunities for women artisans.'}
            </p>
          </div>

          {/* Workflow Sequence Diagram */}
          <div className="mt-10 pt-8 border-t border-slate-700/80">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-semibold">
              {workflowSteps.map((item, idx) => (
                <div key={idx} className="bg-[#142944] p-3 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                  <span className="text-amber-400 font-bold block">{item.step}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{item.sub}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-4">
              *{currentLanguage === 'bn' 
                ? 'আয় ও উৎপাদন নির্ভর করে বাজারের বাস্তব অর্ডারের ওপর। আমরা কোনো নিশ্চিত সরকারি বেতন বা কাল্পনিক আয়ের দাবি করি না।'
                : currentLanguage === 'hi'
                ? 'आय और उत्पादन बाजार के वास्तविक ऑर्डर पर निर्भर करता है। हम किसी अवास्तविक निश्चित वेतन का दावा नहीं करते।'
                : 'Production and earnings are directly linked to confirmed market and festive orders. We do not claim unconditional employment or fixed public salaries.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. ARTISAN WORK & PRODUCTION VIDEOS (NO "Google Drive" branding, professional video cards) */}
      {videos.filter(v => !v.hidden).length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <SectionHeaderDecor
              icon="artisan-badge"
              badgeText={dict.video_tag || (currentLanguage === 'bn' ? 'কারিগরদের কাজের ভিডিও' : currentLanguage === 'hi' ? 'कारीगर कार्य वीडियो' : 'Workshop Videos')}
              heading={dict.video_title || (currentLanguage === 'bn' ? 'আমাদের কাজ ও হস্তশিল্প উৎপাদন ভিডিও' : currentLanguage === 'hi' ? 'हमारा काम व हस्तशिल्प वीडियो' : 'Our Work & Handmade Craft Videos')}
              subheading={dict.video_sub || (currentLanguage === 'bn' ? 'মাটির গহনা ও কারিগরি প্রক্রিয়ার জীবন্ত দৃশ্য' : currentLanguage === 'hi' ? 'मिट्टी के आभूषण व शिल्प निर्माण की प्रक्रिया' : 'Authentic artisan crafting, terracotta firing & workshop footage')}
              align="left"
            />

            <button
              type="button"
              onClick={() => onNavigate('/gallery')}
              className="text-amber-700 hover:text-amber-800 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-end"
            >
              <span>{dict.video_explore_gallery}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.filter(v => !v.hidden).map(vid => (
              <div
                key={vid.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Video Thumbnail */}
                  <div
                    onClick={() => setSelectedVideoModal(vid)}
                    className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer flex items-center justify-center"
                  >
                    {vid.thumbnailUrl ? (
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-slate-950 via-slate-900 to-amber-950/50 flex items-center justify-center">
                        <Clapperboard className="w-12 h-12 text-amber-400/80" />
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 flex items-center justify-center transition-colors">
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                      </div>
                    </div>

                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {vid.category || (currentLanguage === 'bn' ? 'কাজের ভিডিও' : currentLanguage === 'hi' ? 'कार्यशाला वीडियो' : 'Craft Video')}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {vid.description || (currentLanguage === 'bn' ? 'খাঁটি পোড়ামাটির গহনা ও কারিগরদের কাজের ভিডিও দৃশ্য।' : currentLanguage === 'hi' ? 'हस्तशिल्प निर्माण और कार्यशाला का जीवंत दृश्य।' : 'Authentic handcrafted jewellery and clay art production in Kolkata cluster.')}
                    </p>
                  </div>
                </div>

                {/* Footer: Professional Video Details (No "Google Drive" technical wording!) */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Video className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentLanguage === 'bn' ? 'কারখানার কাজের দৃশ্য' : currentLanguage === 'hi' ? 'कार्यशाला दृश्य' : 'Artisan Workshop Footage'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedVideoModal(vid)}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer flex items-center gap-1"
                  >
                    <span>{dict.video_watch_btn}</span>
                    <Play className="w-3 h-3 fill-amber-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. ARTISANAL CRAFT GALLERY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <SectionHeaderDecor
            icon="craft-lotus"
            badgeText={dict.nav_gallery}
            heading={currentLanguage === 'bn' ? 'শিল্পী ও কারিগরদের হাতের কাজ' : currentLanguage === 'hi' ? 'कारीगरों के हस्तशिल्प नमूने' : 'Master Artisan Craftsmanship'}
            subheading={currentLanguage === 'bn' ? 'মাটির জুয়েলারি, টেরাকোটা ডেকোরেশন ও ঐতিহ্যবাহী শিল্পের নির্বাচিত ছবিসমূহ।' : currentLanguage === 'hi' ? 'मिट्टी के आभूषण, टेराकोटा कला और पारंपरिक हस्तशिल्प संग्रह।' : 'Curated handcrafted terracotta jewellery, festive clay idols, and folk art artifacts.'}
            align="left"
          />

          <button
            type="button"
            onClick={() => onNavigate('/gallery')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 self-start md:self-end cursor-pointer"
          >
            <span>{dict.video_explore_gallery}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(galleryItems.slice(0, 4)).map((item) => (
            <div 
              key={item.id}
              onClick={() => onNavigate('/gallery')}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium">
                  {item.category}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {item.artisanName || 'Kolkata Artisan Cluster'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FEATURED WHOLESALE & BULK COLLECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <SectionHeaderDecor
            icon="terracotta-diamond"
            badgeText={dict.prod_tag}
            heading={dict.prod_title}
            subheading={dict.prod_sub}
            align="left"
          />

          <button
            type="button"
            onClick={() => onNavigate('/products')}
            className="text-amber-700 hover:text-amber-800 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-end"
          >
            <span>{dict.prod_view_all}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0B1A30] text-amber-400 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {dict.prod_all_cat}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0B1A30] text-amber-400 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Container */}
              <div 
                className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => onNavigate(`/products/${product.slug || product.id}`)}
              >
                <img
                  src={product.primaryImage || (product.images && product.images[0]) || ((product as any).galleryImages && (product as any).galleryImages[0]) || 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('unsplash')) {
                      target.src = 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80';
                    }
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-[#0B1A30]/90 text-amber-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                    {dict.prod_unit_moq}: {product.moq} pcs
                  </span>
                  {product.productionStatus && (
                    <span className="bg-emerald-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {product.productionStatus}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1">
                    SKU: {product.sku}
                  </div>
                  <h3 
                    onClick={() => onNavigate(`/products/${product.slug || product.id}`)}
                    className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Pricing & Actions */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        {currentLanguage === 'bn' ? 'পাইকারি রেট' : currentLanguage === 'hi' ? 'थोक मूल्य' : 'Wholesale Rate'}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {product.priceOnRequest ? (currentLanguage === 'bn' ? 'অনুরোধে মূল্য' : currentLanguage === 'hi' ? 'अनुरोध पर मूल्य' : 'Price on Request') : `₹${product.bulkPrice || product.retailPrice}/pc`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openChatWithContext(`I would like more information on ${product.name} (SKU: ${product.sku})`, product)}
                      className="text-slate-500 hover:text-amber-600 p-1.5 rounded-md hover:bg-amber-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Ask Assistant"
                    >
                      <Bot className="w-4 h-4 text-amber-500" />
                      <span className="hidden sm:inline">Ask AI</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/products/${product.slug || product.id}`)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors text-center cursor-pointer"
                    >
                      {dict.prod_details_btn}
                    </button>
                    <button
                      type="button"
                      onClick={() => openBulkModal(product)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors text-center shadow-xs cursor-pointer"
                    >
                      {dict.prod_order_btn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. WHY JIT PRIME MPC COMPANY */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <SectionHeaderDecor
            icon="mandala-accent"
            badgeText={currentLanguage === 'bn' ? 'কেন জিত প্রাইম এমপিসি কোম্পানি?' : currentLanguage === 'hi' ? 'जीत प्राइम एमपीसी कंपनी ही क्यों?' : 'Why Choose Jit Prime MPC Company'}
            heading={currentLanguage === 'bn' ? 'বিশ্বাস, কারিগরি ঐতিহ্য ও উৎপাদন ক্ষমতা' : currentLanguage === 'hi' ? 'विश्वास, शिल्प कौशल और उत्पादन क्षमता' : 'Built on Trust, Craftsmanship & Production Scale'}
            subheading={currentLanguage === 'bn' 
              ? 'প্রাতিষ্ঠানিক ক্রেতা, পাইকারি ব্যবসায়ী এবং আন্তর্জাতিক বুটিকের জন্য সম্পূর্ণ স্বচ্ছতা ও নির্ভরযোগ্যতার সাথে হস্তশিল্প সরবরাহ।'
              : currentLanguage === 'hi'
              ? 'संस्थागत खरीदारों, थोक विक्रेताओं और अंतरराष्ट्रीय बुटीक के लिए पूर्ण पारदर्शिता और विश्वसनीयता के साथ आपूर्ति।'
              : 'Serving institutional purchasers, wholesalers, and overseas boutique retailers with complete transparency and reliability.'}
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content?.whyUsCards || []).filter(c => !c.hidden).map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center mb-4 transition-colors">
                  {getIcon(card.iconName)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {card.link && (
                <button
                  type="button"
                  onClick={() => onNavigate(card.link!)}
                  className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:text-amber-700 cursor-pointer"
                >
                  <span>{currentLanguage === 'bn' ? 'আরও জানুন' : currentLanguage === 'hi' ? 'अधिक जानें' : 'Learn more'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. GOVERNMENT TENDER & INSTITUTIONAL PROCUREMENT PREVIEW */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-linear-to-br from-[#0B1A30] to-[#16335C] rounded-3xl p-8 sm:p-12 text-white border-2 border-amber-400 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{dict.govt_tag}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-heading text-white">
                {dict.govt_title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {dict.govt_sub}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#081526] p-3.5 rounded-xl border border-slate-700">
                  <span className="text-amber-400 font-bold text-xs block">
                    {currentLanguage === 'bn' ? 'নমুনা অনুমোদন' : currentLanguage === 'hi' ? 'नमूना अनुमोदन' : 'Sample Approvals'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {currentLanguage === 'bn' ? 'উৎপাদনের পূর্বে প্রোটোটাইপ সাইন-অফ' : currentLanguage === 'hi' ? 'उत्पादन से पूर्व प्रोटोटाइप सत्यापन' : 'Pre-production prototype sign-offs'}
                  </span>
                </div>
                <div className="bg-[#081526] p-3.5 rounded-xl border border-slate-700">
                  <span className="text-amber-400 font-bold text-xs block">
                    {currentLanguage === 'bn' ? 'কাস্টম ব্র্যান্ডিং' : currentLanguage === 'hi' ? 'कस्टम ब्रांडिंग' : 'Custom Branding'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {currentLanguage === 'bn' ? 'ব্রাস প্লেট ও খোদাই করা নাম' : currentLanguage === 'hi' ? 'पीतल प्लेट व उत्कीर्ण नाम' : 'Engraved brass plates & print'}
                  </span>
                </div>
                <div className="bg-[#081526] p-3.5 rounded-xl border border-slate-700">
                  <span className="text-amber-400 font-bold text-xs block">
                    {currentLanguage === 'bn' ? 'নিখুঁত নথি' : currentLanguage === 'hi' ? 'दस्तावेज अखंडता' : 'Document Integrity'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {currentLanguage === 'bn' ? 'জিএসটি ইনভয়েস ও প্যাকিং তালিকা' : currentLanguage === 'hi' ? 'जीएसटी इनवॉइस व पैकिंग मेनिफेस्ट' : 'GST invoices & packing manifests'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right space-y-3">
              <button
                type="button"
                onClick={() => onNavigate('/government-institutional')}
                className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{dict.govt_cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                {dict.direct_call}: {primaryPhone} ({ownerName})
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. INTERNATIONAL BUYERS SECTION PREVIEW */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <Globe2 className="w-4 h-4" />
              <span>{dict.intl_tag}</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-slate-900 font-serif-heading">
              {dict.intl_title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {dict.intl_sub}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/international-buyers')}
            className="px-6 py-3 bg-[#0B1A30] hover:bg-[#152E54] text-white font-bold text-xs sm:text-sm rounded-xl shrink-0 transition-colors shadow-sm cursor-pointer"
          >
            {dict.intl_cta}
          </button>
        </div>
      </section>

      {/* 11. TESTIMONIALS & CLIENT FEEDBACK */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <SectionHeaderDecor
            icon="minimal-chisel"
            badgeText={currentLanguage === 'bn' ? 'গ্রাহক পর্যালোচনা ও মতামত' : currentLanguage === 'hi' ? 'ग्राहक समीक्षा व प्रतिक्रिया' : 'Client Feedback & Reviews'}
            heading={currentLanguage === 'bn' 
              ? 'গ্রাহক ও প্রাতিষ্ঠানিক ক্রেতাদের অভিজ্ঞতা' 
              : currentLanguage === 'hi'
              ? 'विश्वसनीय ग्राहक और संस्थागत अनुभव'
              : 'Trusted by Cultural & Institutional Partners'}
            subheading={currentLanguage === 'bn'
              ? 'আমাদের খাঁটি পোড়ামাটির গহনা, হস্তশিল্প ও প্রাতিষ্ঠানিক সরবরাহ সম্পর্কে সম্মানিত ক্রেতাদের বাস্তব অভিজ্ঞতা।'
              : currentLanguage === 'hi'
              ? 'हमारे मिट्टी के आभूषण व हस्तशिल्प पर ग्राहकों की वास्तविक समीक्षाएं।'
              : 'Authentic reviews from retail buyers, boutique owners, cultural organizers, and handicraft patrons.'}
            align="left"
          />

          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="self-start md:self-end px-5 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{currentLanguage === 'bn' ? 'মতামত বা রিভিউ লিখুন' : currentLanguage === 'hi' ? 'समीक्षा लिखें' : 'Write a Review'}</span>
          </button>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-3">
            <p className="text-xs sm:text-sm">
              {currentLanguage === 'bn'
                ? 'এখনও কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি দিতে ওপরের বাটনে ক্লিক করুন।'
                : currentLanguage === 'hi'
                ? 'अभी कोई समीक्षा नहीं है। अपनी समीक्षा साझा करने के लिए ऊपर क्लिक करें।'
                : 'No reviews yet. Be the first to share your feedback!'}
            </p>
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600"
            >
              {currentLanguage === 'bn' ? 'প্রথম রিভিউ লিখুন' : currentLanguage === 'hi' ? 'पहली समीक्षा लिखें' : 'Write First Review'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-slate-600 ml-1">
                        {t.rating || 5}/5
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{t.clientName}</span>
                    <span className="text-slate-500">
                      {[t.company, t.location].filter(Boolean).join(' • ') || (currentLanguage === 'bn' ? 'ক্রেতা' : currentLanguage === 'hi' ? 'ग्राहक' : 'Customer')}
                    </span>
                    {t.createdAt && (
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {t.verifiedBuyer && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      {currentLanguage === 'bn' ? 'যাচাইকৃত ক্রেতা' : currentLanguage === 'hi' ? 'सत्यापित खरीदार' : 'Verified Buyer'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Writing Review */}
        <WriteReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onReviewSubmitted={(newRev) => {
            setTestimonials(prev => [newRev, ...prev]);
          }}
        />
      </section>

      {/* 12. FAQ ACCORDION */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4">
          <div className="mb-10">
            <SectionHeaderDecor
              icon="terracotta-diamond"
              badgeText={currentLanguage === 'bn' ? 'সাধারণ প্রশ্নোত্তর' : currentLanguage === 'hi' ? 'सामान्य प्रश्न' : 'Frequently Asked Questions'}
              heading={currentLanguage === 'bn' ? 'প্রয়োজনীয় তথ্য ও প্রশ্নের উত্তর' : currentLanguage === 'hi' ? 'आवश्यक जानकारी और उत्तर' : 'Everything You Need to Know'}
              align="center"
            />
          </div>

          <div className="space-y-3">
            {faqs.map(faq => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* DYNAMIC CUSTOM SECTIONS (From Admin Custom Sections Tab) */}
      {customSections.filter(s => !s.hidden).map((sec) => (
        <section key={sec.id} className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow p-8 sm:p-12">
            <div className={`grid grid-cols-1 ${sec.imageUrl ? 'lg:grid-cols-2' : ''} gap-8 items-center`}>
              <div className="space-y-4">
                {sec.subtitle && (
                  <span className="text-amber-600 font-extrabold text-xs uppercase tracking-wider block">
                    {sec.subtitle}
                  </span>
                )}
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading">
                  {sec.title}
                </h2>
                <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {sec.content}
                </div>
                {sec.buttonText && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => sec.buttonLink ? onNavigate(sec.buttonLink) : openBulkModal()}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs sm:text-sm rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>{sec.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {sec.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                  <img
                    src={sec.imageUrl}
                    alt={sec.title}
                    className="w-full h-72 sm:h-96 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* VIDEO PREVIEW MODAL (Strictly NO "Google Drive" branding!) */}
      {selectedVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold line-clamp-1">{selectedVideoModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideoModal(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              {selectedVideoModal.embedUrl ? (
                <iframe
                  src={selectedVideoModal.embedUrl}
                  title={selectedVideoModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedVideoModal.videoUrl && !selectedVideoModal.videoUrl.includes('drive.google.com') && !selectedVideoModal.videoUrl.includes('youtube.com') && !selectedVideoModal.videoUrl.includes('youtu.be') ? (
                <video
                  src={selectedVideoModal.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="p-8 text-center space-y-4 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto">
                    <Play className="w-8 h-8 fill-amber-400 ml-1" />
                  </div>
                  <h4 className="text-white font-bold text-base font-serif-heading">
                    {currentLanguage === 'bn' ? 'কারখানা ও হস্তশিল্প উৎপাদন ভিডিও' : currentLanguage === 'hi' ? 'कार्यशाला व हस्तशिल्प निर्माण वीडियो' : 'Workshop & Craft Production Video'}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {currentLanguage === 'bn' 
                      ? 'এই ভিডিওটি হাই ডেফিনিশনে দেখার জন্য নিচের বাটনে ক্লিক করুন।'
                      : currentLanguage === 'hi'
                      ? 'उच्च गुणवत्ता में वीडियो देखने के लिए नीचे क्लिक करें।'
                      : 'Stream our authentic artisan jewellery making and craft workshop footage in high definition.'}
                  </p>
                  <a
                    href={selectedVideoModal.googleDriveUrl || selectedVideoModal.videoUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-colors"
                  >
                    <span>{dict.video_watch_btn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>{selectedVideoModal.description || `${companyName} Artisan Craftsmanship Workshop`}</span>
              <button
                type="button"
                onClick={() => setSelectedVideoModal(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
              >
                {currentLanguage === 'bn' ? 'বন্ধ করুন' : currentLanguage === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 13. BOTTOM HIGH-CONVERSION BULK CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-linear-to-r from-[#0B1A30] via-[#142D52] to-[#0B1A30] rounded-3xl p-8 sm:p-12 text-center text-white border-2 border-amber-400 shadow-xl space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest">
              {dict.direct_call}: {ownerName}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-heading">
              {currentLanguage === 'bn' 
                ? 'খাঁটি হস্তশিল্প পণ্য অর্ডারের জন্য প্রস্তুত?' 
                : currentLanguage === 'hi'
                ? 'प्रामाणिक हस्तशिल्प ऑर्डर के लिए तैयार हैं?'
                : 'Ready to Order Authentic Handcrafted Products?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {currentLanguage === 'bn'
                ? 'পাইকারি কোটেশন পেতে অথবা কলকাতা কর্মশালার দলের সাথে সরাসরি কথা বলতে যোগাযোগ করুন।'
                : currentLanguage === 'hi'
                ? 'थोक कोटेशन के लिए या हमारी कार्यशाला टीम से चर्चा करने के लिए संपर्क करें।'
                : 'Request your custom wholesale quote or schedule a discussion with our Kolkata workshop team.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openBulkModal()}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{dict.nav_get_quote}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${primaryPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${ownerName}, I would like to inquire about bulk handcrafted products from ${companyName}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp {ownerName}</span>
            </a>
          </div>

          <div className="text-xs text-slate-400 pt-4 border-t border-slate-800 space-y-1">
            <p className="font-semibold text-slate-300">
              📞 {dict.all_contacts_label}: {primaryPhone} (Primary) &bull; {secondaryPhone} &bull; {tertiaryPhone}
            </p>
            <p>
              Address: Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
