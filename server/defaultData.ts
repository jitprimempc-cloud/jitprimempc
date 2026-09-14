import { 
  SiteSettings, 
  Product, 
  Category, 
  Artisan, 
  TrainingProgram, 
  GovernmentTender, 
  PujaCampaign, 
  HomepageContent, 
  LegalPage, 
  FAQ, 
  Testimonial, 
  NavigationItem,
  BulkEnquiryLead,
  GalleryItem,
  Coupon
} from '../src/types.js';

export const defaultSettings: SiteSettings = {
  companyName: "JIT PRIME MPC COMPANY",
  ownerName: "MONOJIT DEY",
  tagline: "Your Trust Our Priority",
  phone: "+91 82405 85219",
  whatsappNumber: "+91 82405 85219",
  email: "monojitdey189@gmail.com",
  fullAddress: "Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.",
  googleMapsUrl: "https://maps.google.com/?q=Nimta+Belghoria+Kolkata+700049",
  businessHours: "Monday - Saturday: 10:00 AM - 8:00 PM IST",
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com"
  },
  logoUrl: "",
  faviconUrl: "",
  currencySymbol: "₹",
  internationalShippingDisclaimer: "International shipping, customs clearance, duties, documentation and delivery timelines are confirmed according to the product type, order volume, destination country and mutually agreed quotation.",
  advancePaymentPolicyNote: "Standard bulk production order terms typically require an agreed advance for material procurement and production scheduling. Custom orders and terms are confirmed per quotation.",
  seo: {
    metaTitle: "Jit Prime MPC Company | Hasta Shilpa, Bulk Indian Handicrafts & Govt Tenders",
    metaDescription: "Authentic Indian Handcrafted Products for Bulk, Institutional & International Buyers by Jit Prime MPC Company, Kolkata. Supporting women artisans with market-linked production opportunities.",
    keywords: "Hasta Shilpa, Indian handicrafts, bulk handmade jewellery, terracotta clay art, Dokra, women artisans Kolkata, West Bengal handicrafts, Govt Tender supplier Kolkata",
    ogTitle: "Jit Prime MPC Company - Authentic Hasta Shilpa & Institutional Handicrafts",
    ogDescription: "Your Trust Our Priority. Bulk Indian crafts, govt tender procurement & export quality handmade goods by Monojit Dey."
  }
};

export const defaultCategories: Category[] = [
  {
    id: "cat-1",
    name: "Handmade Jewellery",
    slug: "handmade-jewellery",
    description: "Exquisite clay, terracotta, bead, and brass handcrafted jewellery created with traditional Bengali craft techniques.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    hidden: false,
    orderIndex: 1
  },
  {
    id: "cat-2",
    name: "Hasta Shilpa / Clay Art",
    slug: "hasta-shilpa-clay-art",
    description: "Authentic terracotta idols, artistic wall plaques, home decor pieces and traditional rural pottery.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    hidden: false,
    orderIndex: 2
  },
  {
    id: "cat-3",
    name: "Textile & Fabric Crafts",
    slug: "textile-fabric-crafts",
    description: "Authentic Kantha stitch pouches, hand-embroidered stoles, traditional batik and jute bags.",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    hidden: false,
    orderIndex: 3
  },
  {
    id: "cat-4",
    name: "Home Décor & Tabletop",
    slug: "home-decor",
    description: "Festive diya sets, hand-painted wooden craft, decorative metalware and traditional living accents.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    hidden: false,
    orderIndex: 4
  },
  {
    id: "cat-5",
    name: "Custom Crafts & Mementos",
    slug: "custom-crafts",
    description: "Customized institutional gifts, government event mementos, corporate gift hampers and festival specials.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    hidden: false,
    orderIndex: 5
  },
  {
    id: "cat-6",
    name: "Other Handcrafted Products",
    slug: "other-handcrafted",
    description: "Seasonal festival items, bamboo craft, handmade paper items and eco-friendly artisan creations.",
    image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80",
    hidden: false,
    orderIndex: 6
  }
];

export const defaultProducts: Product[] = [
  {
    id: "prod-1",
    name: "Handcrafted Terracotta Temple Motif Jewellery Set",
    slug: "handcrafted-terracotta-temple-necklace-set",
    category: "cat-1",
    subcategory: "Necklace & Earring Sets",
    shortDescription: "Organic terracotta clay necklace with hand-painted Bengali folk motif and matching jhumkas.",
    fullDescription: "Finely fired riverbed clay shaped, kiln-baked, and hand-embellished by women artisans in Bengal. Features natural jute thread fastening, hand-painted traditional folk motifs with non-toxic pigments, and lightweight matching earrings. Ideal for festive retail, ethnic boutiques, and Puja collections.",
    craftStory: "Each terracotta piece is shaped by hand using traditional wooden moulds and freehand clay embossing, then sundried and low-fired before skilled hand-painting.",
    materials: ["Purified Terracotta Clay", "Natural Jute Cord", "Organic Pigments", "Brass Findings"],
    dimensions: "Necklace pendant: 7cm x 6cm; Earrings: 4cm drop",
    weight: "85 grams",
    availableColours: ["Earthy Red & Antique Gold", "Indigo & Mustard", "Black & Raw Terracotta"],
    sku: "JP-JW-001",
    moq: 50,
    retailPrice: 499,
    bulkPrice: 220,
    priceOnRequest: false,
    customizationAvailable: true,
    productionStatus: "Made to Order",
    estimatedProductionTime: "10-15 business days for 100-500 pcs",
    featured: true,
    isNew: true,
    tags: ["terracotta", "jewellery", "hasta shilpa", "puja special", "handmade"],
    primaryImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611591475883-9b889b70ec08?auto=format&fit=crop&w=800&q=80"
    ],
    orderIndex: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-2",
    name: "Traditional Hasta Shilpa Terracotta Durga Wall Plaque",
    slug: "terracotta-durga-wall-plaque",
    category: "cat-2",
    subcategory: "Wall Decor & Plaques",
    shortDescription: "Decorative terracotta relief plaque depicting Maa Durga face with traditional Bankura style embellishments.",
    fullDescription: "Exquisite clay art plaque meticulously handcrafted by rural women artisans. Showcases high-relief sculpturing, smooth buffed terracotta finish, and integrated wall mounting hook. Perfect for home decor, festive gifts, and cultural institutions.",
    craftStory: "Rooted in the timeless terracotta craft traditions of Bengal, capturing divine iconography through meticulous thumb and wooden stylus work.",
    materials: ["High-grade Clay", "Protective Matte Sealant", "Brass Wall Hook"],
    dimensions: "10 inches diameter x 1.5 inches depth",
    weight: "650 grams",
    availableColours: ["Natural Baked Terracotta", "Antique Gold Highlighted"],
    sku: "JP-CS-002",
    moq: 25,
    retailPrice: 850,
    bulkPrice: 380,
    priceOnRequest: false,
    customizationAvailable: true,
    productionStatus: "Ready to Ship",
    estimatedProductionTime: "7-12 business days",
    featured: true,
    isNew: true,
    tags: ["hasta shilpa", "durga", "clay art", "wall decor", "terracotta"],
    primaryImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    ],
    orderIndex: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    name: "Handmade Kantha Embroidered Utility Clutch & Pouch",
    slug: "handmade-kantha-embroidered-clutch",
    category: "cat-3",
    subcategory: "Bags & Pouches",
    shortDescription: "Pure cotton pouch with running stitch Kantha embroidery and sturdy brass zipper.",
    fullDescription: "Traditional Bengal Kantha running-stitch embroidery executed on layered handloom cotton fabrics. Sturdy, washable, versatile for cosmetics, stationary, and gift packaging. Popular for corporate gifts, conference kits, and retail boutiques.",
    craftStory: "Kantha is a historic storytelling embroidery where village women transform layers of fabric with rhythmic needlework, providing continuous home-based livelihood.",
    materials: ["Handloom Cotton", "Cotton Embroidery Threads", "YKK Zipper", "Inner Lining"],
    dimensions: "9 inches x 6 inches",
    weight: "90 grams",
    availableColours: ["Assorted Folk Patterns", "Monochrome Navy", "Mustard & Rust"],
    sku: "JP-TX-003",
    moq: 100,
    retailPrice: 350,
    bulkPrice: 140,
    priceOnRequest: false,
    customizationAvailable: true,
    productionStatus: "Made to Order",
    estimatedProductionTime: "12-18 business days for 500 pcs",
    featured: true,
    isNew: false,
    tags: ["kantha", "embroidery", "textile", "corporate gift", "pouch"],
    primaryImage: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80"
    ],
    orderIndex: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-4",
    name: "Artisan Handcrafted Brass & Dokra Memento Figurine",
    slug: "artisan-dokra-memento-figurine",
    category: "cat-5",
    subcategory: "Institutional Mementos",
    shortDescription: "Lost-wax cast Dokra brass tribal figurine mounted on polished wood base for institutional felicitations.",
    fullDescription: "Ancient 4,000-year-old lost wax casting technique. Each Dokra piece is unique and cast individually in bell metal / brass scrap by skilled artisan families. Custom brass engraving plate available for government seminars, corporate achievements, and institutional mementos.",
    craftStory: "Dokra casting involves preparing a clay core, winding beeswax threads, coating in refractory clay, and pouring molten metal, dissolving the wax.",
    materials: ["Recycled Brass / Bell Metal", "Reclaimed Teakwood Base", "Protective Clear Lacquer"],
    dimensions: "Height: 6.5 inches; Base: 4 x 4 inches",
    weight: "480 grams",
    availableColours: ["Antique Brass Golden Patina"],
    sku: "JP-DK-004",
    moq: 20,
    retailPrice: 1200,
    bulkPrice: 590,
    priceOnRequest: true,
    customizationAvailable: true,
    productionStatus: "Made to Order",
    estimatedProductionTime: "15-20 business days",
    featured: true,
    isNew: false,
    tags: ["dokra", "brass", "memento", "institutional supply", "govt tender"],
    primaryImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
    ],
    orderIndex: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-5",
    name: "Festive Hand-Painted Terracotta Diya Gift Set (Box of 8)",
    slug: "festive-hand-painted-terracotta-diya-set",
    category: "cat-4",
    subcategory: "Festive Decor",
    shortDescription: "Premium handcrafted terracotta oil lamps embellished with vibrant eco-friendly colours.",
    fullDescription: "Set of 8 premium crafted terracotta diyas packed in biodegradable craft box. Designed specifically for Puja festive gifting, corporate festival distributions, and export retailers. Custom box branding available for bulk clients.",
    craftStory: "Created by women artisan groups preparing seasonal festive crafts, providing vital supplemental income ahead of major Indian festivals.",
    materials: ["Kiln-fired Clay", "Lead-free Non-toxic Paints", "Eco-friendly Cardboard Box"],
    dimensions: "Each diya: 3 inches diameter; Box: 12 x 7 inches",
    weight: "380 grams / set",
    availableColours: ["Vibrant Multi-colour Pack", "Traditional Red & Gold"],
    sku: "JP-DY-005",
    moq: 100,
    retailPrice: 280,
    bulkPrice: 110,
    priceOnRequest: false,
    customizationAvailable: true,
    productionStatus: "Ready to Ship",
    estimatedProductionTime: "7-10 business days",
    featured: true,
    isNew: true,
    tags: ["puja campaign", "diya", "terracotta", "festive gift", "bulk order"],
    primaryImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
    ],
    orderIndex: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-6",
    name: "Eco-friendly Golden Fiber Jute Conference Folder & Tote",
    slug: "golden-fiber-jute-conference-folder",
    category: "cat-3",
    subcategory: "Corporate Accessories",
    shortDescription: "Durable laminated jute conference portfolio folder with pen holder and document sleeves.",
    fullDescription: "Produced using high-density natural Bengal jute fiber. Designed specifically for government department meetings, institutional seminars, and corporate sustainability events. Can be screen-printed with company / organization logo and custom tagline.",
    craftStory: "Bengal is the heartland of golden fiber jute. Our artisan stitching teams transform raw woven jute into high-utility professional goods.",
    materials: ["100% Natural Jute", "Cotton Webbing Handles", "Metal Snap Button"],
    dimensions: "14 inches x 10.5 inches (fits A4 files)",
    weight: "210 grams",
    availableColours: ["Natural Jute Beige", "Jute with Navy Blue Border", "Jute with Maroon Accent"],
    sku: "JP-JT-006",
    moq: 100,
    retailPrice: 240,
    bulkPrice: 95,
    priceOnRequest: false,
    customizationAvailable: true,
    productionStatus: "Made to Order",
    estimatedProductionTime: "10-14 business days",
    featured: false,
    isNew: false,
    tags: ["jute", "institutional supply", "conference kit", "eco-friendly", "b2b"],
    primaryImage: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80"
    ],
    orderIndex: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const defaultArtisans: Artisan[] = [
  {
    id: "artisan-1",
    name: "Anjali M.",
    artisanCode: "ART-WB-01",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    craft: "Terracotta Relief & Jewellery Sculpting",
    productCategory: "Handmade Jewellery & Clay Art",
    experienceYears: 6,
    story: "Trained in regional clay shaping traditions, Anjali leads a cluster of 8 women artisans in preparing miniature terracotta beads, pendants, and decorative figurines for bulk festive collections.",
    skills: ["Clay Kneading", "Relief Embossing", "Non-toxic Colouring", "Jute Knotting"],
    productsCreated: ["Handcrafted Terracotta Jewellery", "Festive Diyas", "Miniature Idols"],
    broadLocation: "Kolkata Peri-Urban Cluster, West Bengal",
    featured: true,
    hidden: false,
    orderIndex: 1
  },
  {
    id: "artisan-2",
    name: "Sunita D.",
    artisanCode: "ART-WB-02",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    craft: "Kantha Running-Stitch Embroidery",
    productCategory: "Textiles & Fabric Crafts",
    experienceYears: 9,
    story: "Specializing in traditional Bengal Kantha needlecraft, Sunita supervises fabric quality, thread tension, and pattern continuity across custom corporate pouch and textile orders.",
    skills: ["Geometric Kantha Stitch", "Fabric Cutting", "Quality Inspection", "Colour Balancing"],
    productsCreated: ["Kantha Pouches", "Handmade Stoles", "Embroidered Conference Bags"],
    broadLocation: "North 24 Parganas, West Bengal",
    featured: true,
    hidden: false,
    orderIndex: 2
  },
  {
    id: "artisan-3",
    name: "Parvati B.",
    artisanCode: "ART-WB-03",
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    craft: "Jute & Natural Fiber Assembly",
    productCategory: "Bags & Home Accessories",
    experienceYears: 4,
    story: "After completing workshop training in precision sewing of heavy jute fabric, Parvati now crafts eco-friendly conference files and export gift bags with clean edge finishing.",
    skills: ["Industrial Sewing Machine", "Handle Reinforcement", "Pattern Assembly", "Eco-Packaging"],
    productsCreated: ["Jute Conference Bags", "Gift Packaging", "Table Runners"],
    broadLocation: "Hooghly - Nimta Craft Belt, West Bengal",
    featured: true,
    hidden: false,
    orderIndex: 3
  }
];

export const defaultTrainingPrograms: TrainingProgram[] = [
  {
    id: "train-1",
    title: "Terracotta Craft & Miniature Jewellery Making",
    description: "Practical hands-on workshop guiding participants through clay processing, mould handling, decorative embossing, kiln-firing precautions, and durable assembly.",
    skill: "Clay modelling, Jewellery designing, Finishing",
    eligibility: "Interested local women artisans, beginners or experienced crafters seeking commercial production skills.",
    duration: "4-Week Practical Workshop Module",
    location: "Jit Prime Workshop Center, Belghoria - Nimta, Kolkata",
    batchDate: "Next Batch: Registrations Open",
    seats: "15 Participants per Batch",
    registrationStatus: "Open",
    applicationInstructions: "Fill out the registration form below or reach out to Monojit Dey on WhatsApp (+91 82405 85219) for verification and batch timings.",
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    ],
    faqs: [
      {
        question: "Is prior experience required?",
        answer: "No prior experience is necessary. We guide participants from basic clay handling to advanced finishing standards."
      },
      {
        question: "How does this connect to production opportunities?",
        answer: "Artisans meeting quality parameters may be invited to participate in upcoming bulk and institutional production orders."
      }
    ],
    hidden: false,
    orderIndex: 1
  },
  {
    id: "train-2",
    title: "Kantha Needlecraft & Fabric Utility Finishing",
    description: "Module covering traditional stitch variations, pattern transfers, commercial finishing techniques, and zipper/lining stitching for marketable textile accessories.",
    skill: "Kantha embroidery, Machine lining, Quality inspection",
    eligibility: "Women with basic hand sewing familiarity looking to upgrade skills for commercial order fulfilment.",
    duration: "3-Week Skill Upgradation",
    location: "Community Artisan Hub, Kolkata",
    batchDate: "Upcoming Seasonal Batch",
    seats: "20 Participants",
    registrationStatus: "Open",
    applicationInstructions: "Submit your details through the form or visit during office hours with basic identity proof.",
    images: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80"
    ],
    faqs: [
      {
        question: "Are raw materials provided during training?",
        answer: "Yes, practice fabrics, embroidery floss, and tools are provided during the scheduled sessions."
      }
    ],
    hidden: false,
    orderIndex: 2
  }
];

export const defaultTenders: GovernmentTender[] = [
  {
    id: "tender-1",
    title: "Institutional Gift & Memento Supply Capability",
    organization: "Government & Public Sector Procurement Framework",
    year: "Ongoing Capability",
    category: "Hasta Shilpa & Mementos",
    description: "Standardized production line for handcrafted brass Dokra plaques, terracotta mementos, and branded wooden presentation boxes meeting GeM and institutional purchase specifications.",
    status: "Active Capability",
    documents: [
      { name: "Technical Specifications Guide", url: "#" },
      { name: "Quality Assurance Standard", url: "#" }
    ],
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
    ],
    caseStudy: "Designed to meet stringent packaging, material integrity, and batch consistency required for department anniversaries, felicitation ceremonies, and public events.",
    hidden: false,
    orderIndex: 1
  },
  {
    id: "tender-2",
    title: "Eco-Friendly Conference Kits & Jute Accessories Supply",
    organization: "Institutions & Educational Bodies",
    year: "Ongoing Capability",
    category: "Textiles & Jute Supply",
    description: "Capacity to produce customized jute bags, folders, and artisan-made event stationary with customized screen-printing and institutional branding.",
    status: "Documentation Ready",
    documents: [
      { name: "Batch Sample Specifications", url: "#" }
    ],
    images: [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80"
    ],
    caseStudy: "Structured order turnaround from prototype sample approval to dispatch in batch cartons with itemized packing slips.",
    hidden: false,
    orderIndex: 2
  }
];

export const defaultCampaign: PujaCampaign = {
  id: "camp-puja-2026",
  title: "Durga Puja Festive Bulk Collection 2026",
  subtitle: "Special Production Window for Wholesalers, Retailers & Corporates",
  headline: "Prepare Your Puja Collection With Authentic Indian Handcrafted Products",
  supportingText: "Bulk buyers can enquire early for production planning and timely fulfilment. Our women artisan network is preparing seasonal terracotta jewellery, festive diyas, and authentic Bengali folk decor.",
  offerText: "Priority Production Scheduling & Custom Branding for Enquiries Confirmed Early",
  bannerImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
  ctaText: "Request Puja Bulk Quote",
  ctaLink: "/bulk-orders?campaign=puja",
  countdownDeadline: "2026-10-15T00:00:00.000Z",
  enabled: true,
  showCountdown: true,
  startDate: "2026-08-01",
  endDate: "2026-10-20"
};

export const defaultHomepageContent: HomepageContent = {
  hero: {
    headline: "Empowering Artisans. Connecting Indian Craft With Global Markets.",
    supportingText: "Authentic Indian Handcrafted Products for Bulk, Institutional & International Buyers — while creating meaningful production and income opportunities for women artisans.",
    primaryCtaText: "Request Bulk Quote",
    primaryCtaLink: "/bulk-orders",
    secondaryCtaText: "Explore Products",
    secondaryCtaLink: "/products",
    thirdCtaText: "Join Our Artisan Network",
    thirdCtaLink: "/training-livelihood",
    backgroundImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80",
    additionalSlides: [
      {
        headline: "Direct Institutional & Government Tender Procurement",
        supportingText: "Reliable production capabilities for authentic Hasta Shilpa mementos, conference accessories, and bulk cultural products.",
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=80",
        ctaText: "Govt & Institutional Portal",
        ctaLink: "/government-institutional"
      },
      {
        headline: "Export-Ready Handcrafted Goods for International Buyers",
        supportingText: "Ethically made Indian crafts with custom branding, certified packaging, and transparent shipment coordination.",
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1600&q=80",
        ctaText: "International Buyer Services",
        ctaLink: "/international-buyers"
      }
    ]
  },
  trustBadges: [
    { id: "tb-1", title: "Handmade in India", subtitle: "100% Authentic Hasta Shilpa", iconName: "Sparkles", orderIndex: 1, hidden: false },
    { id: "tb-2", title: "Women Artisan Network", subtitle: "Skill to Sustainable Market", iconName: "Users", orderIndex: 2, hidden: false },
    { id: "tb-3", title: "Bulk Production", subtitle: "Structured Capacity & Timelines", iconName: "PackageCheck", orderIndex: 3, hidden: false },
    { id: "tb-4", title: "Institutional Supply", subtitle: "All Govt. Tender Support", iconName: "Building2", orderIndex: 4, hidden: false },
    { id: "tb-5", title: "Custom Craft Production", subtitle: "Tailored Designs & Branding", iconName: "Wrench", orderIndex: 5, hidden: false },
    { id: "tb-6", title: "International Buyer Support", subtitle: "Sample Review & Export Packaging", iconName: "Globe2", orderIndex: 6, hidden: false }
  ],
  whyUsCards: [
    {
      id: "why-1",
      title: "Authentic Indian Craft",
      description: "Direct connection with grassroots Bengal craft traditions including terracotta, clay sculpting, Kantha, and Dokra metal casting without artificial synthetic shortcuts.",
      iconName: "Palette",
      orderIndex: 1,
      hidden: false
    },
    {
      id: "why-2",
      title: "Women's Livelihood Opportunities",
      description: "Bulk orders directly generate production opportunities and market access for women artisans, fostering household dignity and craft preservation.",
      iconName: "HeartHandshake",
      orderIndex: 2,
      hidden: false
    },
    {
      id: "why-3",
      title: "Bulk Production Capability",
      description: "Organized workshop clusters capable of handling large-volume demands from 50 to 10,000+ units with batch-wise quality inspections.",
      iconName: "Layers",
      orderIndex: 3,
      hidden: false
    },
    {
      id: "why-4",
      title: "Custom Requirements & Private Label",
      description: "From custom color palettes and stamped brand logos to bespoke gift packaging, we adapt our craft to your brand vision.",
      iconName: "Sliders",
      orderIndex: 4,
      hidden: false
    },
    {
      id: "why-5",
      title: "Institutional & Tender Readiness",
      description: "Official documentation, GST compliance, invoice transparency, and experience handling structured government and corporate procurement.",
      iconName: "FileCheck",
      orderIndex: 5,
      hidden: false
    },
    {
      id: "why-6",
      title: "Dedicated Buyer Support",
      description: "Direct access to business owner Monojit Dey and our production team via phone, WhatsApp, and our 3-language AI sales assistant.",
      iconName: "PhoneCall",
      orderIndex: 6,
      hidden: false
    }
  ],
  workflowSteps: [
    { id: "wf-1", stepNumber: 1, title: "Learn", description: "Artisans master traditional terracotta, textile, and jewellery techniques.", iconName: "BookOpen", orderIndex: 1, hidden: false },
    { id: "wf-2", stepNumber: 2, title: "Practice", description: "Refining craftsmanship through hands-on sample creation and finishing.", iconName: "Award", orderIndex: 2, hidden: false },
    { id: "wf-3", stepNumber: 3, title: "Create", description: "Transforming natural riverbed clay, cotton, and brass into authentic goods.", iconName: "Flame", orderIndex: 3, hidden: false },
    { id: "wf-4", stepNumber: 4, title: "Quality Check", description: "Stringent verification of dimensions, durability, and paint finishes.", iconName: "CheckCircle2", orderIndex: 4, hidden: false },
    { id: "wf-5", stepNumber: 5, title: "Receive Production Opportunities", description: "Bulk and institutional orders are allocated among trained artisan clusters.", iconName: "Briefcase", orderIndex: 5, hidden: false },
    { id: "wf-6", stepNumber: 6, title: "Fulfil Orders", description: "Crafting batches with disciplined deadlines and safe export packaging.", iconName: "Truck", orderIndex: 6, hidden: false },
    { id: "wf-7", stepNumber: 7, title: "Earn", description: "Timely compensation for work produced, creating self-reliant livelihoods.", iconName: "Coins", orderIndex: 7, hidden: false },
    { id: "wf-8", stepNumber: 8, title: "Grow", description: "Continuous skill development and sustainable community progress.", iconName: "TrendingUp", orderIndex: 8, hidden: false }
  ],
  bulkCta: {
    headline: "Looking for Bulk Handcrafted Products for Your Business or Event?",
    supportingText: "We cater to wholesale distributors, export buyers, corporate event planners, and government procurement teams. Request a personalized quotation with sample previews today.",
    buttonText: "Request Bulk Quote"
  },
  govtSectionPreview: {
    headline: "Specialized in All Govt. Tender & Institutional Handicrafts",
    supportingText: "We provide end-to-end documentation, sample approval protocols, and verified artisan manufacturing for institutional requirements across India."
  }
};

export const defaultNavigation: NavigationItem[] = [
  { id: "nav-1", label: "Home", route: "/", orderIndex: 1, hidden: false },
  { id: "nav-2", label: "About", route: "/about", orderIndex: 2, hidden: false },
  { id: "nav-3", label: "Our Artisans", route: "/our-artisans", orderIndex: 3, hidden: false },
  { id: "nav-4", label: "Products", route: "/products", orderIndex: 4, hidden: false },
  { id: "nav-5", label: "Bulk Orders", route: "/bulk-orders", orderIndex: 5, hidden: false },
  { id: "nav-6", label: "Govt & Institutional", route: "/government-institutional", orderIndex: 6, hidden: false },
  { id: "nav-7", label: "Training & Livelihood", route: "/training-livelihood", orderIndex: 7, hidden: false },
  { id: "nav-8", label: "International Buyers", route: "/international-buyers", orderIndex: 8, hidden: false },
  { id: "nav-9", label: "Contact", route: "/contact", orderIndex: 9, hidden: false }
];

export const defaultLegalPages: LegalPage[] = [
  {
    id: "legal-1",
    slug: "privacy-policy",
    title: "Privacy Policy",
    lastUpdated: "2026-09-01",
    content: `JIT PRIME MPC COMPANY ("Company", "we", "our", or "us"), founded by Monojit Dey, is committed to safeguarding the privacy and confidentiality of our business clients, website visitors, and artisans.

1. Information We Collect
We collect business contact information submitted through our quotation and inquiry forms, including full name, business or corporate entity name, country, WhatsApp or mobile telephone number, email address, product specifications, and desired delivery destinations.

2. How We Use Information
We utilize collected data strictly to:
- Generate and communicate tailored wholesale / B2B quotations.
- Coordinate production scheduling, samples, and shipping logistics.
- Respond to inquiries submitted via website forms, WhatsApp, or our AI Sales Assistant.
- Review and follow up on artisan training and network applications.

3. Protection & Non-Disclosure
We do not sell, rent, or trade your personal or corporate contact information with third-party advertising brokers. Data is accessible solely to authorized personnel of Jit Prime MPC Company for legitimate business fulfilment.

4. Contact for Privacy Inquiries
For any questions regarding data held by Jit Prime MPC Company, contact:
Email: monojitdey189@gmail.com | Phone: +91 82405 85219
Address: Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.`
  },
  {
    id: "legal-2",
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    lastUpdated: "2026-09-01",
    content: `Welcome to JIT PRIME MPC COMPANY (Owner: Monojit Dey). By accessing this website or placing orders with us, you agree to these Terms and Conditions.

1. Commercial Scope
Jit Prime MPC Company specializes in authentic Hasta Shilpa (Indian handicrafts), handcrafted jewellery, clay/terracotta art, natural fiber products, government tender supply, and custom bulk manufacturing.

2. Quotations & Pricing
- Given the handmade nature of our products and fluctuating raw material costs, prices displayed online are indicative retail/reference prices unless confirmed via written quotation.
- Formal bulk quotations depend on quantity, required customizations, packaging specifications, transit destination, and production scheduling.

3. Payment Terms & Advance Policy
- Standard bulk and custom orders require an agreed advance deposit (typically 50% or as specified in your formal proforma invoice) to initiate raw material procurement and artisan allocation.
- The remaining balance is payable prior to dispatch or upon bill of lading presentation according to agreed purchase terms.

4. Artisan Livelihood Scope
We create meaningful production and market-linked income opportunities for local women artisans through genuine orders. We do not provide or guarantee fixed public employment or unconditional salaries.

5. Jurisdiction
All agreements and disputes shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal, India.`
  },
  {
    id: "legal-3",
    slug: "shipping-policy",
    title: "Shipping Policy",
    lastUpdated: "2026-09-01",
    content: `1. Domestic Dispatch (Within India)
- Standard bulk orders are packed in protective shock-absorbing export-grade cartons with individual cushioning for fragile terracotta and clay art.
- Dispatch is arranged via reputable surface or express logistics partners (or client-designated transport agencies) from our Kolkata hub.
- Transit times typically range between 3 to 7 business days following production completion, depending on state destination.

2. International Shipments
- International bulk shipments are dispatched via air cargo or ocean freight based on consignment volume and client request.
- Notice: International shipping costs, customs clearance protocols, import duties, harbor charges, and delivery timelines vary strictly by destination country, order weight, and agreed quotation. We provide complete documentation support (Commercial Invoice, Packing List, Certificate of Origin where applicable).

3. Damage in Transit
Please inspect outer cartons upon arrival. Any physical breakage or transit damage must be documented with clear photographs/video within 48 hours of receipt and reported to monojitdey189@gmail.com or WhatsApp (+91 82405 85219).`
  },
  {
    id: "legal-4",
    slug: "returns-and-refund",
    title: "Returns & Refund Policy",
    lastUpdated: "2026-09-01",
    content: `1. Handmade Craft Characteristics
Because our items are handcrafted by human artisans without industrial machinery, slight variations in natural clay hue, brushwork strokes, embroidery weave, and dimensions (within ±5%) are authentic hallmarks of genuine Hasta Shilpa and are not considered defects.

2. Bulk & Custom Production
Customized orders, private-labeled goods, or large-volume production batches manufactured specifically for a client cannot be returned for arbitrary change of mind once production has commenced or completed.

3. Defective or Damaged Shipments
If an item arrives broken, defective, or significantly divergent from approved physical pre-production samples:
- Notify our team within 48 hours of delivery with photographic evidence.
- We will review the claim promptly and offer an appropriate resolution: replacement in upcoming batch, credit note, or repair as agreed.

4. Cancellations
Order cancellations must be requested prior to material procurement and production initiation. Advance deposits utilized for specialized raw material acquisition cannot be refunded.`
  },
  {
    id: "legal-5",
    slug: "disclaimer",
    title: "Disclaimer",
    lastUpdated: "2026-09-01",
    content: `1. Informational Purpose
The content on this website is for general informational, catalog showcase, and business enquiry purposes. We strive to maintain accurate data, but specifications and availability may evolve.

2. Government & Tender Information
Mentions of government tender readiness, capabilities, or institutional supply reflect our manufacturing and fulfillment capacities. We do not claim official government endorsement, sponsorship, or state agency status unless specifically documented in a formal tender contract.

3. Artisan Empowerment Statement
Our artisan network provides income and production opportunities linked to actual market orders and skill workshops. Statements regarding empowerment describe our mission to provide market access rather than legal guarantees of unconditional financial returns.`
  },
  {
    id: "legal-6",
    slug: "cancellation-policy",
    title: "Cancellation Policy",
    lastUpdated: "2026-09-01",
    content: `1. Standard Cancellation Window
For wholesale, bulk, or institutional orders, cancellation requests must be submitted in writing within 24 hours of invoice acceptance and before artisan allocation or raw material procurement begins.

2. Made-to-Order & Custom Crafts
Because handcrafted terracotta, Dokra brass casting, and hand-embroidered items require immediate procurement of organic raw materials and reservation of women artisan workshop capacity:
- Orders that have commenced fabrication or carving cannot be cancelled.
- Advance deposits committed to raw materials (clay, paints, bell metal, fabric, packaging) are non-refundable once production scheduling is initiated.

3. Modifications in Lieu of Cancellation
If you need to revise quantities, delivery schedules, or product variations, please contact us immediately. We will make every effort to accommodate modifications before batch completion.

4. Company Rights
Jit Prime MPC Company reserves the right to cancel an order due to unforeseen raw material unavailability, extreme environmental disruptions affecting clay kiln curing, or force majeure events. In such rare instances, any unused advance deposit will be promptly refunded.

For cancellation queries, contact Monojit Dey:
Phone / WhatsApp: +91 82405 85219 | Email: monojitdey189@gmail.com`
  }
];

export const defaultFAQs: FAQ[] = [
  {
    id: "faq-1",
    category: "Bulk Orders",
    question: "What is your Minimum Order Quantity (MOQ) for bulk purchases?",
    answer: "Our typical MOQ starts from 25 to 50 pieces for terracotta jewellery and decor, and 100 pieces for pouches or jute items. We are flexible for trial batches and mixed category orders.",
    orderIndex: 1,
    hidden: false
  },
  {
    id: "faq-2",
    category: "Bulk Orders",
    question: "Can you customize designs with our brand logo or specific colors?",
    answer: "Yes! Customization is one of our key strengths. We can incorporate custom colors, motifs, embossed brass tags, screen-printed logos on packaging, and private labeling.",
    orderIndex: 2,
    hidden: false
  },
  {
    id: "faq-3",
    category: "Government",
    question: "How do you fulfill Government Tender and Institutional requirements?",
    answer: "Jit Prime MPC Company provides structured procurement support, GST compliance, technical documentation, pre-production sample approvals, and reliable delivery for public institutions and corporate events.",
    orderIndex: 3,
    hidden: false
  },
  {
    id: "faq-4",
    category: "Shipping",
    question: "Do you supply to international buyers outside India?",
    answer: "Yes, we welcome international buyers, wholesalers, and boutiques. We coordinate export packing and logistics documentation. Specific freight, duties, and timelines are confirmed per quotation.",
    orderIndex: 4,
    hidden: false
  },
  {
    id: "faq-5",
    category: "Artisans",
    question: "How are women artisans supported through Jit Prime MPC Company?",
    answer: "We connect rural and local women artisans directly with real production and market-linked orders. By learning refined techniques and participating in order fulfillment, artisans earn fair income for their handcrafted work.",
    orderIndex: 5,
    hidden: false
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "test-1",
    clientName: "Debasis M.",
    company: "Bengal Cultural Society",
    location: "Kolkata, India",
    content: "We placed an institutional order for 250 handcrafted terracotta mementos for our annual convention. Monojit Dey and his team delivered on time with impeccable craftsmanship and elegant packaging.",
    rating: 5,
    verifiedBuyer: true,
    orderIndex: 1,
    hidden: false
  },
  {
    id: "test-2",
    clientName: "Sarah L.",
    company: "Ethnic Imports Ltd.",
    location: "London, United Kingdom",
    content: "The terracotta jewellery sets and Kantha pouches are wonderfully authentic. Our boutique customers loved the craft stories and direct connection with Bengal women artisans.",
    rating: 5,
    verifiedBuyer: true,
    orderIndex: 2,
    hidden: false
  }
];

export const defaultLeads: BulkEnquiryLead[] = [
  {
    id: "lead-sample-1",
    name: "Rajesh Sharma",
    companyName: "Vedic Heritage Retail",
    country: "India",
    destination: "New Delhi",
    whatsapp: "+91 98300 12345",
    email: "rajesh@vedicheritage.com",
    productOrCategory: "Handmade Jewellery & Terracotta Diyas",
    quantity: "300 Sets",
    requiredDeliveryDate: "2026-09-30",
    customizationRequirement: "Custom gift box with company logo",
    packagingRequirement: "Individual eco craft packaging",
    privateLabelBranding: true,
    message: "Interested in stocking your terracotta jewellery and festive diyas for our retail stores ahead of Durga Puja and Diwali.",
    source: "Website Form",
    priority: "HIGH",
    status: "NEW",
    notes: [
      { text: "Client requested sample kit via WhatsApp.", date: new Date().toISOString(), author: "Monojit Dey" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Hand-painted Terracotta Temple Jewellery Set",
    category: "Handmade Jewellery",
    description: "Pure natural clay pendant and matching jhumkas fired in kiln and painted with organic water-resistant pigments by women artisans.",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    artisanName: "Kakali Mondal",
    materials: "Terracotta Clay, Cotton Dori, Natural Lacquer",
    featured: true,
    orderIndex: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-2",
    title: "Traditional Bengal Dokra Tribal Musician Figurine",
    category: "Dokra & Metal Craft",
    description: "Lost-wax cast bell metal sculpture showcasing the 4000-year-old tribal heritage of Bankura and Purulia.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    artisanName: "Subhash Karmakar",
    materials: "Recycled Brass, Bell Metal",
    featured: true,
    orderIndex: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-3",
    title: "Durga Face Terracotta Wall Hanging Plaque",
    category: "Puja & Festive Decor",
    description: "Intricately detailed Mother Durga face plaque baked in traditional firewood kiln with natural ochre wash.",
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    artisanName: "Rina Das",
    materials: "Riverbed Clay, Natural Pigments",
    featured: true,
    orderIndex: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-4",
    title: "Hand-embroidered Kantha Folk Stitch Pouch",
    category: "Kantha & Handloom",
    description: "Heritage running-stitch Kantha embroidery created on handloom cotton fabric for festive gifting and boutique fashion.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    artisanName: "Shanti Soren",
    materials: "Handloom Cotton, Cotton Threads",
    featured: true,
    orderIndex: 4,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-5",
    title: "Artisanal Bankura Terracotta Horse (ঘোড়া)",
    category: "Terracotta & Clay Art",
    description: "World-renowned GI-certified Bankura Panchmura clay horse, handcrafted with symmetrical neck and ear motifs.",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    artisanName: "Monojit Dey Workshop",
    materials: "Purified Terracotta Clay",
    featured: true,
    orderIndex: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-6",
    title: "Festive Designer Clay Diya & Candle Stand Collection",
    category: "Puja & Festive Decor",
    description: "Assorted handcrafted terracotta oil lamps designed for corporate Diwali and Durga Puja institutional distribution.",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    artisanName: "Nimta Women Cluster",
    materials: "Clay, Organic Enamel Paint",
    featured: false,
    orderIndex: 6,
    createdAt: new Date().toISOString()
  }
];

export const defaultCoupons: Coupon[] = [
  {
    id: "coupon-1",
    code: "PUJA10",
    description: "Durga Puja Festive Offer: 10% Discount on all handcrafted jewellery and clay art",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 1000,
    minQuantity: 10,
    maxDiscount: 2000,
    applicableCategory: "all",
    validUntil: "2026-11-30",
    isActive: true,
    createdAt: "2026-09-12T00:00:00.000Z"
  },
  {
    id: "coupon-2",
    code: "BULK500",
    description: "Flat ₹500 discount for bulk orders of 50 units or more",
    discountType: "fixed",
    discountValue: 500,
    minOrderAmount: 5000,
    minQuantity: 50,
    applicableCategory: "all",
    validUntil: "2026-12-31",
    isActive: true,
    createdAt: "2026-09-12T00:00:00.000Z"
  },
  {
    id: "coupon-3",
    code: "HANDMADE15",
    description: "Special 15% discount for wholesale orders above ₹10,000",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 10000,
    minQuantity: 25,
    maxDiscount: 3500,
    applicableCategory: "all",
    validUntil: "2026-12-31",
    isActive: true,
    createdAt: "2026-09-12T00:00:00.000Z"
  }
];

