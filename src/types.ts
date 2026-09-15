export type LeadStatus = 
  | 'NEW' 
  | 'CONTACTED' 
  | 'QUALIFIED' 
  | 'QUOTATION SENT' 
  | 'NEGOTIATION' 
  | 'WON' 
  | 'LOST' 
  | 'FOLLOW-UP';

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  shortDescription: string;
  fullDescription: string;
  craftStory?: string;
  materials: string[];
  dimensions?: string;
  weight?: string;
  availableColours: string[];
  variants?: ProductVariant[];
  sku: string;
  moq: number;
  retailPrice?: number;
  bulkPrice?: number;
  priceOnRequest: boolean;
  customizationAvailable: boolean;
  productionStatus: 'Ready to Ship' | 'Made to Order' | 'In Production';
  estimatedProductionTime: string;
  leadTime?: string;
  featured: boolean;
  isNew: boolean;
  hidden?: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  primaryImage: string;
  images: string[];
  videoUrl?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  hidden: boolean;
  orderIndex: number;
}

export interface Artisan {
  id: string;
  name: string;
  artisanCode?: string;
  photo: string;
  additionalPhotos?: string[];
  craft: string;
  productCategory: string;
  experienceYears: number;
  story: string;
  skills: string[];
  productsCreated?: string[];
  broadLocation: string;
  featured: boolean;
  hidden: boolean;
  orderIndex: number;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  skill: string;
  craftFocus?: string;
  batchSize?: string;
  registrationOpen?: boolean;
  eligibility: string;
  duration: string;
  location: string;
  batchDate?: string;
  seats?: string;
  registrationStatus: 'Open' | 'Upcoming' | 'Closed';
  applicationInstructions: string;
  images: string[];
  faqs?: { question: string; answer: string }[];
  hidden: boolean;
  orderIndex: number;
}

export interface TrainingApplication {
  id: string;
  programId: string;
  programTitle: string;
  applicantName: string;
  phone: string;
  whatsapp?: string;
  location: string;
  age?: string;
  craftInterest: string;
  message?: string;
  status: 'New' | 'Reviewed' | 'Accepted' | 'Waitlisted' | 'Completed';
  createdAt: string;
}

export interface GovernmentTender {
  id: string;
  title: string;
  organization: string;
  issuingOrganization?: string;
  department?: string;
  tenderReferenceNumber?: string;
  approximateValue?: string;
  scopeOfWork?: string;
  completionYear?: string;
  year: string;
  category: string;
  description: string;
  caseStudySnippet?: string;
  status: 'Verified Project' | 'Active Capability' | 'Empanelled' | 'Completed' | 'Documentation Ready' | string;
  documents?: { name: string; url: string }[];
  images?: string[];
  caseStudy?: string;
  hidden: boolean;
  orderIndex: number;
}

export interface BulkEnquiryLead {
  id: string;
  name: string;
  companyName: string;
  country: string;
  destination?: string;
  whatsapp: string;
  email: string;
  productOrCategory: string;
  quantity: number | string;
  requiredDeliveryDate?: string;
  customizationRequirement?: string;
  packagingRequirement?: string;
  privateLabelBranding?: boolean;
  message: string;
  fileAttachment?: string;
  source: 'Website Form' | 'AI Chatbot' | 'WhatsApp Click' | 'Direct';
  priority: LeadPriority;
  status: LeadStatus;
  couponCode?: string;
  discountAmount?: number;
  estimatedTotal?: number;
  notes?: { text: string; date: string; author: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PujaCampaign {
  id: string;
  title: string;
  subtitle: string;
  headline: string;
  supportingText: string;
  offerText: string;
  bannerImage: string;
  ctaText: string;
  ctaLink: string;
  countdownDeadline: string; // ISO String
  enabled: boolean;
  showCountdown: boolean;
  startDate?: string;
  endDate?: string;
}

export interface TrustBadge {
  id: string;
  title: string;
  subtitle?: string;
  iconName: string;
  orderIndex: number;
  hidden: boolean;
}

export interface WhyUsCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  link?: string;
  orderIndex: number;
  hidden: boolean;
}

export interface ArtisanWorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
  orderIndex: number;
  hidden: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company?: string;
  location?: string;
  content: string;
  rating: number;
  verifiedBuyer: boolean;
  avatar?: string;
  orderIndex: number;
  hidden: boolean;
  createdAt?: string;
}

export interface FAQ {
  id: string;
  category: 'General' | 'Bulk Orders' | 'Artisans' | 'Government' | 'Shipping';
  question: string;
  answer: string;
  orderIndex: number;
  hidden: boolean;
}

export interface SocialProfile {
  id: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'whatsapp' | 'linkedin' | 'twitter' | 'pinterest' | 'telegram' | 'website' | 'other';
  label: string;
  url: string;
  iconName?: string;
  enabled?: boolean;
}

export interface SiteSettings {
  companyName: string;
  shortName?: string;
  ownerName: string;
  tagline: string;
  phone: string;
  secondaryPhone?: string;
  tertiaryPhone?: string;
  whatsappNumber: string;
  email: string;
  fullAddress: string;
  googleMapsUrl?: string;
  businessHours: string;
  generalMoq?: number;
  bulkMoq?: number;
  showArtisansMenu?: boolean;
  socialProfiles?: SocialProfile[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    whatsapp?: string;
    twitter?: string;
  };
  logoUrl?: string;
  faviconUrl?: string;
  currencySymbol: string;
  internationalShippingDisclaimer: string;
  advancePaymentPolicyNote: string;
  shippingDisclaimer?: string;
  visitingCardTagline?: string;
  aboutPhoto?: string;
  teamSettings?: TeamSectionSettings;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage?: string;
  };
}

export interface HomepageContent {
  hero: {
    headline: string;
    supportingText: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    thirdCtaText: string;
    thirdCtaLink: string;
    backgroundImage: string;
    additionalSlides?: {
      headline: string;
      supportingText: string;
      image: string;
      ctaText: string;
      ctaLink: string;
    }[];
  };
  trustBadges: TrustBadge[];
  whyUsCards: WhyUsCard[];
  workflowSteps: ArtisanWorkflowStep[];
  bulkCta: {
    headline: string;
    supportingText: string;
    buttonText: string;
  };
  govtSectionPreview: {
    headline: string;
    supportingText: string;
  };
}

export interface LegalPage {
  id: string;
  slug: 'privacy-policy' | 'terms-and-conditions' | 'shipping-policy' | 'returns-and-refund' | 'cancellation-policy' | 'disclaimer' | string;
  title: string;
  lastUpdated: string;
  content: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  orderIndex: number;
  hidden: boolean;
  isExternal?: boolean;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  altText?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  artisanName?: string;
  materials?: string;
  featured?: boolean;
  orderIndex?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  language?: 'en' | 'bn' | 'hi';
  intentScore?: LeadPriority;
  products?: Partial<Product>[];
  quickActions?: string[];
  timestamp: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoType?: 'upload' | 'link' | 'youtube' | 'vimeo' | 'external';
  googleDriveUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  category: 'Work Video' | 'Customer Review' | 'Production Video' | 'Handmade Work' | 'Our Craft' | 'Customer Stories' | 'Other' | string;
  featured: boolean;
  hidden: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface CustomSection {
  id: string;
  title: string;
  subtitle?: string;
  type?: 'text' | 'image' | 'image_text' | 'gallery' | 'video' | 'cards' | 'cta' | 'banner' | 'faq' | 'stats' | 'timeline';
  content?: string;
  imageUrl?: string;
  secondaryImageUrl?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  cards?: { title: string; description: string; icon?: string; link?: string }[];
  stats?: { label: string; value: string; helper?: string }[];
  hidden: boolean;
  active?: boolean;
  orderIndex: number;
}

export interface WorkerApplication {
  id: string;
  applicantName?: string;
  name?: string;
  phone: string;
  whatsappNumber?: string;
  email?: string;
  location: string;
  skill?: string;
  craftSkill?: string;
  experience?: string;
  experienceYears?: number;
  craftInterest?: string;
  availability?: string;
  dailyCapacityHours?: string;
  hasSmartphone?: boolean;
  message?: string;
  workSampleUrl?: string;
  status: 'New' | 'Contacted' | 'Shortlisted' | 'Active' | 'Not Suitable' | 'Follow-up' | 'NEW';
  notes?: string;
  createdAt: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  startDate?: string;
  endDate?: string;
  countdownEnabled: boolean;
  countdownDeadline?: string;
  active: boolean;
  orderIndex: number;
}

export type SiteLanguage = 'en' | 'bn';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed'; // percentage (%) or flat amount (₹)
  discountValue: number;
  minOrderAmount?: number;
  minQuantity?: number;
  maxDiscount?: number; // Cap for percentage discounts
  applicableCategory?: string; // 'all' or specific category
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  finalTotal: number;
  message: string;
}

export interface TeamMember {
  id: string;
  name?: string;
  role?: string; // post / designation (optional)
  photo?: string;
  bio?: string;
  caption?: string;
  orderIndex?: number;
  hidden?: boolean;
  aspectRatio?: 'square' | 'wide'; // Flipkart product (square) or YouTube thumbnail (wide)
}

export interface TeamSectionSettings {
  enabled?: boolean;
  sectionTitle?: string;
  sectionSubtitle?: string;
  displayLayout?: 'square' | 'wide'; // 'square' = Flipkart Product size (1:1), 'wide' = YouTube Thumbnail size (16:9)
  groupPhotoEnabled?: boolean;
  groupPhoto?: string;
  groupPhotoTitle?: string;
  groupPhotoDescription?: string;
}


