import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';
import type {
  Product,
  Category,
  BannerItem,
  VideoItem,
  SiteSettings,
  WorkerApplication,
  BulkEnquiryLead,
  Coupon,
  CustomSection,
  GalleryItem,
  Artisan,
  Testimonial,
  TeamMember,
  MediaFile
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function isOfflineError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.toLowerCase().includes('client is offline') ||
    msg.toLowerCase().includes('unavailable') ||
    msg.toLowerCase().includes('network')
  );
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  if (isOfflineError(error)) {
    console.warn(`Firestore [${path}] client is offline or database is initializing.`);
  } else {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  }
  throw new Error(JSON.stringify(errInfo));
}

// ----------------------------------------------------
// Generic clean document serialization (removes undefined)
// ----------------------------------------------------
function cleanData<T extends Record<string, any>>(obj: T): T {
  const copy = { ...obj };
  Object.keys(copy).forEach(key => {
    if (copy[key] === undefined) {
      delete copy[key];
    }
  });
  return copy;
}

// ====================================================
// Products
// ====================================================
export async function fsGetProducts(): Promise<Product[]> {
  const path = 'products';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Product[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as Product);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveProduct(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), cleanData(product), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteProduct(id: string): Promise<void> {
  const path = `products/${id}`;
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Categories
// ====================================================
export async function fsGetCategories(): Promise<Category[]> {
  const path = 'categories';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Category[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as Category);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveCategory(category: Category): Promise<void> {
  const path = `categories/${category.id}`;
  try {
    await setDoc(doc(db, 'categories', category.id), cleanData(category), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteCategory(id: string): Promise<void> {
  const path = `categories/${id}`;
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Banners
// ====================================================
export async function fsGetBanners(): Promise<BannerItem[]> {
  const path = 'banners';
  try {
    const snap = await getDocs(collection(db, path));
    const items: BannerItem[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as BannerItem);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveBanner(banner: BannerItem): Promise<void> {
  const path = `banners/${banner.id}`;
  try {
    await setDoc(doc(db, 'banners', banner.id), cleanData(banner), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteBanner(id: string): Promise<void> {
  const path = `banners/${id}`;
  try {
    await deleteDoc(doc(db, 'banners', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Videos
// ====================================================
export async function fsGetVideos(): Promise<VideoItem[]> {
  const path = 'videos';
  try {
    const snap = await getDocs(collection(db, path));
    const items: VideoItem[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as VideoItem);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveVideo(video: VideoItem): Promise<void> {
  const path = `videos/${video.id}`;
  try {
    await setDoc(doc(db, 'videos', video.id), cleanData(video), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteVideo(id: string): Promise<void> {
  const path = `videos/${id}`;
  try {
    await deleteDoc(doc(db, 'videos', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Site Settings
// ====================================================
export async function fsGetSettings(): Promise<SiteSettings | null> {
  const path = 'settings/main';
  try {
    const snap = await getDoc(doc(db, 'settings', 'main'));
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return null;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return null;
    }
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function fsSaveSettings(settings: SiteSettings): Promise<void> {
  const path = 'settings/main';
  try {
    await setDoc(doc(db, 'settings', 'main'), cleanData(settings), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ====================================================
// Worker Applications
// ====================================================
export async function fsGetWorkerApplications(): Promise<WorkerApplication[]> {
  const path = 'workerApplications';
  try {
    const snap = await getDocs(collection(db, path));
    const items: WorkerApplication[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as WorkerApplication);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveWorkerApplication(app: WorkerApplication): Promise<void> {
  const path = `workerApplications/${app.id}`;
  try {
    await setDoc(doc(db, 'workerApplications', app.id), cleanData(app), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteWorkerApplication(id: string): Promise<void> {
  const path = `workerApplications/${id}`;
  try {
    await deleteDoc(doc(db, 'workerApplications', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Leads (Bulk Enquiry)
// ====================================================
export async function fsGetLeads(): Promise<BulkEnquiryLead[]> {
  const path = 'leads';
  try {
    const snap = await getDocs(collection(db, path));
    const items: BulkEnquiryLead[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as BulkEnquiryLead);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveLead(lead: BulkEnquiryLead): Promise<void> {
  const path = `leads/${lead.id}`;
  try {
    await setDoc(doc(db, 'leads', lead.id), cleanData(lead), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteLead(id: string): Promise<void> {
  const path = `leads/${id}`;
  try {
    await deleteDoc(doc(db, 'leads', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Coupons
// ====================================================
export async function fsGetCoupons(): Promise<Coupon[]> {
  const path = 'coupons';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Coupon[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as Coupon);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveCoupon(coupon: Coupon): Promise<void> {
  const path = `coupons/${coupon.id}`;
  try {
    await setDoc(doc(db, 'coupons', coupon.id), cleanData(coupon), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteCoupon(id: string): Promise<void> {
  const path = `coupons/${id}`;
  try {
    await deleteDoc(doc(db, 'coupons', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Custom Sections
// ====================================================
export async function fsGetCustomSections(): Promise<CustomSection[]> {
  const path = 'customSections';
  try {
    const snap = await getDocs(collection(db, path));
    const items: CustomSection[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as CustomSection);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveCustomSection(section: CustomSection): Promise<void> {
  const path = `customSections/${section.id}`;
  try {
    await setDoc(doc(db, 'customSections', section.id), cleanData(section), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteCustomSection(id: string): Promise<void> {
  const path = `customSections/${id}`;
  try {
    await deleteDoc(doc(db, 'customSections', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Gallery Items (হাতের কাজের গ্যালারি)
// ====================================================
export async function fsGetGallery(): Promise<GalleryItem[]> {
  const path = 'gallery';
  try {
    const snap = await getDocs(collection(db, path));
    const items: GalleryItem[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as GalleryItem);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveGalleryItem(item: GalleryItem): Promise<void> {
  const path = `gallery/${item.id}`;
  try {
    await setDoc(doc(db, 'gallery', item.id), cleanData(item), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteGalleryItem(id: string): Promise<void> {
  const path = `gallery/${id}`;
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Artisans (কারিগর নেটওয়ার্ক)
// ====================================================
export async function fsGetArtisans(): Promise<Artisan[]> {
  const path = 'artisans';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Artisan[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as Artisan);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveArtisan(artisan: Artisan): Promise<void> {
  const path = `artisans/${artisan.id}`;
  try {
    await setDoc(doc(db, 'artisans', artisan.id), cleanData(artisan), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteArtisan(id: string): Promise<void> {
  const path = `artisans/${id}`;
  try {
    await deleteDoc(doc(db, 'artisans', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Testimonials (গ্রাহক প্রতিক্রিয়া)
// ====================================================
export async function fsGetTestimonials(): Promise<Testimonial[]> {
  const path = 'testimonials';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Testimonial[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as Testimonial);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveTestimonial(testimonial: Testimonial): Promise<void> {
  const path = `testimonials/${testimonial.id}`;
  try {
    await setDoc(doc(db, 'testimonials', testimonial.id), cleanData(testimonial), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteTestimonial(id: string): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Team (টিম সদস্য)
// ====================================================
export async function fsGetTeam(): Promise<TeamMember[]> {
  const path = 'team';
  try {
    const snap = await getDocs(collection(db, path));
    const items: TeamMember[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as TeamMember);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fsSaveTeam(member: TeamMember): Promise<void> {
  const path = `team/${member.id}`;
  try {
    await setDoc(doc(db, 'team', member.id), cleanData(member), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fsDeleteTeam(id: string): Promise<void> {
  const path = `team/${id}`;
  try {
    await deleteDoc(doc(db, 'team', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ====================================================
// Firebase Storage & Media Persistence (স্থায়ী ছবি ও মিডিয়া স্টোরেজ)
// ====================================================

/**
 * Uploads a raw or compressed file blob directly to Firebase Storage bucket.
 * Returns the permanent, public HTTPS download URL.
 */
export async function fsUploadFileToStorage(
  file: File | Blob, 
  customFileName?: string,
  folder: string = 'uploads'
): Promise<string> {
  const cleanName = (customFileName || (file instanceof File ? file.name : `file-${Date.now()}.jpg`))
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${Math.round(Math.random() * 10000)}_${cleanName}`;
  
  const storageRef = ref(storage, path);
  const metadata = {
    contentType: file.type || 'image/jpeg',
  };

  const snapshot = await uploadBytes(storageRef, file, metadata);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

/**
 * Get all media catalog records from Firestore
 */
export async function fsGetMediaFiles(): Promise<MediaFile[]> {
  const path = 'media';
  try {
    const snap = await getDocs(collection(db, path));
    const items: MediaFile[] = [];
    snap.forEach(d => {
      items.push({ id: d.id, ...d.data() } as MediaFile);
    });
    return items;
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] is offline or database is initializing.`);
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Save media record to Firestore so it is permanently cataloged
 */
export async function fsSaveMediaFile(media: MediaFile): Promise<void> {
  const path = `media/${media.id}`;
  try {
    await setDoc(doc(db, 'media', media.id), cleanData(media), { merge: true });
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] write offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete media record from Firestore and Storage if applicable
 */
export async function fsDeleteMediaFile(id: string): Promise<void> {
  const path = `media/${id}`;
  try {
    await deleteDoc(doc(db, 'media', id));
  } catch (error) {
    if (isOfflineError(error)) {
      console.warn(`Firestore [${path}] delete offline:`, error);
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}


