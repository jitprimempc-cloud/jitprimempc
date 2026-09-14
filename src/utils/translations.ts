export type Language = 'en' | 'bn' | 'hi';

export interface TranslationDict {
  // Navigation
  nav_home: string;
  nav_products: string;
  nav_gallery: string;
  nav_women_work: string;
  nav_bulk: string;
  nav_govt: string;
  nav_international: string;
  nav_about: string;
  nav_contact: string;
  nav_get_quote: string;
  nav_more: string;
  nav_admin: string;
  primary_phone_label: string;
  alt_phone_label: string;
  all_contacts_label: string;

  // Puja Banner
  puja_tag: string;
  puja_sub: string;
  puja_headline: string;
  puja_desc: string;
  puja_cta: string;
  time_days: string;
  time_hrs: string;
  time_min: string;
  time_sec: string;

  // Hero Section
  hero_badge: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_desc: string;
  hero_cta_bulk: string;
  hero_cta_catalog: string;
  hero_cta_whatsapp: string;
  hero_pillar_craft: string;
  hero_pillar_craft_sub: string;
  hero_pillar_women: string;
  hero_pillar_women_sub: string;
  hero_pillar_govt: string;
  hero_pillar_govt_sub: string;
  hero_pillar_export: string;
  hero_pillar_export_sub: string;

  // Core Pillars / About Preview
  pillars_heading: string;
  pillars_sub: string;
  pillar1_title: string;
  pillar1_desc: string;
  pillar2_title: string;
  pillar2_desc: string;
  pillar3_title: string;
  pillar3_desc: string;
  pillar4_title: string;
  pillar4_desc: string;

  // Women / Work Purpose Section
  women_heading: string;
  women_sub: string;
  women_desc: string;
  women_point1_title: string;
  women_point1_desc: string;
  women_point2_title: string;
  women_point2_desc: string;
  women_point3_title: string;
  women_point3_desc: string;
  women_cta: string;
  women_disclaimer: string;

  // Videos Section
  video_heading: string;
  video_sub: string;
  video_tag: string;
  video_play: string;
  video_watch_hd: string;
  video_close: string;
  video_workshop_tag: string;

  // Featured Products
  products_heading: string;
  products_sub: string;
  cat_all: string;
  filter_moq: string;
  filter_price: string;
  card_btn_quote: string;
  card_btn_whatsapp: string;
  card_btn_details: string;
  view_all_products: string;

  // Government Tender & Institutional
  govt_heading: string;
  govt_sub: string;
  govt_desc: string;
  govt_p1: string;
  govt_p2: string;
  govt_p3: string;
  govt_p4: string;
  govt_cta: string;

  // International
  intl_heading: string;
  intl_sub: string;
  intl_desc: string;
  intl_p1: string;
  intl_p2: string;
  intl_p3: string;
  intl_cta: string;

  // Testimonials & Reviews
  reviews_heading: string;
  reviews_sub: string;
  reviews_write_btn: string;

  // FAQ
  faq_heading: string;
  faq_sub: string;

  // Bottom CTA
  bottom_cta_title: string;
  bottom_cta_desc: string;
  bottom_cta_btn_primary: string;
  bottom_cta_call_btn: string;

  // Footer
  footer_about_title: string;
  footer_about_text: string;
  footer_quick_links: string;
  footer_craft_categories: string;
  footer_contact_info: string;
  footer_office_address: string;
  footer_proprietor: string;
  footer_rights: string;
  footer_disclaimer: string;

  // Modals & Chatbot
  modal_bulk_title: string;
  modal_bulk_sub: string;
  modal_name: string;
  modal_company: string;
  modal_phone: string;
  modal_email: string;
  modal_product: string;
  modal_qty: string;
  modal_dest: string;
  modal_date: string;
  modal_notes: string;
  modal_branding_check: string;
  modal_submit: string;
  modal_cancel: string;
  modal_success_title: string;
  modal_success_desc: string;

  chat_title: string;
  chat_status: string;
  chat_placeholder: string;
  chat_send: string;
  chat_quick_prompt1: string;
  chat_quick_prompt2: string;
  chat_quick_prompt3: string;

  // Additional aliases & keys used across components
  badge_gst: string;
  badge_workshop: string;
  badge_gem: string;
  badge_women: string;
  badge_custom: string;
  badge_dispatch: string;

  hero_tag: string;
  hero_heading: string;
  hero_sub: string;
  hero_cta_learn: string;
  hero_cta_call: string;

  pillars_tag: string;
  pillars_title: string;

  women_tag: string;
  women_puja_tag: string;
  women_title: string;
  women_puja_desc: string;
  women_cta_participate: string;

  prod_tag: string;
  prod_title: string;
  prod_sub: string;
  prod_view_all: string;
  prod_all_cat: string;
  prod_unit_moq: string;
  prod_details_btn: string;
  prod_order_btn: string;

  video_title: string;
  video_explore_gallery: string;
  video_watch_btn: string;

  govt_tag: string;
  govt_title: string;

  intl_tag: string;
  intl_title: string;

  direct_call: string;
  nav_artisans: string;
  nav_training: string;
  nav_intl: string;
  chatbot_title: string;

  [key: string]: any;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    nav_home: "Home",
    nav_products: "Products",
    nav_gallery: "Craft Gallery",
    nav_women_work: "Women & Craft Work",
    nav_bulk: "Bulk Orders",
    nav_govt: "Govt & Institutional",
    nav_international: "International Buyers",
    nav_about: "About Us",
    nav_contact: "Contact Us",
    nav_get_quote: "Get Bulk Quote",
    nav_more: "More",
    nav_admin: "Admin",
    primary_phone_label: "Primary Contact",
    alt_phone_label: "Additional Lines",
    all_contacts_label: "Call Monojit Dey",

    puja_tag: "Festive Production Window",
    puja_sub: "Durga Puja & Diwali 2026 Bulk Bookings",
    puja_headline: "Handcrafted Terracotta Jewellery & Clay Idols",
    puja_desc: "Reserve artisan cluster manufacturing capacity early for timely delivery of festive jewellery, clay diyas, and authentic Bengali folk decor.",
    puja_cta: "Request Festive Bulk Quote",
    time_days: "Days",
    time_hrs: "Hrs",
    time_min: "Min",
    time_sec: "Sec",

    hero_badge: "JIT PRIME MPC COMPANY • Authentic Hasta Shilpa",
    hero_title_line1: "Handmade Clay & Terracotta Jewellery",
    hero_title_line2: "Manufacturing from West Bengal",
    hero_desc: "We connect authentic Indian handcrafted products with individual, bulk, institutional, and government buyers — creating genuine order-based production opportunities for women artisans.",
    hero_cta_bulk: "Request Bulk Quote",
    hero_cta_catalog: "Explore Catalog",
    hero_cta_whatsapp: "WhatsApp Us",
    hero_pillar_craft: "100% Handcrafted",
    hero_pillar_craft_sub: "Pure clay, terracotta & heritage folk craft",
    hero_pillar_women: "Women Artisan Work",
    hero_pillar_women_sub: "Genuine order-based workshop opportunities",
    hero_pillar_govt: "Govt & Institutional",
    hero_pillar_govt_sub: "Tender compliance, GST billing & bulk scale",
    hero_pillar_export: "Export Ready",
    hero_pillar_export_sub: "Secure protective packing for global delivery",

    pillars_heading: "Our Core Handmade Business",
    pillars_sub: "Authentic Bengal Hasta Shilpa crafted with patience, heritage techniques and perfection",
    pillar1_title: "Handmade Clay & Terracotta Art",
    pillar1_desc: "Artisanal clay idols, terracotta wall plaques, decorative vases, and traditional diyas moulded from riverbed clay and baked in firewood kilns.",
    pillar2_title: "Terracotta & Fashion Jewellery",
    pillar2_desc: "Hand-painted clay earrings, necklaces, jhumkas, chokers, and festive sets decorated with organic pigments, cotton dori, and beads.",
    pillar3_title: "Government Tender & Institutional Supply",
    pillar3_desc: "Trusted vendor for emporiums, state cultural events, municipal corporate gifting, and tender orders with full documentation and GST billing.",
    pillar4_title: "International Wholesale & Export",
    pillar4_desc: "High-volume supply tailored for global boutique curators, ethnic gift importers, and international Bengali diaspora cultural associations.",

    women_heading: "Empowering Women Through Real Craft Production",
    women_sub: "Order-based handmade production opportunities in our Kolkata workshop cluster",
    women_desc: "At Jit Prime MPC Company, skilled women participate in handmade clay jewellery making, precision moulding, and artistic hand-painting. We connect artisans directly with genuine bulk and institutional orders — providing meaningful, dignified production work especially during peak festive windows like Durga Puja.",
    women_point1_title: "Structured Workshop Environment",
    women_point1_desc: "Women artisans work together in a supportive craft setup with access to natural clay, kilns, non-toxic colors, and quality tools.",
    women_point2_title: "Festive Pre-Puja Production",
    women_point2_desc: "Ahead of Durga Puja and festive seasons, bulk orders create substantial production schedules for traditional jewellery and folk decor.",
    women_point3_title: "Fair Order-Based Remuneration",
    women_point3_desc: "Earnings are directly tied to verified production quantities with transparent rates, ensuring self-reliance and recognition.",
    women_cta: "View Production Opportunities",
    women_disclaimer: "*Production and work opportunities depend on confirmed client orders and seasonal demand. We maintain an honest, professional approach without false promises of guaranteed income or jobs.",

    video_heading: "Our Craft & Production in Motion",
    video_sub: "Watch skilled artisans moulding, firing, and finishing authentic clay jewellery and decor",
    video_tag: "Artisan Craftsmanship",
    video_play: "Play Video",
    video_watch_hd: "Watch Workshop Video",
    video_close: "Close",
    video_workshop_tag: "Workshop Footage",

    products_heading: "Featured Wholesale & Bulk Collection",
    products_sub: "Handcrafted products available for immediate sample dispatch and bulk production booking",
    cat_all: "All Crafts",
    filter_moq: "Min Order (MOQ)",
    filter_price: "Bulk Price",
    card_btn_quote: "Get Bulk Quote",
    card_btn_whatsapp: "Enquire on WhatsApp",
    card_btn_details: "View Details",
    view_all_products: "View All Products & Catalogue",

    govt_heading: "Government Tenders & Institutional Supply",
    govt_sub: "Reliable manufacturing and bulk supply partner for public emporiums, boards & corporations",
    govt_desc: "Jit Prime MPC Company has extensive experience executing large-scale handicraft tenders, corporate gifting mementos, and cultural souvenir requirements. We handle institutional specifications with complete compliance.",
    govt_p1: "Full GST invoicing and official tender documentation compliance",
    govt_p2: "Strict quality control matching pre-approved sample specifications",
    govt_p3: "Proven capacity for 500 to 10,000+ units delivered on schedule",
    govt_p4: "Customized institutional branding, laser engraving & gift packaging",
    govt_cta: "Submit Institutional Tender Enquiry",

    intl_heading: "International Buyers & Global Export",
    intl_sub: "Bringing Bengal's authentic folk art to retail boutiques and cultural societies worldwide",
    intl_desc: "We assist international importers, ethnic boutique owners, and diaspora cultural associations across USA, UK, Canada, Australia, and UAE with export-ready packaging and clear logistics coordination.",
    intl_p1: "Shock-resistant multi-layer cushioning for delicate terracotta",
    intl_p2: "Flexible minimum order quantities for boutique trial shipments",
    intl_p3: "International documentation, customs invoice & prompt dispatch",
    intl_cta: "Connect for Export Orders",

    reviews_heading: "Verified Client Reviews & Feedback",
    reviews_sub: "What boutique curators, corporate buyers, and institutional partners say about our craft",
    reviews_write_btn: "Write a Client Review",

    faq_heading: "Frequently Asked Questions",
    faq_sub: "Clear answers on ordering, manufacturing, minimum quantities, and delivery",

    bottom_cta_title: "Ready to Discuss Your Bulk or Custom Order?",
    bottom_cta_desc: "Connect directly with proprietor Monojit Dey for quotations, custom samples, tender specifications, and production planning.",
    bottom_cta_btn_primary: "Request Bulk Quotation",
    bottom_cta_call_btn: "Call Directly",

    footer_about_title: "JIT PRIME MPC COMPANY",
    footer_about_text: "Premier manufacturer and bulk supplier of handmade clay crafts, terracotta jewellery, Dokra, and authentic Bengal Hasta Shilpa. Committed to craftsmanship, customer trust, and meaningful women artisan empowerment.",
    footer_quick_links: "Quick Links",
    footer_craft_categories: "Craft Specialties",
    footer_contact_info: "Official Contact",
    footer_office_address: "Belghoria Nimta, Khudiram Pally, Near 42 Pally Club, Landmark: Horijon School, Kolkata - 700049, West Bengal, India",
    footer_proprietor: "Proprietor: Monojit Dey",
    footer_rights: "All rights reserved.",
    footer_disclaimer: "Registered handicraft enterprise. Production schedules and order terms confirmed via formal quotation.",

    modal_bulk_title: "Request Bulk & Institutional Quotation",
    modal_bulk_sub: "Get custom pricing, sample availability, and production timeline directly from Monojit Dey",
    modal_name: "Your Full Name *",
    modal_company: "Company / Organization Name",
    modal_phone: "WhatsApp / Mobile Number *",
    modal_email: "Email Address *",
    modal_product: "Product or Category of Interest",
    modal_qty: "Estimated Quantity (e.g., 50, 200, 1000 pcs) *",
    modal_dest: "Delivery Destination (City / Country)",
    modal_date: "Required Delivery Date",
    modal_notes: "Customization / Specific Requirements",
    modal_branding_check: "We require custom gift packaging or private label logo branding",
    modal_submit: "Submit Bulk Enquiry",
    modal_cancel: "Cancel",
    modal_success_title: "Thank You! Your Enquiry Has Been Received",
    modal_success_desc: "Monojit Dey and our team will review your specifications and contact you on WhatsApp / Phone promptly.",

    chat_title: "Jit Prime Craft Assistant",
    chat_status: "Online • Ready to help",
    chat_placeholder: "Ask about terracotta jewellery, bulk orders, prices...",
    chat_send: "Send",
    chat_quick_prompt1: "What are your bulk MOQ and prices?",
    chat_quick_prompt2: "How to order terracotta jewellery for Durga Puja?",
    chat_quick_prompt3: "Can you supply for Government Tenders?",

    // Additional aliases
    badge_gst: "GST Registered",
    badge_workshop: "Kolkata Workshop",
    badge_gem: "Govt Tenders & GEM",
    badge_women: "Women Artisans",
    badge_custom: "Custom Branding",
    badge_dispatch: "Secure Packaging",

    hero_tag: "AUTHENTIC HASTA SHILPA • KOLKATA CLUSTER",
    hero_heading: "Handmade Clay & Terracotta Jewellery Manufacturing from West Bengal",
    hero_sub: "Connecting authentic Indian handcrafted products with bulk, institutional, and government buyers — creating genuine order-based production opportunities for women artisans.",
    hero_cta_learn: "Women Artisan Work",
    hero_cta_call: "Direct Call",

    pillars_tag: "OUR CORE PILLARS",
    pillars_title: "Empowering Artisans & Scaling Bulk Handicraft Supply",

    women_tag: "WOMEN LIVELIHOOD",
    women_puja_tag: "Puja 2026 Production",
    women_title: "Handmade Work & Production Opportunities",
    women_puja_desc: "At Jit Prime MPC Company, skilled women artisans participate in handmade clay jewellery making, precision moulding, and hand-painting for confirmed bulk orders.",
    women_cta_participate: "Explore Production Opportunities",

    prod_tag: "WHOLESALE & BULK",
    prod_title: "Featured Wholesale & Bulk Collection",
    prod_sub: "Handcrafted products available for immediate sample dispatch and bulk production booking.",
    prod_view_all: "View All Products & Catalogue",
    prod_all_cat: "All Crafts",
    prod_unit_moq: "Min MOQ",
    prod_details_btn: "View Details",
    prod_order_btn: "Order / Request Quote",

    video_title: "Our Craft & Production in Motion",
    video_explore_gallery: "Explore Full Craft Gallery",
    video_watch_btn: "Watch Workshop Video",

    govt_tag: "GOVT & INSTITUTIONAL",
    govt_title: "Government Tenders & Institutional Supply",

    intl_tag: "GLOBAL EXPORT",
    intl_title: "International Buyers & Cultural Associations",

    direct_call: "Direct Call",
    nav_artisans: "Artisans",
    nav_training: "Women & Work",
    nav_intl: "Export",
    chatbot_title: "Jit Prime Assistant"
  },

  bn: {
    nav_home: "হোম",
    nav_products: "পণ্য সম্ভার",
    nav_gallery: "শিল্প গ্যালারি",
    nav_women_work: "মহিলাদের হাতের কাজ",
    nav_bulk: "বাল্ক ও পাইকারি অর্ডার",
    nav_govt: "সরকারি ও প্রাতিষ্ঠানিক",
    nav_international: "আন্তর্জাতিক রপ্তানি",
    nav_about: "আমাদের সম্পর্কে",
    nav_contact: "যোগাযোগ",
    nav_get_quote: "বাল্ক কোটেশন চান",
    nav_more: "আরও দেখুন",
    nav_admin: "অ্যাডমিন",
    primary_phone_label: "প্রধান যোগাযোগ",
    alt_phone_label: "বিকল্প নম্বর",
    all_contacts_label: "মনোজিত দে-কে কল করুন",

    puja_tag: "পূজা ও উৎসবের বিশেষ বুকিং",
    puja_sub: "দুর্গাপূজা ও দীপাবলি ২০২৬ বাল্ক বুকিং",
    puja_headline: "পোড়ামাটির গহনা ও হস্তনির্মিত মাটির প্রতিমা",
    puja_desc: "উৎসবের আগে পোড়ামাটির গহনা, মাটির প্রদীপ ও হস্তশিল্পের সময়মতো ডেলিভারি পেতে আমাদের কারিগর ক্লাস্টারের উৎপাদন ক্ষমতা আগে থেকেই বুক করুন।",
    puja_cta: "পূজার বিশেষ কোটেশন চান",
    time_days: "দিন",
    time_hrs: "ঘণ্টা",
    time_min: "মিনিট",
    time_sec: "সেকেন্ড",

    hero_badge: "জিত প্রাইম এমপিসি কোম্পানি • খাঁটি হস্তশিল্প",
    hero_title_line1: "হাতে তৈরি খাঁটি পোড়ামাটির গহনা",
    hero_title_line2: "ও মাটির সামগ্রী উৎপাদনকারী প্রতিষ্ঠান",
    hero_desc: "আমরা খাঁটি ভারতীয় হস্তশিল্পকে পাইকারি, প্রাতিষ্ঠানিক ও সরকারি ক্রেতাদের কাছে পৌঁছে দিই — যা নারী কারিগরদের জন্য কাজের সুযোগ সৃষ্টি করে।",
    hero_cta_bulk: "বাল্ক কোটেশন চান",
    hero_cta_catalog: "ক্যাটালগ দেখুন",
    hero_cta_whatsapp: "WhatsApp করুন",
    hero_pillar_craft: "১০০% হাতে তৈরি",
    hero_pillar_craft_sub: "খাঁটি কাদা মাটি ও লোকশিল্পের নিখুঁত কাজ",
    hero_pillar_women: "নারী কারিগরদের কাজ",
    hero_pillar_women_sub: "বাস্তব কাজের মাধ্যমে আত্মনির্ভরতা",
    hero_pillar_govt: "সরকারি ও প্রাতিষ্ঠানিক",
    hero_pillar_govt_sub: "টেন্ডার স্পেসিফিকেশন ও জিএসটি বিলিং",
    hero_pillar_export: "রপ্তানি মানসম্পন্ন",
    hero_pillar_export_sub: "সুরক্ষিত প্যাকিং ও দেশ-বিদেশে সরবরাহ",

    pillars_heading: "আমাদের প্রধান উৎপাদন ক্ষেত্র",
    pillars_sub: "ঐতিহ্য ও নিষ্ঠার সাথে তৈরি পশ্চিমবঙ্গের খাঁটি হস্তশিল্প",
    pillar1_title: "হাতে তৈরি মাটির পণ্য ও পোড়ামাটি শিল্প",
    pillar1_desc: "নদীর খাঁটি পলিমাটি দিয়ে গড়া এবং কাঠের চুল্লিতে পোড়ানো শৈল্পিক মাটির প্রতিমা, ওয়াল প্লাক, ফুলদানি এবং উৎসবের প্রদীপ।",
    pillar2_title: "পোড়ামাটির ও ফ্যাশন গহনা",
    pillar2_desc: "হাতে আঁকা মাটির কানের দুল, নেকলেস, ঝুমকো ও চকার — যা ভেষজ রঙ ও সুতি ডোরি দিয়ে পরম যত্নে সজ্জিত।",
    pillar3_title: "সরকারি টেন্ডার ও প্রাতিষ্ঠানিক সরবরাহ",
    pillar3_desc: "সরকারি এম্পোরিয়াম, সাংস্কৃতিক দপ্তর ও করপোরেট উপহার সামগ্রী সরবরাহের জন্য নির্ভরযোগ্য অংশীদার।",
    pillar4_title: "আন্তর্জাতিক বাল্ক ও রপ্তানি সেবা",
    pillar4_desc: "আন্তর্জাতিক বুটিক, প্রবাসী বাঙালি সংস্থা ও বিশ্বব্যাপী ভারতীয় লোকশিল্প সংগ্রাহকদের জন্য বিশেষ পাইকারি সরবরাহ।",

    women_heading: "হাতের কাজের মাধ্যমে নারীদের কর্মসংস্থান ও উৎপাদন",
    women_sub: "আমাদের কলকাতা ওয়ার্কশপ ক্লাস্টারে কাজের সুযোগ",
    women_desc: "জিত প্রাইম এমপিসি কোম্পানিতে দক্ষ নারী কারিগররা মাটির গহনা তৈরি, কাদার ছাঁচ প্রস্তুত ও নিপুণ রঙের কাজে অংশ নেন। আমরা তাঁদের সরাসরি নিশ্চিত বাল্ক ও প্রাতিষ্ঠানিক অর্ডারের সাথে যুক্ত করি — কোনো অলীক প্রতিশ্রুতি নয়, বরং বাস্তব কাজের মাধ্যমেই তাঁদের পাশে দাঁড়াই।",
    women_point1_title: "সুশৃঙ্খল কর্মশালার পরিবেশ",
    women_point1_desc: "উপযুক্ত কাঁচামাল, পোড়ানোর চুল্লি এবং নিরাপদ রঙের সুব্যবস্থাসহ নারী কারিগরদের জন্য কাজের উপযুক্ত পরিবেশ।",
    women_point2_title: "পূজার উৎসবকালীন প্রস্তুতি",
    women_point2_desc: "দুর্গাপূজা ও উৎসবের মৌসুমে বৃহৎ পরিসরে গহনা ও লোকশিল্প তৈরির সুযোগ সৃষ্টি হয়।",
    women_point3_title: "কাজের ভিত্তিতে ন্যায্য পারিশ্রমিক",
    women_point3_desc: "প্রতিটি নিখুঁত উৎপাদিত পণ্যের ভিত্তিতে সরাসরি ও স্বচ্ছ পারিশ্রমিক নিশ্চিত করা হয়।",
    women_cta: "কাজের সুযোগ সম্পর্কে জানুন",
    women_disclaimer: "*কাজের সুযোগ নিশ্চিত গ্রাহক অর্ডার ও মৌসুমি চাহিদার ওপর নির্ভরশীল। আমরা কোনো অবাস্তব উপার্জনের মিথ্যা প্রতিশ্রুতি দিই না, বরং সৎ ও মর্যাদাপূর্ণ কাজের সুযোগ তৈরি করি।",

    video_heading: "আমাদের হস্তশিল্প ও উৎপাদনের ভিডিও",
    video_sub: "পোড়ামাটির গহনা তৈরি, কাদার ছাঁচ ও রঙের বাস্তব কাজের ভিডিও দেখুন",
    video_tag: "হস্তশিল্প নির্মাণ",
    video_play: "ভিডিও চালান",
    video_watch_hd: "কর্মশালার ভিডিও দেখুন",
    video_close: "বন্ধ করুন",
    video_workshop_tag: "কর্মশালার ভিডিও",

    products_heading: "জনপ্রিয় পাইকারি ও বাল্ক পণ্য সম্ভার",
    products_sub: "নমুনা পরীক্ষা এবং বাল্ক বুকিংয়ের জন্য উপলব্ধ সেরা হস্তশিল্প পণ্য",
    cat_all: "সকল পণ্য",
    filter_moq: "সর্বনিম্ন অর্ডার (MOQ)",
    filter_price: "পাইকারি মূল্য",
    card_btn_quote: "বাল্ক কোটেশন চান",
    card_btn_whatsapp: "WhatsApp-এ জানুন",
    card_btn_details: "বিস্তারিত দেখুন",
    view_all_products: "সকল পণ্য ও ক্যাটালগ দেখুন",

    govt_heading: "সরকারি টেন্ডার ও প্রাতিষ্ঠানিক সরবরাহ",
    govt_sub: "সরকারি দপ্তর, নিগম ও করপোরেট প্রতিষ্ঠানের জন্য বিশ্বস্ত হস্তশিল্প সরবরাহকারী",
    govt_desc: "জিত প্রাইম এমপিসি কোম্পানি বৃহৎ সরকারি টেন্ডার, সাংস্কৃতিক স্মরণিকা ও উপহার সামগ্রী সরবরাহে বিশেষভাবে পারদর্শী। আমরা প্রতিটি নিয়ম ও গুণগত মান বজায় রেখে সময়মতো সরবরাহ করি।",
    govt_p1: "যথাযথ জিএসটি বিল ও সরকারি টেন্ডারের প্রয়োজনীয় নথিপত্র প্রদান",
    govt_p2: "অনুমোদিত নমুনার সাথে শতভাগ মিল রেখে নিখুঁত মান নিয়ন্ত্রণ",
    govt_p3: "৫০০ থেকে ১০,০০০+ পিস পর্যন্ত সময়মতো সরবরাহের সামর্থ্য",
    govt_p4: "কাস্টম লোগো প্রিন্টিং, লেজার খোদাই ও প্রিমিয়াম উপহার প্যাকিং",
    govt_cta: "প্রাতিষ্ঠানিক টেন্ডারের বিবরণ পাঠান",

    intl_heading: "আন্তর্জাতিক ক্রেতা ও বাল্ক রপ্তানি",
    intl_sub: "বাংলার লোকশিল্প বিশ্বজুড়ে পৌঁছে দেওয়ার নির্ভরযোগ্য মাধ্যম",
    intl_desc: "আমেরিকা, যুক্তরাজ্য, কানাডা, অস্ট্রেলিয়া ও মধ্যপ্রাচ্যের বুটিক মালিক এবং প্রবাসী সংগঠনগুলোর কাছে নিরাপদ প্যাকেজিংসহ সঠিক সময়ে রপ্তানি সুবিধা।",
    intl_p1: "পোড়ামাটির পণ্যের সুরক্ষায় বিশেষ শক-প্রুফ মাল্টিলেয়ার প্যাকিং",
    intl_p2: "নতুন বুটিক ও ক্লায়েন্টদের জন্য সুবিধাজনক ট্রায়াল অর্ডার সুবিধা",
    intl_p3: "রপ্তানি সংক্রান্ত সঠিক ইনভয়েস ও মসৃণ শিপিং সমন্বয়",
    intl_cta: "রপ্তানি সংক্রান্ত আলোচনা করুন",

    reviews_heading: "গ্রাহকদের মতামত ও মূল্যায়ন",
    reviews_sub: "বুটিক মালিক, করপোরেট ক্রেতা ও গ্রাহকদের বাস্তব অভিজ্ঞতা",
    reviews_write_btn: "আপনার মতামত জানান",

    faq_heading: "সাধারণ প্রশ্নোত্তর",
    faq_sub: "অর্ডার প্রক্রিয়া, কাজের সুযোগ ও পণ্য ডেলিভারি সম্পর্কিত স্পষ্ট তথ্য",

    bottom_cta_title: "আপনার বাল্ক বা কাস্টম অর্ডার নিয়ে আলোচনা করতে চান?",
    bottom_cta_desc: "সরাসরি স্বত্বাধিকারী মনোজিত দে-র সাথে কথা বলুন এবং কোটেশন, নমুনা ও উৎপাদন পরিকল্পনা নিশ্চিত করুন।",
    bottom_cta_btn_primary: "বাল্ক কোটেশন অনুরোধ করুন",
    bottom_cta_call_btn: "সরাসরি কল করুন",

    footer_about_title: "জিত প্রাইম এমপিসি কোম্পানি",
    footer_about_text: "খাঁটি মাটির শিল্প, পোড়ামাটির গহনা, ডোকরা ও বাংলার হস্তশিল্পের শীর্ষস্থানীয় নির্মাতা ও বাল্ক সরবরাহকারী। আমরা কাজের গুণমান এবং নারী কারিগরদের মর্যাদাপূর্ণ অংশগ্রহণে বিশ্বাসী।",
    footer_quick_links: "প্রয়োজনীয় লিংক",
    footer_craft_categories: "শিল্পের ধরন",
    footer_contact_info: "অফিসিয়াল যোগাযোগ",
    footer_office_address: "বেলঘড়িয়া নিমতা, ক্ষুদিরাম পল্লী, ৪২ পল্লী ক্লাবের কাছে, ল্যান্ডমার্ক: হরিজন স্কুল, কলকাতা - ৭০০০৪৯, পশ্চিমবঙ্গ, ভারত",
    footer_proprietor: "স্বত্বাধিকারী: মনোজিত দে",
    footer_rights: "সর্বস্বত্ব সংরক্ষিত।",
    footer_disclaimer: "পশ্চিমবঙ্গ সরকারের অধীনে নিবন্ধিত হস্তশিল্প প্রতিষ্ঠান। অর্ডার ও পেমেন্টের শর্তাবলী কোটেশনের মাধ্যমে নির্ধারিত হয়।",

    modal_bulk_title: "বাল্ক ও প্রাতিষ্ঠানিক কোটেশনের অনুরোধ",
    modal_bulk_sub: "মূল্যতালিকা, নমুনা ও ডেলিভারির সময়সীমা সরাসরি মনোজিত দে-র কাছ থেকে জানুন",
    modal_name: "আপনার সম্পূর্ণ নাম *",
    modal_company: "প্রতিষ্ঠান বা সংস্থার নাম",
    modal_phone: "WhatsApp / মোবাইল নম্বর *",
    modal_email: "ইমেইল ঠিকানা *",
    modal_product: "আগ্রহী পণ্য বা ক্যাটাগরি",
    modal_qty: "আনুমানিক অর্ডারের পরিমাণ (যেমন: ৫০, ২০০, ১০০০ পিস) *",
    modal_dest: "ডেলিভারির স্থান (শহর / জেলা)",
    modal_date: "প্রয়োজনীয় ডেলিভারি তারিখ",
    modal_notes: "বিশেষ চাহিদা বা কাস্টমাইজেশন বিবরণ",
    modal_branding_check: "আমাদের কাস্টম উপহার প্যাকিং বা কোম্পানির লোগো প্রয়োজন",
    modal_submit: "কোটেশন পাঠান",
    modal_cancel: "বাতিল",
    modal_success_title: "ধন্যবাদ! আপনার অনুরোধটি জমা হয়েছে",
    modal_success_desc: "মনোজিত দে ও আমাদের টিম দ্রুত আপনার সাথে WhatsApp বা ফোনে যোগাযোগ করবেন।",

    chat_title: "জিত প্রাইম হস্তশিল্প সহকারী",
    chat_status: "অনলাইন • সাহায্য করতে প্রস্তুত",
    chat_placeholder: "পোড়ামাটির গহনা, দাম বা বাল্ক অর্ডার সম্পর্কে জিজ্ঞাসা করুন...",
    chat_send: "পাঠান",
    chat_quick_prompt1: "বাল্ক অর্ডারের সর্বনিম্ন পরিমাণ (MOQ) কত?",
    chat_quick_prompt2: "পূজার জন্য পোড়ামাটির গহনা কীভাবে অর্ডার করব?",
    chat_quick_prompt3: "আপনারা কি সরকারি টেন্ডারে পণ্য সরবরাহ করেন?",

    // Additional aliases
    badge_gst: "জিএসটি নিবন্ধিত",
    badge_workshop: "কলকাতা ওয়ার্কশপ",
    badge_gem: "সরকারি টেন্ডার ও GeM",
    badge_women: "নারী কারিগর ক্লাস্টার",
    badge_custom: "কাস্টম ব্র্যান্ডিং ও লোগো",
    badge_dispatch: "সুরক্ষিত বক্স প্যাকেজিং",

    hero_tag: "খাঁটি হস্তশিল্প • কলকাতা কারিগর ক্লাস্টার",
    hero_heading: "হাতে তৈরি খাঁটি পোড়ামাটির গহনা ও হস্তশিল্প উৎপাদন — পশ্চিমবঙ্গ",
    hero_sub: "আমরা খাঁটি ভারতীয় হস্তশিল্পকে পাইকারি, প্রাতিষ্ঠানিক ও সরকারি ক্রেতাদের কাছে পৌঁছে দিই — যা নারী কারিগরদের জন্য কাজের সুযোগ সৃষ্টি করে।",
    hero_cta_learn: "নারী কারিগরদের কাজ",
    hero_cta_call: "সরাসরি কল",

    pillars_tag: "আমাদের মূল স্তম্ভ",
    pillars_title: "কারিগরদের ক্ষমতায়ন ও বৃহৎ হস্তশিল্প সরবরাহ",

    women_tag: "নারীদের কর্মসংস্থান",
    women_puja_tag: "পূজা ২০২৬ উৎপাদন",
    women_title: "হাতের কাজের মাধ্যমে নারীদের কর্মসংস্থান ও উৎপাদন",
    women_puja_desc: "জিত প্রাইম এমপিসি কোম্পানিতে দক্ষ নারী কারিগররা মাটির গহনা তৈরি, কাদার ছাঁচ প্রস্তুত ও নিপুণ রঙের কাজে অংশ নেন সরাসরি নিশ্চিত অর্ডারের ভিত্তিতে।",
    women_cta_participate: "কাজের সুযোগ সম্পর্কে জানুন",

    prod_tag: "পাইকারি ও বাল্ক সংগ্রহ",
    prod_title: "জনপ্রিয় পাইকারি ও বাল্ক পণ্য সম্ভার",
    prod_sub: "নমুনা পরীক্ষা এবং বাল্ক বুকিংয়ের জন্য উপলব্ধ সেরা হস্তশিল্প পণ্য।",
    prod_view_all: "সকল পণ্য ও ক্যাটালগ দেখুন",
    prod_all_cat: "সকল পণ্য",
    prod_unit_moq: "সর্বনিম্ন MOQ",
    prod_details_btn: "বিস্তারিত দেখুন",
    prod_order_btn: "অর্ডার / কোটেশন চান",

    video_title: "আমাদের কাজ ও হস্তশিল্প উৎপাদন ভিডিও",
    video_explore_gallery: "সম্পূর্ণ শিল্প গ্যালারি দেখুন",
    video_watch_btn: "ভিডিও দেখুন",

    govt_tag: "সরকারি ও প্রাতিষ্ঠানিক",
    govt_title: "সরকারি টেন্ডার ও প্রাতিষ্ঠানিক সরবরাহ",

    intl_tag: "আন্তর্জাতিক রপ্তানি",
    intl_title: "আন্তর্জাতিক ক্রেতা ও বাল্ক রপ্তানি",

    direct_call: "সরাসরি কল করুন",
    nav_artisans: "কারিগরবৃন্দ",
    nav_training: "নারীদের কাজ",
    nav_intl: "রপ্তানি",
    chatbot_title: "জিত প্রাইম সহকারী"
  },

  hi: {
    nav_home: "होम",
    nav_products: "उत्पाद व कैटलॉग",
    nav_gallery: "शिल्प गैलरी",
    nav_women_work: "महिलाओं का हस्तशिल्प कार्य",
    nav_bulk: "थोक व बल्क ऑर्डर",
    nav_govt: "सरकारी व संस्थागत",
    nav_international: "अंतर्राष्ट्रीय निर्यात",
    nav_about: "हमारे बारे में",
    nav_contact: "संपर्क करें",
    nav_get_quote: "बल्क कोटेशन प्राप्त करें",
    nav_more: "अन्य",
    nav_admin: "एडमिन",
    primary_phone_label: "मुख्य संपर्क",
    alt_phone_label: "अन्य नंबर",
    all_contacts_label: "मनोजित दे को कॉल करें",

    puja_tag: "उत्सवी उत्पादन बुकिंग",
    puja_sub: "दुर्गा पूजा व दीपावली 2026 बल्क बुकिंग",
    puja_headline: "हस्तनिर्मित टेराकोटा आभूषण व मिट्टी की मूर्तियां",
    puja_desc: "त्योहारों से पहले टेराकोटा आभूषणों, मिट्टी के दीयों व प्रामाणिक बंगाली लोक शिल्प की समय पर डिलीवरी के लिए हमारी कारीगर कार्यशाला की क्षमता पहले से सुरक्षित करें।",
    puja_cta: "उत्सवी बल्क कोटेशन प्राप्त करें",
    time_days: "दिन",
    time_hrs: "घंटे",
    time_min: "मिनट",
    time_sec: "सेकंड",

    hero_badge: "जित प्राइम एमपीसी कंपनी • प्रामाणिक हस्तशिल्प",
    hero_title_line1: "हस्तनिर्मित टेराकोटा आभूषण व",
    hero_title_line2: "मिट्टी शिल्प निर्माण — पश्चिम बंगाल",
    hero_desc: "हम प्रामाणिक भारतीय हस्तशिल्प को थोक, संस्थागत व सरकारी खरीदारों से जोड़ते हैं — जिससे महिला कारीगरों के लिए वास्तविक ऑर्डर-आधारित उत्पादन अवसर बनते हैं।",
    hero_cta_bulk: "बल्क कोटेशन का अनुरोध",
    hero_cta_catalog: "कैटलॉग देखें",
    hero_cta_whatsapp: "WhatsApp करें",
    hero_pillar_craft: "100% हस्तनिर्मित",
    hero_pillar_craft_sub: "शुद्ध मिट्टी, टेराकोटा व पारंपरिक कला",
    hero_pillar_women: "महिला कारीगर कार्य",
    hero_pillar_women_sub: "वास्तविक उत्पादन अवसर व आत्मनिर्भरता",
    hero_pillar_govt: "सरकारी व संस्थागत",
    hero_pillar_govt_sub: "टेंडर अनुपालन, जीएसटी बिलिंग व समयबद्ध पूर्ति",
    hero_pillar_export: "निर्यात गुणवत्ता",
    hero_pillar_export_sub: "सुरक्षित शॉक-प्रूफ पैकिंग व वैश्विक आपूर्ति",

    pillars_heading: "हमारे मुख्य हस्तशिल्प निर्माण क्षेत्र",
    pillars_sub: "धैर्य, शिल्प कौशल और पारंपरिक तकनीक से तैयार बंगाल का हस्तशिल्प",
    pillar1_title: "हस्तनिर्मित मिट्टी व टेराकोटा कला",
    pillar1_desc: "नदी की उपजाऊ मिट्टी से ढली और पारंपरिक भट्ठी में पकाई गई मूर्तियां, दीवार पट्टिकाएं, कलात्मक फूलदान और उत्सवी दीये।",
    pillar2_title: "टेराकोटा व पारंपरिक आभूषण",
    pillar2_desc: "हाथ से रंगे हुए मिट्टी के झुमके, हार, चोकर और उत्सव सेट — जिन्हें प्राकृतिक रंगों और सूती डोरी से सजाया जाता है।",
    pillar3_title: "सरकारी टेंडर व संस्थागत आपूर्ति",
    pillar3_desc: "सरकारी एम्पोरियम, सांस्कृतिक विभागों व कॉर्पोरेट उपहारों के लिए जीएसटी बिलिंग और पूर्ण दस्तावेजों के साथ विश्वसनीय आपूर्तिकर्ता।",
    pillar4_title: "अंतर्राष्ट्रीय थोक व निर्यात सहायता",
    pillar4_desc: "वैश्विक बुटीक, विदेशी भारतीय सांस्कृतिक संस्थाओं व रिटेलरों के लिए निर्यात-स्तरीय सुरक्षित आपूर्ति।",

    women_heading: "हस्तशिल्प उत्पादन से महिलाओं का सशक्तिकरण",
    women_sub: "हमारी कोलकाता कार्यशाला में ऑर्डर-आधारित कार्य के वास्तविक अवसर",
    women_desc: "जित प्राइम एमपीसी कंपनी में कुशल महिला कारीगर मिट्टी के आभूषण, सांचे ढलाई और कलात्मक फिनिशिंग कार्य में भाग लेती हैं। हम उन्हें सीधे सत्यापित थोक और संस्थागत ऑर्डर से जोड़ते हैं — बिना किसी झूठे वादे के, वास्तविक बाज़ार मांग पर आधारित उत्पादन कार्य प्रदान करते हैं।",
    women_point1_title: "व्यवस्थित कार्यशाला वातावरण",
    women_point1_desc: "प्राकृतिक मिट्टी, भट्ठियां और सुरक्षित रंगों के साथ महिलाओं के लिए कार्यशाला में सीखने व काम करने का उचित माहौल।",
    women_point2_title: "दुर्गा पूजा पूर्व उत्पादन",
    women_point2_desc: "त्योहारों के मौसम में बड़े पैमाने पर पारंपरिक आभूषण और लोक कला उत्पादों का निर्माण कार्य होता है।",
    women_point3_title: "कार्य-आधारित पारदर्शी पारिश्रमिक",
    women_point3_desc: "स्वीकृत निर्मित इकाइयों के आधार पर पारदर्शी और सम्मानजनक पारिश्रमिक दिया जाता है।",
    women_cta: "उत्पादन अवसरों की जानकारी लें",
    women_disclaimer: "*कार्य के अवसर पुष्टि किए गए ग्राहक ऑर्डर और मौसमी मांग पर निर्भर करते हैं। हम गारंटीशुदा आय या नौकरी के कोई झूठे वादे नहीं करते हैं।",

    video_heading: "हमारे शिल्प व उत्पादन के वीडियो",
    video_sub: "कारीगरों द्वारा मिट्टी को आकार देने, पकाने और आभूषणों को सजाने की वास्तविक प्रक्रिया देखें",
    video_tag: "हस्तशिल्प निर्माण",
    video_play: "वीडियो चलाएं",
    video_watch_hd: "कार्यशाला वीडियो देखें",
    video_close: "बंद करें",
    video_workshop_tag: "कार्यशाला वीडियो",

    products_heading: "लोकप्रिय थोक व बल्क उत्पाद संग्रह",
    products_sub: "नमूना जांच और थोक ऑर्डर बुकिंग के लिए उपलब्ध हस्तशिल्प उत्पाद",
    cat_all: "सभी शिल्प",
    filter_moq: "न्यूनतम ऑर्डर (MOQ)",
    filter_price: "थोक मूल्य",
    card_btn_quote: "बल्क कोटेशन प्राप्त करें",
    card_btn_whatsapp: "WhatsApp पर पूछें",
    card_btn_details: "विवरण देखें",
    view_all_products: "सभी उत्पाद व कैटलॉग देखें",

    govt_heading: "सरकारी टेंडर व संस्थागत आपूर्ति",
    govt_sub: "सरकारी उपक्रमों, निगमों व संस्थाओं के लिए प्रमाणित हस्तशिल्प आपूर्तिकर्ता",
    govt_desc: "जित प्राइम एमपीसी कंपनी बड़े पैमाने पर हस्तशिल्प टेंडर, सांस्कृतिक स्मृति चिन्ह और उपहार सामग्री की आपूर्ति में सिद्ध अनुभव रखती है।",
    govt_p1: "जीएसटी चालान और सरकारी टेंडर के पूर्ण दस्तावेजों का अनुपालन",
    govt_p2: "अनुमोदित नमूनों के अनुसार कठोर गुणवत्ता नियंत्रण",
    govt_p3: "500 से 10,000+ इकाइयों की समय पर सुरक्षित डिलीवरी क्षमता",
    govt_p4: "कस्टम लोगो प्रिंटिंग, लेज़र नक्काशी व उपहार पैकेजिंग",
    govt_cta: "संस्थागत टेंडर विवरण भेजें",

    intl_heading: "अंतर्राष्ट्रीय खरीदार व थोक निर्यात",
    intl_sub: "बंगाल की लोक कला को विश्व स्तर पर पहुंचाने का प्रामाणिक मंच",
    intl_desc: "हम अमेरिका, ब्रिटेन, कनाडा, ऑस्ट्रेलिया और यूएई के बुटीक मालिकों व प्रवासी भारतीय संस्थाओं को निर्यात-स्तरीय पैकेजिंग के साथ सीधी आपूर्ति करते हैं।",
    intl_p1: "नाज़ुक टेराकोटा के लिए विशेष शॉक-प्रूफ मल्टीलेयर कुशनिंग",
    intl_p2: "नए बुटीक के लिए अनुकूल ट्रायल ऑर्डर की सुविधा",
    intl_p3: "अंतर्राष्ट्रीय दस्तावेज़, इनवॉइस व सुगम शिपिंग समन्वय",
    intl_cta: "निर्यात ऑर्डर पर बात करें",

    reviews_heading: "सत्यापित ग्राहकों के विचार व समीक्षाएं",
    reviews_sub: "बुटीक मालिकों, संस्थागत खरीदारों और संग्रहकर्ताओं का अनुभव",
    reviews_write_btn: "अपनी समीक्षा लिखें",

    faq_heading: "अक्सर पूछे जाने वाले प्रश्न",
    faq_sub: "ऑर्डर प्रक्रिया, न्यूनतम मात्रा, भुगतान व डिलीवरी से संबंधित स्पष्ट उत्तर",

    bottom_cta_title: "अपने बल्क या कस्टम ऑर्डर पर चर्चा करें",
    bottom_cta_desc: "कोटेशन, नमूने, टेंडर विशिष्टताओं व उत्पादन योजना के लिए सीधे प्रोपराइटर मनोजित दे से संपर्क करें।",
    bottom_cta_btn_primary: "बल्क कोटेशन का अनुरोध करें",
    bottom_cta_call_btn: "सीधे कॉल करें",

    footer_about_title: "जित प्राइम एमपीसी कंपनी",
    footer_about_text: "हस्तनिर्मित मिट्टी के उत्पादों, टेराकोटा आभूषणों, डोकरा व बंगाल के हस्तशिल्प के अग्रणी निर्माता व थोक आपूर्तिकर्ता। हम गुणवत्ता, ग्राहक विश्वास और महिला कारीगरों की गरिमापूर्ण सहभागिता के लिए समर्पित हैं।",
    footer_quick_links: "त्वरित लिंक",
    footer_craft_categories: "शिल्प श्रेणियां",
    footer_contact_info: "आधिकारिक संपर्क",
    footer_office_address: "बेलघोरिया निमता, क्षुदिराम पल्ली, 42 पल्ली क्लब के पास, लैंडमार्क: हरिजन स्कूल, कोलकाता - 700049, पश्चिम बंगाल, भारत",
    footer_proprietor: "प्रोपराइटर: मनोजित दे",
    footer_rights: "सर्वाधिकार सुरक्षित।",
    footer_disclaimer: "पश्चिम बंगाल में पंजीकृत हस्तशिल्प उद्यम। ऑर्डर और भुगतान की शर्तें आधिकारिक कोटेशन द्वारा तय की जाती हैं।",

    modal_bulk_title: "थोक व संस्थागत कोटेशन का अनुरोध",
    modal_bulk_sub: "मूल्य निर्धारण, नमूने व डिलीवरी समय-सीमा सीधे मनोजित दे से प्राप्त करें",
    modal_name: "आपका पूरा नाम *",
    modal_company: "कंपनी या संगठन का नाम",
    modal_phone: "WhatsApp / मोबाइल नंबर *",
    modal_email: "ईमेल पता *",
    modal_product: "रुचि का उत्पाद या श्रेणी",
    modal_qty: "अनुमानित मात्रा (उदा. 50, 200, 1000 पीस) *",
    modal_dest: "डिलीवरी गंतव्य (शहर / राज्य)",
    modal_date: "अपेक्षित डिलीवरी तिथि",
    modal_notes: "कस्टमाइज़ेशन या विशेष आवश्यकताएं",
    modal_branding_check: "हमें कस्टम उपहार पैकिंग या कंपनी लोगो ब्रांडिंग चाहिए",
    modal_submit: "कोटेशन सबमिट करें",
    modal_cancel: "रद्द करें",
    modal_success_title: "धन्यवाद! आपका अनुरोध प्राप्त हो गया है",
    modal_success_desc: "मनोजित दे और हमारी टीम जल्द ही आपसे WhatsApp या फोन पर संपर्क करेगी।",

    chat_title: "जित प्राइम हस्तशिल्प सहायक",
    chat_status: "ऑनलाइन • सहायता के लिए उपलब्ध",
    chat_placeholder: "टेराकोटा आभूषण, मूल्य या थोक ऑर्डर के बारे में पूछें...",
    chat_send: "भेजें",
    chat_quick_prompt1: "थोक ऑर्डर की न्यूनतम मात्रा (MOQ) क्या है?",
    chat_quick_prompt2: "दुर्गा पूजा के लिए टेराकोटा आभूषण कैसे ऑर्डर करें?",
    chat_quick_prompt3: "क्या आप सरकारी टेंडर के लिए आपूर्ति करते हैं?",

    // Additional aliases
    badge_gst: "जीएसटी पंजीकृत",
    badge_workshop: "कोलकाता कार्यशाला",
    badge_gem: "सरकारी टेंडर व GeM",
    badge_women: "महिला कारीगर क्लस्टर",
    badge_custom: "कस्टम ब्रांडिंग व लोगो",
    badge_dispatch: "सुरक्षित बॉक्स पैकेजिंग",

    hero_tag: "प्रामाणिक हस्तशिल्प • कोलकाता कारीगर क्लस्टर",
    hero_heading: "हस्तनिर्मित टेराकोटा आभूषण व मिट्टी हस्तशिल्प निर्माण — पश्चिम बंगाल",
    hero_sub: "हम प्रामाणिक भारतीय हस्तशिल्प को थोक, संस्थागत व सरकारी खरीदारों से जोड़ते हैं — जिससे महिला कारीगरों के लिए वास्तविक ऑर्डर-आधारित उत्पादन अवसर बनते हैं।",
    hero_cta_learn: "महिला कारीगर कार्य",
    hero_cta_call: "सीधे कॉल",

    pillars_tag: "हमारे मुख्य स्तंभ",
    pillars_title: "कारीगर सशक्तिकरण व व्यापक हस्तशिल्प आपूर्ति",

    women_tag: "महिला आजीविका",
    women_puja_tag: "पूजा 2026 उत्पादन",
    women_title: "हस्तशिल्प उत्पादन से महिलाओं का सशक्तिकरण",
    women_puja_desc: "जित प्राइम एमपीसी कंपनी में कुशल महिला कारीगर मिट्टी के आभूषण, सांचे ढलाई और कलात्मक फिनिशिंग कार्य में भाग लेती हैं पुष्टि किए गए बल्क ऑर्डर के आधार पर।",
    women_cta_participate: "उत्पादन अवसरों की जानकारी लें",

    prod_tag: "थोक व बल्क संग्रह",
    prod_title: "लोकप्रिय थोक व बल्क उत्पाद संग्रह",
    prod_sub: "नमूना जांच और थोक ऑर्डर बुकिंग के लिए उपलब्ध हस्तशिल्प उत्पाद।",
    prod_view_all: "सभी उत्पाद व कैटलॉग देखें",
    prod_all_cat: "सभी शिल्प",
    prod_unit_moq: "न्यूनतम MOQ",
    prod_details_btn: "विवरण देखें",
    prod_order_btn: "ऑर्डर / कोटेशन प्राप्त करें",

    video_title: "हमारा काम व हस्तशिल्प वीडियो",
    video_explore_gallery: "संपूर्ण शिल्प गैलरी देखें",
    video_watch_btn: "वीडियो देखें",

    govt_tag: "सरकारी व संस्थागत",
    govt_title: "सरकारी टेंडर व संस्थागत आपूर्ति",

    intl_tag: "अंतर्राष्ट्रीय निर्यात",
    intl_title: "अंतर्राष्ट्रीय खरीदार व थोक निर्यात",

    direct_call: "सीधे कॉल करें",
    nav_artisans: "कारीगर",
    nav_training: "महिला कार्य",
    nav_intl: "निर्यात",
    chatbot_title: "जित प्राइम सहायक"
  }
};

export const getTranslation = (lang: Language): TranslationDict => {
  return translations[lang] || translations.en;
};
