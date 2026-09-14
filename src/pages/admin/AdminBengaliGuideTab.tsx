import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Package, 
  Layers, 
  Flame, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  Settings, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Search,
  Upload,
  AlertTriangle
} from 'lucide-react';

interface AdminBengaliGuideTabProps {
  onSwitchTab: (tabId: string) => void;
}

export const AdminBengaliGuideTab: React.FC<AdminBengaliGuideTabProps> = ({ onSwitchTab }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      id: 'gallery',
      title: 'হাতের কাজের গ্যালারি (Craft Gallery Management)',
      subtitle: 'ডিভাইস থেকে সরাসরি হস্তশিল্পের ছবি আপলোড ও ক্যাটাগরি নিয়ন্ত্রণ',
      icon: ImageIcon,
      tabId: 'gallery',
      steps: [
        '১. বামদিকের মেনু থেকে "Craft Gallery (গ্যালারি)" ট্যাবে ক্লিক করুন।',
        '২. উপরে থাকা "নতুন হাতের কাজ যোগ করুন (Add Photo)" বাটনে চাপ দিন।',
        '৩. "ডিভাইস থেকে ছবি আপলোড" বোতামে ক্লিক করে আপনার ফোন বা কম্পিউটার থেকে ছবি সিলেক্ট করুন। ছবি সাথে সাথে আপলোড হয়ে প্রিভিউ দেখাবে।',
        '৪. ক্যাটাগরি নির্বাচন করুন (যেমন: Handmade Jewellery, Terracotta & Clay Art, Dokra ইত্যাদি)। চাইলে নতুন কোনো ক্যাটাগরিও লিখে দিতে পারেন।',
        '৫. কাজের শিরোনাম, বিবরণ, ব্যবহৃত উপাদান এবং কারিগরের নাম লিখে "সংরক্ষণ করুন" বাটনে চাপুন। ওয়েবসাইটে তাৎক্ষণিক ছবি লাইভ হয়ে যাবে।'
      ],
      tips: 'টিপস: ফোনের ক্যামেরা দিয়ে ভালো আলোতে ছবি তুললে হস্তশিল্পের ফিনিশিং সবচেয়ে সুন্দর দেখায়।'
    },
    {
      id: 'products',
      title: 'প্রোডাক্ট ক্যাটালগ (Products & Wholesale Catalogue)',
      subtitle: 'নতুন হস্তশিল্প পণ্য যোগ, রিটেল ও পাইকারি দাম এবং MOQ নির্ধারণ',
      icon: Package,
      tabId: 'products',
      steps: [
        '১. "Products & Catalogue" ট্যাবে যান এবং "Add New Product" বাটনে ক্লিক করুন।',
        '২. পণ্যের নাম (Title) এবং সঠিক ক্যাটাগরি সিলেক্ট করুন।',
        '৩. দামের ক্ষেত্রে: Retail Price (খুচরা মূল্য), Bulk Price (পাইকারি মূল্য) এবং MOQ (সর্বনিম্ন কত পিস অর্ডার নিতে পারবেন, যেমন: 20 বা 50 পিস) লিখুন।',
        '৪. পণ্যের ছবি আপলোড করুন এবং ব্যবহৃত ম্যাটেরিয়াল (যেমন: Terracotta Clay, Brass, Cotton) উল্লেখ করুন।',
        '৫. ফর্ম জমা দিন। পণ্যটি ওয়েবসাইটের প্রোডাক্ট পেজে ও সার্চ লিস্টে দেখা যাবে।'
      ],
      tips: 'টিপস: সরকারি বা কর্পোরেট ক্রেতাদের জন্য "Customization Available" অপশনটি চালু রাখবেন।'
    },
    {
      id: 'leads',
      title: 'বাল্ক কোটেশন ও লিডস (B2B Wholesale Leads)',
      subtitle: 'ওয়েবসাইটে আসা পাইকারি ক্রেতাদের রিকোয়েস্ট ও অর্ডার ট্র্যাক করা',
      icon: Flame,
      tabId: 'leads',
      steps: [
        '১. যখন কোনো বড় শোরুম, কর্পোরেট অফিস বা আন্তর্জাতিক ক্রেতা বাল্ক ফর্ম পূরণ করবে, তা "B2B Wholesale Leads" এ জমা হবে।',
        '২. প্রতিটি লিডে গ্রাহকের নাম, ফোন/WhatsApp নম্বর, ইমেল, প্রডাক্টের ধরন ও পরিমাণের স্পষ্ট বিবরণ থাকে।',
        '৩. ক্রেতার সাথে কথা বলার পর স্টেটাস পরিবর্তন করুন: NEW -> CONTACTED -> QUOTATION SENT -> WON।',
        '৪. ইন্টারনাল নোট লিখে রাখতে পারেন (যেমন: "ক্লায়েন্টকে WhatsApp-এ স্যাম্পল পাঠানো হয়েছে")।'
      ],
      tips: 'টিপস: লিড আসার ২৪ ঘণ্টার মধ্যে ক্রেতাকে কল বা WhatsApp করলে অর্ডার পাওয়ার সম্ভাবনা ৯০% বৃদ্ধি পায়।'
    },
    {
      id: 'training',
      title: 'Learn & Earn এবং মহিলা কারিগর প্রশিক্ষণ',
      subtitle: 'গ্রামীণ মহিলাদের জন্য ফ্রি ট্রেনিং এবং আয়ের আবেদন ম্যানেজমেন্ট',
      icon: GraduationCap,
      tabId: 'training',
      steps: [
        '১. "Training & Livelihood" ট্যাবে যান।',
        '২. আগ্রহী গ্রামীণ মহিলারা যারা ওয়েবসাইটে নাম, ঠিকানা ও ফোন দিয়ে আবেদন করেছে, তাদের তালিকা এখানে দেখা যাবে।',
        '৩. আবেদনকারীর সাথে ফোনে যোগাযোগ করে তার আগ্রহ নিশ্চিত করুন এবং "Status" এ গিয়ে Verified বা Admitted হিসেবে চিহ্নিত করুন।',
        '৪. নতুন কোনো ট্রেনিং ব্যাচ বা ক্যাম্প শুরু হলে এখান থেকে নতুন প্রোগ্রাম যোগ করতে পারবেন।'
      ],
      tips: 'টিপস: মহিলাদের আশ্বস্ত করবেন যে ট্রেনিং ও কাঁচামাল ১০০% বিনামূল্যে দেওয়া হয় এবং তৈরির পর জিত প্রাইম নিজেই তৈরি পণ্য ক্রয় করে।'
    },
    {
      id: 'categories',
      title: 'ক্যাটাগরি ও বিভাগ (Categories & Groups)',
      subtitle: 'হস্তশিল্পের মূল বিভাগগুলো পরিচালনা করা',
      icon: Layers,
      tabId: 'categories',
      steps: [
        '১. "Categories & Groups" ট্যাবে ক্লিক করুন।',
        '২. বর্তমান ক্যাটাগরিগুলোর (Handmade Jewellery, Clay Art ইত্যাদি) নাম বা ছবি পরিবর্তন করতে "Edit" চাপুন।',
        '৩. কোনো নতুন শাখা তৈরি করতে "Add Category" এ গিয়ে নাম ও ছবি দিয়ে সংরক্ষণ করুন।'
      ],
      tips: 'টিপস: অপ্রয়োজনীয় ক্যাটাগরি তৈরি না করে পরিষ্কার ও জনপ্রিয় ক্যাটাগরি রাখলে ক্রেতারা সহজে প্রডাক্ট খুঁজে পায়।'
    },
    {
      id: 'artisans',
      title: 'কারিগরদের প্রোফাইল (Artisan Stories)',
      subtitle: 'মাটির কারিগর ও হস্তশিল্পীদের পরিচিতি ওয়েবসাইটের সামনে তুলে ধরা',
      icon: Users,
      tabId: 'artisans',
      steps: [
        '১. "Women Artisans" ট্যাবে যান।',
        '২. নতুন কারিগরের নাম, ছবি, তিনি কোন হস্তশিল্পে পারদর্শী (যেমন: মাটির গয়না তৈরি, পুতুল গড়া, কাঁথা কাজ) এবং তার জীবনসংগ্রামের গল্প লিখুন।',
        '৩. সেভ করুন। এতে ক্রেতারা বুঝতে পারবে প্রতিটি পণ্যের পেছনে খাঁটি কারিগরের শ্রম রয়েছে।'
      ],
      tips: 'টিপস: আন্তর্জাতিক ও কর্পোরেট বায়াররা কারিগরদের গল্প দেখে সবচেয়ে বেশি আকৃষ্ট হয়।'
    },
    {
      id: 'tenders',
      title: 'সরকারি টেন্ডার ও প্রাতিষ্ঠানিক সরবরাহ (Govt. Tenders)',
      subtitle: 'সরকারি মেলা, প্রদর্শনী ও ডিপার্টমেন্টাল টেন্ডার তথ্য প্রকাশ',
      icon: ShieldCheck,
      tabId: 'tenders',
      steps: [
        '১. "Govt. Tenders & RFP" ট্যাবে যান।',
        '২. হস্তশিল্প বা স্মারক সরবরাহের যেকোনো সাম্প্রতিক টেন্ডার ও সরকারি অর্ডারের বিবরণ যোগ বা আপডেট করুন।',
        '৩. জিএসটি ইনভয়েসিং ও প্রাতিষ্ঠানিক স্মারকের তথ্য এখানে সংরক্ষিত থাকে।'
      ],
      tips: 'টিপস: সরকারি ক্লায়েন্টদের জন্য সবসময় মান নিয়ন্ত্রণ ও স্যাম্পল অনুমোদনের শর্ত উল্লেখ রাখবেন।'
    },
    {
      id: 'settings',
      title: 'কোম্পানি সেটিংস ও কন্ট্যাক্ট তথ্য (Company Identity)',
      subtitle: 'ফোন নম্বর, ঠিকানা, WhatsApp নম্বর ও সামাজিক যোগাযোগ লিংক পরিবর্তন',
      icon: Settings,
      tabId: 'settings',
      steps: [
        '১. "Company Identity" ট্যাবে যান।',
        '২. এখানে ফোন নম্বর, WhatsApp নম্বর, ইমেল বা দোকানের ঠিকানা পরিবর্তন করতে পারবেন।',
        '৩. পরিবর্তন করার পর নিচে গিয়ে "Save Company Settings" বাটনে ক্লিক করুন। সাথে সাথে ওয়েবসাইটের সব জায়গায় তথ্য আপডেট হয়ে যাবে।'
      ],
      tips: 'টিপস: WhatsApp নম্বরের আগে কান্ট্রি কোড (+91) সঠিকভাবে দিলে ক্রেতারা সরাসরি চ্যাট করতে পারবে।'
    }
  ];

  const filteredGuides = guides.filter(g => 
    !searchQuery.trim() ||
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.steps.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>অ্যাডমিন সহায়িকা ও ইউজার গাইড</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            জিত প্রাইম অ্যাডমিন প্যানেল ব্যবহারের সম্পূর্ণ বাংলা নির্দেশিকা
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            অ্যাডমিন প্যানেলের কোন সেকশনে কী কাজ হয়, কীভাবে ডিভাইস থেকে ছবি আপলোড করবেন, প্রডাক্ট ও ক্যাটাগরি তৈরি করবেন এবং ক্রেতাদের অর্ডার ম্যানেজ করবেন—তার সহজ ও স্পষ্ট গাইডলাইন।
          </p>
        </div>
      </div>

      {/* Quick Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="কোন বিষয়ে জানতে চান খুঁজুন (যেমন: ছবি আপলোড, দাম, লিডস, ট্রেনিং)..."
          className="w-full bg-transparent border-none text-xs text-slate-900 focus:outline-hidden"
        />
        {searchQuery && (
          <button 
            type="button" 
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
          >
            ক্লিয়ার
          </button>
        )}
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGuides.map(guide => {
          const Icon = guide.icon;
          return (
            <div 
              key={guide.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {guide.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {guide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-1.5 pt-1 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {guide.steps.map((step, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>

                {/* Tip */}
                <div className="text-[11px] text-amber-900 bg-amber-50 px-3 py-2 rounded-md border border-amber-200 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{guide.tips}</span>
                </div>
              </div>

              {/* Direct Jump Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSwitchTab(guide.tabId)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>এই সেকশনটি খুলুন (Open Section)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Best Practices Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>জরুরি টিপস ও সাধারণ সতর্কতা (Best Practices)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <strong className="text-slate-800 block">১. ছবি সাইজ ও কোয়ালিটি</strong>
            <span>মোবাইলের ছবি সরাসরি আপলোড করা যাবে। তবে ব্যাকগ্রাউন্ড পরিষ্কার ও পরিচ্ছন্ন রাখলে হস্তশিল্পের আকর্ষণ বাড়ে।</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <strong className="text-slate-800 block">২. দাম ও MOQ স্পষ্ট রাখুন</strong>
            <span>পাইকারি ও খুচরা মূল্যের পার্থক্য স্পষ্ট রাখলে পাইকারি ক্রেতারা দ্রুত কোটেশনের অনুরোধ করে।</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <strong className="text-slate-800 block">৩. নিরাপত্তা ও লগইন</strong>
            <span>কাজ শেষ হলে উপরের ডানদিকের &ldquo;Logout&rdquo; বোতামে ক্লিক করে লগআউট করবেন।</span>
          </div>
        </div>
      </div>

    </div>
  );
};
