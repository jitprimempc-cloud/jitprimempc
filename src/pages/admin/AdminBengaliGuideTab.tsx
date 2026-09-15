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
  AlertTriangle,
  Tag,
  Video,
  Star,
  Bot,
  FileText,
  Trash2,
  LayoutDashboard
} from 'lucide-react';

interface AdminBengaliGuideTabProps {
  onSwitchTab: (tabId: string) => void;
}

export const AdminBengaliGuideTab: React.FC<AdminBengaliGuideTabProps> = ({ onSwitchTab }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      id: 'products',
      title: '১. প্রোডাক্ট ক্যাটালগ (Products & Catalogue)',
      subtitle: 'নতুন হস্তশিল্প পণ্য যোগ, রিটেল ও পাইকারি দাম, ছবির সাইজ এবং MOQ নির্ধারণ',
      icon: Package,
      tabId: 'products',
      steps: [
        '১. বামদিকের মেনু থেকে "Products & Catalogue" ট্যাবে যান এবং "Add New Product" বাটনে ক্লিক করুন।',
        '২. পণ্যের নাম (Title), বিস্তারিত বর্ণনা এবং সঠিক ক্যাটাগরি নির্বাচন করুন।',
        '৩. দামের ক্ষেত্রে: Retail Price (খুচরা মূল্য), Bulk Price (পাইকারি রেট) এবং MOQ (সর্বনিম্ন অর্ডারের সংখ্যা, যেমন: ২০ বা ৫০ পিস) লিখুন।',
        '৪. পণ্যের ছবি সরাসরি ফোন/কম্পিউটার ডিভাইস থেকে আপলোড করুন অথবা ইমেজ ইউআরএল দিন। একাধিক ছবি ও ম্যাটেরিয়াল নাম যুক্ত করতে পারবেন।',
        '৫. ডিলিট বা এডিট: কোনো প্রডাক্ট ডিলিট করতে চাইলে লাল ট্র্যাশ বাটনে চাপ দিলে কনফার্মেশন পপআপ আসবে, সেখান থেকে নিরাপদভাবে মুছে ফেলতে পারবেন।'
      ],
      tips: 'টিপস: প্রোডাক্টের ছবি পরিষ্কার আলোতে তুললে এবং পাইকারি ও খুচরা রেট স্পষ্টভাবে দিলে বড় বায়াররা দ্রুত অর্ডার পাঠায়।'
    },
    {
      id: 'coupons',
      title: '২. কুপন কোড ও প্রমোশন (Coupons & Promo Codes)',
      subtitle: 'পাইকারি ও উৎসবের বিশেষ ডিসকাউন্ট কোড তৈরি ও মেয়াদ নির্ধারণ',
      icon: Tag,
      tabId: 'coupons',
      steps: [
        '১. "Coupons & Promo Codes (কুপন কোড)" ট্যাবে যান।',
        '২. "Create New Coupon" বাটনে ক্লিক করে কুপন কোডের নাম দিন (যেমন: PUJA2025, WHOLESALE10)।',
        '৩. ডিসকাউন্টের ধরন নির্বাচন করুন: শতকরা ছাড় (Percentage %) অথবা নির্দিষ্ট টাকা (Fixed Amount ₹)।',
        '৪. শর্ত নির্ধারণ করুন: সর্বনিম্ন অর্ডারের পরিমাণ (Min Order Amount) এবং মেয়াদের শেষ তারিখ (Expiry Date)।',
        '৫. যেকোনো সময় কুপন সাময়িকভাবে নিষ্ক্রিয় (Deactivate) বা লাল বাটনে ক্লিক করে কনফার্মেশনের মাধ্যমে ডিলিট করতে পারবেন।'
      ],
      tips: 'টিপস: বড় উৎসব বা প্রথম অর্ডারের জন্য কুপন কোড দিলে ক্রেতারা বেশি উৎসাহ নিয়ে ক্রয় করে।'
    },
    {
      id: 'gallery',
      title: '৩. হাতের কাজের গ্যালারি (Craft Gallery Management)',
      subtitle: 'ডিভাইস থেকে সরাসরি নিখুঁত হস্তশিল্পের ছবি আপলোড ও ক্যাটাগরি অনুযায়ী সাজানো',
      icon: ImageIcon,
      tabId: 'gallery',
      steps: [
        '১. "Craft Gallery (হাতের কাজ)" ট্যাবে যান এবং "নতুন হাতের কাজ যোগ করুন (Add Photo)" বাটনে চাপ দিন।',
        '২. "ডিভাইস থেকে ছবি আপলোড" বোতামে ক্লিক করে আপনার ফোন বা কম্পিউটার থেকে ছবি সিলেক্ট করুন। সাথে সাথে আপলোড হয়ে প্রিভিউ দেখাবে।',
        '৩. ক্যাটাগরি নির্বাচন করুন (যেমন: Jewellery, Terracotta Art, Dokra ইত্যাদি)।',
        '৪. হস্তশিল্পের শিরোনাম, বিবরণ ও কারিগরের নাম লিখে সংরক্ষণ করুন। ওয়েবসাইটে তাৎক্ষণিক ছবি লাইভ হয়ে যাবে।',
        '৫. ভুল ছবি যুক্ত হলে লাল ডিলিট বাটনে ক্লিক করে পপআপে নিশ্চিত করে স্থায়ীভাবে মুছে ফেলা যায়।'
      ],
      tips: 'টিপস: কারিগরদের কাজের প্রক্রিয়ার ছবি গ্যালারিতে রাখলে হস্তশিল্পের সত্যতা ও বিশ্বাসযোগ্যতা অনেক বৃদ্ধি পায়।'
    },
    {
      id: 'videos',
      title: '৪. কাজের ভিডিও ও মেকিং (Work & Craft Videos)',
      subtitle: 'হাতে তৈরির জীবন্ত ভিডিও আপলোড বা ইউটিউব/ভিডিও লিংক প্রদর্শন',
      icon: Video,
      tabId: 'videos',
      steps: [
        '১. "Work & Craft Videos (কাজের ভিডিও)" ট্যাবে যান।',
        '২. "Upload Video" দিয়ে সরাসরি ভিডিও ফাইল আপলোড করতে পারেন অথবা "Add Video Link" দিয়ে লিঙ্ক যুক্ত করতে পারেন।',
        '৩. ভিডিওটির শিরোনাম, বর্ণনা, ক্যাটাগরি এবং একটি আকর্ষণীয় থাম্বনেইল ছবি দিন।',
        '৪. ওয়েবসাইটে ওপর-নিচ সাজাতে তীর চিহ্ন (Arrow Up / Down) বোতাম ব্যবহার করতে পারেন।',
        '৫. কোনো ভিডিও ডিলিট করতে চাইলে ডিলিট বাটনে ক্লিক করলে নিশ্চিতকরণ পপআপ আসবে।'
      ],
      tips: 'টিপস: শর্ট ভিডিও বা রিলে মাটির কাজ ও গয়না তৈরির লাইভ মুহূর্তগুলো বায়ারদের সবচেয়ে বেশি টানে।'
    },
    {
      id: 'categories',
      title: '৫. ক্যাটাগরি ও বিভাগ (Categories & Groups)',
      subtitle: 'হস্তশিল্পের মূল ক্যাটাগরি ও সাব-ক্যাটাগরি তৈরি ও কভার ছবি পরিবর্তন',
      icon: Layers,
      tabId: 'categories',
      steps: [
        '১. "Categories & Groups" ট্যাবে ক্লিক করুন।',
        '২. নতুন ক্যাটাগরি তৈরির জন্য "Add New Category" এ গিয়ে নাম, বাংলা নাম ও কভার ছবি আপলোড করুন।',
        '৩. বর্তমান ক্যাটাগরিগুলোর তথ্য বা ছবি আপডেট করতে নীল "Edit" বাটনে ক্লিক করুন।',
        '৪. অপ্রয়োজনীয় ক্যাটাগরি ডিলিট করতে ডিলিট বাটনে ক্লিক করলে বাংলা সতর্কবার্তা পপআপ আসবে।'
      ],
      tips: 'টিপস: ক্যাটাগরিগুলোর পরিষ্কার ও আকর্ষণীয় কভার ছবি রাখলে পুরো ওয়েবসাইটের রূপ প্রফেশনাল দেখায়।'
    },
    {
      id: 'leads',
      title: '৬. বাল্ক কোটেশন ও বিটুবি লিডস (B2B Wholesale Leads)',
      subtitle: 'বড় পাইকারি ক্রেতাদের অনুসন্ধান, হোয়াটসঅ্যাপ চ্যাট ও অর্ডার ট্র্যাক করা',
      icon: Flame,
      tabId: 'leads',
      steps: [
        '১. যখন কোনো বড় শোরুম, বুটিক, কর্পোরেট অফিস বা আন্তর্জাতিক ক্রেতা ফর্ম পূরণ করে, তা "B2B Wholesale Leads" এ জমা হয়।',
        '২. প্রতিটি লিডে ক্রেতার নাম, কোম্পানি, ফোন/হোয়াটসঅ্যাপ নম্বর, ইমেল এবং চাওয়া পণ্যের পরিমাণ থাকে।',
        '৩. সরাসরি সবুজ WhatsApp বাটনে ক্লিক করে ক্রেতার সাথে চ্যাট শুরু করতে পারেন।',
        '৪. স্টেটাস পরিবর্তন করুন (New -> Contacted -> Won) এবং ইন্টারনাল নোট লিখে সংরক্ষণ করুন।',
        '৫. ভুয়া বা অপ্রয়োজনীয় লিড মুছে ফেলতে ডিলিট বাটনে ক্লিক করে কনফার্ম করুন।'
      ],
      tips: 'টিপস: লিড আসার সাথে সাথে দ্রুত WhatsApp এ যোগাযোগ করলে বড় অর্ডারের সম্ভাবনা বহুগুণ বেড়ে যায়।'
    },
    {
      id: 'training',
      title: '৭. ট্রেনিং ও কাজের আবেদন (Training & Livelihood Applications)',
      subtitle: 'গ্রামীণ মহিলাদের ট্রেনিং এবং কাজের সুযোগের ফর্ম ও যোগাযোগ তালিকা',
      icon: Users,
      tabId: 'training',
      steps: [
        '১. "Training & Livelihood" ট্যাবে যান।',
        '২. আগ্রহী গ্রামীণ মহিলারা যারা ওয়েবসাইটে নাম, ঠিকানা ও ফোন নম্বর দিয়ে আবেদন করেছেন তাদের তালিকা "Applications" সেকশনে দেখতে পাবেন।',
        '৩. এই সেকশনে ট্রেনিংয়ের জন্য আগ্রহীরা এবং সরাসরি কাজের জন্য আগ্রহীরা উভয়ই আবেদন করতে পারবেন। "Worker Application" বা মহিলা আবেদনের জন্য আলাদা কোনো অপশন নেই, এই একটি ফর্ম থেকেই সব ম্যানেজ করা হবে।',
        '৪. আবেদনকারীর সাথে ফোনে যোগাযোগ করে তার কাজের সুযোগ নিশ্চিত করুন এবং স্ট্যাটাস "Approved" করুন।'
      ],
      tips: 'টিপস: আবেদনকারীর সাথে দ্রুত যোগাযোগ করে তাদের ট্রেনিং বা কাজে যুক্ত করলে উৎপাদনের মান সেরা হয়।'
    },
    {
      id: 'artisans',
      title: '৮. আমাদের কারিগরবৃন্দ (Our Artisans Management)',
      subtitle: 'মাটির কারিগর ও শিল্পীদের প্রোফাইল ও জীবনসংগ্রামের গল্প পরিচালনা',
      icon: Users,
      tabId: 'artisans',
      steps: [
        '১. "Our Artisans" ট্যাবে যান এবং "Add Artisan" বাটনে ক্লিক করুন।',
        '২. কারিগরের নাম, ছবি (ডিভাইস থেকে আপলোড বা লিঙ্ক), অভিজ্ঞতা ও দক্ষতার ক্ষেত্র (Terracotta, Jewellery, Painting) লিখুন।',
        '৩. তাদের জীবনসংগ্রাম ও সাফল্যের গল্প বিস্তারিতভাবে লিখুন।',
        '৪. তথ্য এডিট বা মুছে ফেলতে তালিকা থেকে যথাক্রমে এডিট বা ডিলিট কনফার্মেশন ব্যবহার করুন।'
      ],
      tips: 'টিপস: সরকারি ও কর্পোরেট বায়াররা মাটির কারিগরদের আসল গল্প পড়ে বেশি অনুপ্রাণিত হয়ে অর্ডার প্রদান করে।'
    },
    {
      id: 'team',
      title: '৯. আমাদের টিম মেম্বার (Our Team - About Page)',
      subtitle: 'অ্যাবাউট পেজের জন্য টিম মেম্বারদের বড় সাইজ ছবি (Flipkart/YouTube স্টাইল) ও পদবি সংযোজন',
      icon: Users,
      tabId: 'team',
      steps: [
        '১. "Our Team (আমাদের টিম - About)" ট্যাবে যান।',
        '২. "নতুন টিম মেম্বার যোগ করুন (Add Team Member)" বাটনে ক্লিক করুন।',
        '৩. মেম্বারের নাম, পদবি (যেমন: Founder, Master Craftsman, Production Lead), ফোন/ইমেল ও পরিচিতি লিখুন।',
        '৪. ছবি নির্বাচন: আপনার কম্পিউটার/মোবাইল থেকে সরাসরি ছবি আপলোড করুন অথবা ফটো লিঙ্ক দিন। ছবি বড় আকারে (Flipkart স্কয়ার বা YouTube থাম্বনেইল স্টাইলে) ওয়েবসাইটে দেখা যাবে।',
        '৫. টিম মেম্বারের ছবি পরিবর্তন করতে এডিট করুন অথবা ডিলিট বাটনে ক্লিক করে কনফার্মেশন পপআপে "হ্যাঁ, মুছে ফেলুন" নির্বাচন করুন।'
      ],
      tips: 'টিপস: টিম মেম্বারদের পরিষ্কার পোর্ট্রেট বা ওয়ার্কশপের কাজের ছবি দিলে কোম্পানি সম্পর্কে অসাধারণ প্রফেশনাল ইমেজ তৈরি হয়।'
    },
    {
      id: 'training',
      title: '১০. প্রশিক্ষণ ও জীবিকা (Training & Livelihood)',
      subtitle: 'মহিলাদের হস্তশিল্প প্রশিক্ষণ প্রোগ্রাম, ব্যাচ তথ্য ও আয়ের সুযোগ পরিচালনা',
      icon: GraduationCap,
      tabId: 'training',
      steps: [
        '১. "Training & Livelihood" ট্যাবে যান।',
        '২. নতুন ট্রেনিং ব্যাচ তৈরির জন্য কোর্স শিরোনাম, মেয়াদ, আসন সংখ্যা ও প্রশিক্ষণ কেন্দ্রের ঠিকানা দিয়ে সংরক্ষণ করুন।',
        '৩. ট্রেনিং পেজে আবেদন করা প্রার্থীদের তালিকা দেখে তাদের অ্যাডমিশন স্ট্যাটাস আপডেট করুন।',
        '৪. ট্রেনিং সংক্রান্ত কোনো এন্ট্রি ডিলিট করতে লাল বাটনে ক্লিক করে নিরাপদ কনফার্মেশন সম্পূর্ণ করুন।'
      ],
      tips: 'টিপস: প্রশিক্ষণে বিনামূল্যে কাঁচামাল প্রদান ও তৈরি পণ্য কিনে নেওয়ার নিশ্চয়তা উল্লেখ থাকলে নারীদের অংশগ্রহণ বাড়ে।'
    },
    {
      id: 'banners',
      title: '১১. হোমপেজ অফার ব্যানার ও কাউন্টডাউন (Banners & Countdown)',
      subtitle: 'হোমপেজের আকর্ষণীয় ব্যানার, হেডলাইন, অফার ট্যাগ ও কাউন্টডাউন টাইমার তৈরি',
      icon: Sparkles,
      tabId: 'banners',
      steps: [
        '১. "Banners & Countdown" ট্যাবে গিয়ে "Add New Banner" চাপুন।',
        '২. ব্যানারের মূল শিরোনাম, সাব-টাইটেল ও কল-টু-অ্যাকশন বোতামের লিংক সেট করুন।',
        '৩. অফার ব্যানার হলে শেষ হওয়ার তারিখ ও সময় দিলে হোমপেজে লাইভ কাউন্টডাউন টাইমার চলবে।',
        '৪. ব্যানার অন/অফ করতে টগল বাটন ব্যবহার করুন অথবা বাদ দিতে ডিলিট কনফার্মেশন ব্যবহার করুন।'
      ],
      tips: 'টিপস: উৎসব ও মেলার সময় কাউন্টডাউন ব্যানার চালু রাখলে অর্ডারের সংখ্যা উল্লেখযোগ্যভাবে বৃদ্ধি পায়।'
    },
    {
      id: 'sections',
      title: '১২. কাস্টম সেকশন ও প্রমোশনাল ব্লক (Custom Sections)',
      subtitle: 'হোমপেজ বা অন্যান্য পেজে বিশেষ বার্তা বা নতুন ব্লকের অবস্থান নিয়ন্ত্রণ',
      icon: Layers,
      tabId: 'sections',
      steps: [
        '১. "Custom Sections" ট্যাবে গিয়ে নতুন সেকশন যোগ করতে পারেন।',
        '২. সেকশনের শিরোনাম, বর্ণনা ও ছবি যুক্ত করে দৃশ্যমানতা (Visibility) অন বা অফ করতে পারেন।',
        '৩. অপ্রয়োজনীয় সেকশন লাল ডিলিট বোতামে ক্লিক করে পপআপ থেকে স্থায়ীভাবে সরিয়ে ফেলুন।'
      ],
      tips: 'টিপস: বিশেষ কোনো প্রদর্শনী বা বিশেষ অর্ডারের ঘোষণা দেওয়ার জন্য কাস্টম সেকশন ব্যবহার করুন।'
    },
    {
      id: 'tenders',
      title: '১৩. সরকারি টেন্ডার ও প্রাতিষ্ঠানিক সরবরাহ (Govt. Tenders & RFP)',
      subtitle: 'সরকারি মেলা, প্রদর্শনী ও ডিপার্টমেন্টাল টেন্ডার তথ্য প্রকাশ ও ট্র্যাক করা',
      icon: ShieldCheck,
      tabId: 'tenders',
      steps: [
        '১. "Govt. Tenders & RFP" ট্যাবে যান।',
        '২. হস্তশিল্প বা স্মারক সরবরাহের যেকোনো সাম্প্রতিক টেন্ডার ও সরকারি অর্ডারের বিবরণ যোগ বা আপডেট করুন।',
        '৩. জিএসটি ইনভয়েসিং, প্রাতিষ্ঠানিক স্মারক এবং সরবরাহের ডেডলাইন ট্র্যাক করুন।',
        '৪. মেয়াদোত্তীর্ণ টেন্ডার ডিলিট বোতামে ক্লিক করে কনফার্মেশনের মাধ্যমে মুছে ফেলা যায়।'
      ],
      tips: 'টিপস: সরকারি ক্লায়েন্টদের জন্য সবসময় মান নিয়ন্ত্রণ ও জিএসটি কোটেশন স্পষ্ট রাখবেন।'
    },
    {
      id: 'testimonials',
      title: '১৪. গ্রাহক রিভিউ ও প্রশংসাপত্র (Client Reviews)',
      subtitle: 'সন্তুষ্ট গ্রাহক, কর্পোরেট বায়ার ও শোরুমের রিভিউ যুক্ত ও প্রদর্শন করা',
      icon: Star,
      tabId: 'testimonials',
      steps: [
        '১. "Client Reviews (গ্রাহক রিভিউ)" ট্যাবে যান।',
        '২. গ্রাহকের নাম, কোম্পানির নাম/শহর, তাদের রেটিং (যেমন: ৫ স্টার) ও মন্তব্য লিখে যুক্ত করুন।',
        '৩. গ্রাহকের ছবি বা কোম্পানির লোগো আপলোড করতে পারেন।',
        '৪. কোনো ভুয়া বা অবাঞ্ছিত রিভিউ মুছে ফেলার জন্য লাল ডিলিট বাটনে ক্লিক করে নিরাপদ কনফার্মেশন করুন।'
      ],
      tips: 'টিপস: আসল কর্পোরেট বায়ারদের প্রশংসাপত্র হোমপেজে থাকলে নতুন বায়ারদের আস্থা শতগুণ বেড়ে যায়।'
    },
    {
      id: 'campaign',
      title: '১৫. উৎসব ও দুর্গা পূজা ক্যাম্পেইন (Festive Campaign)',
      subtitle: 'পূজা কালেকশন, উপহার বক্স ও সিজনাল হস্তশিল্পের বিশেষ অফার সেটিং',
      icon: Sparkles,
      tabId: 'campaign',
      steps: [
        '১. "Durga Puja Campaign" ট্যাবে গিয়ে বিশেষ উৎসবের অফার কনফিগার করুন।',
        '২. পূজা স্পেশাল গিফট হ্যাম্পার ও মাটির গয়নার বিশেষ ক্যাম্পেইন ব্যানার ও ছাড় সক্রিয় করুন।'
      ],
      tips: 'টিপস: উৎসবের ১৫-২০ দিন আগে থেকেই ক্যাম্পেইন চালু করে প্রচার করলে সর্বোচ্চ বিক্রয় পাওয়া যায়।'
    },
    {
      id: 'knowledge',
      title: '১৬. এআই চ্যাটবট ও জ্ঞানভাণ্ডার (AI Knowledge & FAQs)',
      subtitle: 'ওয়েবসাইটের এআই অ্যাসিস্ট্যান্টের জন্য প্রশ্নোত্তর ও সাধারণ তথ্যাবলি যুক্ত করা',
      icon: Bot,
      tabId: 'knowledge',
      steps: [
        '১. "AI Knowledge & FAQs" ট্যাবে যান এবং "Add Question & Answer" চাপুন।',
        '২. গ্রাহকরা সচরাচর যে প্রশ্ন করেন (যেমন: সর্বনিম্ন অর্ডার কত? ডেলিভারি কতদিনে হয়? ডিসকাউন্ট কীভাবে পাব?) তা প্রশ্ন ও উত্তরে লিখে দিন।',
        '৩. এআই চ্যাটবট স্বয়ংক্রিয়ভাবে এই তথ্য মুখস্থ করে বাংলা, হিন্দি ও ইংরেজিতে গ্রাহকদের উত্তর দেবে।',
        '৪. পুরনো প্রশ্নোত্তর পরিবর্তন করতে এডিট বা নিরাপদ ডিলিট পপআপের মাধ্যমে মুছে ফেলতে পারেন।'
      ],
      tips: 'টিপস: পাইকারি দামের নিয়মাবলী ও যোগাযোগ নম্বর (+91 82405 85219) এআই সিস্টেমে অন্তর্ভুক্ত রাখা আছে।'
    },
    {
      id: 'media',
      title: '১৭. মিডিয়া ও অ্যাসেট লাইব্রেরি (Media & Asset Library)',
      subtitle: 'সমস্ত আপলোড করা ছবি ও ফাইলের ভাণ্ডার, লিংক কপি ও ফাইল রিমুভাল',
      icon: ImageIcon,
      tabId: 'media',
      steps: [
        '১. "Media & Asset Library" ট্যাবে যান।',
        '২. আপনার কম্পিউটারের ড্রাইভ থেকে যেকোনো ছবি ড্র্যাগ বা সিলেক্ট করে আপলোড করতে পারেন।',
        '৩. যেকোনো ছবির পাশে থাকা "Copy URL" বাটনে চাপ দিয়ে লিঙ্ক কপি করে প্রোডাক্ট বা ব্যানারে ব্যবহার করতে পারেন।',
        '৪. অপ্রয়োজনীয় ফাইল মুছতে লাল ডিলিট বাটনে ক্লিক করে কনফার্মেশন পপআপে নিশ্চিত করুন।'
      ],
      tips: 'টিপস: মিডিয়া লাইব্রেরি ব্যবহার করে এক ক্লিকেই ছবির লিঙ্ক পেয়ে অন্য যেকোনো ফর্মে পেস্ট করা যায়।'
    },
    {
      id: 'legal',
      title: '১৮. আইনি নীতিমালা ও পলিসি (Legal & Policies)',
      subtitle: 'শর্তাবলী, রিফান্ড পলিসি, পাইকারি শিপিং নিয়ম ও প্রোপাইটর ঘোষণা',
      icon: FileText,
      tabId: 'legal',
      steps: [
        '১. "Legal & Policies" ট্যাবে গিয়ে ব্যবসার শর্তাবলী, প্রাইভেসি পলিসি ও রিটার্ন পলিসি সম্পাদনা করতে পারেন।',
        '২. এডিট শেষে "Save Policies" বাটনে চাপলে ওয়েবসাইটের ফুটারের লিগ্যাল পেজে সব লাইভ হয়ে যাবে।'
      ],
      tips: 'টিপস: পাইকারি অর্ডারে অ্যাডভান্স পেমেন্ট ও ড্যামেজ ক্লেইমের নিয়মাবলী স্পষ্ট লিখে রাখা আইনত নিরাপদ।'
    },
    {
      id: 'settings',
      title: '১৯. কোম্পানি পরিচয়, পাসওয়ার্ড ও সেটিংস (Company Identity)',
      subtitle: 'প্রোপাইটর নাম (মনোজিত দে), ফোন, WhatsApp, ঠিকানা ও অ্যাডমিন পাসওয়ার্ড পরিবর্তন',
      icon: Settings,
      tabId: 'settings',
      steps: [
        '১. "Company Identity & Passwords" ট্যাবে যান।',
        '২. কোম্পানির নাম (Jit Prime MPC Company), স্বত্বাধিকারীর নাম (Monojit Dey), মোবাইল ও WhatsApp নম্বর পরিবর্তন করতে পারবেন।',
        '৩. দোকানের পূর্ণ ঠিকানা (যেমন: রাজারহাট রোড, কলকাতা-৭০০১৩৫, পশ্চিমবঙ্গ) আপডেট করতে পারবেন।',
        '৪. নতুন সিকিউর অ্যাডমিন পাসওয়ার্ড সেট করার ব্যবস্থা রয়েছে।',
        '৫. পরিবর্তন শেষে নিচে "Save Company Settings" চাপুন। পুরো ওয়েবসাইটে তাৎক্ষণিক সব তথ্য আপডেট হয়ে যাবে।'
      ],
      tips: 'টিপস: WhatsApp নম্বরে কান্ট্রি কোড (+91) দিলে দেশি ও বিদেশি উভয় বায়াররাই ১ ক্লিকে চ্যাট করতে পারে।'
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
      <div className="bg-[#0B1A30] text-white p-6 sm:p-8 rounded-2xl border-2 border-amber-400/80 shadow-md relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>অ্যাডমিন সহায়িকা ও ইউজার ম্যানুয়াল v1.1</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif-heading">
            জিত প্রাইম অ্যাডমিন প্যানেলের সম্পূর্ণ বাংলা সহায়িকা
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            অ্যাডমিন প্যানেলের প্রতিটি মেনুর কাজ, প্রোডাক্ট যোগ-এডিট-ডিলিট, বড় সাইজের টিম ছবি সংযোজন, ডিভাইস থেকে ফটো আপলোড এবং ক্লায়েন্ট হ্যান্ডলিংয়ের এ টু জেড নির্দেশিকা নিচে ধাপে ধাপে দেওয়া হলো।
          </p>
        </div>
      </div>

      {/* Safety Deletion Feature Notification Card */}
      <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 p-5 rounded-2xl border-2 border-red-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-red-900 font-bold text-sm sm:text-base">
          <div className="p-1.5 bg-red-600 text-white rounded-lg shrink-0">
            <Trash2 className="w-4 h-4" />
          </div>
          <span>নতুন নিরাপদ কনফার্মেশন ও ডিলিট ফিচার (Safe Delete Confirmation Flow)</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          অ্যাডমিন প্যানেলের প্রতিটি সেকশনে (প্রোডাক্ট, কুপন, গ্যালারি, ভিডিও, টিম মেম্বার, কারিগর, ক্যাটাগরি, রিভিউ ইত্যাদি) এখন নিরাপদ ও দৃষ্টিনন্দন বাংলা কনফার্মেশন পপআপ যুক্ত করা হয়েছে। কোনো লাল ডিলিট বোতামে ক্লিক করলে ব্রাউজার ব্লক না হয়ে সুন্দর একটি ডায়লগ বক্স আসবে এবং প্রডাক্টের নাম নিশ্চিত করে &ldquo;হ্যাঁ, মুছে ফেলুন&rdquo; চাপলে তা স্থায়ীভাবে ডিলিট হয়ে যাবে। ভুলবশত ক্লিক লাগলেও &ldquo;বাতিল করুন&rdquo; চেপে সহজেই নিরাপদ থাকা যাবে।
        </p>
      </div>

      {/* Quick Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="কোন মেনু বা ফিচার নিয়ে জানতে চান? (যেমন: টিম, প্রোডাক্ট, ডিলিট, কুপন, ছবি আপলোড, দাম, লিডস)..."
          className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-900 focus:outline-hidden"
        />
        {searchQuery && (
          <button 
            type="button" 
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 shrink-0 font-bold px-2 py-1 bg-slate-100 rounded"
          >
            ক্লিয়ার
          </button>
        )}
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGuides.map(guide => {
          const Icon = guide.icon;
          return (
            <div 
              key={guide.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        {guide.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {guide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-1.5 pt-1 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {guide.steps.map((step, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>

                {/* Tip */}
                <div className="text-[11px] text-amber-950 bg-amber-50 px-3 py-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{guide.tips}</span>
                </div>
              </div>

              {/* Direct Jump Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSwitchTab(guide.tabId)}
                  className="w-full py-2.5 bg-[#0B1A30] hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>এই মেনুতে যান (Go to this Admin Tab)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Best Practices Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 font-serif-heading">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>প্রয়োজনীয় টিপস ও সাধারণ সতর্কতা (Admin Best Practices)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 pt-1">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
            <strong className="text-slate-900 block text-xs font-bold">১. ছবি সাইজ ও কোয়ালিটি</strong>
            <span className="leading-relaxed block">মোবাইলের যেকোনো ছবি সরাসরি আপলোড করা যায়। তবে টিম মেম্বারদের জন্য স্কয়ার বা বড় থাম্বনেইল ছবি এবং প্রোডাক্টের জন্য সাদা/হালকা ব্যাকগ্রাউন্ডে ছবি দিলে আকর্ষণ সবচেয়ে বেশি থাকে।</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
            <strong className="text-slate-900 block text-xs font-bold">২. দাম ও MOQ স্পষ্ট রাখা</strong>
            <span className="leading-relaxed block">খুচরা দামের পাশাপাশি পাইকারি দাম ও সর্বনিম্ন পিস (MOQ) উল্লেখ রাখলে বড় পাইকারি বা শোরুমের ক্রেতারা সরাসরি যোগাযোগ করে।</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
            <strong className="text-slate-900 block text-xs font-bold">৩. নিরাপদ ডিলিট ও লগআউট</strong>
            <span className="leading-relaxed block">কোনো কিছু ডিলিট করার আগে নিশ্চিতকরণ পপআপে নাম যাচাই করে নিন। কাজ সম্পন্ন হলে ওপরের ডানদিকের বোতামে ক্লিক করে লগআউট করুন।</span>
          </div>
        </div>
      </div>

      {/* Version badge */}
      <div className="text-center text-[11px] text-slate-400 pt-2">
        Jit Prime MPC Company Admin Portal & Guide System — Version 1.1 (Production Ready)
      </div>

    </div>
  );
};
