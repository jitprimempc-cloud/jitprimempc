import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, Calendar, Award, X, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { GovernmentTender } from '../../types';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

export const AdminTendersTab: React.FC = () => {
  const [tenders, setTenders] = useState<GovernmentTender[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTender, setEditingTender] = useState<GovernmentTender | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<Partial<GovernmentTender>>({
    title: '',
    issuingOrganization: 'Directorate of MSME, Govt. of West Bengal',
    year: '2024',
    category: 'Mementos & Awards',
    caseStudySnippet: '',
    status: 'Successfully Executed & Certified',
    hidden: false
  });

  const loadTenders = async () => {
    setLoading(true);
    try {
      const data = await api.getTenders(true);
      setTenders(data);
    } catch (err) {
      console.error('Failed to load tenders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenders();
  }, []);

  const handleOpenAdd = () => {
    setEditingTender(null);
    setFormData({
      title: '',
      issuingOrganization: '',
      year: new Date().getFullYear().toString(),
      category: 'Tender Supply',
      caseStudySnippet: '',
      status: 'Ready for RFP / Active Capability',
      hidden: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: GovernmentTender) => {
    setEditingTender(t);
    setFormData({
      ...t,
      title: t.title || '',
      issuingOrganization: t.issuingOrganization || '',
      year: t.year || '',
      category: t.category || '',
      caseStudySnippet: t.caseStudySnippet || '',
      status: t.status || 'Successfully Executed',
      hidden: t.hidden || false
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (t: GovernmentTender) => {
    setDeleteTarget({ id: t.id, name: t.title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteTender(deleteTarget.id);
      setTenders(prev => prev.filter(t => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('টেন্ডার রেকর্ড মুছতে সমস্যা হয়েছে');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTender) {
        const updated = await api.updateTender(editingTender.id, formData);
        setTenders(prev => prev.map(t => t.id === editingTender.id ? updated : t));
      } else {
        const created = await api.createTender(formData);
        setTenders(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
            Government Tenders & Institutional Projects ({tenders.length})
          </h2>
          <p className="text-xs text-slate-500">
            Showcase procurement track records, compliance credentials, and executed institutional supplies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tender Record</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tenders.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {t.category}
                </span>
                <span className="text-slate-500">{t.year}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900">{t.title}</h3>
              <p className="text-xs text-slate-600 font-medium">Organization: {t.issuingOrganization}</p>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">{t.caseStudySnippet}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t.status}</span>
              </span>
              <div className="space-x-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(t)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="টেন্ডার রেকর্ড মুছে ফেলা (Delete Tender)"
        itemName={deleteTarget?.name}
        message="আপনি কি নিশ্চিত যে এই সরকারি টেন্ডার রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="bg-[#0B1A30] text-white p-5 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-base font-serif-heading">
                {editingTender ? 'Edit Tender Record' : 'Add Tender Record'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project / Tender Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    value={formData.issuingOrganization || ''}
                    onChange={e => setFormData({ ...formData, issuingOrganization: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year / Timeline</label>
                  <input
                    type="text"
                    value={formData.year || ''}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Procurement Category</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Execution / Capability Summary</label>
                <textarea
                  rows={3}
                  value={formData.caseStudySnippet || ''}
                  onChange={e => setFormData({ ...formData, caseStudySnippet: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Badge</label>
                <input
                  type="text"
                  value={formData.status || ''}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
