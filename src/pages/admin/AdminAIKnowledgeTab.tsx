import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  Sparkles, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { FAQ } from '../../types';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

export const AdminAIKnowledgeTab: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState<Partial<FAQ>>({
    category: 'General',
    question: '',
    answer: '',
    hidden: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const data = await api.getFaqs(true);
      setFaqs(data);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setFormData({
      category: 'Bulk Orders',
      question: '',
      answer: '',
      hidden: false
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      ...faq,
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'Bulk Orders',
      hidden: faq.hidden || false
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (faq: FAQ) => {
    setDeleteTarget({ id: faq.id, name: faq.question });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteFaq(deleteTarget.id);
      setFaqs(prev => prev.filter(f => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete FAQ');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleHidden = async (faq: FAQ) => {
    try {
      const updated = await api.updateFaq(faq.id, { hidden: !faq.hidden });
      setFaqs(prev => prev.map(f => f.id === faq.id ? updated : f));
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      setError('Both Question and Answer are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingFaq) {
        const updated = await api.updateFaq(editingFaq.id, formData);
        setFaqs(prev => prev.map(f => f.id === editingFaq.id ? updated : f));
      } else {
        const created = await api.createFaq(formData);
        setFaqs(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <span>Loading AI Assistant Knowledge...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4" />
            <span>Conversational Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-slate-900">
            AI Assistant Knowledge & FAQs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage standard answers used by both the public FAQ accordion and the live Jit Prime AI Assistant.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#0B1A30] hover:bg-[#152E54] text-amber-400 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Q&A</span>
        </button>
      </div>

      {/* Model & Voice Intelligence Card */}
      <div className="p-5 bg-linear-to-r from-amber-50/90 to-amber-100/60 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              Active Engine: Gemini 2.5 Flash + Knowledge Retrieval
            </span>
          </div>
          <p className="text-xs text-slate-700">
            Supports multi-lingual inquiries in English, Bengali (বাংলা), and Hindi (हिन्दी). Seamlessly handles product recommendations, MOQ inquiries, and owner handoff (+91 82405 85219).
          </p>
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map(f => (
          <div
            key={f.id}
            className={`bg-white rounded-2xl p-5 border ${f.hidden ? 'border-dashed border-slate-300 opacity-60' : 'border-slate-200'} shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-start justify-between gap-4`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                  {f.category}
                </span>
                {f.hidden && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                    Hidden from Public
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {f.question}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {f.answer}
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <button
                type="button"
                onClick={() => handleToggleHidden(f)}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                  f.hidden ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title={f.hidden ? "Make Visible" : "Hide"}
              >
                {f.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => handleOpenEdit(f)}
                className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Edit FAQ"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(f)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete FAQ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="জ্ঞানভাণ্ডারের প্রশ্নোত্তর মুছে ফেলা (Delete FAQ)"
        itemName={deleteTarget?.name}
        message="আপনি কি নিশ্চিত যে এই প্রশ্নোত্তরটি এআই জ্ঞানভাণ্ডার থেকে স্থায়ীভাবে মুছে ফেলতে চান?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-[#0B1A30] text-white p-5 flex items-center justify-between border-b-2 border-amber-400">
              <h3 className="font-bold text-base">
                {editingFaq ? 'Edit Knowledge Item' : 'Add Knowledge Item'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Knowledge Category</label>
                <select
                  value={formData.category || 'Bulk Orders'}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="General">General Inquiries</option>
                  <option value="Bulk Orders">Bulk Orders & Pricing</option>
                  <option value="Artisans">Women Artisans & Workshops</option>
                  <option value="Government">Government Tenders & Institutional</option>
                  <option value="Shipping">Packaging & International Shipping</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question / Prompt *</label>
                <input
                  type="text"
                  required
                  value={formData.question || ''}
                  onChange={e => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. Can you supply 500 brass Dokra mementos for a government conference?"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Verified Answer *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.answer || ''}
                  onChange={e => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide complete, accurate answer for both web FAQ and AI bot..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="faqHidden"
                  checked={formData.hidden || false}
                  onChange={e => setFormData({ ...formData, hidden: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 border-slate-300 focus:ring-amber-400"
                />
                <label htmlFor="faqHidden" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Hide from public FAQ accordion (still retained in AI context)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Knowledge Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
