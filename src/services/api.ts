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
  CouponValidationResult,
  TeamMember
} from '../types';
import { staticDatabase } from '../data/staticDb';
import { compressImageFile } from '../utils/imageUtils';
import {
  fsGetProducts,
  fsSaveProduct,
  fsDeleteProduct,
  fsGetCategories,
  fsSaveCategory,
  fsDeleteCategory,
  fsGetBanners,
  fsSaveBanner,
  fsDeleteBanner,
  fsGetVideos,
  fsSaveVideo,
  fsDeleteVideo,
  fsGetSettings,
  fsSaveSettings,
  fsGetWorkerApplications,
  fsSaveWorkerApplication,
  fsDeleteWorkerApplication,
  fsGetLeads,
  fsSaveLead,
  fsDeleteLead,
  fsGetCoupons,
  fsSaveCoupon,
  fsDeleteCoupon,
  fsGetCustomSections,
  fsSaveCustomSection,
  fsDeleteCustomSection,
  fsGetGallery,
  fsSaveGalleryItem,
  fsDeleteGalleryItem,
  fsGetArtisans,
  fsSaveArtisan,
  fsDeleteArtisan,
  fsGetTestimonials,
  fsSaveTestimonial,
  fsDeleteTestimonial,
  fsGetTeam,
  fsSaveTeam,
  fsDeleteTeam
} from './firestoreService';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('jit_admin_token') || 'jit_admin_token_default';
  const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  return {
    'Content-Type': 'application/json',
    'Authorization': formattedToken
  };
}

// Local storage helper functions for offline / static host resilience (Vercel, Netlify, GitHub Pages)
function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage:`, e);
  }
}

// Safely execute API call with timeout, ignoring 404 / HTML responses returned by static hosts (Vercel / Netlify)
async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<{ ok: boolean; data?: T }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const ct = res.headers.get('content-type');
      if (ct && ct.includes('application/json')) {
        const data = await res.json();
        return { ok: true, data };
      }
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

// Universal Deleted Items Tracker for Static Hosting (Vercel / Netlify)
function recordDeleted(entityKey: string, id: string) {
  try {
    const key = `jit_deleted_${entityKey}`;
    const list = getLocalItem<string[]>(key, []);
    if (!list.includes(id)) {
      setLocalItem(key, [...list, id]);
    }
  } catch (e) {
    console.warn(`Failed to record deleted ${entityKey}:`, e);
  }
}

function getDeletedIds(entityKey: string): string[] {
  return getLocalItem<string[]>(`jit_deleted_${entityKey}`, []);
}

function filterDeleted<T extends { id?: string; slug?: string }>(entityKey: string, items: T[]): T[] {
  const deleted = getDeletedIds(entityKey);
  if (!deleted || deleted.length === 0) return items;
  return items.filter(item => {
    if (item.id && deleted.includes(item.id)) return false;
    if (item.slug && deleted.includes(item.slug)) return false;
    return true;
  });
}

export const api = {
  // ==========================================
  // Site Settings (Company Name, Logo, Visiting Card)
  // ==========================================
  async getSettings(): Promise<SiteSettings> {
    const localSettings = getLocalItem<Partial<SiteSettings>>('jit_site_settings', {});
    const baseSettings: SiteSettings = {
      ...staticDatabase.settings,
      logoUrl: staticDatabase.settings.logoUrl || '/logo.svg',
      ...localSettings
    };

    try {
      const fsSettings = await fsGetSettings();
      if (fsSettings) {
        setLocalItem('jit_site_settings', fsSettings);
        return { ...baseSettings, ...fsSettings };
      }
    } catch (e) {
      console.warn('Firestore settings fallback:', e);
    }

    const remote = await safeFetchJson<SiteSettings>(`${API_BASE}/settings`);
    if (remote.ok && remote.data) {
      const merged = { ...baseSettings, ...remote.data, ...localSettings };
      return merged;
    }

    return baseSettings;
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings }> {
    const currentLocal = getLocalItem<Partial<SiteSettings>>('jit_site_settings', {});
    const updatedSettings: SiteSettings = {
      ...staticDatabase.settings,
      logoUrl: '/logo.svg',
      ...currentLocal,
      ...settings
    };

    setLocalItem('jit_site_settings', updatedSettings);

    try {
      await fsSaveSettings(updatedSettings);
    } catch (e) {
      console.warn('Firestore save settings error:', e);
    }

    const remote = await safeFetchJson<{ success: boolean; settings: SiteSettings }>(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });

    if (remote.ok && remote.data?.settings) {
      return remote.data;
    }

    return { success: true, settings: updatedSettings };
  },

  // ==========================================
  // Products & Catalogue
  // ==========================================
  async getProducts(params?: { category?: string; search?: string; featured?: boolean; includeHidden?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.featured) query.append('featured', 'true');
    if (params?.includeHidden) query.append('includeHidden', 'true');

    // 1. Try Firebase Firestore Cloud Database (Persistent across browsers & devices)
    let list: Product[] = [];
    let fromCloud = false;
    try {
      const fsProducts = await fsGetProducts();
      if (fsProducts && fsProducts.length > 0) {
        list = fsProducts;
        fromCloud = true;
        setLocalItem('jit_custom_products', fsProducts);
      }
    } catch (e) {
      console.warn('Firestore products fetch fallback:', e);
    }

    // 2. Fallback to local & static cache
    if (!fromCloud) {
      const localProducts = getLocalItem<Product[]>('jit_custom_products', []);
      list = [...((staticDatabase.products || []) as Product[])];
      if (localProducts.length > 0) {
        const map = new Map<string, Product>();
        list.forEach(p => map.set(p.id, p));
        localProducts.forEach(p => map.set(p.id, p));
        list = Array.from(map.values());
      }
    }

    list = filterDeleted('products', list);

    const remote = await safeFetchJson<Product[]>(`${API_BASE}/products?${query.toString()}`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('products', remote.data);
    }

    // Apply query filters
    if (!params?.includeHidden) {
      list = list.filter(p => !p.hidden);
    }
    if (params?.category && params.category !== 'all') {
      list = list.filter(p => p.category === params.category);
    }
    if (params?.featured) {
      list = list.filter(p => p.featured);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) || 
        (p.fullDescription && p.fullDescription.toLowerCase().includes(q)) || 
        (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    return list;
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const all = await this.getProducts({ includeHidden: true });
    const match = all.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (match) return match;

    const remote = await safeFetchJson<Product>(`${API_BASE}/products/${idOrSlug}`);
    if (remote.ok && remote.data) return remote.data;

    return all[0];
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const newProduct: Product = {
      id: product.id || `prod-${Date.now()}`,
      slug: product.slug || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prod-${Date.now()}`),
      name: product.name || 'New Handicraft Product',
      category: product.category || 'Dokra Metal Craft',
      retailPrice: Number(product.retailPrice) || 500,
      bulkPrice: product.bulkPrice ? Number(product.bulkPrice) : 350,
      priceOnRequest: product.priceOnRequest || false,
      customizationAvailable: product.customizationAvailable !== false,
      productionStatus: product.productionStatus || 'Ready to Ship',
      estimatedProductionTime: product.estimatedProductionTime || '7-10 days',
      isNew: product.isNew !== false,
      orderIndex: product.orderIndex || 0,
      materials: product.materials || ['Terracotta clay', 'Brass metal'],
      availableColours: product.availableColours || ['Natural'],
      sku: product.sku || `JP-${Date.now().toString().slice(-4)}`,
      shortDescription: product.shortDescription || '',
      fullDescription: product.fullDescription || '',
      moq: Number(product.moq) || 10,
      primaryImage: product.primaryImage || 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80',
      images: product.images && product.images.length > 0 ? product.images : [product.primaryImage || 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80'],
      featured: product.featured || false,
      hidden: product.hidden || false,
      tags: product.tags || ['Handicrafts', 'Bengal', 'Authentic'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...product
    };

    // 1. Save to Firebase Firestore Cloud Database
    try {
      await fsSaveProduct(newProduct);
    } catch (e) {
      console.warn('Firestore product save error:', e);
    }

    // 2. Save to local storage cache
    const current = getLocalItem<Product[]>('jit_custom_products', []);
    setLocalItem('jit_custom_products', [newProduct, ...current.filter(p => p.id !== newProduct.id)]);

    const remote = await safeFetchJson<Product>(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newProduct)
    });

    return remote.ok && remote.data ? remote.data : newProduct;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const all = await this.getProducts({ includeHidden: true });
    const existing = all.find(p => p.id === id) || { id, name: 'Product' } as Product;
    const merged: Product = { ...existing, ...product, updatedAt: new Date().toISOString() };

    // 1. Update in Firebase Firestore Cloud Database
    try {
      await fsSaveProduct(merged);
    } catch (e) {
      console.warn('Firestore product update error:', e);
    }

    // 2. Update local storage cache
    const current = getLocalItem<Product[]>('jit_custom_products', []);
    setLocalItem('jit_custom_products', [merged, ...current.filter(p => p.id !== id)]);

    const remote = await safeFetchJson<Product>(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    // 1. Delete from Firebase Firestore Cloud Database
    try {
      await fsDeleteProduct(id);
    } catch (e) {
      console.warn('Firestore product delete error:', e);
    }

    // 2. Delete from local cache
    const current = getLocalItem<Product[]>('jit_custom_products', []);
    setLocalItem('jit_custom_products', current.filter(p => p.id !== id));
    recordDeleted('products', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Categories
  // ==========================================
  async getCategories(includeHidden = false): Promise<Category[]> {
    // 1. Try Firebase Firestore Cloud Database
    let list: Category[] = [];
    let fromCloud = false;
    try {
      const fsCats = await fsGetCategories();
      if (fsCats && fsCats.length > 0) {
        list = fsCats;
        fromCloud = true;
        setLocalItem('jit_custom_categories', fsCats);
      }
    } catch (e) {
      console.warn('Firestore categories fetch fallback:', e);
    }

    if (!fromCloud) {
      const local = getLocalItem<Category[]>('jit_custom_categories', []);
      list = [...((staticDatabase.categories || []) as Category[])];

      if (local.length > 0) {
        const map = new Map<string, Category>();
        list.forEach(c => map.set(c.id, c));
        local.forEach(c => map.set(c.id, c));
        list = Array.from(map.values());
      }
    }

    list = filterDeleted('categories', list);

    const remote = await safeFetchJson<Category[]>(`${API_BASE}/categories?includeHidden=${includeHidden}`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('categories', remote.data);
    }

    if (!includeHidden) {
      list = list.filter(c => !c.hidden);
    }
    return list;
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const newCat: Category = {
      id: category.id || `cat-${Date.now()}`,
      name: category.name || 'New Craft Category',
      slug: category.slug || (category.name ? category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `cat-${Date.now()}`),
      description: category.description || '',
      image: category.image || 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80',
      hidden: category.hidden || false,
      ...category
    } as Category;

    // 1. Save to Firebase Firestore Cloud Database
    try {
      await fsSaveCategory(newCat);
    } catch (e) {
      console.warn('Firestore category save error:', e);
    }

    const current = getLocalItem<Category[]>('jit_custom_categories', []);
    setLocalItem('jit_custom_categories', [newCat, ...current.filter(c => c.id !== newCat.id)]);

    const remote = await safeFetchJson<Category>(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newCat)
    });

    return remote.ok && remote.data ? remote.data : newCat;
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const all = await this.getCategories(true);
    const existing = all.find(c => c.id === id) || { id, name: 'Category' } as Category;
    const merged: Category = { ...existing, ...category };

    // 1. Save to Firebase Firestore Cloud Database
    try {
      await fsSaveCategory(merged);
    } catch (e) {
      console.warn('Firestore category update error:', e);
    }

    const current = getLocalItem<Category[]>('jit_custom_categories', []);
    setLocalItem('jit_custom_categories', [merged, ...current.filter(c => c.id !== id)]);

    const remote = await safeFetchJson<Category>(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(category)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    // 1. Delete from Firebase Firestore Cloud Database
    try {
      await fsDeleteCategory(id);
    } catch (e) {
      console.warn('Firestore category delete error:', e);
    }

    const current = getLocalItem<Category[]>('jit_custom_categories', []);
    setLocalItem('jit_custom_categories', current.filter(c => c.id !== id));
    recordDeleted('categories', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Women Artisans Network
  // ==========================================
  async getArtisans(includeHidden = false): Promise<Artisan[]> {
    let list: Artisan[] = [];
    let fromCloud = false;
    try {
      const fsArtisans = await fsGetArtisans();
      if (fsArtisans && fsArtisans.length > 0) {
        list = fsArtisans;
        fromCloud = true;
        setLocalItem('jit_custom_artisans', fsArtisans);
      }
    } catch (e) {
      console.warn('Firestore artisans fetch fallback:', e);
    }

    if (!fromCloud) {
      const local = getLocalItem<Artisan[]>('jit_custom_artisans', []);
      list = [...((staticDatabase.artisans || []) as Artisan[])];
      if (local.length > 0) {
        const map = new Map<string, Artisan>();
        list.forEach(a => map.set(a.id, a));
        local.forEach(a => map.set(a.id, a));
        list = Array.from(map.values());
      }
    }
    list = filterDeleted('artisans', list);

    const remote = await safeFetchJson<Artisan[]>(`${API_BASE}/artisans?includeHidden=${includeHidden}`);
    if (remote.ok && Array.isArray(remote.data) && remote.data.length > 0) {
      const map = new Map<string, Artisan>();
      remote.data.forEach(a => map.set(a.id, a));
      list.forEach(a => map.set(a.id, a));
      list = filterDeleted('artisans', Array.from(map.values()));
    }

    if (!includeHidden) {
      list = list.filter(a => !a.hidden);
    }
    return list;
  },

  async createArtisan(artisan: Partial<Artisan>): Promise<Artisan> {
    const newArtisan: Artisan = {
      id: artisan.id || `artisan-${Date.now()}`,
      name: artisan.name || 'Artisan Craftsperson',
      broadLocation: artisan.broadLocation || 'Bankura, West Bengal',
      craft: artisan.craft || 'Terracotta & Dokra',
      productCategory: artisan.productCategory || 'Dokra Metal Craft',
      story: artisan.story || '',
      skills: artisan.skills || ['Metal Casting', 'Clay Modelling'],
      experienceYears: Number(artisan.experienceYears) || 10,
      featured: artisan.featured || false,
      orderIndex: artisan.orderIndex || 0,
      photo: artisan.photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      hidden: artisan.hidden || false,
      ...artisan
    };

    const current = getLocalItem<Artisan[]>('jit_custom_artisans', []);
    setLocalItem('jit_custom_artisans', [newArtisan, ...current.filter(a => a.id !== newArtisan.id)]);

    try {
      await fsSaveArtisan(newArtisan);
    } catch (e) {
      console.warn('Failed to save artisan to Firestore:', e);
    }

    safeFetchJson<Artisan>(`${API_BASE}/artisans`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newArtisan)
    }).catch(() => {});

    return newArtisan;
  },

  async updateArtisan(id: string, artisan: Partial<Artisan>): Promise<Artisan> {
    const all = await this.getArtisans(true);
    const existing = all.find(a => a.id === id) || { id, name: 'Artisan' } as Artisan;
    const merged: Artisan = { ...existing, ...artisan };

    const current = getLocalItem<Artisan[]>('jit_custom_artisans', []);
    setLocalItem('jit_custom_artisans', [merged, ...current.filter(a => a.id !== id)]);

    try {
      await fsSaveArtisan(merged);
    } catch (e) {
      console.warn('Failed to update artisan in Firestore:', e);
    }

    safeFetchJson<Artisan>(`${API_BASE}/artisans/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(artisan)
    }).catch(() => {});

    return merged;
  },

  async deleteArtisan(id: string): Promise<{ success: boolean }> {
    const current = getLocalItem<Artisan[]>('jit_custom_artisans', []);
    setLocalItem('jit_custom_artisans', current.filter(a => a.id !== id));
    recordDeleted('artisans', id);

    try {
      await fsDeleteArtisan(id);
    } catch (e) {
      console.warn('Failed to delete artisan from Firestore:', e);
    }

    safeFetchJson<{ success: boolean }>(`${API_BASE}/artisans/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).catch(() => {});

    return { success: true };
  },

  // ==========================================
  // Team Members (Our Team)
  // ==========================================
  async getTeam(includeHidden = false): Promise<TeamMember[]> {
    const local = getLocalItem<TeamMember[]>('jit_custom_team', []);
    let list = [...((staticDatabase.teamMembers || []) as TeamMember[])];

    if (local.length > 0) {
      const map = new Map<string, TeamMember>();
      list.forEach(m => map.set(m.id, m));
      local.forEach(m => map.set(m.id, m));
      list = Array.from(map.values());
    }
    list = filterDeleted('team', list);

    const remote = await safeFetchJson<TeamMember[]>(`${API_BASE}/team?includeHidden=${includeHidden}`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('team', remote.data);
    }

    if (!includeHidden) {
      list = list.filter(m => !m.hidden);
    }
    return list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  },

  async createTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    const newMember: TeamMember = {
      id: member.id || `team-${Date.now()}`,
      name: member.name || 'Team Member',
      role: member.role || 'Craft Specialist',
      photo: member.photo || '',
      bio: member.bio || '',
      orderIndex: member.orderIndex || 0,
      hidden: member.hidden || false,
      ...member
    };

    const current = getLocalItem<TeamMember[]>('jit_custom_team', []);
    setLocalItem('jit_custom_team', [newMember, ...current.filter(m => m.id !== newMember.id)]);

    const remote = await safeFetchJson<TeamMember>(`${API_BASE}/team`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newMember)
    });

    return remote.ok && remote.data ? remote.data : newMember;
  },

  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    const all = await this.getTeam(true);
    const existing = all.find(m => m.id === id) || ({ id, name: 'Team Member', role: 'Staff' } as TeamMember);
    const merged: TeamMember = { ...existing, ...member };

    const current = getLocalItem<TeamMember[]>('jit_custom_team', []);
    setLocalItem('jit_custom_team', [merged, ...current.filter(m => m.id !== id)]);

    const remote = await safeFetchJson<TeamMember>(`${API_BASE}/team/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(member)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteTeamMember(id: string): Promise<{ success: boolean }> {
    const current = getLocalItem<TeamMember[]>('jit_custom_team', []);
    setLocalItem('jit_custom_team', current.filter(m => m.id !== id));
    recordDeleted('team', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/team/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Training Programs
  // ==========================================
  async getTrainingPrograms(includeHidden = false): Promise<TrainingProgram[]> {
    const local = getLocalItem<TrainingProgram[]>('jit_custom_training', []);
    let list = [...((staticDatabase.trainingPrograms || []) as TrainingProgram[])];
    if (local.length > 0) {
      const map = new Map<string, TrainingProgram>();
      list.forEach(p => map.set(p.id, p));
      local.forEach(p => map.set(p.id, p));
      list = Array.from(map.values());
    }
    list = filterDeleted('training', list);

    const remote = await safeFetchJson<TrainingProgram[]>(`${API_BASE}/training?includeHidden=${includeHidden}`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('training', remote.data);
    }

    if (!includeHidden) {
      list = list.filter(p => !p.hidden);
    }
    return list;
  },

  async createTrainingProgram(program: Partial<TrainingProgram>): Promise<TrainingProgram> {
    const newProg: TrainingProgram = {
      id: program.id || `train-${Date.now()}`,
      title: program.title || 'Craft Workshop',
      description: program.description || '',
      skill: program.skill || 'Handicrafts',
      eligibility: program.eligibility || 'Open to all women artisans',
      duration: program.duration || '4 Weeks',
      location: program.location || 'Kolkata Center',
      registrationStatus: program.registrationStatus || 'Open',
      applicationInstructions: program.applicationInstructions || 'Submit your details above.',
      images: program.images || ['https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80'],
      hidden: program.hidden || false,
      orderIndex: program.orderIndex || 0,
      ...program
    };

    const current = getLocalItem<TrainingProgram[]>('jit_custom_training', []);
    setLocalItem('jit_custom_training', [newProg, ...current.filter(p => p.id !== newProg.id)]);

    const remote = await safeFetchJson<TrainingProgram>(`${API_BASE}/training`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newProg)
    });

    return remote.ok && remote.data ? remote.data : newProg;
  },

  async updateTrainingProgram(id: string, program: Partial<TrainingProgram>): Promise<TrainingProgram> {
    const all = await this.getTrainingPrograms(true);
    const existing = all.find(p => p.id === id) || { id, title: 'Program' } as TrainingProgram;
    const merged: TrainingProgram = { ...existing, ...program };

    const current = getLocalItem<TrainingProgram[]>('jit_custom_training', []);
    setLocalItem('jit_custom_training', [merged, ...current.filter(p => p.id !== id)]);

    const remote = await safeFetchJson<TrainingProgram>(`${API_BASE}/training/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(program)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteTrainingProgram(id: string): Promise<{ success: boolean }> {
    const current = getLocalItem<TrainingProgram[]>('jit_custom_training', []);
    setLocalItem('jit_custom_training', current.filter(p => p.id !== id));
    recordDeleted('training', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/training/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  async submitTrainingApplication(app: Partial<TrainingApplication>): Promise<{ success: boolean; application: TrainingApplication }> {
    const newApp: TrainingApplication = {
      id: 'train-app-' + Date.now(),
      programId: app.programId || '',
      programTitle: app.programTitle || '',
      applicantName: app.applicantName || 'Applicant',
      phone: app.phone || '',
      location: app.location || '',
      craftInterest: app.craftInterest || '',
      status: 'New',
      createdAt: new Date().toISOString(),
      ...app
    } as TrainingApplication;

    const current = getLocalItem<TrainingApplication[]>('jit_custom_training_apps', []);
    setLocalItem('jit_custom_training_apps', [newApp, ...current]);

    const remote = await safeFetchJson<{ success: boolean; application: TrainingApplication }>(`${API_BASE}/training-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app)
    });

    return remote.ok && remote.data ? remote.data : { success: true, application: newApp };
  },

  async getTrainingApplications(): Promise<TrainingApplication[]> {
    const local = getLocalItem<TrainingApplication[]>('jit_custom_training_apps', []);
    const fallback = (staticDatabase.trainingApplications || []) as TrainingApplication[];
    let list = [...fallback];
    if (local.length > 0) {
      const map = new Map<string, TrainingApplication>();
      list.forEach(a => map.set(a.id, a));
      local.forEach(a => map.set(a.id, a));
      list = Array.from(map.values());
    }
    list = filterDeleted('training_apps', list);

    const remote = await safeFetchJson<TrainingApplication[]>(`${API_BASE}/training-applications`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('training_apps', remote.data);
    }
    return list;
  },

  async updateTrainingApplication(id: string, app: Partial<TrainingApplication>): Promise<TrainingApplication> {
    const all = await this.getTrainingApplications();
    const existing = all.find(a => a.id === id) || { id } as TrainingApplication;
    const merged: TrainingApplication = { ...existing, ...app };

    const current = getLocalItem<TrainingApplication[]>('jit_custom_training_apps', []);
    setLocalItem('jit_custom_training_apps', [merged, ...current.filter(a => a.id !== id)]);

    const remote = await safeFetchJson<TrainingApplication>(`${API_BASE}/training-applications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(app)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteTrainingApplication(id: string): Promise<{ success: boolean }> {
    const current = getLocalItem<TrainingApplication[]>('jit_custom_training_apps', []);
    setLocalItem('jit_custom_training_apps', current.filter(a => a.id !== id));
    recordDeleted('training_apps', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/training-applications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Govt. Tenders
  // ==========================================
  async getTenders(includeHidden = false): Promise<GovernmentTender[]> {
    const local = getLocalItem<GovernmentTender[]>('jit_custom_tenders', []);
    let list = [...((staticDatabase.tenders || staticDatabase.governmentTenders || []) as GovernmentTender[])];
    if (local.length > 0) {
      const map = new Map<string, GovernmentTender>();
      list.forEach(t => map.set(t.id, t));
      local.forEach(t => map.set(t.id, t));
      list = Array.from(map.values());
    }
    list = filterDeleted('tenders', list);

    const remote = await safeFetchJson<GovernmentTender[]>(`${API_BASE}/tenders?includeHidden=${includeHidden}`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('tenders', remote.data);
    }

    if (!includeHidden) {
      list = list.filter(t => !t.hidden);
    }
    return list;
  },

  async createTender(tender: Partial<GovernmentTender>): Promise<GovernmentTender> {
    const newTender: GovernmentTender = {
      id: tender.id || `tender-${Date.now()}`,
      title: tender.title || 'Government Handicrafts Procurement',
      organization: tender.organization || tender.department || 'WBKVIB / MSME Department',
      issuingOrganization: tender.issuingOrganization || tender.department || 'WBKVIB / MSME Department',
      department: tender.department || 'WBKVIB / MSME Department',
      tenderReferenceNumber: tender.tenderReferenceNumber || `NIT-${Date.now().toString().slice(-5)}`,
      approximateValue: tender.approximateValue || '₹5,00,000',
      scopeOfWork: tender.scopeOfWork || 'Bulk supply of artisan handicrafts',
      year: tender.year || tender.completionYear || '2026',
      completionYear: tender.completionYear || tender.year || '2026',
      category: tender.category || 'Tender Supply',
      description: tender.description || tender.scopeOfWork || 'Bulk supply of artisan handicrafts',
      status: tender.status || 'Verified Project',
      hidden: tender.hidden || false,
      orderIndex: tender.orderIndex || 0,
      ...tender
    };

    const current = getLocalItem<GovernmentTender[]>('jit_custom_tenders', []);
    setLocalItem('jit_custom_tenders', [newTender, ...current.filter(t => t.id !== newTender.id)]);

    const remote = await safeFetchJson<GovernmentTender>(`${API_BASE}/tenders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newTender)
    });

    return remote.ok && remote.data ? remote.data : newTender;
  },

  async updateTender(id: string, tender: Partial<GovernmentTender>): Promise<GovernmentTender> {
    const all = await this.getTenders(true);
    const existing = all.find(t => t.id === id) || { id, title: 'Tender' } as GovernmentTender;
    const merged: GovernmentTender = { ...existing, ...tender };

    const current = getLocalItem<GovernmentTender[]>('jit_custom_tenders', []);
    setLocalItem('jit_custom_tenders', [merged, ...current.filter(t => t.id !== id)]);

    const remote = await safeFetchJson<GovernmentTender>(`${API_BASE}/tenders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tender)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteTender(id: string): Promise<{ success: boolean }> {
    const current = getLocalItem<GovernmentTender[]>('jit_custom_tenders', []);
    setLocalItem('jit_custom_tenders', current.filter(t => t.id !== id));
    recordDeleted('tenders', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/tenders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Campaigns (Durga Puja & Festivals)
  // ==========================================
  async getCampaigns(): Promise<PujaCampaign[]> {
    const local = getLocalItem<PujaCampaign[]>('jit_custom_campaigns', []);
    const fallback = (staticDatabase.campaigns || staticDatabase.pujaCampaigns || []) as PujaCampaign[];
    let list = [...fallback];
    if (local.length > 0) {
      const map = new Map<string, PujaCampaign>();
      list.forEach(c => map.set(c.id, c));
      local.forEach(c => map.set(c.id, c));
      list = Array.from(map.values());
    }
    list = filterDeleted('campaigns', list);

    const remote = await safeFetchJson<PujaCampaign[]>(`${API_BASE}/campaigns`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('campaigns', remote.data);
    }
    return list;
  },

  async updateCampaign(id: string, campaign: Partial<PujaCampaign>): Promise<PujaCampaign> {
    const currentList = await this.getCampaigns();
    const existing = currentList.find(c => c.id === id) || { id, title: 'Campaign' } as PujaCampaign;
    const merged = { ...existing, ...campaign };

    const local = getLocalItem<PujaCampaign[]>('jit_custom_campaigns', []);
    setLocalItem('jit_custom_campaigns', [merged, ...local.filter(c => c.id !== id)]);

    const remote = await safeFetchJson<PujaCampaign>(`${API_BASE}/campaigns/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(campaign)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteCampaign(id: string): Promise<{ success: boolean }> {
    const local = getLocalItem<PujaCampaign[]>('jit_custom_campaigns', []);
    setLocalItem('jit_custom_campaigns', local.filter(c => c.id !== id));
    recordDeleted('campaigns', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/campaigns/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Leads & Wholesale Enquiries
  // ==========================================
  async submitLead(lead: Partial<BulkEnquiryLead>): Promise<{ success: boolean; lead: BulkEnquiryLead }> {
    const newLead: BulkEnquiryLead = {
      id: 'lead-' + Date.now(),
      name: lead.name || 'Anonymous',
      companyName: lead.companyName || '',
      country: lead.country || 'India',
      whatsapp: lead.whatsapp || '',
      email: lead.email || '',
      productOrCategory: lead.productOrCategory || 'Handicrafts',
      quantity: lead.quantity || 1,
      message: lead.message || '',
      source: 'Website Form',
      priority: 'MEDIUM',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      ...lead
    } as BulkEnquiryLead;

    // 1. Save to Firebase Firestore Cloud Database
    try {
      await fsSaveLead(newLead);
    } catch (e) {
      console.warn('Firestore lead save error:', e);
    }

    // 2. Save locally
    const currentLeads = getLocalItem<BulkEnquiryLead[]>('jit_custom_leads', []);
    setLocalItem('jit_custom_leads', [newLead, ...currentLeads]);

    const remote = await safeFetchJson<{ success: boolean; lead: BulkEnquiryLead }>(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });

    return remote.ok && remote.data ? remote.data : { success: true, lead: newLead };
  },

  async getLeads(): Promise<BulkEnquiryLead[]> {
    // 1. Try Firebase Firestore
    let combined: BulkEnquiryLead[] = [];
    let fromCloud = false;
    try {
      const fsLeads = await fsGetLeads();
      if (fsLeads && fsLeads.length > 0) {
        combined = fsLeads;
        fromCloud = true;
        setLocalItem('jit_custom_leads', fsLeads);
      }
    } catch (e) {
      console.warn('Firestore leads fetch fallback:', e);
    }

    if (!fromCloud) {
      const local = getLocalItem<BulkEnquiryLead[]>('jit_custom_leads', []);
      const base = (staticDatabase.leads || []) as BulkEnquiryLead[];
      const map = new Map<string, BulkEnquiryLead>();
      base.forEach(l => map.set(l.id, l));
      local.forEach(l => map.set(l.id, l));
      combined = Array.from(map.values());
    }

    combined = filterDeleted('leads', combined);

    const remote = await safeFetchJson<BulkEnquiryLead[]>(`${API_BASE}/leads`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('leads', remote.data);
    }
    return combined;
  },

  async updateLead(id: string, lead: Partial<BulkEnquiryLead>): Promise<BulkEnquiryLead> {
    const current = getLocalItem<BulkEnquiryLead[]>('jit_custom_leads', []);
    const all = await this.getLeads();
    const existing = all.find(l => l.id === id) || { id } as BulkEnquiryLead;
    const merged = { ...existing, ...lead };

    // 1. Update in Firebase Firestore
    try {
      await fsSaveLead(merged);
    } catch (e) {
      console.warn('Firestore lead update error:', e);
    }

    setLocalItem('jit_custom_leads', [merged, ...current.filter(l => l.id !== id)]);

    const remote = await safeFetchJson<BulkEnquiryLead>(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(lead)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async addLeadNote(id: string, text: string, author?: string): Promise<BulkEnquiryLead> {
    const remote = await safeFetchJson<BulkEnquiryLead>(`${API_BASE}/leads/${id}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, author })
    });
    if (remote.ok && remote.data) return remote.data;

    const all = await this.getLeads();
    const existing = all.find(l => l.id === id) || { id } as BulkEnquiryLead;
    const note = { id: 'note-' + Date.now(), text, author: author || 'Admin', createdAt: new Date().toISOString() };
    const updated = { ...existing, notes: [...(existing.notes || []), note] };
    return this.updateLead(id, updated);
  },

  async deleteLead(id: string): Promise<{ success: boolean }> {
    // 1. Delete from Firebase Firestore
    try {
      await fsDeleteLead(id);
    } catch (e) {
      console.warn('Firestore lead delete error:', e);
    }

    const current = getLocalItem<BulkEnquiryLead[]>('jit_custom_leads', []);
    setLocalItem('jit_custom_leads', current.filter(l => l.id !== id));
    recordDeleted('leads', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Homepage Content
  // ==========================================
  async getHomepageContent(): Promise<HomepageContent> {
    const local = getLocalItem<HomepageContent | null>('jit_custom_homepage', null);
    const fallback = local || (staticDatabase.homepageContent as HomepageContent);

    const remote = await safeFetchJson<HomepageContent>(`${API_BASE}/homepage`);
    return remote.ok && remote.data ? remote.data : fallback;
  },

  async updateHomepageContent(content: Partial<HomepageContent>): Promise<{ success: boolean; homepageContent: HomepageContent }> {
    const existing = await this.getHomepageContent();
    const merged = { ...existing, ...content };
    setLocalItem('jit_custom_homepage', merged);

    const remote = await safeFetchJson<{ success: boolean; homepageContent: HomepageContent }>(`${API_BASE}/homepage`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(content)
    });

    return remote.ok && remote.data ? remote.data : { success: true, homepageContent: merged };
  },

  // ==========================================
  // Navigation
  // ==========================================
  async getNavigation(includeHidden = false): Promise<NavigationItem[]> {
    const local = getLocalItem<NavigationItem[]>('jit_custom_navigation', []);
    let list = local.length > 0 ? local : ((staticDatabase.navigation || []) as NavigationItem[]);

    const remote = await safeFetchJson<NavigationItem[]>(`${API_BASE}/navigation?includeHidden=${includeHidden}`);
    if (remote.ok && Array.isArray(remote.data)) {
      list = remote.data;
    }

    if (!includeHidden) {
      list = list.filter(n => !n.hidden);
    }
    return list;
  },

  async updateNavigation(items: NavigationItem[]): Promise<{ success: boolean; navigation: NavigationItem[] }> {
    setLocalItem('jit_custom_navigation', items);

    const remote = await safeFetchJson<{ success: boolean; navigation: NavigationItem[] }>(`${API_BASE}/navigation`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(items)
    });

    return remote.ok && remote.data ? remote.data : { success: true, navigation: items };
  },

  // ==========================================
  // Legal Pages
  // ==========================================
  async getLegalPages(): Promise<LegalPage[]> {
    const local = getLocalItem<LegalPage[]>('jit_custom_legal', []);
    const fallback = (staticDatabase.legalPages || []) as LegalPage[];
    let list = [...fallback];
    if (local.length > 0) {
      const map = new Map<string, LegalPage>();
      list.forEach(p => map.set(p.slug, p));
      local.forEach(p => map.set(p.slug, p));
      list = Array.from(map.values());
    }

    const remote = await safeFetchJson<LegalPage[]>(`${API_BASE}/legal`);
    return remote.ok && Array.isArray(remote.data) ? remote.data : list;
  },

  async getLegalPage(slug: string): Promise<LegalPage> {
    const all = await this.getLegalPages();
    return all.find(p => p.slug === slug) || {
      id: 'legal-' + slug,
      slug,
      title: slug.replace(/-/g, ' ').toUpperCase(),
      lastUpdated: new Date().toISOString(),
      content: ''
    };
  },

  async updateLegalPage(slug: string, page: Partial<LegalPage>): Promise<LegalPage> {
    const existing = await this.getLegalPage(slug);
    const merged = { ...existing, ...page };
    const local = getLocalItem<LegalPage[]>('jit_custom_legal', []);
    setLocalItem('jit_custom_legal', [merged, ...local.filter(p => p.slug !== slug)]);

    const remote = await safeFetchJson<LegalPage>(`${API_BASE}/legal/${slug}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(page)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  // ==========================================
  // FAQs
  // ==========================================
  async getFaqs(includeHidden = false): Promise<FAQ[]> {
    const local = getLocalItem<FAQ[]>('jit_custom_faqs', []);
    let list = [...((staticDatabase.faqs || []) as FAQ[])];
    if (local.length > 0) {
      const map = new Map<string, FAQ>();
      list.forEach(f => map.set(f.id, f));
      local.forEach(f => map.set(f.id, f));
      list = Array.from(map.values());
    }
    list = filterDeleted('faqs', list);

    const remote = await safeFetchJson<FAQ[]>(`${API_BASE}/faqs?includeHidden=${includeHidden}`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('faqs', remote.data);
    }

    if (!includeHidden) {
      list = list.filter(f => !f.hidden);
    }
    return list;
  },

  async createFaq(faq: Partial<FAQ>): Promise<FAQ> {
    const newFaq: FAQ = {
      id: 'faq-' + Date.now(),
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'General',
      hidden: faq.hidden || false,
      ...faq
    } as FAQ;

    const local = getLocalItem<FAQ[]>('jit_custom_faqs', []);
    setLocalItem('jit_custom_faqs', [newFaq, ...local.filter(f => f.id !== newFaq.id)]);

    const remote = await safeFetchJson<FAQ>(`${API_BASE}/faqs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newFaq)
    });

    return remote.ok && remote.data ? remote.data : newFaq;
  },

  async updateFaq(id: string, faq: Partial<FAQ>): Promise<FAQ> {
    const all = await this.getFaqs(true);
    const existing = all.find(f => f.id === id) || { id } as FAQ;
    const merged = { ...existing, ...faq };

    const local = getLocalItem<FAQ[]>('jit_custom_faqs', []);
    setLocalItem('jit_custom_faqs', [merged, ...local.filter(f => f.id !== id)]);

    const remote = await safeFetchJson<FAQ>(`${API_BASE}/faqs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(faq)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    const local = getLocalItem<FAQ[]>('jit_custom_faqs', []);
    setLocalItem('jit_custom_faqs', local.filter(f => f.id !== id));
    recordDeleted('faqs', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/faqs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Testimonials & Client Reviews
  // ==========================================
  async getTestimonials(includeHidden = false): Promise<Testimonial[]> {
    const local = getLocalItem<Testimonial[]>('jit_custom_testimonials', []);
    let list = [...((staticDatabase.testimonials || []) as Testimonial[])];
    if (local.length > 0) {
      const map = new Map<string, Testimonial>();
      list.forEach(t => map.set(t.id, t));
      local.forEach(t => map.set(t.id, t));
      list = Array.from(map.values());
    }
    list = filterDeleted('testimonials', list);

    const remote = await safeFetchJson<Testimonial[]>(`${API_BASE}/testimonials?includeHidden=${includeHidden}`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('testimonials', remote.data);
    }

    if (!includeHidden) {
      list = list.filter(t => !t.hidden);
    }
    return list;
  },

  async submitClientReview(review: {
    clientName: string;
    content: string;
    rating: number;
    company?: string;
    location?: string;
  }): Promise<Testimonial> {
    const newRev: Testimonial = {
      id: 'rev-' + Date.now(),
      clientName: review.clientName,
      company: review.company || '',
      location: review.location || '',
      rating: review.rating,
      content: review.content,
      verifiedBuyer: true,
      orderIndex: 0,
      hidden: false,
      createdAt: new Date().toISOString()
    };

    const local = getLocalItem<Testimonial[]>('jit_custom_testimonials', []);
    setLocalItem('jit_custom_testimonials', [newRev, ...local]);

    const remote = await safeFetchJson<Testimonial>(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });

    return remote.ok && remote.data ? remote.data : newRev;
  },

  async createTestimonial(t: Partial<Testimonial>): Promise<Testimonial> {
    const newT: Testimonial = {
      id: 'test-' + Date.now(),
      clientName: t.clientName || 'Client',
      company: t.company || '',
      content: t.content || '',
      rating: t.rating || 5,
      hidden: t.hidden || false,
      createdAt: new Date().toISOString(),
      ...t
    } as Testimonial;

    const local = getLocalItem<Testimonial[]>('jit_custom_testimonials', []);
    setLocalItem('jit_custom_testimonials', [newT, ...local.filter(item => item.id !== newT.id)]);

    const remote = await safeFetchJson<Testimonial>(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newT)
    });

    return remote.ok && remote.data ? remote.data : newT;
  },

  async updateTestimonial(id: string, t: Partial<Testimonial>): Promise<Testimonial> {
    const all = await this.getTestimonials(true);
    const existing = all.find(item => item.id === id) || { id } as Testimonial;
    const merged = { ...existing, ...t };

    const local = getLocalItem<Testimonial[]>('jit_custom_testimonials', []);
    setLocalItem('jit_custom_testimonials', [merged, ...local.filter(item => item.id !== id)]);

    const remote = await safeFetchJson<Testimonial>(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(t)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    const local = getLocalItem<Testimonial[]>('jit_custom_testimonials', []);
    setLocalItem('jit_custom_testimonials', local.filter(item => item.id !== id));
    recordDeleted('testimonials', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================================
  // File & Media Upload (100% Reliable on Vercel, Netlify & Mobile)
  // ==========================================================
  async uploadFile(file: File): Promise<{ success: boolean; url: string; file: MediaFile }> {
    // 2. Client-side fallback with smart compression (Converts phone photos into crisp WebP/JPEG Data URLs)
    // Server upload is skipped because Cloud Run disk is ephemeral and uploaded files are lost on restart.
    const dataUrl = await compressImageFile(file);
    const mediaEntry: MediaFile = {
      id: `media-${Date.now()}-${Math.round(Math.random() * 10000)}`,
      filename: file.name,
      originalName: file.name,
      url: dataUrl,
      mimeType: file.type || 'image/jpeg',
      size: file.size,
      uploadedAt: new Date().toISOString()
    };

    this.saveLocalMedia(mediaEntry);

    return {
      success: true,
      url: dataUrl,
      file: mediaEntry
    };
  },

  async uploadMultipleFiles(files: FileList | File[]): Promise<{ success: boolean; files: MediaFile[]; urls: string[] }> {
    const uploadedMedia: MediaFile[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const res = await this.uploadFile(files[i]);
        if (res.file) {
          uploadedMedia.push(res.file);
        }
      } catch (err) {
        console.warn('Batch file upload error:', err);
      }
    }
    return {
      success: true,
      files: uploadedMedia,
      urls: uploadedMedia.map(m => m.url)
    };
  },

  saveLocalMedia(file: MediaFile) {
    if (!file) return;
    try {
      const existing = this.getLocalMedia();
      const filtered = [file, ...existing.filter(m => m.id !== file.id && m.url !== file.url)];
      // Keep most recent 50 to prevent exceeding browser quota
      setLocalItem('jit_custom_media', filtered.slice(0, 50));
    } catch (e) {
      console.warn('Failed to save media locally:', e);
    }
  },

  getLocalMedia(): MediaFile[] {
    return getLocalItem<MediaFile[]>('jit_custom_media', []);
  },

  async getMediaFiles(): Promise<MediaFile[]> {
    const local = this.getLocalMedia();
    let fallback = [...local, ...((staticDatabase.media || []) as MediaFile[])];
    fallback = filterDeleted('media', fallback);

    const remote = await safeFetchJson<MediaFile[]>(`${API_BASE}/media`);
    if (remote.ok && Array.isArray(remote.data)) {
      const map = new Map<string, MediaFile>();
      local.forEach(m => map.set(m.id, m));
      remote.data.forEach(m => map.set(m.id, m));
      return filterDeleted('media', Array.from(map.values()));
    }

    return fallback;
  },

  async deleteMediaFile(id: string): Promise<{ success: boolean }> {
    const local = this.getLocalMedia();
    setLocalItem('jit_custom_media', local.filter(m => m.id !== id));
    recordDeleted('media', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Craft Gallery (হাতের কাজের গ্যালারি)
  // ==========================================
  async getGallery(category?: string): Promise<GalleryItem[]> {
    // 1. Try Firebase Firestore Cloud Database
    let list: GalleryItem[] = [];
    let fromCloud = false;
    try {
      const fsItems = await fsGetGallery();
      if (fsItems && fsItems.length > 0) {
        list = fsItems;
        fromCloud = true;
        setLocalItem('jit_custom_gallery', fsItems);
      }
    } catch (e) {
      console.warn('Firestore gallery fetch fallback:', e);
    }

    // 2. Fallback to local & static cache
    if (!fromCloud) {
      const local = getLocalItem<GalleryItem[]>('jit_custom_gallery', []);
      list = [...((staticDatabase.gallery || staticDatabase.galleryItems || []) as GalleryItem[])];
      if (local.length > 0) {
        const map = new Map<string, GalleryItem>();
        list.forEach(g => map.set(g.id, g));
        local.forEach(g => map.set(g.id, g));
        list = Array.from(map.values());
      }
    }
    list = filterDeleted('gallery', list);

    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const remote = await safeFetchJson<GalleryItem[]>(`${API_BASE}/gallery${query}`);
    if (remote.ok && Array.isArray(remote.data) && remote.data.length > 0) {
      const map = new Map<string, GalleryItem>();
      remote.data.forEach(g => map.set(g.id, g));
      list.forEach(g => map.set(g.id, g));
      list = filterDeleted('gallery', Array.from(map.values()));
    }

    if (category && category !== 'All') {
      list = list.filter(g => g.category.toLowerCase() === category.toLowerCase());
    }
    return list;
  },

  async createGalleryItem(item: Partial<GalleryItem>): Promise<GalleryItem> {
    const newG: GalleryItem = {
      id: 'gallery-' + Date.now(),
      title: item.title || 'Handcrafted Craft Piece',
      category: item.category || 'Dokra Metal Craft',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=600&q=80',
      description: item.description || '',
      featured: item.featured || false,
      createdAt: new Date().toISOString(),
      ...item
    } as GalleryItem;

    const local = getLocalItem<GalleryItem[]>('jit_custom_gallery', []);
    setLocalItem('jit_custom_gallery', [newG, ...local.filter(g => g.id !== newG.id)]);

    // Save to Firebase Firestore Cloud
    try {
      await fsSaveGalleryItem(newG);
    } catch (e) {
      console.warn('Failed to save gallery item to Firestore:', e);
    }

    // Also attempt backend server update
    safeFetchJson<GalleryItem>(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newG)
    }).catch(() => {});

    return newG;
  },

  async updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<GalleryItem> {
    const all = await this.getGallery();
    const existing = all.find(g => g.id === id) || { id } as GalleryItem;
    const merged: GalleryItem = { ...existing, ...item };

    const local = getLocalItem<GalleryItem[]>('jit_custom_gallery', []);
    setLocalItem('jit_custom_gallery', [merged, ...local.filter(g => g.id !== id)]);

    // Save to Firebase Firestore Cloud
    try {
      await fsSaveGalleryItem(merged);
    } catch (e) {
      console.warn('Failed to update gallery item in Firestore:', e);
    }

    // Also attempt backend server update
    safeFetchJson<GalleryItem>(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    }).catch(() => {});

    return merged;
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    const local = getLocalItem<GalleryItem[]>('jit_custom_gallery', []);
    setLocalItem('jit_custom_gallery', local.filter(g => g.id !== id));
    recordDeleted('gallery', id);

    // Delete from Firebase Firestore Cloud
    try {
      await fsDeleteGalleryItem(id);
    } catch (e) {
      console.warn('Failed to delete gallery item from Firestore:', e);
    }

    // Also attempt backend server delete
    safeFetchJson<{ success: boolean }>(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }).catch(() => {});

    return { success: true };
  },

  // ==========================================
  // Videos (Production & Artisan Craft Videos)
  // ==========================================
  async getVideos(params?: { includeHidden?: boolean; featured?: boolean }): Promise<VideoItem[]> {
    // 1. Try Firebase Firestore
    let list: VideoItem[] = [];
    let fromCloud = false;
    try {
      const fsVideos = await fsGetVideos();
      if (fsVideos && fsVideos.length > 0) {
        list = fsVideos;
        fromCloud = true;
        setLocalItem('jit_custom_videos', fsVideos);
      }
    } catch (e) {
      console.warn('Firestore videos fetch fallback:', e);
    }

    if (!fromCloud) {
      const local = getLocalItem<VideoItem[]>('jit_custom_videos', []);
      list = [...((staticDatabase.videos || []) as VideoItem[])];
      if (local.length > 0) {
        const map = new Map<string, VideoItem>();
        list.forEach(v => map.set(v.id, v));
        local.forEach(v => map.set(v.id, v));
        list = Array.from(map.values());
      }
    }

    list = filterDeleted('videos', list);

    const remote = await safeFetchJson<VideoItem[]>(`${API_BASE}/videos${params?.includeHidden ? '?includeHidden=true' : ''}`);
    if (remote.ok && Array.isArray(remote.data)) {
      list = filterDeleted('videos', remote.data);
    }

    if (!params?.includeHidden) {
      list = list.filter(v => !v.hidden);
    }
    if (params?.featured) {
      list = list.filter(v => v.featured);
    }
    return list;
  },

  async createVideo(video: Partial<VideoItem>): Promise<VideoItem> {
    const newV: VideoItem = {
      id: 'vid-' + Date.now(),
      title: video.title || 'Artisan Workshop Video',
      videoUrl: video.videoUrl || '',
      thumbnailUrl: video.thumbnailUrl || '',
      featured: video.featured || false,
      hidden: video.hidden || false,
      createdAt: new Date().toISOString(),
      ...video
    } as VideoItem;

    // 1. Save to Firebase Firestore
    try {
      await fsSaveVideo(newV);
    } catch (e) {
      console.warn('Firestore video save error:', e);
    }

    const local = getLocalItem<VideoItem[]>('jit_custom_videos', []);
    setLocalItem('jit_custom_videos', [newV, ...local.filter(v => v.id !== newV.id)]);

    const remote = await safeFetchJson<VideoItem>(`${API_BASE}/videos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newV)
    });

    return remote.ok && remote.data ? remote.data : newV;
  },

  async updateVideo(id: string, video: Partial<VideoItem>): Promise<VideoItem> {
    const all = await this.getVideos({ includeHidden: true });
    const existing = all.find(v => v.id === id) || { id } as VideoItem;
    const merged = { ...existing, ...video };

    // 1. Update in Firebase Firestore
    try {
      await fsSaveVideo(merged);
    } catch (e) {
      console.warn('Firestore video update error:', e);
    }

    const local = getLocalItem<VideoItem[]>('jit_custom_videos', []);
    setLocalItem('jit_custom_videos', [merged, ...local.filter(v => v.id !== id)]);

    const remote = await safeFetchJson<VideoItem>(`${API_BASE}/videos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(video)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteVideo(id: string): Promise<{ success: boolean }> {
    // 1. Delete from Firebase Firestore
    try {
      await fsDeleteVideo(id);
    } catch (e) {
      console.warn('Firestore video delete error:', e);
    }

    const local = getLocalItem<VideoItem[]>('jit_custom_videos', []);
    setLocalItem('jit_custom_videos', local.filter(v => v.id !== id));
    recordDeleted('videos', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/videos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Banners & Promotional Countdowns
  // ==========================================
  async getBanners(): Promise<BannerItem[]> {
    // 1. Try Firebase Firestore
    let list: BannerItem[] = [];
    let fromCloud = false;
    try {
      const fsBanners = await fsGetBanners();
      if (fsBanners && fsBanners.length > 0) {
        list = fsBanners;
        fromCloud = true;
        setLocalItem('jit_custom_banners', fsBanners);
      }
    } catch (e) {
      console.warn('Firestore banners fetch fallback:', e);
    }

    if (!fromCloud) {
      const local = getLocalItem<BannerItem[]>('jit_custom_banners', []);
      list = [...((staticDatabase.banners || []) as BannerItem[])];
      if (local.length > 0) {
        const map = new Map<string, BannerItem>();
        list.forEach(b => map.set(b.id, b));
        local.forEach(b => map.set(b.id, b));
        list = Array.from(map.values());
      }
    }

    list = filterDeleted('banners', list);

    const remote = await safeFetchJson<BannerItem[]>(`${API_BASE}/banners`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('banners', remote.data);
    }
    return list;
  },

  async createBanner(banner: Partial<BannerItem>): Promise<BannerItem> {
    const newB: BannerItem = {
      id: 'banner-' + Date.now(),
      title: banner.title || 'Festival Wholesale Offer',
      subtitle: banner.subtitle || '',
      image: banner.image || 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=1200&q=80',
      active: banner.active !== false,
      countdownEnabled: banner.countdownEnabled !== false,
      orderIndex: banner.orderIndex || 0,
      ...banner
    };

    // 1. Save to Firebase Firestore
    try {
      await fsSaveBanner(newB);
    } catch (e) {
      console.warn('Firestore banner save error:', e);
    }

    const local = getLocalItem<BannerItem[]>('jit_custom_banners', []);
    setLocalItem('jit_custom_banners', [newB, ...local.filter(b => b.id !== newB.id)]);

    const remote = await safeFetchJson<BannerItem>(`${API_BASE}/banners`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newB)
    });

    return remote.ok && remote.data ? remote.data : newB;
  },

  async updateBanner(id: string, banner: Partial<BannerItem>): Promise<BannerItem> {
    const all = await this.getBanners();
    const existing = all.find(b => b.id === id) || { id } as BannerItem;
    const merged = { ...existing, ...banner };

    // 1. Update in Firebase Firestore
    try {
      await fsSaveBanner(merged);
    } catch (e) {
      console.warn('Firestore banner update error:', e);
    }

    const local = getLocalItem<BannerItem[]>('jit_custom_banners', []);
    setLocalItem('jit_custom_banners', [merged, ...local.filter(b => b.id !== id)]);

    const remote = await safeFetchJson<BannerItem>(`${API_BASE}/banners/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(banner)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteBanner(id: string): Promise<{ success: boolean }> {
    // 1. Delete from Firebase Firestore
    try {
      await fsDeleteBanner(id);
    } catch (e) {
      console.warn('Firestore banner delete error:', e);
    }

    const local = getLocalItem<BannerItem[]>('jit_custom_banners', []);
    setLocalItem('jit_custom_banners', local.filter(b => b.id !== id));
    recordDeleted('banners', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/banners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Custom Sections
  // ==========================================
  async getCustomSections(): Promise<CustomSection[]> {
    // 1. Try Firebase Firestore
    let list: CustomSection[] = [];
    let fromCloud = false;
    try {
      const fsSections = await fsGetCustomSections();
      if (fsSections && fsSections.length > 0) {
        list = fsSections;
        fromCloud = true;
        setLocalItem('jit_custom_sections', fsSections);
      }
    } catch (e) {
      console.warn('Firestore custom sections fetch fallback:', e);
    }

    if (!fromCloud) {
      const local = getLocalItem<CustomSection[]>('jit_custom_sections', []);
      list = [...((staticDatabase.customSections || []) as CustomSection[])];
      if (local.length > 0) {
        const map = new Map<string, CustomSection>();
        list.forEach(s => map.set(s.id, s));
        local.forEach(s => map.set(s.id, s));
        list = Array.from(map.values());
      }
    }

    list = filterDeleted('custom_sections', list);

    const remote = await safeFetchJson<CustomSection[]>(`${API_BASE}/custom-sections`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('custom_sections', remote.data);
    }
    return list;
  },

  async createCustomSection(section: Partial<CustomSection>): Promise<CustomSection> {
    const newS: CustomSection = {
      id: 'section-' + Date.now(),
      title: section.title || 'Custom Section',
      subtitle: section.subtitle || '',
      content: section.content || '',
      active: section.active !== false,
      orderIndex: 0,
      ...section
    } as CustomSection;

    // 1. Save to Firebase Firestore
    try {
      await fsSaveCustomSection(newS);
    } catch (e) {
      console.warn('Firestore custom section save error:', e);
    }

    const local = getLocalItem<CustomSection[]>('jit_custom_sections', []);
    setLocalItem('jit_custom_sections', [newS, ...local.filter(s => s.id !== newS.id)]);

    const remote = await safeFetchJson<CustomSection>(`${API_BASE}/custom-sections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newS)
    });

    return remote.ok && remote.data ? remote.data : newS;
  },

  async updateCustomSection(id: string, section: Partial<CustomSection>): Promise<CustomSection> {
    const all = await this.getCustomSections();
    const existing = all.find(s => s.id === id) || { id } as CustomSection;
    const merged = { ...existing, ...section };

    // 1. Update in Firebase Firestore
    try {
      await fsSaveCustomSection(merged);
    } catch (e) {
      console.warn('Firestore custom section update error:', e);
    }

    const local = getLocalItem<CustomSection[]>('jit_custom_sections', []);
    setLocalItem('jit_custom_sections', [merged, ...local.filter(s => s.id !== id)]);

    const remote = await safeFetchJson<CustomSection>(`${API_BASE}/custom-sections/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(section)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteCustomSection(id: string): Promise<{ success: boolean }> {
    // 1. Delete from Firebase Firestore
    try {
      await fsDeleteCustomSection(id);
    } catch (e) {
      console.warn('Firestore custom section delete error:', e);
    }

    const local = getLocalItem<CustomSection[]>('jit_custom_sections', []);
    setLocalItem('jit_custom_sections', local.filter(s => s.id !== id));
    recordDeleted('custom_sections', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/custom-sections/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Worker Applications (মহিলা কারিগর আবেদন)
  // ==========================================
  async getWorkerApplications(): Promise<WorkerApplication[]> {
    // 1. Try Firebase Firestore
    let combined: WorkerApplication[] = [];
    let fromCloud = false;
    try {
      const fsWorkers = await fsGetWorkerApplications();
      if (fsWorkers && fsWorkers.length > 0) {
        combined = fsWorkers;
        fromCloud = true;
        setLocalItem('jit_custom_workers', fsWorkers);
      }
    } catch (e) {
      console.warn('Firestore worker applications fetch fallback:', e);
    }

    if (!fromCloud) {
      const local = getLocalItem<WorkerApplication[]>('jit_custom_workers', []);
      const fallback = (staticDatabase.workerApplications || []) as WorkerApplication[];
      const map = new Map<string, WorkerApplication>();
      fallback.forEach(w => map.set(w.id, w));
      local.forEach(w => map.set(w.id, w));
      combined = Array.from(map.values());
    }

    combined = filterDeleted('workers', combined);

    const remote = await safeFetchJson<WorkerApplication[]>(`${API_BASE}/worker-applications`);
    if (remote.ok && Array.isArray(remote.data)) {
      return filterDeleted('workers', remote.data);
    }
    return combined;
  },

  async submitWorkerApplication(app: Partial<WorkerApplication>): Promise<{ success: boolean; application?: WorkerApplication }> {
    const newWorker: WorkerApplication = {
      id: 'worker-' + Date.now(),
      name: app.name || app.applicantName || 'Applicant',
      applicantName: app.applicantName || app.name || 'Applicant',
      phone: app.phone || '',
      location: app.location || 'West Bengal',
      skill: app.skill || app.craftSkill || 'Handicrafts',
      craftSkill: app.craftSkill || app.skill || 'Handicrafts',
      status: 'New',
      createdAt: new Date().toISOString(),
      ...app
    };

    // 1. Save to Firebase Firestore
    try {
      await fsSaveWorkerApplication(newWorker);
    } catch (e) {
      console.warn('Firestore worker application save error:', e);
    }

    const local = getLocalItem<WorkerApplication[]>('jit_custom_workers', []);
    setLocalItem('jit_custom_workers', [newWorker, ...local]);

    const remote = await safeFetchJson<{ success: boolean; application?: WorkerApplication }>(`${API_BASE}/worker-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app)
    });

    return remote.ok && remote.data ? remote.data : { success: true, application: newWorker };
  },

  async updateWorkerApplication(id: string, app: Partial<WorkerApplication>): Promise<WorkerApplication> {
    const all = await this.getWorkerApplications();
    const existing = all.find(w => w.id === id) || { id } as WorkerApplication;
    const merged = { ...existing, ...app };

    // 1. Update in Firebase Firestore
    try {
      await fsSaveWorkerApplication(merged);
    } catch (e) {
      console.warn('Firestore worker application update error:', e);
    }

    const local = getLocalItem<WorkerApplication[]>('jit_custom_workers', []);
    setLocalItem('jit_custom_workers', [merged, ...local.filter(w => w.id !== id)]);

    const remote = await safeFetchJson<WorkerApplication>(`${API_BASE}/worker-applications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(app)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteWorkerApplication(id: string): Promise<{ success: boolean }> {
    // 1. Delete from Firebase Firestore
    try {
      await fsDeleteWorkerApplication(id);
    } catch (e) {
      console.warn('Firestore worker application delete error:', e);
    }

    const local = getLocalItem<WorkerApplication[]>('jit_custom_workers', []);
    setLocalItem('jit_custom_workers', local.filter(w => w.id !== id));
    recordDeleted('workers', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/worker-applications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  // ==========================================
  // Password Management
  // ==========================================
  async changePassword(newPassword: string, oldPassword?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    localStorage.setItem('jit_admin_custom_pwd', newPassword);

    const remote = await safeFetchJson<{ success: boolean; message?: string; error?: string }>(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldPassword: oldPassword || '', newPassword })
    });

    return remote.ok && remote.data ? remote.data : { success: true, message: 'Password updated successfully.' };
  },

  // ==========================================
  // AI Chat Assistance
  // ==========================================
  async sendChatMessage(message: string, language?: 'en' | 'bn' | 'hi', history?: any[]): Promise<{
    text: string;
    language: 'en' | 'bn' | 'hi';
    intentScore: string;
    matchedProducts: any[];
    quickActions: string[];
  }> {
    const remote = await safeFetchJson<{
      text: string;
      language: 'en' | 'bn' | 'hi';
      intentScore: string;
      matchedProducts: any[];
      quickActions: string[];
    }>(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, history })
    });

    if (remote.ok && remote.data) {
      return remote.data;
    }

    return {
      text: language === 'bn' 
        ? 'জিৎ প্রাইম এমপিসি কোম্পানিতে যোগাযোগ করার জন্য ধন্যবাদ। বাল্ক অর্ডার বা বিস্তারিত জানার জন্য আমাদের সরাসরি ফোন বা হোয়াটসঅ্যাপে (+৯১ ৮২৪০৫ ৮৫২১৯) যোগাযোগ করতে পারেন।'
        : 'Thank you for reaching out to Jit Prime MPC Company! For immediate bulk quotations and order inquiries, please message or call us directly on WhatsApp at +91 82405 85219.',
      language: language || 'en',
      intentScore: 'high',
      matchedProducts: [],
      quickActions: ['WhatsApp Us', 'View Catalogue', 'Request Quote']
    };
  },

  // ==========================================
  // Backup & Data Export
  // ==========================================
  getBackupDownloadUrl(): string {
    return `${API_BASE}/backup/export`;
  },

  async importBackup(data: any): Promise<{ success: boolean; message?: string }> {
    if (data?.settings) setLocalItem('jit_site_settings', data.settings);
    if (data?.products) setLocalItem('jit_custom_products', data.products);
    if (data?.categories) setLocalItem('jit_custom_categories', data.categories);
    if (data?.artisans) setLocalItem('jit_custom_artisans', data.artisans);
    if (data?.coupons) setLocalItem('jit_custom_coupons', data.coupons);
    if (data?.media) setLocalItem('jit_custom_media', data.media);

    const remote = await safeFetchJson<{ success: boolean; message?: string }>(`${API_BASE}/backup/import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return remote.ok && remote.data ? remote.data : { success: true, message: 'Data imported and stored successfully.' };
  },

  // ==========================================
  // Coupons & Promo Codes
  // ==========================================
  async getCoupons(includeAll = false): Promise<Coupon[]> {
    // 1. Try Firebase Firestore
    let list: Coupon[] = [];
    let fromCloud = false;
    try {
      const fsCoupons = await fsGetCoupons();
      if (fsCoupons && fsCoupons.length > 0) {
        list = fsCoupons;
        fromCloud = true;
        setLocalItem('jit_custom_coupons', fsCoupons);
      }
    } catch (e) {
      console.warn('Firestore coupons fetch fallback:', e);
    }

    if (!fromCloud) {
      const defaultFallback: Coupon[] = (staticDatabase.coupons || [
        {
          id: 'coupon-festive10',
          code: 'FESTIVE10',
          description: '১০% বিশেষ ছাড় উৎসবের অর্ডারে (10% festive discount on handicraft orders)',
          discountType: 'percentage',
          discountValue: 10,
          minOrderAmount: 1000,
          maxDiscount: 2000,
          applicableCategory: 'all',
          isActive: true,
          usedCount: 14,
          createdAt: '2026-08-01T00:00:00.000Z'
        },
        {
          id: 'coupon-bulk500',
          code: 'BULK500',
          description: 'বাল্ক অর্ডারে ₹৫০০ ফ্ল্যাট ছাড় (Flat ₹500 discount on bulk orders above ₹5,000)',
          discountType: 'fixed',
          discountValue: 500,
          minOrderAmount: 5000,
          applicableCategory: 'all',
          isActive: true,
          usedCount: 29,
          createdAt: '2026-08-10T00:00:00.000Z'
        }
      ]) as Coupon[];

      list = getLocalItem<Coupon[]>('jit_custom_coupons', defaultFallback);
    }

    list = filterDeleted('coupons', list);

    const remote = await safeFetchJson<Coupon[]>(`${API_BASE}/coupons${includeAll ? '?all=true' : ''}`);
    if (remote.ok && Array.isArray(remote.data)) {
      list = filterDeleted('coupons', remote.data);
      setLocalItem('jit_custom_coupons', list);
    }

    if (!includeAll) {
      const today = new Date().toISOString().split('T')[0];
      list = list.filter(c => c.isActive && (!c.validUntil || c.validUntil >= today));
    }
    return list;
  },

  async validateCoupon(params: { code: string; subtotal: number; quantity: number; category?: string; categoryId?: string }): Promise<CouponValidationResult> {
    const { code, subtotal = 0, quantity = 1 } = params;
    const category = params.category || params.categoryId;
    if (!code || !code.trim()) {
      return { valid: false, discountAmount: 0, finalTotal: subtotal, message: 'Please enter a coupon code.' };
    }

    const remote = await safeFetchJson<CouponValidationResult>(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (remote.ok && remote.data) {
      return remote.data;
    }

    // Client-side validation fallback
    const coupons = await this.getCoupons(false);
    const cleanInputCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanInputCode);

    if (!coupon) {
      return { valid: false, discountAmount: 0, finalTotal: subtotal, message: `Coupon code "${code}" is invalid or expired.` };
    }

    if (!coupon.isActive) {
      return { valid: false, discountAmount: 0, finalTotal: subtotal, message: 'This coupon code is currently inactive.' };
    }

    if (coupon.validUntil) {
      const today = new Date().toISOString().split('T')[0];
      if (coupon.validUntil < today) {
        return { valid: false, discountAmount: 0, finalTotal: subtotal, message: `Coupon "${coupon.code}" expired on ${coupon.validUntil}.` };
      }
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        finalTotal: subtotal,
        message: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required to use this coupon.`
      };
    }

    if (coupon.minQuantity && quantity < coupon.minQuantity) {
      return {
        valid: false,
        discountAmount: 0,
        finalTotal: subtotal,
        message: `Minimum ${coupon.minQuantity} items required to use this coupon.`
      };
    }

    if (coupon.applicableCategory && coupon.applicableCategory !== 'all') {
      if (category && coupon.applicableCategory.toLowerCase() !== category.toLowerCase()) {
        return {
          valid: false,
          discountAmount: 0,
          finalTotal: subtotal,
          message: `This coupon is only valid for the "${coupon.applicableCategory}" category.`
        };
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }
    const finalTotal = Math.max(0, subtotal - discountAmount);

    return {
      valid: true,
      coupon,
      discountAmount,
      finalTotal,
      message: `Coupon "${coupon.code}" applied! You save ₹${discountAmount.toLocaleString('en-IN')}.`
    };
  },

  async createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const cleanCode = (coupon.code || '').trim().toUpperCase();
    const newCoupon: Coupon = {
      id: `coupon-${Date.now()}`,
      code: cleanCode,
      description: (coupon.description || '').trim(),
      discountType: coupon.discountType === 'fixed' ? 'fixed' : 'percentage',
      discountValue: Number(coupon.discountValue) || 0,
      minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : undefined,
      minQuantity: coupon.minQuantity ? Number(coupon.minQuantity) : undefined,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : undefined,
      applicableCategory: coupon.applicableCategory || 'all',
      validUntil: coupon.validUntil || undefined,
      isActive: coupon.isActive !== false,
      usedCount: 0,
      createdAt: new Date().toISOString()
    };

    // 1. Save to Firebase Firestore
    try {
      await fsSaveCoupon(newCoupon);
    } catch (e) {
      console.warn('Firestore coupon save error:', e);
    }

    const current = getLocalItem<Coupon[]>('jit_custom_coupons', []);
    setLocalItem('jit_custom_coupons', [newCoupon, ...current.filter(c => c.id !== newCoupon.id)]);

    const remote = await safeFetchJson<Coupon>(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newCoupon)
    });

    return remote.ok && remote.data ? remote.data : newCoupon;
  },

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const all = await this.getCoupons(true);
    const existing = all.find(c => c.id === id) || { id, code: 'COUPON' } as Coupon;
    const merged = { ...existing, ...updates };

    // 1. Update in Firebase Firestore
    try {
      await fsSaveCoupon(merged);
    } catch (e) {
      console.warn('Firestore coupon update error:', e);
    }

    const current = getLocalItem<Coupon[]>('jit_custom_coupons', []);
    setLocalItem('jit_custom_coupons', [merged, ...current.filter(c => c.id !== id)]);

    const remote = await safeFetchJson<Coupon>(`${API_BASE}/coupons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });

    return remote.ok && remote.data ? remote.data : merged;
  },

  async deleteCoupon(id: string): Promise<{ success: boolean }> {
    // 1. Delete from Firebase Firestore
    try {
      await fsDeleteCoupon(id);
    } catch (e) {
      console.warn('Firestore coupon delete error:', e);
    }

    const current = getLocalItem<Coupon[]>('jit_custom_coupons', []);
    setLocalItem('jit_custom_coupons', current.filter(c => c.id !== id));
    recordDeleted('coupons', id);

    await safeFetchJson<{ success: boolean }>(`${API_BASE}/coupons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return { success: true };
  },

  async factoryReset(password: string): Promise<{ success: boolean; message: string }> {
    const cleanPass = (password || '').trim();
    const customPwd = localStorage.getItem('jit_admin_custom_pwd');
    const validPasswords = ['Jit@123', 'jitprime85219'];
    if (customPwd) validPasswords.push(customPwd);

    if (!validPasswords.includes(cleanPass)) {
      return { success: false, message: 'ভুল অ্যাডমিন পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন। (Incorrect admin password)' };
    }

    const keysToRemove = [
      'jit_custom_products',
      'jit_custom_categories',
      'jit_custom_artisans',
      'jit_custom_team',
      'jit_custom_training',
      'jit_custom_training_apps',
      'jit_custom_tenders',
      'jit_custom_campaigns',
      'jit_custom_leads',
      'jit_custom_homepage',
      'jit_custom_navigation',
      'jit_custom_legal',
      'jit_custom_faqs',
      'jit_custom_testimonials',
      'jit_custom_media',
      'jit_custom_gallery',
      'jit_custom_videos',
      'jit_custom_banners',
      'jit_custom_sections',
      'jit_custom_workers',
      'jit_custom_coupons',
    ];

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('jit_deleted_') || keysToRemove.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Also attempt server-side reset if running with backend
    try {
      await safeFetchJson<{success: boolean; message: string; error?: string}>(`${API_BASE}/factory-reset`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ password: cleanPass })
      });
    } catch {
      // Ignored if server API is not available on static host
    }

    return { success: true, message: 'Factory reset successful.' };
  }
};
