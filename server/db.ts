import fs from 'fs';
import path from 'path';
import { 
  SiteSettings, 
  Product, 
  Category, 
  Artisan, 
  TrainingProgram, 
  TrainingApplication, 
  GovernmentTender, 
  PujaCampaign, 
  HomepageContent, 
  LegalPage, 
  FAQ, 
  Testimonial, 
  NavigationItem, 
  BulkEnquiryLead,
  MediaFile,
  GalleryItem,
  VideoItem,
  CustomSection,
  WorkerApplication,
  BannerItem,
  Coupon
} from '../src/types.js';

import {
  defaultSettings,
  defaultCategories,
  defaultProducts,
  defaultArtisans,
  defaultTrainingPrograms,
  defaultTenders,
  defaultCampaign,
  defaultHomepageContent,
  defaultNavigation,
  defaultLegalPages,
  defaultFAQs,
  defaultTestimonials,
  defaultLeads,
  defaultGallery,
  defaultCoupons
} from './defaultData.js';

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  passwordHash: string; // Stored securely
  role: 'superadmin' | 'admin';
  lastLogin?: string;
}

export interface DatabaseSchema {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  artisans: Artisan[];
  trainingPrograms: TrainingProgram[];
  trainingApplications: TrainingApplication[];
  workerApplications: WorkerApplication[];
  tenders: GovernmentTender[];
  campaigns: PujaCampaign[];
  banners: BannerItem[];
  homepageContent: HomepageContent;
  customSections: CustomSection[];
  videos: VideoItem[];
  navigation: NavigationItem[];
  legalPages: LegalPage[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  leads: BulkEnquiryLead[];
  media: MediaFile[];
  gallery: GalleryItem[];
  coupons: Coupon[];
  adminUsers: AdminUser[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial DB state
function getInitialDb(): DatabaseSchema {
  return {
    settings: defaultSettings,
    categories: defaultCategories,
    products: defaultProducts,
    artisans: defaultArtisans,
    coupons: defaultCoupons,
    trainingPrograms: defaultTrainingPrograms,
    trainingApplications: [],
    workerApplications: [],
    tenders: defaultTenders,
    campaigns: [defaultCampaign],
    banners: [
      {
        id: 'banner-1',
        title: 'Durga Puja Festive Bulk Bookings 2026',
        subtitle: 'Authentic Terracotta Jewellery & Bengali Folk Art',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Request Bulk Quote',
        ctaLink: '/bulk-orders',
        countdownEnabled: true,
        countdownDeadline: '2026-10-15T00:00:00.000Z',
        active: true,
        orderIndex: 1
      }
    ],
    homepageContent: defaultHomepageContent,
    customSections: [],
    videos: [
      {
        id: 'vid-1',
        title: 'Handmade Terracotta Jewellery Workshop & Artisan Crafting',
        description: 'Watch our skilled women artisans in Nimta moulding, baking and detailing exquisite clay jewellery pieces.',
        googleDriveUrl: 'https://drive.google.com/file/d/1demo-terracotta-jewellery/view',
        embedUrl: '',
        thumbnailUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        category: 'Work Video',
        featured: true,
        hidden: false,
        orderIndex: 1,
        createdAt: '2026-09-12T10:00:00.000Z'
      },
      {
        id: 'vid-2',
        title: 'Artisanal Bankura Clay Horse Moulding & Folk Decor Production',
        description: 'Authentic clay handmade manufacturing in Bengal connecting heritage craft with wholesale and bulk buyers.',
        googleDriveUrl: 'https://drive.google.com/file/d/1demo-bankura-clay-work/view',
        embedUrl: '',
        thumbnailUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
        category: 'Production Video',
        featured: true,
        hidden: false,
        orderIndex: 2,
        createdAt: '2026-09-12T10:00:00.000Z'
      }
    ],
    navigation: defaultNavigation,
    legalPages: defaultLegalPages,
    faqs: defaultFAQs,
    testimonials: defaultTestimonials,
    leads: defaultLeads,
    media: [],
    gallery: defaultGallery,
    adminUsers: [
      {
        id: 'admin-setup',
        username: 'admin',
        email: 'admin@gmail.com',
        passwordHash: 'Jit@123',
        role: 'superadmin'
      },
      {
        id: 'admin-monojit',
        username: 'monojit',
        email: 'monojitdey189@gmail.com',
        passwordHash: 'jitprime85219',
        role: 'superadmin'
      }
    ]
  };
}

// Read database
export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDb();
      writeDb(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    // Ensure missing collections are backfilled
    const initial = getInitialDb();
    let updated = false;
    for (const key of Object.keys(initial) as (keyof DatabaseSchema)[]) {
      if (data[key] === undefined) {
        (data as any)[key] = initial[key];
        updated = true;
      }
    }
    if (updated) {
      writeDb(data);
    }
    return data;
  } catch (err) {
    console.error('Error reading database file, returning initial state:', err);
    return getInitialDb();
  }
}

// Write database atomically
export function writeDb(data: DatabaseSchema): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}
