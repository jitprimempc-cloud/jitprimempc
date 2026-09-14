import React from 'react';
import { 
  Globe2, 
  Sparkles, 
  ShieldCheck, 
  Plane, 
  PackageCheck, 
  FileText, 
  ArrowRight, 
  AlertCircle,
  MessageCircle,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface InternationalBuyersPageProps {
  onNavigate: (route: string) => void;
}

export const InternationalBuyersPage: React.FC<InternationalBuyersPageProps> = ({ onNavigate }) => {
  const { settings, openBulkModal } = useApp();
  const phone = settings?.phone || '+91 82405 85219';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 space-y-14">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0B1A30] to-[#142C4F] rounded-3xl p-8 sm:p-12 text-white border-2 border-amber-400 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Globe2 className="w-4 h-4 text-amber-400" />
            <span>Global Export & Overseas Boutiques</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-heading">
            Indian Craft &bull; Ready for Global Buyers
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Connecting overseas retail stores, ethical lifestyle brands, and cultural importers directly with authentic Bengali artisan clusters.
          </p>
        </div>
      </div>

      {/* Mandatory Quotation & Freight Notice */}
      <div className="bg-amber-50 border-2 border-amber-400/70 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-slate-800">
          <h4 className="font-bold text-amber-950 uppercase tracking-wider">
            Important Export Quotation Notice
          </h4>
          <p className="leading-relaxed">
            International shipping, duties, documentation, customs clearance, and delivery timelines are confirmed according to the product type, order volume, destination country, and formally agreed commercial quotation.
          </p>
        </div>
      </div>

      {/* Export Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Multi-Layer Export Packaging</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Individual bubble packaging, moisture-barrier wrapping, cellular partitioned boxes, and reinforced master cartons engineered for international air/sea freight.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Plane className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Pre-Production Sample Dispatch</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Courier dispatch of physical prototypes for buyer sign-off, color approval, and packaging confirmation prior to full production run.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Custom Private Labeling</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bespoke backer cards, custom hangtags, barcodes, engraved brass logos, and specialized gift packaging tailored to your brand identity.
          </p>
        </div>
      </div>

      {/* International Ordering Process */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">
            Clear Four-Step Workflow
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-heading">
            How International Orders Work
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-amber-600 font-bold text-xs">STEP 1</span>
            <h4 className="font-bold text-sm text-slate-900">Requirement Submission</h4>
            <p className="text-xs text-slate-600">
              Submit product choices, target quantities, and destination port/city.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-amber-600 font-bold text-xs">STEP 2</span>
            <h4 className="font-bold text-sm text-slate-900">Sample & Proforma</h4>
            <p className="text-xs text-slate-600">
              Receive formal proforma invoice with freight estimates and courier sample review.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-amber-600 font-bold text-xs">STEP 3</span>
            <h4 className="font-bold text-sm text-slate-900">Handcraft Production</h4>
            <p className="text-xs text-slate-600">
              Artisan clusters manufacture order with batch photo/video updates.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-amber-600 font-bold text-xs">STEP 4</span>
            <h4 className="font-bold text-sm text-slate-900">Secure Dispatch</h4>
            <p className="text-xs text-slate-600">
              Final inspection, export packing, tracking documentation, and customs handover.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => openBulkModal()}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Initiate International Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
