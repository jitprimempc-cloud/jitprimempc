import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, Save, Image, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { PujaCampaign } from '../../types';
import { SingleImageUpload } from '../../components/ImageUploadField';

export const AdminCampaignTab: React.FC = () => {
  const [campaign, setCampaign] = useState<PujaCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const camps = await api.getCampaigns();
        if (camps.length > 0) {
          setCampaign(camps[0]);
        }
      } catch (err) {
        console.error('Failed to load campaign:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await api.updateCampaign(campaign.id, campaign);
      setCampaign(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !campaign) {
    return <div className="py-12 text-center text-xs text-slate-500">Loading campaign settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
          Durga Puja & Festive Bulk Campaign Manager
        </h2>
        <p className="text-xs text-slate-500">
          Control the countdown banner, priority wholesale production booking, and festive incentives across the website.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm">
        
        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Festive campaign successfully updated and live on site!</span>
          </div>
        )}

        {/* Master Toggle */}
        <div className="p-5 bg-amber-50/70 border border-amber-300 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Enable Durga Puja Campaign Banner</h3>
            <p className="text-xs text-slate-600">
              When enabled, a top countdown banner appears across the website.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={campaign.enabled}
              onChange={e => setCampaign({ ...campaign, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Campaign Banner Image Upload */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
          <SingleImageUpload
            label="Campaign Feature / Hero Background Image (Upload from Device)"
            value={campaign.bannerImage || ''}
            onChange={url => setCampaign({ ...campaign, bannerImage: url })}
            aspectRatio="landscape"
          />
        </div>

        {/* Text Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Campaign Headline *</label>
            <input
              type="text"
              required
              value={campaign.title || ''}
              onChange={e => setCampaign({ ...campaign, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Subtitle / Sub-hook</label>
            <input
              type="text"
              value={campaign.subtitle || ''}
              onChange={e => setCampaign({ ...campaign, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* Countdown Target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Production Booking Deadline (Countdown Target) *
            </label>
            <input
              type="datetime-local"
              value={campaign.countdownDeadline ? campaign.countdownDeadline.slice(0, 16) : ''}
              onChange={e => setCampaign({ ...campaign, countdownDeadline: new Date(e.target.value).toISOString() })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Offer / Discount Badge Text</label>
            <input
              type="text"
              value={campaign.offerText || ''}
              onChange={e => setCampaign({ ...campaign, offerText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        {/* Details & CTA */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Full Campaign Description</label>
          <textarea
            rows={3}
            value={campaign.description || ''}
            onChange={e => setCampaign({ ...campaign, description: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">CTA Button Label</label>
            <input
              type="text"
              value={campaign.ctaText || ''}
              onChange={e => setCampaign({ ...campaign, ctaText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">CTA Destination Route</label>
            <input
              type="text"
              value={campaign.ctaLink || ''}
              onChange={e => setCampaign({ ...campaign, ctaLink: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Campaign Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
