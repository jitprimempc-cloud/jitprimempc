import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  PhoneCall, 
  Flame, 
  ShieldCheck, 
  Building2, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { BulkEnquiryLead, Product, Artisan, PujaCampaign } from '../../types';

interface AdminDashboardTabProps {
  onSwitchTab: (tab: string) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({ onSwitchTab }) => {
  const [stats, setStats] = useState({
    productsCount: 0,
    leadsCount: 0,
    highPriorityLeads: 0,
    artisansCount: 0,
    trainingApplicationsCount: 0,
    tendersCount: 0,
    campaignActive: false
  });
  const [recentLeads, setRecentLeads] = useState<BulkEnquiryLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prods, leads, artisans, trainingApps, tenders, campaigns] = await Promise.all([
          api.getProducts({ includeHidden: true }),
          api.getLeads(),
          api.getArtisans(true),
          api.getTrainingApplications(),
          api.getTenders(true),
          api.getCampaigns()
        ]);

        const highPriority = leads.filter(l => l.priority === 'HIGH' || l.priority === 'VERY HIGH').length;
        const activeCamp = campaigns.some(c => c.enabled);

        setStats({
          productsCount: prods.length,
          leadsCount: leads.length,
          highPriorityLeads: highPriority,
          artisansCount: artisans.length,
          trainingApplicationsCount: trainingApps.length,
          tendersCount: tenders.length,
          campaignActive: activeCamp
        });

        setRecentLeads(leads.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: any) => {
    try {
      const updated = await api.updateLead(leadId, { status: newStatus });
      setRecentLeads(prev => prev.map(l => l.id === leadId ? updated : l));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#0B1A30] to-[#142C4F] rounded-2xl p-6 sm:p-8 text-white border border-amber-400/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
            Operational Overview
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-white">
            Welcome to Jit Prime MPC Management Panel
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time control over products, high-intent B2B leads, artisan clusters, and campaign timers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSwitchTab('products')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
          >
            + Add New Product
          </button>
          <button
            type="button"
            onClick={() => onSwitchTab('leads')}
            className="px-4 py-2 bg-[#102441] hover:bg-[#18365F] text-white border border-slate-600 font-bold text-xs rounded-xl"
          >
            View All Leads ({stats.leadsCount})
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Products */}
        <div 
          onClick={() => onSwitchTab('products')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Products</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.productsCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            Active in catalogue
          </span>
        </div>

        {/* Priority Leads */}
        <div 
          onClick={() => onSwitchTab('leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Priority Leads</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600">
            {stats.highPriorityLeads}
          </div>
          <span className="text-[11px] text-slate-500">
            {stats.leadsCount} total enquiries
          </span>
        </div>

        {/* Artisans */}
        <div 
          onClick={() => onSwitchTab('artisans')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Women Artisans</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.artisansCount}
          </div>
          <span className="text-[11px] text-slate-500">
            Profiles listed on site
          </span>
        </div>

        {/* Training Applications */}
        <div 
          onClick={() => onSwitchTab('training')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Applications</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.trainingApplicationsCount}
          </div>
          <span className="text-[11px] text-slate-500">
            Crafter registrations
          </span>
        </div>

      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-serif-heading">
              Recent Inquiries & Bulk Quotation Requests
            </h3>
            <p className="text-xs text-slate-500">
              Generated from website forms, product detail pages, and the 3-language AI chatbot.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSwitchTab('leads')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Open All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Client & Company</th>
                <th className="p-3.5">WhatsApp / Phone</th>
                <th className="p-3.5">Requirement</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      lead.priority === 'VERY HIGH' ? 'bg-red-100 text-red-700 border border-red-200' :
                      lead.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.priority}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{lead.name}</span>
                    <span className="text-[11px] text-slate-500">{lead.companyName} &bull; {lead.country}</span>
                  </td>

                  <td className="p-3.5 font-semibold text-slate-800">
                    {lead.whatsapp}
                  </td>

                  <td className="p-3.5 text-slate-700 max-w-xs truncate">
                    {lead.productOrCategory}
                  </td>

                  <td className="p-3.5 font-bold text-slate-900">
                    {lead.quantity}
                  </td>

                  <td className="p-3.5">
                    <select
                      value={lead.status || 'NEW'}
                      onChange={e => handleStatusChange(lead.id, e.target.value)}
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

                  <td className="p-3.5 text-right">
                    <a
                      href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.name}, this is Monojit Dey from Jit Prime MPC Company regarding your inquiry for ${lead.productOrCategory}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
