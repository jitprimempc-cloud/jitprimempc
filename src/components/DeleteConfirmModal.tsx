import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = 'আইটেম মুছে ফেলা নিশ্চিত করুন (Confirm Delete)',
  itemName,
  message,
  confirmText = 'হ্যাঁ, স্থায়ীভাবে মুছুন (Delete)',
  cancelText = 'বাতিল (Cancel)',
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-50 p-6 flex items-start gap-4 border-b border-red-100">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-heading">
              {title}
            </h3>
            <p className="text-xs text-red-700 mt-1 font-medium">
              সতর্কতা: এই কাজটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না (Irreversible Action)
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {itemName && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                নির্বাচিত আইটেম (Target Item):
              </span>
              <p className="text-sm font-bold text-slate-900 break-words">
                &ldquo;{itemName}&rdquo;
              </p>
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {message || 'আপনি কি নিশ্চিত যে আপনি এটি ডাটাবেস ও ওয়েবসাইট থেকে স্থায়ীভাবে মুছে ফেলতে চান?'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isLoading ? 'মুছে ফেলা হচ্ছে...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
