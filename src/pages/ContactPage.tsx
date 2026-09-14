import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phone = settings?.phone || '+91 82405 85219';
  const email = settings?.email || 'monojitdey189@gmail.com';
  const ownerName = settings?.ownerName || 'MONOJIT DEY';
  const companyName = settings?.companyName || 'JIT PRIME MPC COMPANY';
  const fullAddress = settings?.fullAddress || 'Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError('Please provide your name and phone number.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await api.submitLead({
        name: form.name,
        companyName: form.company || 'Contact Form Inquiry',
        country: 'India',
        whatsapp: form.phone,
        email: form.email,
        productOrCategory: 'General Contact Inquiry',
        quantity: 'N/A',
        message: form.message,
        source: 'Website Form',
        priority: 'MEDIUM'
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0B1A30] to-[#142C4F] rounded-3xl p-8 sm:p-12 text-white border-2 border-amber-400 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Visiting Card Identity &bull; Your Trust Our Priority</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-heading">
            Connect With Jit Prime MPC Company
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Reach out directly to proprietor <strong className="text-amber-300">{ownerName}</strong> and our workshop team in Kolkata for wholesale orders, government tender discussions, or artisan training programs.
          </p>
        </div>
      </div>

      {/* Main Grid: Contact Cards & Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            {/* Visiting Card Branding Box */}
            <div className="p-4 rounded-2xl bg-linear-to-br from-[#0B1A30] to-[#162F52] text-white border border-amber-400/50 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                {companyName}
              </span>
              <h3 className="text-base font-extrabold text-white font-serif-heading">
                Owner: {ownerName}
              </h3>
              <p className="text-xs text-amber-300 italic">
                &ldquo;Your Trust Our Priority&rdquo;
              </p>
              <div className="text-[11px] text-slate-300 pt-1">
                All Govt. Tender &bull; Hasta Shilpa &bull; Bulk Orders
              </div>
            </div>

            {/* Direct Details */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Physical Workshop & Office</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    {fullAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900">Phone & WhatsApp Direct</h4>
                  <a 
                    href={`tel:${phone.replace(/\s+/g, '')}`} 
                    className="text-xs font-semibold text-amber-800 hover:underline"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900">Official Email</h4>
                  <a 
                    href={`mailto:${email}`} 
                    className="text-xs font-semibold text-amber-800 hover:underline break-all"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">Business Hours</h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Open 24/7
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {settings?.businessHours || '24/7 (Open 24 Hours, 7 Days a Week)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Monojit Dey, I am contacting you through your official website regarding handicraft production.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Monojit on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif-heading">
                Message Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for contacting Jit Prime MPC Company. We will review your message and reply via phone or email shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                  Send Direct Inquiry
                </h3>
                <p className="text-xs text-slate-500">
                  Leave your requirements, questions, or visit appointment request below.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amitava Banerjee"
                    value={form.name || ''}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone || ''}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={form.email || ''}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Organization Name"
                    value={form.company || ''}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Message or Requirement *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you with handcrafted products, tender requirements, or training..."
                  value={form.message || ''}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
