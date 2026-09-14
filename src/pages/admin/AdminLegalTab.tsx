import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Save, 
  Check, 
  Clock, 
  AlertCircle, 
  FileText, 
  Eye, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../../services/api';
import { LegalPage } from '../../types';

export const AdminLegalTab: React.FC = () => {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('terms-and-conditions');
  const [currentEdit, setCurrentEdit] = useState<Partial<LegalPage>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await api.getLegalPages();
      setPages(data);
      const active = data.find(p => p.slug === selectedSlug) || data[0];
      if (active) {
        setSelectedSlug(active.slug);
        setCurrentEdit({ ...active });
      }
    } catch (err: any) {
      setErrorMsg('Failed to load legal pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug);
    const target = pages.find(p => p.slug === slug);
    if (target) {
      setCurrentEdit({ ...target });
    }
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlug) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const updated = await api.updateLegalPage(selectedSlug, {
        title: currentEdit.title,
        content: currentEdit.content,
        lastUpdated: new Date().toISOString().split('T')[0]
      });

      setPages(prev => prev.map(p => p.slug === selectedSlug ? updated : p));
      setCurrentEdit(updated);
      setSuccessMsg(`"${updated.title}" updated and saved successfully!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save legal policy.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <span>Loading legal documents...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Compliance & Terms Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-slate-900">
            Legal Policies & Disclaimers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public Terms, Privacy, Shipping, Refund, Cancellation, and General Disclaimers.
          </p>
        </div>

        <a
          href={`/legal/${selectedSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-slate-600" />
          <span>View Live Policy</span>
        </a>
      </div>

      {/* Advisory Note */}
      <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">Legal & Compliance Notice:</span>
          <span>
            These policies are provided as standard business templates for Jit Prime MPC Company (Proprietor: Monojit Dey). Clients and corporate procurement officers should review terms with their legal advisors for jurisdiction-specific contractual clauses.
          </span>
        </div>
      </div>

      {/* Policy Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {pages.map(p => (
          <button
            key={p.slug}
            type="button"
            onClick={() => handleSelectPage(p.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              selectedSlug === p.slug
                ? 'bg-[#0B1A30] text-amber-400 shadow-sm border border-amber-400/40'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{p.title}</span>
          </button>
        ))}
      </div>

      {/* Main Policy Editor */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Policy Document Title *
            </label>
            <input
              type="text"
              required
              value={currentEdit.title || ''}
              onChange={e => setCurrentEdit({ ...currentEdit, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Last Updated Date
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{currentEdit.lastUpdated || 'Will update automatically upon save'}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Policy Terms & Content (Plain text / Sections) *
          </label>
          <textarea
            rows={14}
            required
            value={currentEdit.content || ''}
            onChange={e => setCurrentEdit({ ...currentEdit, content: e.target.value })}
            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
            placeholder="Enter policy clauses, terms, return conditions, and address notices..."
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            Changes will be reflected immediately on the public website.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Policy...' : 'Save Policy Changes'}</span>
          </button>
        </div>
      </form>

    </div>
  );
};
