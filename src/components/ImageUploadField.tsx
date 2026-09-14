import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  Link as LinkIcon, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { api } from '../services/api';

interface SingleImageUploadProps {
  label?: string;
  helperText?: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: 'square' | 'wide' | 'avatar';
}

export const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  label,
  helperText,
  value,
  onChange,
  aspectRatio = 'wide'
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.url) {
        onChange(res.url);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
  };

  const handleRemove = () => {
    onChange('');
  };

  const aspectClass = 
    aspectRatio === 'square' ? 'aspect-square max-w-[200px]' :
    aspectRatio === 'avatar' ? 'w-24 h-24 rounded-full' :
    'aspect-video max-w-sm';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}
        
        {/* Toggle between Device Upload & Paste Link */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-[11px]">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
              activeMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3 text-amber-600" />
            <span>Device</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
              activeMode === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3 text-amber-600" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        <div className="relative group rounded-xl border border-slate-200 bg-slate-50 overflow-hidden inline-block shadow-xs">
          <img
            src={value}
            alt="Preview"
            className={`${aspectClass} object-contain bg-white p-1 block`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.endsWith('/logo.svg')) {
                target.src = '/logo.svg';
              }
            }}
          />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-md shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-xs cursor-pointer"
              title="Delete Image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : activeMode === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 rounded-xl p-5 text-center cursor-pointer transition-colors max-w-sm flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 block">
              {uploading ? 'Processing & Compressing...' : 'Click / Tap to Select from Device'}
            </span>
            <span className="text-slate-500 text-[11px]">
              JPG, PNG, WEBP, SVG (Mobile, Tablet, PC)
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-w-md">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.png or /logo.svg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => handleApplyUrl()}
              disabled={!urlInput.trim()}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Paste any direct image link, or use <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-800">/logo.svg</code> for the official brand logo.
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
};

interface MultipleImageUploadProps {
  label?: string;
  images: string[];
  primaryImage: string;
  onImagesChange: (images: string[]) => void;
  onPrimaryChange: (primaryUrl: string) => void;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  label,
  images,
  primaryImage,
  onImagesChange,
  onPrimaryChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const res = await api.uploadMultipleFiles(files);
      if (res.success && res.urls) {
        const updated = [...images, ...res.urls];
        onImagesChange(updated);
        if (!primaryImage && updated.length > 0) {
          onPrimaryChange(updated[0]);
        }
      } else {
        setError('Batch upload failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Multiple upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;
    const clean = urlInput.trim();
    const updated = [...images, clean];
    onImagesChange(updated);
    if (!primaryImage) {
      onPrimaryChange(clean);
    }
    setUrlInput('');
  };

  const handleRemove = (urlToRemove: string) => {
    const updated = images.filter(u => u !== urlToRemove);
    onImagesChange(updated);
    if (primaryImage === urlToRemove) {
      onPrimaryChange(updated[0] || '');
    }
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onImagesChange(copy);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL input' : '+ Add via URL link'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-2.5 bg-slate-100 rounded-xl border border-slate-200">
          <input
            type="url"
            placeholder="Paste image link: https://..."
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => handleAddUrl()}
            disabled={!urlInput.trim()}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of existing gallery images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((url, index) => {
          const isPrimary = url === primaryImage;
          return (
            <div
              key={url + index}
              className={`relative group rounded-xl border-2 overflow-hidden bg-slate-50 aspect-square ${
                isPrimary ? 'border-amber-500 shadow-md' : 'border-slate-200'
              }`}
            >
              <img 
                src={url} 
                alt={`Product ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith('/logo.svg')) target.src = '/logo.svg';
                }}
              />
              
              {isPrimary && (
                <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Primary</span>
                </span>
              )}

              {/* Hover actions overlay */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => onPrimaryChange(url)}
                      className="px-2 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 text-[10px] font-bold rounded shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3 h-3" />
                      <span>Set Primary</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(url)}
                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow-xs ml-auto cursor-pointer"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reorder controls */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveImage(index, 'left')}
                    className="p-1 bg-white/80 hover:bg-white text-slate-800 rounded disabled:opacity-30 cursor-pointer"
                    title="Move left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-white font-semibold">
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => moveImage(index, 'right')}
                    className="p-1 bg-white/80 hover:bg-white text-slate-800 rounded disabled:opacity-30 cursor-pointer"
                    title="Move right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add more button */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 rounded-xl aspect-square flex flex-col items-center justify-center gap-1.5 cursor-pointer p-3 text-center transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <Upload className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            {uploading ? 'Compressing & Uploading...' : 'Upload Images'}
          </span>
          <span className="text-[10px] text-slate-500 leading-tight">
            Single or multiple files from device
          </span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg,image/svg+xml"
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
};
