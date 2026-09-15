import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus, 
  MessageSquare, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Search,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { Testimonial } from '../../types';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

export const AdminTestimonialsTab: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for creating official testimonial
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    clientName: '',
    company: '',
    location: '',
    rating: 5,
    content: '',
    verifiedBuyer: true,
    hidden: false
  });

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await api.getTestimonials(true);
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteTestimonial(deleteTarget.id);
      setTestimonials(prev => prev.filter(t => t.id !== deleteTarget.id));
      setFeedbackMsg({ type: 'success', text: `Review from "${deleteTarget.name}" was successfully deleted.` });
      setTimeout(() => setFeedbackMsg(null), 3000);
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Failed to delete testimonial:', err);
      setFeedbackMsg({ type: 'error', text: 'Failed to delete review: ' + (err.message || 'Unknown error') });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleHide = async (t: Testimonial) => {
    try {
      const updated = await api.updateTestimonial(t.id, { hidden: !t.hidden });
      setTestimonials(prev => prev.map(item => item.id === t.id ? updated : item));
      setFeedbackMsg({
        type: 'success',
        text: updated.hidden 
          ? `Review from "${t.clientName}" is now hidden from the public website.` 
          : `Review from "${t.clientName}" is now visible on the website.`
      });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.content) return;

    try {
      const created = await api.createTestimonial(formData);
      setTestimonials(prev => [created, ...prev]);
      setIsModalOpen(false);
      setFormData({
        clientName: '',
        company: '',
        location: '',
        rating: 5,
        content: '',
        verifiedBuyer: true,
        hidden: false
      });
      setFeedbackMsg({ type: 'success', text: 'Official testimonial added successfully.' });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      console.error('Failed to add testimonial:', err);
      setFeedbackMsg({ type: 'error', text: 'Failed to add review: ' + (err.message || 'Unknown error') });
    }
  };

  const filtered = testimonials.filter(t => {
    const q = searchTerm.toLowerCase();
    return (
      t.clientName.toLowerCase().includes(q) ||
      (t.company && t.company.toLowerCase().includes(q)) ||
      (t.location && t.location.toLowerCase().includes(q)) ||
      t.content.toLowerCase().includes(q)
    );
  });

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6">
      
      {/* Header & Instructions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-800">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-serif-heading">
                Client Reviews & Feedback (গ্রাহকদের রিভিউ ও ফিডব্যাক)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              গ্রাহকরা হোমপেজে &ldquo;Write a Review&rdquo; বাটনে ক্লিক করে যে রিভিউ দিচ্ছেন তা এখানে দেখতে পাবেন এবং অ্যাডমিন চাইলে যেকোনো সময় ডিলিট করতে পারবেন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadTestimonials}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Official Testimonial</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Total Reviews</span>
            <span className="text-lg font-black text-slate-900">{testimonials.length}</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-[11px] font-bold text-amber-700 uppercase block">Average Rating</span>
            <span className="text-lg font-black text-amber-900 flex items-center gap-1">
              {averageRating} <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-700 uppercase block">Active on Website</span>
            <span className="text-lg font-black text-emerald-900">
              {testimonials.filter(t => !t.hidden).length}
            </span>
          </div>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200">
            <span className="text-[11px] font-bold text-red-700 uppercase block">Hidden / Inactive</span>
            <span className="text-lg font-black text-red-900">
              {testimonials.filter(t => t.hidden).length}
            </span>
          </div>
        </div>

        {feedbackMsg && (
          <div className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm || ''}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by client name, company, city, content..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-500"
          />
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
          <p className="text-xs">Loading client reviews...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200 space-y-2">
          <MessageSquare className="w-8 h-8 mx-auto text-slate-400" />
          <h4 className="font-bold text-sm text-slate-700">No Reviews Found</h4>
          <p className="text-xs max-w-sm mx-auto">
            {searchTerm ? 'No reviews match your search query.' : 'There are no client reviews yet. Clients can submit reviews from the homepage.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(t => (
            <div 
              key={t.id} 
              className={`bg-white rounded-2xl p-5 border transition-all ${
                t.hidden ? 'border-slate-300 opacity-60 bg-slate-50' : 'border-slate-200 shadow-xs hover:border-amber-300'
              } flex flex-col justify-between space-y-3`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-1">
                      {t.rating || 5}/5
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {t.hidden ? (
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                        Hidden
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Live on Site
                      </span>
                    )}
                    {t.verifiedBuyer && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 italic mt-3 leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-slate-900 block">
                    {t.clientName}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {[t.company, t.location].filter(Boolean).join(' • ') || 'Customer Review'}
                  </span>
                  {t.createdAt && (
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Admin Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleHide(t)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors text-xs flex items-center gap-1"
                    title={t.hidden ? "Make Visible on Website" : "Hide from Website"}
                  >
                    {t.hidden ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                    <span className="hidden sm:inline">{t.hidden ? 'Show' : 'Hide'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(t.id, t.clientName)}
                    className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs flex items-center gap-1 font-bold cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="রিভিউ মুছে ফেলা (Delete Testimonial)"
        itemName={deleteTarget?.name}
        message="আপনি কি নিশ্চিত যে এই কাস্টমার রিভিউটি স্থায়ীভাবে মুছে ফেলতে চান?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Add Official Testimonial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0B1A30] text-white p-4 border-b-2 border-amber-400 flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base font-serif-heading">
                Add Official Client Testimonial
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Client / Buyer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName || ''}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Smt. Sumana Sen"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Banga Sanskritik Samiti"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Kolkata / USA"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Star Rating (1 to 5)
                  </label>
                  <select
                    value={formData.rating ?? 5}
                    onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                    <option value={2}>2 Stars (★★☆☆☆)</option>
                    <option value={1}>1 Star (★☆☆☆☆)</option>
                  </select>
                </div>
                <div className="flex items-center pt-6 gap-2">
                  <input
                    type="checkbox"
                    id="verifiedBuyer"
                    checked={formData.verifiedBuyer || false}
                    onChange={e => setFormData({ ...formData, verifiedBuyer: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300"
                  />
                  <label htmlFor="verifiedBuyer" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Verified Buyer Badge
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Testimonial / Feedback Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content || ''}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the client feedback..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-xs"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
