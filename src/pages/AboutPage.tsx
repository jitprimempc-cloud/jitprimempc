import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  Award, 
  Users, 
  Building, 
  ArrowRight,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings, openBulkModal } = useApp();

  const phone = settings?.phone || '+91 82405 85219';
  const email = settings?.email || 'monojitdey189@gmail.com';
  const ownerName = settings?.ownerName || 'MONOJIT DEY';
  const companyName = settings?.companyName || 'JIT PRIME MPC COMPANY';
  const fullAddress = settings?.fullAddress || 'Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 space-y-16">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0B1A30] to-[#142C4F] rounded-3xl p-8 sm:p-14 text-white border-2 border-amber-400 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>All Govt. Tender &bull; Hasta Shilpa &bull; Wholesale Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-heading">
            About Jit Prime MPC Company
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Founded and led by <span className="text-amber-400 font-bold">{ownerName}</span> in Kolkata, West Bengal, we bridge the gap between traditional Indian handicraft heritage and modern institutional, domestic wholesale, and international markets.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs">
            <span className="bg-[#102441] px-3 py-1.5 rounded-lg border border-slate-700">
              Visiting Card Motto: <strong className="text-amber-300">&ldquo;Your Trust Our Priority&rdquo;</strong>
            </span>
            <span className="bg-[#102441] px-3 py-1.5 rounded-lg border border-slate-700">
              Workshop Hub: <strong className="text-white">Kolkata - 700049</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Leadership & Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=900&q=80"
              alt="Monojit Dey and Handicraft Production"
              className="w-full h-96 object-cover"
            />
            <div className="p-5 bg-[#0B1A30] text-white">
              <h3 className="font-bold text-lg text-white">{ownerName}</h3>
              <p className="text-xs text-amber-400 font-medium">Proprietor & Production Director</p>
              <p className="text-xs text-slate-300 mt-2">
                &ldquo;Our mission is to establish sustainable production clusters where women artisans gain pride, skill, and genuine market-linked income while institutional buyers receive flawless handcrafted products.&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-heading mb-3">
              Rooted in Bengal&apos;s Rich Artisan Legacy
            </h2>
            <p className="mb-3">
              Jit Prime MPC Company was established with a singular vision: to preserve traditional Hasta Shilpa techniques while introducing standard production planning, strict quality controls, and formal compliance that institutional buyers and government departments require.
            </p>
            <p className="mb-3">
              From our central workshop and assembly hub in Belghoria, Nimta, Kolkata, we manage production schedules across multiple clusters of skilled women artisans specialized in terracotta pottery, terracotta jewellery, Dokra brass castings, natural jute conference bags, and festive Puja artefacts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Child Labour</span>
              </div>
              <p className="text-xs text-slate-500">
                100% ethical production carried out by adult women artisans working in safe, dignified community clusters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fair Production Rates</span>
              </div>
              <p className="text-xs text-slate-500">
                Direct compensation tied to batch completion, ensuring artisans earn fair value without exploitative middlemen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Location & Verification */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200">
        <div className="max-w-3xl mb-8 space-y-2">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">
            Verified Physical Location
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-heading">
            Our Kolkata Production & Coordination Center
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Institutional buyers, tender officers, and wholesale clients are welcome to inspect physical samples and discuss custom specifications at our verified address:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <MapPin className="w-6 h-6 text-amber-500 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">Registered Address</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {fullAddress}
            </p>
            <p className="text-[11px] font-semibold text-amber-700 pt-1">
              Landmark: Harijon School &bull; Near 42 Pally Club
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <Phone className="w-6 h-6 text-amber-500 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">Direct Contact</h4>
            <p className="text-xs text-slate-600">
              Speak directly with Monojit Dey for quick order quotes or tender documentation:
            </p>
            <p className="text-sm font-extrabold text-slate-900 pt-1">
              {phone}
            </p>
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline pt-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <Mail className="w-6 h-6 text-amber-500 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">Official Inquiries</h4>
            <p className="text-xs text-slate-600">
              For tender submissions, purchase orders, and commercial contracts:
            </p>
            <p className="text-sm font-extrabold text-slate-900 pt-1 break-all">
              {email}
            </p>
            <span className="text-[11px] text-slate-400 block pt-1">
              Response within 24 business hours
            </span>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => openBulkModal()}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Request Custom Quotation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
