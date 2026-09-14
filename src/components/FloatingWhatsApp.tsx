import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useApp();
  const phone = settings?.whatsappNumber || '+91 82405 85219';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = encodeURIComponent("Hello Monojit Dey, I would like to inquire about bulk handcrafted products from Jit Prime MPC Company.");

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <a
        href={`https://wa.me/${cleanPhone}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-white"
        aria-label="Chat with Monojit Dey on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
        </div>
        <div className="hidden sm:block text-left">
          <span className="block text-[11px] font-semibold text-emerald-100 uppercase tracking-wider leading-none">
            Chat on WhatsApp
          </span>
          <span className="block text-xs font-bold text-white">
            Monojit Dey
          </span>
        </div>
      </a>
    </div>
  );
};
