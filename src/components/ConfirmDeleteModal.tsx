import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title = 'আইটেম মুছে ফেলতে চান? / Confirm Deletion',
  message = 'আপনি কি নিশ্চিত যে এই রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান? এটি মুছে ফেলার পর আর পুনরুদ্ধার করা যাবে না।',
  itemName,
  confirmText = 'হ্যাঁ, মুছে ফেলুন (Delete)',
  cancelText = 'বাতিল (Cancel)',
  loading = false,
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="confirm-delete-backdrop"
      className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div 
        id="confirm-delete-dialog"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Warning Icon */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {title}
            </h3>
            {itemName && (
              <p className="text-xs font-semibold text-amber-700 bg-amber-50 rounded-md px-2 py-1 mt-1.5 inline-block max-w-full truncate">
                &ldquo;{itemName}&rdquo;
              </p>
            )}
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {message}
            </p>
          </div>

          <button
            type="button"
            id="btn-close-delete-modal"
            disabled={loading}
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            id="btn-cancel-delete"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            id="btn-confirm-delete"
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>মুছে ফেলা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
