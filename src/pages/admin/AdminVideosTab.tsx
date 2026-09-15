import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Play, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles,
  Upload,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clapperboard
} from 'lucide-react';
import { VideoItem } from '../../types';
import { api } from '../../services/api';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

const VIDEO_CATEGORIES = [
  'Our Work',
  'Handmade Work',
  'Our Craft',
  'Work Videos',
  'Production Video',
  'Customer Stories',
  'Customer Review',
  'Other'
];

export const AdminVideosTab: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Source mode: 'upload' or 'link'
  const [sourceMode, setSourceMode] = useState<'upload' | 'link'>('upload');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoType: 'upload' as 'upload' | 'link' | 'youtube' | 'external',
    googleDriveUrl: '',
    embedUrl: '',
    thumbnailUrl: '',
    category: 'Our Work',
    featured: true,
    hidden: false
  });

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await api.getVideos({ includeHidden: true });
      setVideos(data || []);
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleOpenAdd = (mode: 'upload' | 'link' = 'upload') => {
    setEditingVideo(null);
    setSourceMode(mode);
    setUploadStatus(null);
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      videoType: mode,
      googleDriveUrl: '',
      embedUrl: '',
      thumbnailUrl: '',
      category: 'Our Work',
      featured: true,
      hidden: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: VideoItem) => {
    setEditingVideo(v);
    const mode = v.videoUrl && !v.embedUrl?.includes('youtube') && !v.googleDriveUrl ? 'upload' : 'link';
    setSourceMode(mode);
    setUploadStatus(null);
    setFormData({
      title: v.title,
      description: v.description || '',
      videoUrl: v.videoUrl || '',
      videoType: (v.videoType as any) || mode,
      googleDriveUrl: v.googleDriveUrl || '',
      embedUrl: v.embedUrl || '',
      thumbnailUrl: v.thumbnailUrl || '',
      category: v.category || 'Our Work',
      featured: v.featured || false,
      hidden: v.hidden || false
    });
    setIsModalOpen(true);
  };

  // Upload video directly from user device
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setUploadStatus('Uploading video from device... Please wait.');
    try {
      const res = await api.uploadFile(file);
      if (res && res.url) {
        setFormData(prev => ({
          ...prev,
          videoUrl: res.url,
          videoType: 'upload',
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
        }));
        setUploadStatus('Video uploaded successfully!');
      } else {
        setUploadStatus('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Video upload error:', err);
      setUploadStatus('Upload error. Please check file size and format.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Upload thumbnail directly from device
  const handleThumbFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    try {
      const res = await api.uploadFile(file);
      if (res && res.url) {
        setFormData(prev => ({ ...prev, thumbnailUrl: res.url }));
      }
    } catch (err) {
      console.error('Thumbnail upload error:', err);
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  // Auto-convert YouTube link to embed and thumbnail
  const handleLinkInput = (url: string) => {
    let embed = '';
    let thumb = formData.thumbnailUrl;
    
    // Check for YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      const vidId = ytMatch[1];
      embed = `https://www.youtube.com/embed/${vidId}`;
      if (!thumb) {
        thumb = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }
    }

    setFormData(prev => ({
      ...prev,
      googleDriveUrl: url,
      embedUrl: embed || prev.embedUrl,
      thumbnailUrl: thumb || prev.thumbnailUrl,
      videoType: ytMatch ? 'youtube' : 'link'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a video title');
      return;
    }

    try {
      const payload = {
        ...formData,
        // If neither videoUrl nor googleDriveUrl is present, allow saving metadata
        videoUrl: formData.videoUrl || formData.googleDriveUrl || '',
      };

      if (editingVideo) {
        await api.updateVideo(editingVideo.id, payload);
        setVideos(prev => prev.map(v => v.id === editingVideo.id ? { ...v, ...payload } : v));
      } else {
        const newVid = await api.createVideo({
          ...payload,
          orderIndex: videos.length + 1,
          createdAt: new Date().toISOString()
        });
        setVideos(prev => [newVid, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving video:', err);
      alert('Failed to save video. Please check your connection.');
    }
  };

  const handleDeleteClick = (v: VideoItem) => {
    setDeleteTarget({ id: v.id, name: v.title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteVideo(deleteTarget.id);
      setVideos(prev => prev.filter(v => v.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting video:', err);
      alert('ভিডিওটি মুছতে সমস্যা হয়েছে');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleHidden = async (v: VideoItem) => {
    try {
      const updatedHidden = !v.hidden;
      await api.updateVideo(v.id, { hidden: updatedHidden });
      setVideos(prev => prev.map(item => item.id === v.id ? { ...item, hidden: updatedHidden } : item));
    } catch (err) {
      console.error('Error toggling hidden state:', err);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const newVideos = [...videos];
    const temp = newVideos[index];
    newVideos[index] = newVideos[targetIndex];
    newVideos[targetIndex] = temp;

    // Update orderIndex
    newVideos.forEach((v, idx) => {
      v.orderIndex = idx + 1;
    });
    setVideos(newVideos);

    // Save order changes
    try {
      await Promise.all([
        api.updateVideo(newVideos[index].id, { orderIndex: index + 1 }),
        api.updateVideo(newVideos[targetIndex].id, { orderIndex: targetIndex + 1 })
      ]);
    } catch (err) {
      console.error('Failed to save video reordering:', err);
    }
  };

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Clapperboard className="w-4 h-4" />
            <span>Artisan & Workshop Videos</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-heading">
            ভিডিও ম্যানেজমেন্ট (Video Management System)
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            ডিভাইস থেকে সরাসরি ভিডিও আপলোড করুন অথবা ভিডিও লিঙ্ক (YouTube, ক্লাউড ভিডিও ইত্যাদি) যুক্ত করুন। গ্রাহকদের জন্য সর্বদা পেশাদার শিরোনাম প্রদর্শিত হবে।
          </p>
        </div>

        {/* Two addition buttons as requested */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAdd('upload')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Video (ডিভাইস থেকে)</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAdd('link')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <LinkIcon className="w-4 h-4 text-amber-400" />
            <span>Add Video Link (লিংক যোগ)</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-[#0B1A30] text-amber-400 shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Categories ({videos.length})
        </button>
        {VIDEO_CATEGORIES.map(cat => {
          const count = videos.filter(v => v.category === cat).length;
          if (count === 0 && selectedCategory !== cat) return null;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0B1A30] text-amber-400 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Videos List / Cards */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <p className="text-sm">ভিডিও লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-4">
          <Film className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <p className="text-base font-bold text-slate-800">কোনো ভিডিও যোগ করা হয়নি</p>
            <p className="text-xs text-slate-500 mt-1">ডিভাইস থেকে আপলোড করুন বা লিংক দিয়ে প্রথম ভিডিওটি যোগ করুন।</p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenAdd('upload')}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-600"
            >
              Upload Video
            </button>
            <button
              type="button"
              onClick={() => handleOpenAdd('link')}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
            >
              Add Video Link
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid, idx) => (
            <div
              key={vid.id}
              className={`bg-white rounded-2xl border ${vid.hidden ? 'border-slate-300 opacity-60 bg-slate-50' : 'border-slate-200'} overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                {/* Thumbnail / Auto-thumbnail */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center group">
                  {vid.thumbnailUrl ? (
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    /* Auto-Generated Clean Card Design */
                    <div className="w-full h-full bg-linear-to-br from-[#0B1A30] via-[#142C4F] to-slate-900 p-4 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mb-2">
                        <Play className="w-5 h-5 fill-amber-400 ml-0.5" />
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{vid.title}</p>
                      <span className="text-[10px] text-amber-300 mt-0.5">{vid.category || 'Our Craft'}</span>
                    </div>
                  )}

                  {/* Badges */}
                  <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    {vid.category || 'Our Work'}
                  </span>

                  {vid.featured && (
                    <span className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      {vid.videoUrl && !vid.embedUrl?.includes('youtube') ? 'Direct Upload Video' : 'Stream / Link'}
                    </span>
                    <span className="text-[10px] text-slate-400">Order: #{vid.orderIndex || idx + 1}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {vid.description || 'Authentic handcrafted workshop footage in Kolkata cluster.'}
                  </p>
                </div>
              </div>

              {/* Actions & Reordering Footer */}
              <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveOrder(idx, 'up')}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 rounded cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === filteredVideos.length - 1}
                    onClick={() => handleMoveOrder(idx, 'down')}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 rounded cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Visibility toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleHidden(vid)}
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
                  title={vid.hidden ? 'Show on website' : 'Hide from website'}
                >
                  {vid.hidden ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{vid.hidden ? 'লুকানো' : 'দৃশ্যমান'}</span>
                </button>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(vid)}
                    className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                    title="Edit Video"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(vid)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="ভিডিও মুছে ফেলা (Delete Video)"
        itemName={deleteTarget?.name}
        message="আপনি কি নিশ্চিত যে এই ভিডিওটি স্থায়ীভাবে মুছে ফেলতে চান?"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                  {editingVideo ? 'ভিডিও সম্পাদনা করুন (Edit Video)' : 'নতুন ভিডিও যুক্ত করুন (Add Video)'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  পদ্ধতি নির্বাচন করুন: সরাসরি ফাইল আপলোড অথবা ভিডিও লিঙ্ক।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSourceMode('upload')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  sourceMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>A) Upload Video from Device</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('link')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  sourceMode === 'link' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>B) Add Video Link</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {/* Mode A: Direct Device Upload */}
              {sourceMode === 'upload' && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border-2 border-dashed border-amber-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">ভিডিও ফাইল আপলোড (MP4, WebM, QuickTime)</span>
                    {formData.videoUrl && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> File Selected
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={videoFileInputRef}
                    onChange={handleVideoFileChange}
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      disabled={isUploadingVideo}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingVideo ? 'Uploading...' : 'ডিভাইস থেকে ফাইল বাছুন (Choose Video)'}</span>
                    </button>

                    {formData.videoUrl && (
                      <span className="text-xs text-slate-600 truncate max-w-xs">
                        {formData.videoUrl}
                      </span>
                    )}
                  </div>

                  {uploadStatus && (
                    <p className="text-xs text-amber-800 font-medium">{uploadStatus}</p>
                  )}
                  <p className="text-[11px] text-slate-500">
                    সর্বোচ্চ ১০০ মেগাবাইট পর্যন্ত ভিডিও ফাইল আপলোড সমর্থিত।
                  </p>
                </div>
              )}

              {/* Mode B: Video Link */}
              {sourceMode === 'link' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      ভিডিও লিঙ্ক (Video URL / YouTube / Web Stream) *
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=... or direct video link"
                      value={formData.googleDriveUrl || ''}
                      onChange={e => handleLinkInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      YouTube লিংক দিলে স্বয়ংক্রিয়ভাবে ভিডিও এম্বেড ও থাম্বনেইল তৈরি হয়ে যাবে। গ্রাহক পেজে কোনো প্রকার টেকনিক্যাল স্টোরেজ নাম দেখানো হবে না।
                    </span>
                  </div>

                  {formData.embedUrl && (
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        স্বয়ংক্রিয় এম্বেড প্লেয়ার লিঙ্ক
                      </label>
                      <input
                        type="text"
                        value={formData.embedUrl || ''}
                        onChange={e => setFormData({ ...formData, embedUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Video Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  ভিডিওর শিরোনাম (Video Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ঐতিহ্যবাহী পোড়ামাটির গহনা তৈরি ও কর্মশালা"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category & Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    পেশাদার ক্যাটাগরি (Professional Category)
                  </label>
                  <select
                    value={formData.category || 'Our Work'}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {VIDEO_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Thumbnail from device or link */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    থাম্বনেইল ছবি (Thumbnail Image)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={thumbFileInputRef}
                      onChange={handleThumbFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <input
                      type="text"
                      placeholder="Image URL or upload"
                      value={formData.thumbnailUrl || ''}
                      onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => thumbFileInputRef.current?.click()}
                      disabled={isUploadingThumbnail}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Upload Image from Device"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{isUploadingThumbnail ? '...' : 'Upload'}</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    থাম্বনেইল না দিলে স্বয়ংক্রিয় প্রিমিয়াম কার্ড ডিজাইন তৈরি হবে।
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  বিবরণ (Description)
                </label>
                <textarea
                  rows={2}
                  placeholder="ভিডিও ও হস্তশিল্প প্রক্রিয়ার বিবরণ লিখুন..."
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                  />
                  <span className="font-semibold text-slate-800 text-xs">হোমপেজে ফিচার্ড করুন (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hidden}
                    onChange={e => setFormData({ ...formData, hidden: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                  />
                  <span className="font-semibold text-slate-800 text-xs">ভিডিওটি লুকান (Hide)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  সংরক্ষণ করুন (Save Video)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
