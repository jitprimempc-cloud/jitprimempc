import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  MapPin, 
  Award, 
  Heart, 
  ArrowRight, 
  Layers, 
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Artisan } from '../types';

interface ArtisansPageProps {
  onNavigate: (route: string) => void;
}

export const ArtisansPage: React.FC<ArtisansPageProps> = ({ onNavigate }) => {
  const { openBulkModal } = useApp();

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getArtisans(false);
        setArtisans(data);
      } catch (err) {
        console.error('Failed to load artisans:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0B1A30] to-[#142C4F] rounded-3xl p-8 sm:p-12 text-white border-2 border-amber-400 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Empowerment Through Authentic Craftsmanship</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-heading">
            Our Artisans &bull; The Hands Behind the Craft
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every piece from Jit Prime MPC Company is crafted by skilled women artisans across West Bengal. Through structured training and market-linked bulk orders, we create dignified income opportunities without relying on false guarantees.
          </p>
        </div>
      </div>

      {/* Artisans Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading artisan profiles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Photo */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={artisan.photo}
                  alt={artisan.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0B1A30]/90 text-amber-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-xs">
                  {artisan.experienceYears}+ Years Experience
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{artisan.broadLocation}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                    {artisan.craft}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                    {artisan.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    &ldquo;{artisan.story}&rdquo;
                  </p>
                </div>

                <div>
                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 mb-4">
                    {artisan.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-amber-50 text-amber-900 text-[10px] font-semibold rounded border border-amber-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedArtisan(artisan)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Read Artisan Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artisan Detail Modal */}
      {selectedArtisan && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative">
            <button
              type="button"
              onClick={() => setSelectedArtisan(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/40 text-white hover:bg-slate-900 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/9 bg-slate-900 relative">
              <img
                src={selectedArtisan.photo}
                alt={selectedArtisan.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-amber-400 text-xs font-bold uppercase">{selectedArtisan.craft}</span>
                <h3 className="text-xl font-bold text-white">{selectedArtisan.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span>Location: <strong>{selectedArtisan.broadLocation}</strong></span>
                <span>Craft Experience: <strong>{selectedArtisan.experienceYears} Years</strong></span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Artisan Background & Journey</h4>
                <p className="leading-relaxed text-slate-600 italic">
                  &ldquo;{selectedArtisan.story}&rdquo;
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Mastered Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArtisan.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-semibold rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => { setSelectedArtisan(null); openBulkModal(); }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  Order Handcrafted Products by this Cluster
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA for Women Crafters */}
      <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900 font-serif-heading">
          Are You a Woman Artisan or Looking to Learn a Craft?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          We organize practical workshop batches where you learn quality finishing, standard sizing, and production discipline to access genuine market demand.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/training-livelihood')}
          className="px-6 py-3 bg-[#0B1A30] hover:bg-[#152E54] text-amber-400 font-bold text-xs sm:text-sm rounded-xl transition-all inline-flex items-center gap-2"
        >
          <span>Explore Training Programs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
