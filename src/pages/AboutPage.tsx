import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  Award, 
  Users, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle, 
  Briefcase,
  Maximize2,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TeamMember } from '../types';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings, openBulkModal } = useApp();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; title?: string; subtitle?: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    api.getTeam(false)
      .then(data => {
        if (mounted) {
          setTeamMembers(data || []);
          setLoadingTeam(false);
        }
      })
      .catch(err => {
        console.error('Failed to load team members:', err);
        if (mounted) setLoadingTeam(false);
      });
    return () => { mounted = false; };
  }, []);

  const phone = settings?.phone || '+91 82405 85219';
  const email = settings?.email || 'monojitdey189@gmail.com';
  const ownerName = settings?.ownerName || 'MONOJIT DEY';
  const companyName = settings?.companyName || 'JIT PRIME MPC COMPANY';
  const fullAddress = settings?.fullAddress || 'Belghoria, Nimta, Khudiram Pally, Near 42 Pally Club, Landmark - Harijon School, Kolkata - 700049, West Bengal, India.';

  const teamSettings = settings?.teamSettings || {
    enabled: true,
    sectionTitle: 'Our Dedicated Team & Leadership',
    sectionSubtitle: 'The skilled artisans, production managers, and master craftspeople powering Jit Prime MPC Company',
    groupPhotoEnabled: true,
    groupPhoto: '',
    groupPhotoTitle: 'Jit Prime MPC Production & Artisan Cluster Team',
    groupPhotoDescription: 'Our united collective of over 40+ rural women artisans and workshop specialists based in Belghoria, Nimta, Kolkata.'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 space-y-16">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0B1A30] to-[#142C4F] rounded-3xl p-8 sm:p-14 text-white border-2 border-amber-400 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>All Govt. Tender &bull; Hasta Shilpa &bull; Wholesale Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-heading">
            About Jit Prime MPC Company
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Founded and led by <span className="text-amber-400 font-bold">{ownerName}</span> in Kolkata, West Bengal, we bridge the gap between traditional Indian handicraft heritage and modern institutional, domestic wholesale, and international markets.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs">
            <span className="bg-[#102441] px-3 py-1.5 rounded-lg border border-slate-700">
              Visiting Card Motto: <strong className="text-amber-300">&ldquo;Your Trust Our Priority&rdquo;</strong>
            </span>
            <span className="bg-[#102441] px-3 py-1.5 rounded-lg border border-slate-700">
              Workshop Hub: <strong className="text-white">Kolkata - 700049</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Leadership & Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-slate-900 group">
            <div className="w-full h-96 sm:h-[420px] bg-slate-950 overflow-hidden relative">
              <img
                src={settings?.aboutPhoto || "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=900&q=80"}
                alt={`${ownerName} - Proprietor & Production Director`}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('unsplash')) {
                    target.src = "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=900&q=80";
                  }
                }}
              />
            </div>
            <div className="p-5 bg-[#0B1A30] text-white">
              <h3 className="font-bold text-lg text-white">{ownerName}</h3>
              <p className="text-xs text-amber-400 font-medium">Proprietor & Production Director</p>
              <p className="text-xs text-slate-300 mt-2">
                &ldquo;Our mission is to establish sustainable production clusters where women artisans gain pride, skill, and genuine market-linked income while institutional buyers receive flawless handcrafted products.&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-heading mb-3">
              Rooted in Bengal&apos;s Rich Artisan Legacy
            </h2>
            <p className="mb-3">
              Jit Prime MPC Company was established with a singular vision: to preserve traditional Hasta Shilpa techniques while introducing standard production planning, strict quality controls, and formal compliance that institutional buyers and government departments require.
            </p>
            <p className="mb-3">
              From our central workshop and assembly hub in Belghoria, Nimta, Kolkata, we manage production schedules across multiple clusters of skilled women artisans specialized in terracotta pottery, terracotta jewellery, Dokra brass castings, natural jute conference bags, and festive Puja artefacts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Child Labour</span>
              </div>
              <p className="text-xs text-slate-500">
                100% ethical production carried out by adult women artisans working in safe, dignified community clusters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fair Production Rates</span>
              </div>
              <p className="text-xs text-slate-500">
                Direct compensation tied to batch completion, ensuring artisans earn fair value without exploitative middlemen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      {teamSettings.enabled !== false && (
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Our Team &bull; আমাদের টিম</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif-heading">
              {teamSettings.sectionTitle || 'Our Dedicated Team & Leadership'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {teamSettings.sectionSubtitle || 'The skilled artisans, production managers, and master craftspeople powering Jit Prime MPC Company.'}
            </p>
          </div>

          {/* All Team Members Group Photo Banner (if enabled & uploaded) */}
          {teamSettings.groupPhotoEnabled && teamSettings.groupPhoto && (
            <div className="rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-xl bg-slate-950 relative group">
              <div className="aspect-21/9 sm:aspect-16/7 max-h-[440px] w-full relative overflow-hidden">
                <img
                  src={teamSettings.groupPhoto}
                  alt={teamSettings.groupPhotoTitle || 'Our Team'}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0B1A30] via-[#0B1A30]/40 to-transparent"></div>
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white space-y-1.5 sm:space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>One Unified Craft Family</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold font-serif-heading text-white">
                    {teamSettings.groupPhotoTitle || 'Jit Prime MPC Production & Artisan Cluster Team'}
                  </h3>
                  {teamSettings.groupPhotoDescription && (
                    <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
                      {teamSettings.groupPhotoDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Team Photos Large Grid (Flipkart Square or YouTube Thumbnail size) */}
          {loadingTeam ? (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              টিম লোড হচ্ছে...
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
              {teamMembers.map((member) => {
                const isWide = (member.aspectRatio || teamSettings.displayLayout) === 'wide';
                const hasDetails = (member.name && member.name !== 'Team Member Photo') || member.role || member.caption || member.bio;
                
                return (
                  <div
                    key={member.id}
                    onClick={() => {
                      if (member.photo) {
                        setLightboxPhoto({
                          url: member.photo,
                          title: member.name || member.caption || 'Our Team Member',
                          subtitle: member.role || member.bio || ''
                        });
                      }
                    }}
                    className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                  >
                    {/* Large Image Frame - Flipkart Product (Square) or YouTube (16:9) */}
                    <div className={`w-full bg-slate-950 relative overflow-hidden ${
                      isWide ? 'aspect-16/9' : 'aspect-square'
                    }`}>
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name || member.caption || 'Team Member'}
                          className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-amber-300/60 p-6 bg-linear-to-br from-[#0B1A30] to-slate-900">
                          <Users className="w-16 h-16 mb-2 opacity-60" />
                          <span className="text-xs font-bold text-slate-300">Jit Prime Team</span>
                        </div>
                      )}

                      {/* Zoom Indicator */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full bg-white/90 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>View Full Image</span>
                        </span>
                      </div>
                    </div>

                    {/* Optional Information / Caption Footer */}
                    {hasDetails && (
                      <div className="p-4 sm:p-5 space-y-1.5 bg-white border-t border-slate-100">
                        {member.name && member.name !== 'Team Member Photo' && (
                          <h3 className="font-bold text-slate-900 text-base font-serif-heading group-hover:text-amber-600 transition-colors">
                            {member.name}
                          </h3>
                        )}
                        {member.role && (
                          <p className="text-xs font-bold text-amber-700">
                            {member.role}
                          </p>
                        )}
                        {member.caption && member.caption !== member.name && (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {member.caption}
                          </p>
                        )}
                        {member.bio && (
                          <p className="text-xs text-slate-500 italic pt-1 line-clamp-2">
                            &ldquo;{member.bio}&rdquo;
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      )}

      {/* Lightbox Modal for Team Photo Zoom */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-400/40"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] w-full flex items-center justify-center bg-black">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title || 'Team Member Photo'}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {(lightboxPhoto.title || lightboxPhoto.subtitle) && (
              <div className="p-5 bg-slate-900 text-white border-t border-slate-800">
                {lightboxPhoto.title && (
                  <h4 className="font-bold text-lg text-amber-300 font-serif-heading">
                    {lightboxPhoto.title}
                  </h4>
                )}
                {lightboxPhoto.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {lightboxPhoto.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workshop Location & Verification */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200">
        <div className="max-w-3xl mb-8 space-y-2">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">
            Verified Physical Location
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-heading">
            Our Kolkata Production & Coordination Center
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Institutional buyers, tender officers, and wholesale clients are welcome to inspect physical samples and discuss custom specifications at our verified address:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <MapPin className="w-6 h-6 text-amber-500 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">Registered Address</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {fullAddress}
            </p>
            <p className="text-[11px] font-semibold text-amber-700 pt-1">
              Landmark: Harijon School &bull; Near 42 Pally Club
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <Phone className="w-6 h-6 text-amber-500 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">Direct Contact</h4>
            <p className="text-xs text-slate-600">
              Speak directly with Monojit Dey for quick order quotes or tender documentation:
            </p>
            <p className="text-sm font-extrabold text-slate-900 pt-1">
              {phone}
            </p>
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline pt-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <Mail className="w-6 h-6 text-amber-500 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">Official Inquiries</h4>
            <p className="text-xs text-slate-600">
              For tender submissions, purchase orders, and commercial contracts:
            </p>
            <p className="text-sm font-extrabold text-slate-900 pt-1 break-all">
              {email}
            </p>
            <span className="text-[11px] text-slate-400 block pt-1">
              Response within 24 business hours
            </span>
          </div>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => openBulkModal()}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Request Custom Quotation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
