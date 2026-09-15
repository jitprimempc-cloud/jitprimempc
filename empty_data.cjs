const fs = require('fs');
let code = fs.readFileSync('server/defaultData.ts', 'utf-8');

code = code.replace(/export const defaultCategories: Category\[\] = \[[\s\S]*?\];/g, 'export const defaultCategories: Category[] = [];');
code = code.replace(/export const defaultProducts: Product\[\] = \[[\s\S]*?\];/g, 'export const defaultProducts: Product[] = [];');
code = code.replace(/export const defaultArtisans: Artisan\[\] = \[[\s\S]*?\];/g, 'export const defaultArtisans: Artisan[] = [];');
code = code.replace(/export const defaultTrainingPrograms: TrainingProgram\[\] = \[[\s\S]*?\];/g, 'export const defaultTrainingPrograms: TrainingProgram[] = [];');
code = code.replace(/export const defaultTenders: GovernmentTender\[\] = \[[\s\S]*?\];/g, 'export const defaultTenders: GovernmentTender[] = [];');
code = code.replace(/export const defaultFAQs: FAQ\[\] = \[[\s\S]*?\];/g, 'export const defaultFAQs: FAQ[] = [];');
code = code.replace(/export const defaultTestimonials: Testimonial\[\] = \[[\s\S]*?\];/g, 'export const defaultTestimonials: Testimonial[] = [];');
code = code.replace(/export const defaultLeads: BulkEnquiryLead\[\] = \[[\s\S]*?\];/g, 'export const defaultLeads: BulkEnquiryLead[] = [];');
code = code.replace(/export const defaultGallery: GalleryItem\[\] = \[[\s\S]*?\];/g, 'export const defaultGallery: GalleryItem[] = [];');
code = code.replace(/export const defaultCoupons: Coupon\[\] = \[[\s\S]*?\];/g, 'export const defaultCoupons: Coupon[] = [];');

fs.writeFileSync('server/defaultData.ts', code, 'utf-8');
