import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  FileCheck, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Award, 
  Download, 
  Clock, 
  Calendar,
  Layers,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { GovernmentTender } from '../types';

interface GovtPageProps {
  onNavigate: (route: string) => void;
}

export const GovernmentInstitutionalPage: React.FC<GovtPageProps> = ({ onNavigate }) => {
  const { settings, openBulkModal } = useApp();

  const [tenders, setTenders] = useState<GovernmentTender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getTenders(false);
        setTenders(data);
      } catch (err) {
        console.error('Failed to load tenders:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const phone = settings?.phone || '+91 82405 85219';
  const ownerName = settings?.ownerName || 'MONOJIT DEY';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 space-y-14">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0B1A30] to-[#142C4F] rounded-3xl p-8 sm:p-12 text-white border-2 border-amber-400 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>All Govt. Tender &bull; GeM & Tender Ready Supplier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-heading">
            Government & Institutional Procurement
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Reliable supply partner for government departments, cultural directorates, state emporiums, universities, and public sector undertakings. From custom conference mementos to large-scale cultural event merchandise.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs">
            <span className="bg-[#102441] px-3 py-1.5 rounded-lg border border-slate-700">
              Proprietor: <strong className="text-amber-300">{ownerName}</strong>
            </span>
            <span className="bg-[#102441] px-3 py-1.5 rounded-lg border border-slate-700">
              Tender Helpline: <strong className="text-white">{phone}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Procurement Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Custom Institutional Mementos</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            High-grade Dokra brass trophies, terracotta cultural plaques, and framed folk art customized with government department crests and dignitary plaques.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Full Compliance & Invoicing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            GST compliance, HSN code classification, technical spec sheets, and tender document fulfillment aligned with standard public procurement guidelines.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Rigorous Pre-Shipment Inspection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Physical pre-production prototype approval, batch sampling checks, and secure multi-tier packaging for zero-transit breakage.
          </p>
        </div>
      </div>

      {/* Tender Capabilities & Track Record */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">
              Procurement Track Record & Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-heading">
              Tender Profiles & Executed Projects
            </h2>
          </div>
          <button
            type="button"
            onClick={() => openBulkModal()}
            className="px-5 py-2.5 bg-[#0B1A30] hover:bg-[#152E54] text-amber-400 font-bold text-xs sm:text-sm rounded-xl transition-colors shrink-0"
          >
            Submit RFP / Tender Spec
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading tender capabilities...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tenders.map((tender) => (
              <div
                key={tender.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {tender.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tender.year}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-heading">
                    {tender.title}
                  </h3>

                  <div className="text-xs text-slate-600">
                    Issuing Authority: <strong className="text-slate-800">{tender.issuingOrganization}</strong>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {tender.caseStudySnippet}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{tender.status}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => openBulkModal()}
                    className="text-amber-600 hover:text-amber-700 font-bold inline-flex items-center gap-1"
                  >
                    <span>Request Quotation</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Direct Contact Callout */}
      <div className="bg-[#0B1A30] text-white p-8 sm:p-10 rounded-3xl border-2 border-amber-400 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-bold font-serif-heading text-white">
            Have a Govt. Tender or Institutional RFP?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Contact Monojit Dey directly for pre-bid technical specs, physical sample presentation, and competitive tier rate estimates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Call {phone}</span>
          </a>
          <button
            type="button"
            onClick={() => openBulkModal()}
            className="px-5 py-3 bg-[#152E54] hover:bg-[#1E3E6B] text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-600 transition-colors"
          >
            Upload Tender Spec Sheet
          </button>
        </div>
      </div>

    </div>
  );
};
