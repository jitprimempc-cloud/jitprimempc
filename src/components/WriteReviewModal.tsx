import React, { useState } from 'react';
import { X, Star, CheckCircle2, AlertCircle, MessageSquarePlus, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Testimonial } from '../types';
import { useApp } from '../context/AppContext';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (newReview: Testimonial) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const { currentLanguage } = useApp();
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return currentLanguage === 'bn' ? 'অসাধারণ (৫/৫)' : currentLanguage === 'hi' ? 'उत्कृष्ट (५/५)' : 'Outstanding (5/5)';
      case 4:
        return currentLanguage === 'bn' ? 'খুব ভালো (৪/৫)' : currentLanguage === 'hi' ? 'बहुत अच्छा (४/५)' : 'Very Good (4/5)';
      case 3:
        return currentLanguage === 'bn' ? 'ভালো (৩/৫)' : currentLanguage === 'hi' ? 'अच्छा (३/५)' : 'Good (3/5)';
      case 2:
        return currentLanguage === 'bn' ? 'মোটামুটি (২/৫)' : currentLanguage === 'hi' ? 'औसत (२/५)' : 'Fair (2/5)';
      case 1:
        return currentLanguage === 'bn' ? 'উন্নতি প্রয়োজন (১/৫)' : currentLanguage === 'hi' ? 'सुधार की आवश्यकता (१/५)' : 'Needs Improvement (1/5)';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientName.trim()) {
      setError(
        currentLanguage === 'bn'
          ? 'অনুগ্রহ করে আপনার নাম লিখুন।'
          : currentLanguage === 'hi'
          ? 'कृपया अपना नाम लिखें।'
          : 'Please enter your name.'
      );
      return;
    }

    if (!content.trim()) {
      setError(
        currentLanguage === 'bn'
          ? 'অনুগ্রহ করে আপনার মতামত বা রিভিউ লিখুন।'
          : currentLanguage === 'hi'
          ? 'कृपया अपनी प्रतिक्रिया या समीक्षा लिखें।'
          : 'Please write your feedback or review.'
      );
      return;
    }

    setLoading(true);
    try {
      const created = await api.submitClientReview({
        clientName: clientName.trim(),
        company: company.trim(),
        location: location.trim(),
        rating,
        content: content.trim()
      });

      setSuccess(true);
      onReviewSubmitted(created);

      setTimeout(() => {
        setSuccess(false);
        setClientName('');
        setCompany('');
        setLocation('');
        setContent('');
        setRating(5);
        onClose();
      }, 1600);
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0B1A30] text-white p-5 border-b-2 border-amber-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold font-serif-heading text-white">
                {currentLanguage === 'bn' 
                  ? 'গ্রাহক রিভিউ বা মতামত লিখুন' 
                  : currentLanguage === 'hi'
                  ? 'ग्राहक समीक्षा या प्रतिक्रिया लिखें'
                  : 'Write a Client Review'}
              </h3>
              <p className="text-xs text-amber-300">
                {currentLanguage === 'bn'
                  ? 'আপনার মূল্যবান মতামত সরাসরি ওয়েবসাইটে প্রকাশিত হবে'
                  : currentLanguage === 'hi'
                  ? 'आपकी प्रतिक्रिया सीधे वेबसाइट पर प्रकाशित होगी'
                  : 'Your feedback will be published on our website'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-serif-heading">
                {currentLanguage === 'bn' 
                  ? 'ধন্যবাদ! আপনার রিভিউ যুক্ত হয়েছে।' 
                  : currentLanguage === 'hi'
                  ? 'धन्यवाद! आपकी समीक्षा प्रकाशित हो गई है।'
                  : 'Thank You! Your Review is Published.'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                {currentLanguage === 'bn'
                  ? 'আপনার মূল্যবান মতামতের জন্য আমরা কৃতজ্ঞ। এটি আমাদের শিল্প ও সেবার মান বাড়াতে সাহায্য করবে।'
                  : currentLanguage === 'hi'
                  ? 'आपकी मूल्यवान प्रतिक्रिया के लिए हम आभारी हैं।'
                  : 'We truly appreciate your feedback and support for our authentic Bengal artisans.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="space-y-1.5 text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {currentLanguage === 'bn' 
                    ? 'আপনার রেটিং সিলেক্ট করুন' 
                    : currentLanguage === 'hi'
                    ? 'अपनी रेटिंग चुनें'
                    : 'Your Rating'}
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => {
                    const active = (hoverRating !== null ? hoverRating : rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                        aria-label={`${star} Stars`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            active ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-semibold text-amber-700 block">
                  {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
                </span>
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLanguage === 'bn' ? 'আপনার নাম *' : currentLanguage === 'hi' ? 'आपका नाम *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={clientName || ''}
                  onChange={e => setClientName(e.target.value)}
                  placeholder={currentLanguage === 'bn' ? 'যেমন: অনন্যা দাস / রাহুল ব্যানার্জি' : currentLanguage === 'hi' ? 'जैसे: अनन्या दास / राहुल' : 'e.g., Ananya Das / Amit Roy'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {/* Company / Designation & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLanguage === 'bn' 
                      ? 'প্রতিষ্ঠান বা পরিচয় (ঐচ্ছিক)' 
                      : currentLanguage === 'hi'
                      ? 'संस्थान या भूमिका (वैकल्पिक)'
                      : 'Company / Role (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={company || ''}
                    onChange={e => setCompany(e.target.value)}
                    placeholder={currentLanguage === 'bn' ? 'যেমন: বুটিক ওনার / ক্রেতা' : currentLanguage === 'hi' ? 'जैसे: बुटीक मालिक / ग्राहक' : 'e.g., Boutique Owner / Buyer'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLanguage === 'bn' 
                      ? 'শহর বা স্থান (ঐচ্ছিক)' 
                      : currentLanguage === 'hi'
                      ? 'शहर या स्थान (वैकल्पिक)'
                      : 'Location / City (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={location || ''}
                    onChange={e => setLocation(e.target.value)}
                    placeholder={currentLanguage === 'bn' ? 'যেমন: কলকাতা / ঢাকা / লন্ডন' : currentLanguage === 'hi' ? 'जैसे: कोलकाता / दिल्ली / मुंबई' : 'e.g., Kolkata / Delhi / USA'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              {/* Feedback Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentLanguage === 'bn'
                    ? 'আপনার রিভিউ বা অভিজ্ঞতা লিখুন *'
                    : currentLanguage === 'hi'
                    ? 'अपनी समीक्षा या अनुभव लिखें *'
                    : 'Your Feedback / Review *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={content || ''}
                  onChange={e => setContent(e.target.value)}
                  placeholder={
                    currentLanguage === 'bn'
                      ? 'হস্তশিল্প, টেরাকোটা গয়না, পণ্যের ফিনিশিং বা সেবার অভিজ্ঞতা সম্পর্কে লিখুন...'
                      : currentLanguage === 'hi'
                      ? 'हस्तशिल्प, टेराकोटा आभूषण, उत्पाद फिनिशिंग या सेवा अनुभव के बारे में लिखें...'
                      : 'Share your experience regarding product quality, terracotta jewellery, dispatch, or artisan craftsmanship...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {currentLanguage === 'bn' ? 'বাতিল' : currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>
                    {currentLanguage === 'bn' ? 'রিভিউ জমা দিন' : currentLanguage === 'hi' ? 'समीक्षा भेजें' : 'Submit Review'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
