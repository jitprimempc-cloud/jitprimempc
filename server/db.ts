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
  Coupon,
  TeamMember
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
  teamMembers: TeamMember[];
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
    banners: [],
    homepageContent: defaultHomepageContent,
    customSections: [],
    videos: [],
    navigation: defaultNavigation,
    legalPages: defaultLegalPages,
    faqs: defaultFAQs,
    testimonials: defaultTestimonials,
    leads: defaultLeads,
    media: [],
    gallery: defaultGallery,
    teamMembers: [],
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
        passwordHash: 'Jit@123',
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
