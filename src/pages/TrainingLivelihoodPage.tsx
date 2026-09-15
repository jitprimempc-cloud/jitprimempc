import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Clock, 
  MapPin, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TrainingProgram } from '../types';

export const TrainingLivelihoodPage: React.FC = () => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    applicantName: '',
    phone: '',
    age: '',
    broadLocation: '',
    programId: '',
    priorCraftExperience: 'Beginner (No prior experience)',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getTrainingPrograms(false);
        setPrograms(data);
        if (data.length > 0) {
          setForm(prev => ({ ...prev, programId: data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load training programs:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicantName || !form.phone) {
      setError('Please provide your name and phone number.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const selectedProg = programs.find(p => p.id === form.programId);
      await api.submitTrainingApplication({
        programId: form.programId,
        programTitle: selectedProg?.title || 'Artisan Workshop',
        applicantName: form.applicantName,
        phone: form.phone,
        whatsapp: form.phone,
        age: form.age || undefined,
        location: form.broadLocation,
        craftInterest: form.priorCraftExperience,
        message: form.notes
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 space-y-14">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#0B1A30] to-[#142C4F] rounded-3xl p-8 sm:p-12 text-white border-2 border-amber-400 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold border border-amber-300 shadow-xs">
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span>LEARN &amp; EARN INITIATIVE &bull; শিখুন ও উপার্জন করুন</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-heading text-white">
            Learn &amp; Earn: মহিলা কারিগর প্রশিক্ষণ ও নিশ্চিত জীবিকা
          </h1>
          <p className="text-amber-300 font-bold text-base sm:text-lg">
            &ldquo;From Learning a Skill to Earning Dignified Income From Home&rdquo;
          </p>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            বিনামূল্যে হস্তশিল্পের আধুনিক ও ঐতিহ্যবাহী কাজ শিখুন। প্রশিক্ষণ শেষে জিত প্রাইম এমপিসি কোম্পানির মার্কেট ও প্রাতিষ্ঠানিক অর্ডারের মাধ্যমে ঘরে বসেই নিশ্চিত উপার্জনের সুযোগ পান।
          </p>
          <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl text-xs text-amber-200">
            *স্বচ্ছতা প্রতিশ্রুতি: আমরা নিশ্চিত গুণমানের তৈরির পর সরাসরি মার্কেট-লিঙ্কড অর্ডারে কাজ দিই। কাঁচামাল ও প্রশিক্ষণ সহায়তা সম্পূর্ণ বিনামূল্যে প্রদান করা হয়।
          </div>
        </div>
      </div>

      {/* 4 Pillars of Training */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
            01
          </span>
          <h4 className="font-bold text-slate-900 text-sm">Fundamental Craft Skills</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Clay preparation, terracotta moulding, bead shaping, natural pigment blending, and kiln firing safety.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
            02
          </span>
          <h4 className="font-bold text-slate-900 text-sm">Finishing & Symmetry</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mastering uniform sizing, waterproof sealing, smooth edging, and defect elimination for bulk orders.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
            03
          </span>
          <h4 className="font-bold text-slate-900 text-sm">Production Discipline</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Understanding batch deadlines, packing standards, and collaboration in community artisan hubs.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
            04
          </span>
          <h4 className="font-bold text-slate-900 text-sm">Market Access Linkage</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Certified participants are inducted into Jit Prime MPC Company&apos;s active order allocation roster.
          </p>
        </div>
      </div>

      {/* Programs List & Application Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Active Programs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">
              Upcoming Batches
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif-heading">
              Open Training Programs
            </h2>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">Loading training programs...</div>
          ) : (
            <div className="space-y-6">
              {programs.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4 hover:border-amber-400 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-700 uppercase bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      {prog.craftFocus}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {prog.registrationOpen ? "Admissions Open" : "Batch Full"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{prog.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      <span>{prog.batchSize} per batch</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{prog.location}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Eligibility: <strong className="text-slate-800">{prog.eligibility}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(prev => ({ ...prev, programId: prog.id }));
                        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-amber-600 hover:text-amber-700 font-bold inline-flex items-center gap-1"
                    >
                      <span>Apply for Batch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Application Form */}
        <div id="application-form" className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif-heading">
                  Application Received!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you, {form.applicantName}. Our workshop coordinator will contact you on {form.phone} with batch timings and location directions.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-heading">
                    Artisan Workshop Application
                  </h3>
                  <p className="text-xs text-slate-500">
                    Open to women crafters seeking structured skills & commercial order opportunities.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sima Das"
                    value={form.applicantName || ''}
                    onChange={e => setForm({ ...form, applicantName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone || ''}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 28"
                      value={form.age || ''}
                      onChange={e => setForm({ ...form, age: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Area / Locality in West Bengal
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Belghoria, Nimta, Habra, Bankura"
                    value={form.broadLocation || ''}
                    onChange={e => setForm({ ...form, broadLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Prior Craft Experience
                  </label>
                  <select
                    value={form.priorCraftExperience || 'Beginner (No prior experience)'}
                    onChange={e => setForm({ ...form, priorCraftExperience: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Beginner (No prior experience)">Beginner (No prior experience)</option>
                    <option value="Basic knowledge (hobby/homecraft)">Basic knowledge (hobby/homecraft)</option>
                    <option value="Intermediate (practiced for 1-2 years)">Intermediate (practiced for 1-2 years)</option>
                    <option value="Experienced artisan seeking market orders">Experienced artisan seeking market orders</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Notes / Personal Background (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any questions or specific craft interests..."
                    value={form.notes || ''}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
