import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { readDb, writeDb, DatabaseSchema } from './server/db.js';
import { generateChatResponse } from './server/aiChat.js';
import { 
  Product, 
  Category, 
  Artisan, 
  TrainingProgram, 
  TrainingApplication, 
  GovernmentTender, 
  PujaCampaign, 
  BulkEnquiryLead,
  MediaFile,
  FAQ,
  Testimonial,
  NavigationItem,
  GalleryItem,
  VideoItem,
  BannerItem,
  CustomSection,
  WorkerApplication,
  Coupon
} from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsers
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Setup file upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOAD_DIR));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMime = [
    'image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif', 'application/pdf',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/mpeg'
  ];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, GIF, PDF, and video formats (MP4, WebM, QuickTime) are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for high-res images and workshop videos
  fileFilter
});

// Helper for auth token check
function checkAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  // Simple token format: Bearer <username>:<timestamp>
  const parts = token.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    next();
  } else {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, email, password } = req.body;
  const identifier = ((username || email || '') as string).trim().toLowerCase();
  const cleanPass = ((password || '') as string).trim();
  
  if (!identifier || !cleanPass) {
    return res.status(400).json({ error: 'Username/Email and password are required' });
  }

  const db = readDb();
  const user = db.adminUsers.find(u => 
    u.username.toLowerCase() === identifier || 
    (u.email && u.email.toLowerCase() === identifier)
  );
  
  if (user && user.passwordHash === cleanPass) {
    const token = `Bearer ${user.username}:${Date.now()}`;
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email || `${user.username}@jitprime.com`,
        role: user.role
      }
    });
  }
  return res.status(401).json({ error: 'Invalid email/username or password' });
});

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ valid: false });
  const parts = token.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    const db = readDb();
    const tokenUser = parts[1].split(':')[0];
    const user = db.adminUsers.find(u => u.username.toLowerCase() === tokenUser.toLowerCase());
    return res.json({ 
      valid: true,
      user: user ? {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      } : undefined
    });
  }
  res.status(401).json({ valid: false });
});

app.post('/api/auth/change-password', checkAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters' });
  }
  const db = readDb();
  if (db.adminUsers && db.adminUsers.length > 0) {
    const admin = db.adminUsers[0];
    if (oldPassword && admin.passwordHash !== oldPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    admin.passwordHash = newPassword;
    writeDb(db);
  }
  res.json({ success: true, message: 'Password updated successfully' });
});

// Settings
app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

app.put('/api/settings', checkAuth, (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// Products
app.get('/api/products', (req, res) => {
  const db = readDb();
  const { category, search, featured, includeHidden } = req.query;
  let products = db.products;

  if (includeHidden !== 'true') {
    products = products.filter(p => !p.hidden);
  }
  if (category) {
    products = products.filter(p => p.category === category);
  }
  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }
  if (search) {
    const query = String(search).toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.shortDescription.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }
  products.sort((a, b) => a.orderIndex - b.orderIndex);
  res.json(products);
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const db = readDb();
  const product = db.products.find(p => p.id === req.params.idOrSlug || p.slug === req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', checkAuth, (req, res) => {
  const db = readDb();
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    orderIndex: db.products.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.products.push(newProduct);
  writeDb(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products[index] = {
    ...db.products[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', checkAuth, (req, res) => {
  const db = readDb();
  db.products = db.products.filter(p => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Categories
app.get('/api/categories', (req, res) => {
  const db = readDb();
  const { includeHidden } = req.query;
  let categories = db.categories;
  if (includeHidden !== 'true') {
    categories = categories.filter(c => !c.hidden);
  }
  categories.sort((a, b) => a.orderIndex - b.orderIndex);
  res.json(categories);
});

app.post('/api/categories', checkAuth, (req, res) => {
  const db = readDb();
  const newCategory: Category = {
    ...req.body,
    id: `cat-${Date.now()}`,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    orderIndex: db.categories.length + 1,
    hidden: false
  };
  db.categories.push(newCategory);
  writeDb(db);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  db.categories[index] = { ...db.categories[index], ...req.body };
  writeDb(db);
  res.json(db.categories[index]);
});

app.delete('/api/categories/:id', checkAuth, (req, res) => {
  const db = readDb();
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Artisans
app.get('/api/artisans', (req, res) => {
  const db = readDb();
  const { includeHidden } = req.query;
  let artisans = db.artisans;
  if (includeHidden !== 'true') {
    artisans = artisans.filter(a => !a.hidden);
  }
  artisans.sort((a, b) => a.orderIndex - b.orderIndex);
  res.json(artisans);
});

app.post('/api/artisans', checkAuth, (req, res) => {
  const db = readDb();
  const newArtisan: Artisan = {
    ...req.body,
    id: `artisan-${Date.now()}`,
    orderIndex: db.artisans.length + 1,
    hidden: false
  };
  db.artisans.push(newArtisan);
  writeDb(db);
  res.status(201).json(newArtisan);
});

app.put('/api/artisans/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.artisans.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Artisan not found' });
  db.artisans[index] = { ...db.artisans[index], ...req.body };
  writeDb(db);
  res.json(db.artisans[index]);
});

app.delete('/api/artisans/:id', checkAuth, (req, res) => {
  const db = readDb();
  db.artisans = db.artisans.filter(a => a.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Training Programs
app.get('/api/training', (req, res) => {
  const db = readDb();
  const { includeHidden } = req.query;
  let programs = db.trainingPrograms;
  if (includeHidden !== 'true') {
    programs = programs.filter(p => !p.hidden);
  }
  programs.sort((a, b) => a.orderIndex - b.orderIndex);
  res.json(programs);
});

app.post('/api/training', checkAuth, (req, res) => {
  const db = readDb();
  const newProgram: TrainingProgram = {
    ...req.body,
    id: `train-${Date.now()}`,
    orderIndex: db.trainingPrograms.length + 1,
    hidden: false
  };
  db.trainingPrograms.push(newProgram);
  writeDb(db);
  res.status(201).json(newProgram);
});

app.put('/api/training/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.trainingPrograms.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Training program not found' });
  db.trainingPrograms[index] = { ...db.trainingPrograms[index], ...req.body };
  writeDb(db);
  res.json(db.trainingPrograms[index]);
});

app.delete('/api/training/:id', checkAuth, (req, res) => {
  const db = readDb();
  db.trainingPrograms = db.trainingPrograms.filter(p => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Training Applications
app.get('/api/training-applications', checkAuth, (req, res) => {
  const db = readDb();
  res.json(db.trainingApplications);
});

app.post('/api/training-applications', (req, res) => {
  const db = readDb();
  const newApp: TrainingApplication = {
    ...req.body,
    id: `app-${Date.now()}`,
    status: 'New',
    createdAt: new Date().toISOString()
  };
  db.trainingApplications.unshift(newApp);
  writeDb(db);
  res.status(201).json({ success: true, application: newApp });
});

app.put('/api/training-applications/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.trainingApplications.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Application not found' });
  db.trainingApplications[index] = { ...db.trainingApplications[index], ...req.body };
  writeDb(db);
  res.json(db.trainingApplications[index]);
});

// Government Tenders
app.get('/api/tenders', (req, res) => {
  const db = readDb();
  const { includeHidden } = req.query;
  let tenders = db.tenders;
  if (includeHidden !== 'true') {
    tenders = tenders.filter(t => !t.hidden);
  }
  tenders.sort((a, b) => a.orderIndex - b.orderIndex);
  res.json(tenders);
});

app.post('/api/tenders', checkAuth, (req, res) => {
  const db = readDb();
  const newTender: GovernmentTender = {
    ...req.body,
    id: `tender-${Date.now()}`,
    orderIndex: db.tenders.length + 1,
    hidden: false
  };
  db.tenders.push(newTender);
  writeDb(db);
  res.status(201).json(newTender);
});

app.put('/api/tenders/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.tenders.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Tender not found' });
  db.tenders[index] = { ...db.tenders[index], ...req.body };
  writeDb(db);
  res.json(db.tenders[index]);
});

app.delete('/api/tenders/:id', checkAuth, (req, res) => {
  const db = readDb();
  db.tenders = db.tenders.filter(t => t.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Campaigns / Puja
app.get('/api/campaigns', (req, res) => {
  const db = readDb();
  res.json(db.campaigns);
});

app.put('/api/campaigns/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.campaigns.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Campaign not found' });
  db.campaigns[index] = { ...db.campaigns[index], ...req.body };
  writeDb(db);
  res.json(db.campaigns[index]);
});

app.post('/api/campaigns', checkAuth, (req, res) => {
  const db = readDb();
  const newCamp: PujaCampaign = {
    ...req.body,
    id: `camp-${Date.now()}`
  };
  db.campaigns.push(newCamp);
  writeDb(db);
  res.status(201).json(newCamp);
});

app.delete('/api/campaigns/:id', checkAuth, (req, res) => {
  const db = readDb();
  db.campaigns = db.campaigns.filter(c => c.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Leads / Bulk Enquiries
app.get('/api/leads', checkAuth, (req, res) => {
  const db = readDb();
  res.json(db.leads);
});

app.post('/api/leads', (req, res) => {
  const db = readDb();
  const newLead: BulkEnquiryLead = {
    ...req.body,
    id: `lead-${Date.now()}`,
    status: 'NEW',
    priority: req.body.priority || 'HIGH',
    source: req.body.source || 'Website Form',
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.leads.unshift(newLead);
  writeDb(db);
  res.status(201).json({ success: true, lead: newLead });
});

app.put('/api/leads/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.leads.findIndex(l => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Lead not found' });
  db.leads[index] = {
    ...db.leads[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  res.json(db.leads[index]);
});

app.post('/api/leads/:id/notes', checkAuth, (req, res) => {
  const { text, author } = req.body;
  const db = readDb();
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  if (!lead.notes) lead.notes = [];
  lead.notes.push({
    text,
    author: author || 'Monojit Dey',
    date: new Date().toISOString()
  });
  lead.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json(lead);
});

app.delete('/api/leads/:id', checkAuth, (req, res) => {
  const db = readDb();
  db.leads = db.leads.filter(l => l.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Gallery Endpoints (হাতের কাজের গ্যালারি)
app.get('/api/gallery', (req, res) => {
  const db = readDb();
  const { category } = req.query;
  let items = db.gallery || [];
  if (category && typeof category === 'string' && category !== 'All') {
    items = items.filter(g => g.category.toLowerCase() === category.toLowerCase());
  }
  items.sort((a, b) => (a.orderIndex || 99) - (b.orderIndex || 99));
  res.json(items);
});

app.post('/api/gallery', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.gallery) db.gallery = [];
  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: req.body.title || 'Untitled Craft',
    category: req.body.category || 'Terracotta & Clay Art',
    description: req.body.description || '',
    imageUrl: req.body.imageUrl || '',
    artisanName: req.body.artisanName || 'Bengal Artisan Cluster',
    materials: req.body.materials || '',
    featured: !!req.body.featured,
    orderIndex: req.body.orderIndex !== undefined ? Number(req.body.orderIndex) : db.gallery.length + 1,
    createdAt: new Date().toISOString()
  };
  db.gallery.unshift(newItem);
  writeDb(db);
  res.status(201).json(newItem);
});

app.put('/api/gallery/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.gallery) db.gallery = [];
  const index = db.gallery.findIndex(g => g.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Gallery item not found' });
  db.gallery[index] = { ...db.gallery[index], ...req.body };
  writeDb(db);
  res.json(db.gallery[index]);
});

app.delete('/api/gallery/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.gallery) db.gallery = [];
  db.gallery = db.gallery.filter(g => g.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Homepage Content
app.get('/api/homepage', (req, res) => {
  const db = readDb();
  res.json(db.homepageContent);
});

app.put('/api/homepage', checkAuth, (req, res) => {
  const db = readDb();
  db.homepageContent = { ...db.homepageContent, ...req.body };
  writeDb(db);
  res.json({ success: true, homepageContent: db.homepageContent });
});

// Navigation
app.get('/api/navigation', (req, res) => {
  const db = readDb();
  const { includeHidden } = req.query;
  let nav = db.navigation;
  if (includeHidden !== 'true') {
    nav = nav.filter(n => !n.hidden);
  }
  nav.sort((a, b) => a.orderIndex - b.orderIndex);
  res.json(nav);
});

app.put('/api/navigation', checkAuth, (req, res) => {
  const db = readDb();
  db.navigation = req.body;
  writeDb(db);
  res.json({ success: true, navigation: db.navigation });
});

// Legal Pages
app.get('/api/legal', (req, res) => {
  const db = readDb();
  res.json(db.legalPages);
});

app.get('/api/legal/:slug', (req, res) => {
  const db = readDb();
  const page = db.legalPages.find(p => p.slug === req.params.slug);
  if (!page) return res.status(404).json({ error: 'Legal page not found' });
  res.json(page);
});

app.put('/api/legal/:slug', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.legalPages.findIndex(p => p.slug === req.params.slug);
  if (index === -1) return res.status(404).json({ error: 'Legal page not found' });
  db.legalPages[index] = {
    ...db.legalPages[index],
    ...req.body,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  writeDb(db);
  res.json(db.legalPages[index]);
});

// FAQs
app.get('/api/faqs', (req, res) => {
  const db = readDb();
  const { includeHidden } = req.query;
  let faqs = db.faqs;
  if (includeHidden !== 'true') {
    faqs = faqs.filter(f => !f.hidden);
  }
  faqs.sort((a, b) => a.orderIndex - b.orderIndex);
  res.json(faqs);
});

app.post('/api/faqs', checkAuth, (req, res) => {
  const db = readDb();
  const newFaq: FAQ = {
    ...req.body,
    id: `faq-${Date.now()}`,
    orderIndex: db.faqs.length + 1,
    hidden: false
  };
  db.faqs.push(newFaq);
  writeDb(db);
  res.status(201).json(newFaq);
});

app.put('/api/faqs/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.faqs.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'FAQ not found' });
  db.faqs[index] = { ...db.faqs[index], ...req.body };
  writeDb(db);
  res.json(db.faqs[index]);
});

app.delete('/api/faqs/:id', checkAuth, (req, res) => {
  const db = readDb();
  db.faqs = db.faqs.filter(f => f.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Testimonials
app.get('/api/testimonials', (req, res) => {
  const db = readDb();
  const { includeHidden } = req.query;
  let list = db.testimonials || [];
  if (includeHidden !== 'true') {
    list = list.filter(t => !t.hidden);
  }
  list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  res.json(list);
});

// Client & Admin review submission: Clients can submit reviews without admin login
app.post('/api/testimonials', (req, res) => {
  const db = readDb();
  const { clientName, content, rating, company, location, avatar, verifiedBuyer } = req.body;

  if (!clientName || !String(clientName).trim()) {
    return res.status(400).json({ error: 'Client name is required (নাম প্রদান আবশ্যক)' });
  }
  if (!content || !String(content).trim()) {
    return res.status(400).json({ error: 'Review content is required (রিভিউ লেখা আবশ্যক)' });
  }

  const numRating = Math.max(1, Math.min(5, Number(rating) || 5));

  const newTestimonial: Testimonial = {
    id: `test-${Date.now()}`,
    clientName: String(clientName).trim(),
    content: String(content).trim(),
    rating: numRating,
    company: company ? String(company).trim() : '',
    location: location ? String(location).trim() : '',
    avatar: avatar || '',
    verifiedBuyer: verifiedBuyer === true,
    orderIndex: -Date.now(), // Place newly submitted reviews at the very front
    hidden: false,
    createdAt: new Date().toISOString()
  };

  db.testimonials.unshift(newTestimonial);
  writeDb(db);
  res.status(201).json(newTestimonial);
});

app.put('/api/testimonials/:id', checkAuth, (req, res) => {
  const db = readDb();
  const index = db.testimonials.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Testimonial not found' });
  db.testimonials[index] = { ...db.testimonials[index], ...req.body };
  writeDb(db);
  res.json(db.testimonials[index]);
});

// Admin can delete any review / testimonial
app.delete('/api/testimonials/:id', checkAuth, (req, res) => {
  const db = readDb();
  const initialLength = db.testimonials.length;
  db.testimonials = db.testimonials.filter(t => t.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, deleted: db.testimonials.length < initialLength });
});

// Media Library
app.get('/api/media', checkAuth, (req, res) => {
  const db = readDb();
  res.json(db.media || []);
});

app.delete('/api/media/:id', checkAuth, (req, res) => {
  const db = readDb();
  const file = db.media.find(m => m.id === req.params.id);
  if (file) {
    const filePath = path.join(UPLOAD_DIR, file.filename);
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    }
    db.media = db.media.filter(m => m.id !== req.params.id);
    writeDb(db);
  }
  res.json({ success: true });
});

// File Uploads (Single & Multiple from Mobile, Tablet, Desktop)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const mediaEntry: MediaFile = {
    id: `media-${Date.now()}`,
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: fileUrl,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date().toISOString()
  };

  const db = readDb();
  if (!db.media) db.media = [];
  db.media.unshift(mediaEntry);
  writeDb(db);

  res.json({
    success: true,
    url: fileUrl,
    file: mediaEntry
  });
});

app.post('/api/upload-multiple', upload.array('files', 12), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const db = readDb();
  if (!db.media) db.media = [];

  const uploadedMedia: MediaFile[] = files.map(file => {
    const fileUrl = `/uploads/${file.filename}`;
    const mediaEntry: MediaFile = {
      id: `media-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      filename: file.filename,
      originalName: file.originalname,
      url: fileUrl,
      mimeType: file.mimetype,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
    db.media.unshift(mediaEntry);
    return mediaEntry;
  });

  writeDb(db);

  res.json({
    success: true,
    files: uploadedMedia,
    urls: uploadedMedia.map(m => m.url)
  });
});

// Videos (Google Drive link and video embeds)
app.get('/api/videos', (req, res) => {
  const db = readDb();
  let list = db.videos || [];
  if (req.query.includeHidden !== 'true') {
    list = list.filter(v => !v.hidden);
  }
  list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  res.json(list);
});

app.post('/api/videos', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.videos) db.videos = [];
  const newVideo: VideoItem = {
    id: `vid-${Date.now()}`,
    title: req.body.title || 'Handmade Craft Video',
    description: req.body.description || '',
    videoUrl: req.body.videoUrl || '',
    videoType: req.body.videoType || (req.body.videoUrl ? 'upload' : 'link'),
    googleDriveUrl: req.body.googleDriveUrl || '',
    embedUrl: req.body.embedUrl || '',
    thumbnailUrl: req.body.thumbnailUrl || '',
    category: req.body.category || 'Production Video',
    featured: !!req.body.featured,
    hidden: !!req.body.hidden,
    orderIndex: req.body.orderIndex !== undefined ? Number(req.body.orderIndex) : db.videos.length + 1,
    createdAt: new Date().toISOString()
  };
  db.videos.push(newVideo);
  writeDb(db);
  res.status(201).json(newVideo);
});

app.put('/api/videos/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.videos) db.videos = [];
  const index = db.videos.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Video not found' });
  db.videos[index] = { ...db.videos[index], ...req.body };
  writeDb(db);
  res.json(db.videos[index]);
});

app.delete('/api/videos/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.videos) db.videos = [];
  db.videos = db.videos.filter(v => v.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Banners
app.get('/api/banners', (req, res) => {
  const db = readDb();
  const list = db.banners || [];
  res.json(list);
});

app.post('/api/banners', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.banners) db.banners = [];
  const newBanner: BannerItem = {
    id: `banner-${Date.now()}`,
    title: req.body.title || '',
    subtitle: req.body.subtitle || '',
    image: req.body.image || '',
    ctaText: req.body.ctaText || '',
    ctaLink: req.body.ctaLink || '',
    countdownEnabled: !!req.body.countdownEnabled,
    countdownDeadline: req.body.countdownDeadline || '',
    active: req.body.active !== false,
    orderIndex: req.body.orderIndex !== undefined ? Number(req.body.orderIndex) : db.banners.length + 1
  };
  db.banners.push(newBanner);
  writeDb(db);
  res.status(201).json(newBanner);
});

app.put('/api/banners/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.banners) db.banners = [];
  const index = db.banners.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Banner not found' });
  db.banners[index] = { ...db.banners[index], ...req.body };
  writeDb(db);
  res.json(db.banners[index]);
});

app.delete('/api/banners/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.banners) db.banners = [];
  db.banners = db.banners.filter(b => b.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Custom Sections
app.get('/api/custom-sections', (req, res) => {
  const db = readDb();
  const list = (db.customSections || []).filter(s => s.active);
  list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  res.json(list);
});

app.post('/api/custom-sections', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.customSections) db.customSections = [];
  const newSection: CustomSection = {
    id: `section-${Date.now()}`,
    title: req.body.title || 'New Section',
    subtitle: req.body.subtitle || '',
    content: req.body.content || '',
    imageUrl: req.body.imageUrl || '',
    buttonText: req.body.buttonText || '',
    buttonLink: req.body.buttonLink || '',
    backgroundColor: req.body.backgroundColor || '#F8FAFC',
    textColor: req.body.textColor || '#0F172A',
    orderIndex: req.body.orderIndex !== undefined ? Number(req.body.orderIndex) : db.customSections.length + 1,
    active: req.body.active !== false,
    hidden: req.body.hidden !== undefined ? !!req.body.hidden : req.body.active === false
  };
  db.customSections.push(newSection);
  writeDb(db);
  res.status(201).json(newSection);
});

app.put('/api/custom-sections/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.customSections) db.customSections = [];
  const index = db.customSections.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Custom section not found' });
  db.customSections[index] = { ...db.customSections[index], ...req.body };
  writeDb(db);
  res.json(db.customSections[index]);
});

app.delete('/api/custom-sections/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.customSections) db.customSections = [];
  db.customSections = db.customSections.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Worker Applications (Women Artisan & Local Worker registration)
app.get('/api/worker-applications', checkAuth, (req, res) => {
  const db = readDb();
  res.json(db.workerApplications || []);
});

app.post('/api/worker-applications', (req, res) => {
  const db = readDb();
  if (!db.workerApplications) db.workerApplications = [];
  const newApp: WorkerApplication = {
    id: `worker-${Date.now()}`,
    name: req.body.name || '',
    phone: req.body.phone || '',
    whatsappNumber: req.body.whatsappNumber || '',
    email: req.body.email || '',
    location: req.body.location || '',
    craftSkill: req.body.craftSkill || 'Clay & Terracotta',
    experienceYears: Number(req.body.experienceYears) || 0,
    dailyCapacityHours: req.body.dailyCapacityHours || '4-6 hours',
    hasSmartphone: req.body.hasSmartphone !== false,
    notes: req.body.notes || '',
    status: 'NEW',
    createdAt: new Date().toISOString()
  };
  db.workerApplications.unshift(newApp);
  writeDb(db);
  res.status(201).json({ success: true, application: newApp });
});

app.put('/api/worker-applications/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.workerApplications) db.workerApplications = [];
  const index = db.workerApplications.findIndex(w => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Worker application not found' });
  db.workerApplications[index] = { ...db.workerApplications[index], ...req.body };
  writeDb(db);
  res.json(db.workerApplications[index]);
});

// Coupons & Promo Codes Management
app.get('/api/coupons', (req, res) => {
  const db = readDb();
  if (!db.coupons) db.coupons = [];
  const { all } = req.query;
  if (all === 'true') {
    return res.json(db.coupons);
  }
  // Public only receives active and non-expired coupons
  const now = new Date().toISOString().split('T')[0];
  const activeCoupons = db.coupons.filter(c => {
    if (!c.isActive) return false;
    if (c.validUntil && c.validUntil < now) return false;
    return true;
  });
  res.json(activeCoupons);
});

app.post('/api/coupons/validate', (req, res) => {
  const db = readDb();
  if (!db.coupons) db.coupons = [];
  const { code, subtotal = 0, quantity = 1, category } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ valid: false, message: 'Please enter a coupon code.' });
  }

  const cleanCode = code.trim().toUpperCase();
  const coupon = db.coupons.find(c => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return res.status(404).json({ valid: false, message: `Coupon "${cleanCode}" is invalid or does not exist.` });
  }

  if (!coupon.isActive) {
    return res.status(400).json({ valid: false, message: `Coupon "${cleanCode}" is currently inactive.` });
  }

  const today = new Date().toISOString().split('T')[0];
  if (coupon.validUntil && coupon.validUntil < today) {
    return res.status(400).json({ valid: false, message: `Coupon "${cleanCode}" expired on ${coupon.validUntil}.` });
  }

  const numSubtotal = Number(subtotal) || 0;
  const numQuantity = Number(quantity) || 1;

  if (coupon.minOrderAmount && numSubtotal < coupon.minOrderAmount) {
    return res.status(400).json({ 
      valid: false, 
      message: `Minimum order value of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required to apply this coupon. (Current: ₹${numSubtotal.toLocaleString('en-IN')})` 
    });
  }

  if (coupon.minQuantity && numQuantity < coupon.minQuantity) {
    return res.status(400).json({ 
      valid: false, 
      message: `Minimum quantity of ${coupon.minQuantity} units required to apply this coupon. (Current: ${numQuantity} units)` 
    });
  }

  if (coupon.applicableCategory && coupon.applicableCategory !== 'all' && category && coupon.applicableCategory !== category) {
    return res.status(400).json({ 
      valid: false, 
      message: `This coupon is only valid for category "${coupon.applicableCategory}".` 
    });
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((numSubtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, numSubtotal);
  }

  const finalTotal = Math.max(0, numSubtotal - discountAmount);

  res.json({
    valid: true,
    coupon,
    discountAmount,
    finalTotal,
    message: `Coupon "${coupon.code}" applied! You save ₹${discountAmount.toLocaleString('en-IN')}.`
  });
});

app.post('/api/coupons', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.coupons) db.coupons = [];
  const { 
    code, 
    description = '', 
    discountType = 'percentage', 
    discountValue = 10,
    minOrderAmount,
    minQuantity,
    maxDiscount,
    applicableCategory = 'all',
    validUntil,
    isActive = true
  } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Coupon code is required' });
  }

  const cleanCode = code.trim().toUpperCase();
  const existing = db.coupons.find(c => c.code.toUpperCase() === cleanCode);
  if (existing) {
    return res.status(400).json({ error: `Coupon code "${cleanCode}" already exists` });
  }

  const newCoupon: Coupon = {
    id: `coupon-${Date.now()}`,
    code: cleanCode,
    description: description.trim(),
    discountType: discountType === 'fixed' ? 'fixed' : 'percentage',
    discountValue: Number(discountValue) || 0,
    minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
    minQuantity: minQuantity ? Number(minQuantity) : undefined,
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    applicableCategory: applicableCategory || 'all',
    validUntil: validUntil || undefined,
    isActive: !!isActive,
    usedCount: 0,
    createdAt: new Date().toISOString()
  };

  db.coupons.unshift(newCoupon);
  writeDb(db);
  res.status(201).json(newCoupon);
});

app.put('/api/coupons/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.coupons) db.coupons = [];
  const index = db.coupons.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Coupon not found' });

  const current = db.coupons[index];
  const updatedCode = req.body.code ? req.body.code.trim().toUpperCase() : current.code;

  // Check code clash if code changed
  if (updatedCode !== current.code) {
    const exists = db.coupons.find(c => c.id !== req.params.id && c.code.toUpperCase() === updatedCode);
    if (exists) {
      return res.status(400).json({ error: `Coupon code "${updatedCode}" is already in use.` });
    }
  }

  db.coupons[index] = {
    ...current,
    ...req.body,
    code: updatedCode,
    discountValue: req.body.discountValue !== undefined ? Number(req.body.discountValue) : current.discountValue,
    minOrderAmount: req.body.minOrderAmount !== undefined ? (req.body.minOrderAmount ? Number(req.body.minOrderAmount) : undefined) : current.minOrderAmount,
    minQuantity: req.body.minQuantity !== undefined ? (req.body.minQuantity ? Number(req.body.minQuantity) : undefined) : current.minQuantity,
    maxDiscount: req.body.maxDiscount !== undefined ? (req.body.maxDiscount ? Number(req.body.maxDiscount) : undefined) : current.maxDiscount,
    isActive: req.body.isActive !== undefined ? !!req.body.isActive : current.isActive
  };

  writeDb(db);
  res.json(db.coupons[index]);
});

app.delete('/api/coupons/:id', checkAuth, (req, res) => {
  const db = readDb();
  if (!db.coupons) db.coupons = [];
  const initialLength = db.coupons.length;
  db.coupons = db.coupons.filter(c => c.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, deleted: db.coupons.length < initialLength });
});


// AI Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await generateChatResponse(message, language, history);
    res.json(result);
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ 
      text: "That's a great question. I don't want to give you inaccurate information. Please leave your contact details or reach Monojit Dey directly on WhatsApp: +91 82405 85219.",
      language: 'en',
      intentScore: 'LOW',
      matchedProducts: []
    });
  }
});

// Backup & Export / Import
app.get('/api/backup/export', checkAuth, (req, res) => {
  const db = readDb();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=jit-prime-backup-${new Date().toISOString().split('T')[0]}.json`);
  res.send(JSON.stringify(db, null, 2));
});

app.post('/api/backup/import', checkAuth, (req, res) => {
  try {
    const importedData = req.body;
    if (!importedData.settings || !Array.isArray(importedData.products)) {
      return res.status(400).json({ error: 'Invalid backup file structure' });
    }
    writeDb(importedData);
    res.json({ success: true, message: 'Database restored successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to restore database', details: err.message });
  }
});

// Vite middleware & Production Handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jit Prime MPC Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
