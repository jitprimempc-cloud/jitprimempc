import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, ArrowLeft, Clock } from 'lucide-react';
import { api } from '../services/api';
import { LegalPage } from '../types';

interface LegalPageViewerProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const LegalPageViewer: React.FC<LegalPageViewerProps> = ({ slug, onNavigate }) => {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [allPages, setAllPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cur, all] = await Promise.all([
          api.getLegalPage(slug),
          api.getLegalPages()
        ]);
        setPage(cur);
        setAllPages(all);
      } catch (err) {
        console.error('Failed to load legal page:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 text-center max-w-4xl mx-auto px-4">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-2">Loading legal policies...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-8">
      
      {/* Top back button */}
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      {/* Policy switcher tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {allPages.map(p => (
          <button
            key={p.slug}
            type="button"
            onClick={() => onNavigate(`/legal/${p.slug}`)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              p.slug === slug
                ? 'bg-[#0B1A30] text-amber-400 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Page Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Policy &bull; Jit Prime MPC Company</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-heading text-slate-900">
            {page?.title || "Legal Document"}
          </h1>
          {page?.lastUpdated && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {page.lastUpdated}</span>
            </p>
          )}
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-700">
          {page?.content || "Policy content is currently being finalized."}
        </div>
      </div>

    </div>
  );
};
