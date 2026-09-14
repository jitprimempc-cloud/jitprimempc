import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MessageCircle, 
  Phone, 
  Mail, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Paperclip, 
  Plus, 
  X,
  Building,
  Globe,
  Tag,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';
import { BulkEnquiryLead, LeadPriority, LeadStatus } from '../../types';

export const AdminLeadsTab: React.FC = () => {
  const [leads, setLeads] = useState<BulkEnquiryLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const [selectedLead, setSelectedLead] = useState<BulkEnquiryLead | null>(null);
  const [newNote, setNewNote] = useState('');

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      const updated = await api.updateLead(id, { status: newStatus });
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(updated);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleUpdatePriority = async (id: string, newPriority: LeadPriority) => {
    try {
      const updated = await api.updateLead(id, { priority: newPriority });
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(updated);
      }
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  const handleAddNote = async (id: string) => {
    if (!newNote.trim()) return;
    try {
      const updated = await api.addLeadNote(id, newNote.trim(), 'Monojit Dey');
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
      setSelectedLead(updated);
      setNewNote('');
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    try {
      await api.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Company', 'Country', 'WhatsApp', 'Email', 'Product', 'Quantity', 'Status', 'Priority', 'Notes'];
    const rows = filteredLeads.map(l => [
      l.id,
      l.createdAt,
      `"${l.name}"`,
      `"${l.companyName}"`,
      `"${l.country}"`,
      `"${l.whatsapp}"`,
      `"${l.email || ''}"`,
      `"${l.productOrCategory}"`,
      `"${l.quantity}"`,
      l.status,
      l.priority,
      `"${(l.notes || []).map(n => n.text).join('; ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jit-prime-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = !search || 
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.companyName.toLowerCase().includes(search.toLowerCase()) ||
      l.whatsapp.includes(search) ||
      l.productOrCategory.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || l.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
            B2B Leads & Commercial Enquiries ({filteredLeads.length})
          </h2>
          <p className="text-xs text-slate-500">
            Track inquiries, update sales pipeline status, assign priority, and add internal notes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Bengali Quick Guide Box */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-slate-700 flex items-start gap-2.5">
        <div className="p-1 bg-amber-100 text-amber-800 rounded shrink-0 mt-0.5">
          <BookOpen className="w-3.5 h-3.5" />
        </div>
        <div className="leading-relaxed">
          <strong className="text-slate-900 font-bold">বাংলা গাইড (B2B Leads):</strong> ওয়েবসাইট থেকে কোনো ক্রেতা যখন বাল্ক কোটেশনের অনুরোধ পাঠায়, তা এখানে স্বয়ংক্রিয়ভাবে তালিকাভুক্ত হয়। ক্রেতার নাম বা চোখের আইকনে ক্লিক করে বিস্তারিত দেখুন এবং কথা বলার পর স্টেটাস আপডেট (NEW &rarr; CONTACTED &rarr; WON) করুন।
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search || ''}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-hidden focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter || 'ALL'}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="QUOTATION SENT">QUOTATION SENT</option>
              <option value="NEGOTIATION">NEGOTIATION</option>
              <option value="WON">WON</option>
              <option value="LOST">LOST</option>
              <option value="FOLLOW-UP">FOLLOW-UP</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500">Priority:</span>
            <select
              value={priorityFilter || 'ALL'}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="VERY HIGH">VERY HIGH</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Buyer & Business</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Product & Volume</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      lead.priority === 'VERY HIGH' ? 'bg-red-100 text-red-700 border border-red-200' :
                      lead.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.priority}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{lead.name}</span>
                    <span className="text-[11px] text-slate-500">{lead.companyName} ({lead.country})</span>
                  </td>

                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800 block">{lead.whatsapp}</span>
                      {lead.email && <span className="text-[10px] text-slate-500 block">{lead.email}</span>}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="font-medium text-slate-900 block">{lead.productOrCategory}</span>
                    <span className="text-[11px] text-amber-700 font-bold">Qty: {lead.quantity}</span>
                    {lead.couponCode && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-mono font-bold px-1.5 py-0.5 rounded block w-fit mt-1 border border-amber-200">
                        🏷️ {lead.couponCode} {lead.discountAmount ? `(-₹${lead.discountAmount})` : ''}
                      </span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <select
                      value={lead.status || 'NEW'}
                      onChange={e => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                      className="text-[11px] font-semibold bg-slate-100 border border-slate-300 rounded px-2 py-1 outline-hidden"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="QUOTATION SENT">QUOTATION SENT</option>
                      <option value="NEGOTIATION">NEGOTIATION</option>
                      <option value="WON">WON</option>
                      <option value="LOST">LOST</option>
                      <option value="FOLLOW-UP">FOLLOW-UP</option>
                    </select>
                  </td>

                  <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-lg"
                      title="View Lead Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.name}, this is Monojit Dey from Jit Prime MPC Company regarding your inquiry for ${lead.productOrCategory}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                      title="Direct WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-linear-to-r from-[#0B1A30] to-[#152E54] text-white p-5 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold text-xs uppercase">{selectedLead.priority} PRIORITY</span>
                  <span className="text-slate-400 text-xs">&bull;</span>
                  <span className="text-xs text-slate-300">Status: {selectedLead.status}</span>
                </div>
                <h3 className="font-bold text-lg font-serif-heading">{selectedLead.name} - {selectedLead.companyName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              
              {/* Quick Contact & WhatsApp Bar */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-emerald-800 font-bold uppercase block">Contact Number</span>
                  <span className="text-base font-extrabold text-emerald-950">{selectedLead.whatsapp}</span>
                </div>
                <a
                  href={`https://wa.me/${selectedLead.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedLead.name}, this is Monojit Dey from Jit Prime MPC Company regarding your inquiry for ${selectedLead.productOrCategory}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp Conversation</span>
                </a>
              </div>

              {/* Requirement Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase block">Product / Craft</span>
                  <strong className="text-slate-900 text-sm">{selectedLead.productOrCategory}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase block">Quantity Required</span>
                  <strong className="text-slate-900 text-sm">{selectedLead.quantity}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase block">Destination City</span>
                  <strong className="text-slate-900">{selectedLead.destination || 'Not Specified'} ({selectedLead.country})</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase block">Delivery Target Date</span>
                  <strong className="text-slate-900">{selectedLead.requiredDeliveryDate || 'Standard Timeline'}</strong>
                </div>
              </div>

              {/* Customization & Private Labeling */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Customization & Branding</h4>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-xs">
                  <p><strong>Private Labeling:</strong> {selectedLead.privateLabelBranding ? 'YES (Requested)' : 'No'}</p>
                  {selectedLead.customizationRequirement && (
                    <p><strong>Customization Details:</strong> {selectedLead.customizationRequirement}</p>
                  )}
                  {selectedLead.packagingRequirement && (
                    <p><strong>Packaging Specs:</strong> {selectedLead.packagingRequirement}</p>
                  )}
                </div>
              </div>

              {/* Applied Coupon & Pricing Estimate */}
              {(selectedLead.couponCode || selectedLead.estimatedTotal) && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-amber-800 font-bold uppercase block">Applied Promo / Coupon</span>
                    <strong className="text-sm font-mono text-slate-900">{selectedLead.couponCode || 'None'}</strong>
                    {selectedLead.discountAmount && (
                      <span className="text-emerald-700 font-bold block mt-0.5">Discount: -₹{selectedLead.discountAmount.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  {selectedLead.estimatedTotal && (
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 font-bold uppercase block">Estimated Net Value</span>
                      <strong className="text-base font-black text-slate-950">₹{selectedLead.estimatedTotal.toLocaleString('en-IN')}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Message from client */}
              {selectedLead.message && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Client Message</h4>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 italic">
                    &ldquo;{selectedLead.message}&rdquo;
                  </div>
                </div>
              )}

              {/* Attachment */}
              {selectedLead.fileAttachment && (
                <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Paperclip className="w-4 h-4 text-amber-600" />
                    <span>Attached Technical / Reference Spec File</span>
                  </span>
                  <a
                    href={selectedLead.fileAttachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 hover:bg-slate-50"
                  >
                    View File
                  </a>
                </div>
              )}

              {/* Internal Notes Section */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="font-bold text-slate-900">Internal Sales Team Notes</h4>
                
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {(selectedLead.notes || []).map((note, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <strong className="text-slate-700">{note.author}</strong>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-slate-800">{note.text}</p>
                    </div>
                  ))}
                  {(!selectedLead.notes || selectedLead.notes.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add follow-up notes, quoted rates, callback reminders..."
                    value={newNote || ''}
                    onChange={e => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddNote(selectedLead.id)}
                    className="px-4 py-2 bg-[#0B1A30] text-amber-400 font-bold text-xs rounded-xl shrink-0"
                  >
                    Add Note
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
