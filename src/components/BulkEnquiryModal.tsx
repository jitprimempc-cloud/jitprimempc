import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  Package, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { LeadPriority } from '../types';

export const BulkEnquiryModal: React.FC = () => {
  const { 
    isBulkModalOpen, 
    closeBulkModal, 
    bulkModalProduct, 
    bulkModalInitialQuantity,
    bulkModalCouponCode,
    bulkModalDiscountAmount,
    settings, 
    categories 
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    country: 'India',
    destination: '',
    whatsapp: '',
    email: '',
    productOrCategory: '',
    quantity: '100',
    requiredDeliveryDate: '',
    customizationRequirement: '',
    packagingRequirement: '',
    privateLabelBranding: false,
    message: ''
  });

  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponInput, setCouponInput] = useState('');
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isBulkModalOpen) {
      if (bulkModalProduct) {
        setFormData(prev => ({
          ...prev,
          productOrCategory: `${bulkModalProduct.name} (SKU: ${bulkModalProduct.sku})`,
          quantity: String(bulkModalInitialQuantity || bulkModalProduct.moq || 100)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          productOrCategory: prev.productOrCategory || 'General Bulk Inquiry',
          quantity: String(bulkModalInitialQuantity || '100')
        }));
      }

      if (bulkModalCouponCode) {
        setAppliedCouponCode(bulkModalCouponCode);
        setCouponInput(bulkModalCouponCode);
        setAppliedDiscount(bulkModalDiscountAmount || 0);
        setCouponMsg(`Coupon ${bulkModalCouponCode} applied`);
      } else {
        setAppliedCouponCode('');
        setCouponInput('');
        setAppliedDiscount(0);
        setCouponMsg(null);
      }
    }
  }, [bulkModalProduct, isBulkModalOpen, bulkModalInitialQuantity, bulkModalCouponCode, bulkModalDiscountAmount]);

  if (!isBulkModalOpen) return null;

  const phone = settings?.whatsappNumber || '+91 82405 85219';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setError(null);
    try {
      const res = await api.uploadFile(file);
      if (res.success) {
        setAttachmentUrl(res.url);
        setAttachmentName(file.name);
      } else {
        setError('Failed to upload file');
      }
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) {
      setError('Please provide your name and WhatsApp number.');
      return;
    }

    setSubmitting(true);
    setError(null);

    // Calculate priority
    const qtyNum = parseInt(formData.quantity.replace(/[^0-9]/g, ''), 10) || 100;
    let priority: LeadPriority = 'HIGH';
    if (qtyNum >= 500 || formData.country.toLowerCase() !== 'india') {
      priority = 'VERY HIGH';
    } else if (qtyNum < 50) {
      priority = 'MEDIUM';
    }

    const unitPrice = bulkModalProduct ? (bulkModalProduct.bulkPrice || bulkModalProduct.retailPrice || 0) : 0;
    const subtotal = unitPrice * qtyNum;
    const estimatedTotal = Math.max(0, subtotal - appliedDiscount);

    try {
      await api.submitLead({
        name: formData.name,
        companyName: formData.companyName || 'Not specified',
        country: formData.country,
        destination: formData.destination,
        whatsapp: formData.whatsapp,
        email: formData.email,
        productOrCategory: formData.productOrCategory,
        quantity: formData.quantity,
        requiredDeliveryDate: formData.requiredDeliveryDate,
        customizationRequirement: formData.customizationRequirement,
        packagingRequirement: formData.packagingRequirement,
        privateLabelBranding: formData.privateLabelBranding,
        message: formData.message,
        fileAttachment: attachmentUrl || undefined,
        couponCode: appliedCouponCode || undefined,
        discountAmount: appliedDiscount > 0 ? appliedDiscount : undefined,
        estimatedTotal: estimatedTotal > 0 ? estimatedTotal : undefined,
        source: 'Website Form',
        priority
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit bulk enquiry. Please try again or message via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateModalCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponValidating(true);
    setCouponMsg(null);
    try {
      const qtyNum = parseInt(formData.quantity.replace(/[^0-9]/g, ''), 10) || 100;
      const unitPrice = bulkModalProduct ? (bulkModalProduct.bulkPrice || bulkModalProduct.retailPrice || 0) : 0;
      const subtotal = unitPrice * qtyNum;
      const res = await api.validateCoupon({
        code,
        subtotal,
        quantity: qtyNum,
        categoryId: bulkModalProduct?.category
      });
      if (res.valid) {
        setAppliedCouponCode(res.coupon?.code || code);
        setAppliedDiscount(res.discountAmount || 0);
        setCouponMsg(`Coupon ${res.coupon?.code} applied: ₹${res.discountAmount.toLocaleString('en-IN')} discount!`);
      } else {
        setAppliedCouponCode('');
        setAppliedDiscount(0);
        setCouponMsg(res.message || 'Coupon not applicable');
      }
    } catch (err: any) {
      setCouponMsg(err.message || 'Validation error');
    } finally {
      setCouponValidating(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError(null);
    setAttachmentUrl(null);
    setAttachmentName(null);
    closeBulkModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#0B1A30] to-[#152E54] text-white p-4 sm:p-6 border-b-2 border-amber-400 relative shrink-0">
          <button
            type="button"
            onClick={resetAndClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Direct B2B & Wholesale Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-serif-heading text-white">
            Request Bulk Quotation
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Connect directly with Monojit Dey and our production cluster in Kolkata for wholesale, institutional, and custom handicraft requirements.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Bulk Enquiry Submitted Successfully!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for your requirement. Your quotation request has been securely recorded in our system. Our team and Mr. Monojit Dey will reach out to you within 24 hours.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello Monojit Dey, I have submitted a bulk quote request on your website for ${formData.productOrCategory} (${formData.quantity} pcs). My name is ${formData.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify Monojit on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-lg"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Row 1: Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma / Sarah Jenkins"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heritage Crafts Boutique / Govt. Dept"
                    value={formData.companyName || ''}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Row 2: WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    WhatsApp Number (with Country Code) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.whatsapp || ''}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="buyer@company.com"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Row 3: Product / Category & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Product or Category of Interest *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Terracotta Jewellery, Maa Durga Plaques, Dokra"
                    value={formData.productOrCategory || ''}
                    onChange={e => setFormData({ ...formData, productOrCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100, 500 pcs"
                    value={formData.quantity || ''}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Promo / Coupon Code Section */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Have a Promo or Coupon Code? (কুপন কোড থাকলে লিখুন)</span>
                  </label>
                  {appliedCouponCode && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      Applied: {appliedCouponCode}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. PUJA10, BULK500"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleValidateModalCoupon}
                    disabled={couponValidating || !couponInput.trim()}
                    className="px-3.5 py-1.5 bg-slate-900 text-amber-400 font-bold text-xs rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {couponValidating ? 'Validating...' : appliedCouponCode ? 'Update Code' : 'Apply Code'}
                  </button>
                </div>

                {couponMsg && (
                  <p className={`text-[11px] font-medium ${appliedCouponCode ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

              {/* Row 4: Country & Delivery City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Country of Delivery
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. India, United Kingdom, USA, UAE"
                    value={formData.country || ''}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Required Delivery Timeline / Date
                  </label>
                  <input
                    type="date"
                    value={formData.requiredDeliveryDate || ''}
                    onChange={e => setFormData({ ...formData, requiredDeliveryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Customization & Private Label */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="privateLabel"
                    checked={formData.privateLabelBranding}
                    onChange={e => setFormData({ ...formData, privateLabelBranding: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="privateLabel" className="font-semibold text-slate-900 cursor-pointer">
                    We require Private Label / Custom Brand Logo on Product or Packaging
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Specific customization requirements (colors, tags, size modifications)..."
                    value={formData.customizationRequirement || ''}
                    onChange={e => setFormData({ ...formData, customizationRequirement: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs outline-hidden"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Additional Notes or Project Specifications
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details regarding your target budget, packaging specifications, or event deadlines..."
                  value={formData.message || ''}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {/* File Attachment Upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attach Design / Reference File (PDF or Image, max 15MB)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>{uploadingFile ? 'Uploading...' : 'Choose File from Device'}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                  </label>
                  {attachmentName && (
                    <span className="text-xs text-emerald-700 font-medium truncate max-w-xs">
                      &check; {attachmentName}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingFile}
                  className="px-6 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Request Bulk Quote'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
