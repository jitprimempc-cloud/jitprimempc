import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Edit2, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { WorkerApplication } from '../../types';
import { api } from '../../services/api';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

const STATUS_OPTIONS: Array<WorkerApplication['status']> = [
  'New',
  'Contacted',
  'Shortlisted',
  'Active',
  'Follow-up',
  'Not Suitable'
];

export const AdminWorkersTab: React.FC = () => {
  const [applications, setApplications] = useState<WorkerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkerApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load worker applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: WorkerApplication['status']) => {
    try {
      await api.updateWorkerApplication(id, { status: newStatus });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      await api.updateWorkerApplication(id, { notes: notesText });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, notes: notesText } : a));
      setEditingNotesId(null);
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteWorkerApplication(deleteTarget.id);
      setApplications(prev => prev.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete worker application:', err);
      alert('আবেদনটি মুছতে সমস্যা হয়েছে');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = applications.filter(app => {
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery) ||
      (app.location && app.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.skill && app.skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Artisan &amp; Worker Applications &bull; কারিগর ও মহিলা আবেদনসমূহ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif-heading">
            Women Artisans &amp; Local Craft Workers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            পোড়ামাটির গহনা, কাদামাটি শিল্প ও হস্তশিল্প তৈরির প্রশিক্ষণ ও কাজের জন্য যুক্ত হতে ইচ্ছুক গ্রামীণ মা-বোনেদের আবেদন তালিকা।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold">
            মোট আবেদন: {applications.length}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম, ফোন নম্বর বা এলাকা দিয়ে খুঁজুন..."
            value={searchQuery || ''}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'All'
                ? 'bg-[#0B1A30] text-amber-400'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({applications.length})
          </button>
          {STATUS_OPTIONS.map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0B1A30] text-amber-400'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st} ({applications.filter(a => a.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <p className="text-sm">আবেদনপত্র লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-2">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold">কোনো আবেদন পাওয়া যায়নি।</p>
          <p className="text-xs text-slate-400">
            ওয়েবসাইটের Learn &amp; Earn ফর্ম থেকে মহিলারা আবেদন করলে এখানে সরাসরি জমা পড়বে।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(app => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {app.applicantName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {app.location || 'West Bengal'}
                      </span>
                      {app.createdAt && (
                        <span>&bull; {new Date(app.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={app.status || 'Applied'}
                      onChange={e => handleStatusChange(app.id, e.target.value as any)}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(app.id, app.applicantName)}
                      title="আবেদন মুছে ফেলুন (Delete Application)"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">অভিজ্ঞতা / দক্ষতা:</span>
                    <span className="font-bold text-slate-900">{app.skill || 'নতুন শিখতে আগ্রহী'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">পছন্দের কাজ:</span>
                    <span className="font-bold text-slate-900">{app.craftInterest || 'টেরাকোটা গহনা'}</span>
                  </div>
                  {app.availability && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">কাজের সময়:</span>
                      <span>{app.availability}</span>
                    </div>
                  )}
                  {app.message && (
                    <p className="text-slate-600 italic pt-1 border-t border-slate-200/60 mt-1">
                      &ldquo;{app.message}&rdquo;
                    </p>
                  )}
                </div>

                {/* Internal Admin Notes */}
                <div className="mt-3">
                  {editingNotesId === app.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={notesText || ''}
                        onChange={e => setNotesText(e.target.value)}
                        placeholder="অভ্যন্তরীণ নোট লিখুন (যেমন: ফোনে কথা হয়েছে, আগামী সোমবার কর্মশালায় আসবেন)..."
                        className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                        >
                          বাতিল
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(app.id)}
                          className="px-3 py-1 text-xs bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-600"
                        >
                          নোট সংরক্ষণ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="italic truncate max-w-[240px]">
                        {app.notes ? `নোট: ${app.notes}` : 'কোনো নোট যোগ করা নেই'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNotesId(app.id);
                          setNotesText(app.notes || '');
                        }}
                        className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>নোট দিন</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Call & WhatsApp */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${app.phone}`}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>ফোন করুন ({app.phone})</span>
                </a>

                <a
                  href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`নমস্কার ${app.applicantName}, আমি মনোজিত দে, জিৎ প্রাইম এমপিসি কোম্পানি থেকে বলছি। আমাদের হস্তশিল্প কর্মশালা ও কারিগর তালিকায় আপনার আবেদনের পরিপ্রেক্ষিতে যোগাযোগ করছি।`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="আবেদনপত্র মুছে ফেলা (Delete Application)"
        itemName={deleteTarget?.name}
        message="আপনি কি নিশ্চিত যে এই প্রার্থীর আবেদনপত্রটি তালিকা থেকে স্থায়ীভাবে মুছে ফেলতে চান?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};
