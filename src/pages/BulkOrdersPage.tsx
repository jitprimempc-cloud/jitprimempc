import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Upload, 
  Truck, 
  FileText, 
  Building, 
  Globe,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { LeadPriority } from '../types';

export const BulkOrdersPage: React.FC = () => {
  const { settings, categories } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    country: 'India',
    destination: '',
    whatsapp: '',
    email: '',
    productOrCategory: '',
    quantity: '200',
    requiredDeliveryDate: '',
    customizationRequirement: '',
    packagingRequirement: '',
    privateLabelBranding: false,
    message: ''
  });

  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const qtyNum = parseInt(formData.quantity.replace(/[^0-9]/g, ''), 10) || 200;
    let priority: LeadPriority = 'HIGH';
    if (qtyNum >= 500 || formData.country.toLowerCase() !== 'india') {
      priority = 'VERY HIGH';
    }

    try {
      await api.submitLead({
        name: formData.name,
        companyName: formData.companyName || 'Wholesale Buyer',
        country: formData.country,
        destination: formData.destination,
        whatsapp: formData.whatsapp,
        email: formData.email,
        productOrCategory: formData.productOrCategory || 'General Bulk Order',
        quantity: formData.quantity,
        requiredDeliveryDate: formData.requiredDeliveryDate,
        customizationRequirement: formData.customizationRequirement,
        packagingRequirement: formData.packagingRequirement,
        privateLabelBranding: formData.privateLabelBranding,
        message: formData.message,
        fileAttachment: attachmentUrl || undefined,
        source: 'Website Form',
        priority
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0B1A30] via-[#122B4D] to-[#163660] rounded-3xl p-8 sm:p-12 text-white border-2 border-amber-400 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold border border-amber-300 shadow-xs">
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>DIRECT B2B &amp; WHOLESALE SUPPLY &bull; বাল্ক ও প্রাতিষ্ঠানিক অর্ডার</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-heading text-white">
            Bulk &amp; Product Orders (পাইকারি ও বাল্ক অর্ডার)
          </h1>
          <p className="text-amber-300 font-bold text-base sm:text-lg">
            Direct Workshop Supply for Retailers, Corporates, Festivals &amp; Exporters
          </p>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            কোনো মধ্যস্থতাকারী ছাড়াই সরাসরি কলকাতার মাস্টার কারিগরদের থেকে জেনুইন হস্তশিল্প সংগ্রহ করুন। কর্পোরেট গিফটিং, দুর্গোৎসবের স্মারক, হোলসেল ও আন্তর্জাতিক অর্ডারে কাস্টম ব্র্যান্ডিং ও জিএসটি ইনভয়েস সহ সরবরাহ।
          </p>
        </div>
      </div>

      {/* Main Grid: Form & Wholesale Guarantees */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Form */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif-heading">
                Bulk Enquiry Successfully Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, {formData.name}. Mr. Monojit Dey and our production team have been notified. We will review your requirements and send a formal commercial quotation to your WhatsApp ({formData.whatsapp}).
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello Monojit Dey, I have submitted a wholesale enquiry for ${formData.quantity} pcs of ${formData.productOrCategory}. Name: ${formData.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect with Monojit on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                  Request a Formal Commercial Quotation
                </h3>
                <p className="text-xs text-slate-500">
                  Fill out the details below to receive competitive tier pricing based on your volume.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Business / Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengal Heritage Emporium"
                    value={formData.companyName || ''}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.whatsapp || ''}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    placeholder="purchase@company.com"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Handcrafted Product / Craft Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Terracotta Necklaces, Dokra Mementos, Clay Pots"
                    value={formData.productOrCategory || ''}
                    onChange={e => setFormData({ ...formData, productOrCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimated Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 250 pcs"
                    value={formData.quantity || ''}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Country of Delivery
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. India, United States, UK"
                    value={formData.country || ''}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Delivery City / Postal Destination
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, New Delhi, London"
                    value={formData.destination || ''}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Private label and customization */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="privateLabelCheck"
                    checked={formData.privateLabelBranding}
                    onChange={e => setFormData({ ...formData, privateLabelBranding: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="privateLabelCheck" className="font-bold text-slate-900 cursor-pointer">
                    We require Private Label / Custom Brand Tagging
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Customization Details
                  </label>
                  <input
                    type="text"
                    placeholder="Custom engraving, specific pantone shades, logo printing..."
                    value={formData.customizationRequirement || ''}
                    onChange={e => setFormData({ ...formData, customizationRequirement: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Additional Notes or Packaging Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Target budget per unit, corrugated box packaging, or specific timeline constraints..."
                  value={formData.message || ''}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {/* File upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attach Design Reference or Technical Spec Sheet (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-amber-600" />
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

              {/* Submit */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={submitting || uploadingFile}
                  className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Request Formal Bulk Quote'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#0B1A30] text-white p-6 sm:p-7 rounded-3xl border-2 border-amber-400 space-y-4">
            <h3 className="font-bold text-lg text-amber-400 font-serif-heading">
              Our B2B Order Policies
            </h3>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Advance Payment:</strong> Standard 50% advance upon contract signing and sample approval; balance before shipment dispatch.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Sampling Workflow:</strong> Physical or high-res video prototypes submitted prior to mass cluster manufacturing.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>GST Invoices:</strong> Full tax invoice compliance with valid HSN codes for all domestic transactions.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <span className="text-[11px] text-slate-400 block mb-1 font-semibold">
                Direct Contact with Monojit Dey:
              </span>
              <p className="text-white font-bold text-sm">{phone}</p>
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Business Chat</span>
              </a>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm">Cluster Coordination Hub</h4>
            <p className="leading-relaxed">
              Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.
            </p>
            <p className="text-[11px] text-amber-700 font-semibold">
              Inspection of physical samples available by prior appointment.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
