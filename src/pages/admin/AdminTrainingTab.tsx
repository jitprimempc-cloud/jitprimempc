import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen, Users, MessageCircle, Clock, MapPin, X, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { TrainingProgram, TrainingApplication } from '../../types';

export const AdminTrainingTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'programs' | 'applications'>('programs');
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [applications, setApplications] = useState<TrainingApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Program form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [formData, setFormData] = useState<Partial<TrainingProgram>>({
    title: '',
    craftFocus: 'Terracotta Sculpting & Moulding',
    duration: '15 Days (Intensive)',
    batchSize: '20 Crafters',
    eligibility: 'Women crafters and beginners in West Bengal',
    location: 'Belghoria Workshop Hub, Kolkata',
    description: '',
    registrationOpen: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [progs, apps] = await Promise.all([
        api.getTrainingPrograms(true),
        api.getTrainingApplications()
      ]);
      setPrograms(progs);
      setApplications(apps);
    } catch (err) {
      console.error('Failed to load training data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProgram(null);
    setFormData({
      title: '',
      craftFocus: 'Terracotta Jewellery Crafting',
      duration: '10 Days',
      batchSize: '15 Crafters',
      eligibility: 'Women in North 24 Parganas and Kolkata',
      location: 'Nimta / Belghoria Workshop Hub',
      description: '',
      registrationOpen: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: TrainingProgram) => {
    setEditingProgram(p);
    setFormData({
      ...p,
      title: p.title || '',
      craftFocus: p.craftFocus || '',
      duration: p.duration || '',
      batchSize: p.batchSize || '',
      eligibility: p.eligibility || '',
      location: p.location || '',
      description: p.description || '',
      registrationOpen: p.registrationOpen ?? true
    });
    setIsModalOpen(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm('Delete this program?')) return;
    try {
      await api.deleteTrainingProgram(id);
      setPrograms(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        const updated = await api.updateTrainingProgram(editingProgram.id, formData);
        setPrograms(prev => prev.map(p => p.id === editingProgram.id ? updated : p));
      } else {
        const created = await api.createTrainingProgram(formData);
        setPrograms(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleUpdateAppStatus = async (id: string, status: any) => {
    try {
      const updated = await api.updateTrainingApplication(id, { status });
      setApplications(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and SubTab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
            Training & Livelihood Management
          </h2>
          <p className="text-xs text-slate-500">
            Organize artisan workshop batches and review crafter applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('programs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              subTab === 'programs' ? 'bg-[#0B1A30] text-amber-400' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Programs ({programs.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('applications')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              subTab === 'applications' ? 'bg-[#0B1A30] text-amber-400' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Applications ({applications.length})
          </button>
        </div>
      </div>

      {subTab === 'programs' ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Program</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map(prog => (
              <div key={prog.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {prog.craftFocus}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${prog.registrationOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {prog.registrationOpen ? 'Registration Open' : 'Closed'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{prog.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{prog.description}</p>
                  
                  <div className="text-xs text-slate-500 pt-2 space-y-1">
                    <div>Duration: <strong className="text-slate-700">{prog.duration}</strong></div>
                    <div>Batch Size: <strong className="text-slate-700">{prog.batchSize}</strong></div>
                    <div>Location: <strong className="text-slate-700">{prog.location}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prog)}
                    className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProgram(prog.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Applicant Name</th>
                  <th className="p-3.5">Phone / WhatsApp</th>
                  <th className="p-3.5">Location & Age</th>
                  <th className="p-3.5">Prior Experience</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5 font-bold text-slate-900">{app.applicantName}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{app.phone}</td>
                    <td className="p-3.5 text-slate-600">{app.location || 'Kolkata'} {app.age ? `(${app.age} yrs)` : ''}</td>
                    <td className="p-3.5 text-slate-700">{app.craftInterest || app.message || 'General Craft'}</td>
                    <td className="p-3.5">
                      <select
                        value={app.status || 'New'}
                        onChange={e => handleUpdateAppStatus(app.id, e.target.value)}
                        className="text-[11px] font-semibold bg-slate-100 border border-slate-300 rounded px-2 py-1 outline-hidden"
                      >
                        <option value="New">New</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Waitlisted">Waitlisted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <a
                        href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${app.applicantName}, this is Monojit Dey from Jit Prime MPC Company regarding your training application.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Chat</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Program Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="bg-[#0B1A30] text-white p-5 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-base font-serif-heading">
                {editingProgram ? 'Edit Training Program' : 'Create Training Program'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Program Title *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Craft Focus</label>
                  <input
                    type="text"
                    value={formData.craftFocus || ''}
                    onChange={e => setFormData({ ...formData, craftFocus: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Size</label>
                  <input
                    type="text"
                    value={formData.batchSize || ''}
                    onChange={e => setFormData({ ...formData, batchSize: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={formData.eligibility || ''}
                  onChange={e => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Syllabus Overview</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.registrationOpen}
                    onChange={e => setFormData({ ...formData, registrationOpen: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Registration is Open</span>
                </label>
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
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
