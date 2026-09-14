import React, { useState, useEffect } from 'react';
import { Upload, Copy, Check, Trash2, Image, FileText, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { MediaFile } from '../../types';

export const AdminMediaTab: React.FC = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await api.getMediaFiles();
      setMedia(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await api.uploadFile(file);
        if (res.file) {
          setMedia(prev => [res.file, ...prev]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this media file?')) return;
    try {
      await api.deleteMediaFile(id);
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
            Media & File Asset Library ({media.length})
          </h2>
          <p className="text-xs text-slate-500">
            Upload images and spec documents directly from your device (Mobile, Tablet, Desktop).
          </p>
        </div>

        <label className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto transition-colors">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading Files...' : 'Upload Files from Device'}</span>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleUploadFiles}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of uploaded items */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading media library...</div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Image className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">No Media Uploaded Yet</h3>
          <p className="text-xs text-slate-500">Upload photos of handicraft batches, artisan workshops, or product specs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
            >
              <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {item.mimeType?.startsWith('image/') || item.url.startsWith('data:image') || item.url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) ? (
                  <img
                    src={item.url}
                    alt={item.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.endsWith('/logo.svg')) target.src = '/logo.svg';
                    }}
                  />
                ) : (
                  <FileText className="w-10 h-10 text-slate-400" />
                )}
              </div>

              <div className="p-2.5 space-y-1.5 text-[11px]">
                <p className="font-semibold text-slate-800 truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>{(item.size / 1024).toFixed(0)} KB</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.url, item.id)}
                      className="p-1 hover:text-amber-600 rounded"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
