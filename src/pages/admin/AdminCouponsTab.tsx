import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Copy, 
  Percent, 
  IndianRupee, 
  AlertCircle, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Power,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { Coupon, Category } from '../../types';

export const AdminCouponsTab: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1000,
    minQuantity: 10,
    maxDiscount: 2000,
    applicableCategory: 'all',
    validUntil: '',
    isActive: true
  });

  // Test Simulator state
  const [testCode, setTestCode] = useState('');
  const [testSubtotal, setTestSubtotal] = useState('5000');
  const [testQuantity, setTestQuantity] = useState('50');
  const [testResult, setTestResult] = useState<any | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const [list, cats] = await Promise.all([
        api.getCoupons(true),
        api.getCategories(true)
      ]);
      setCoupons(list);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 1000,
      minQuantity: 10,
      maxDiscount: 2000,
      applicableCategory: 'all',
      validUntil: '2026-12-31',
      isActive: true
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount,
      minQuantity: c.minQuantity,
      maxDiscount: c.maxDiscount,
      applicableCategory: c.applicableCategory || 'all',
      validUntil: c.validUntil || '',
      isActive: c.isActive
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.code.trim()) {
      setError('কুপন কোড দেওয়া আবশ্যক (Coupon code is required)');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingCoupon) {
        await api.updateCoupon(editingCoupon.id, formData);
        setSuccessMsg(`Coupon ${formData.code} updated successfully!`);
      } else {
        await api.createCoupon(formData);
        setSuccessMsg(`New coupon ${formData.code} created successfully!`);
      }
      setIsModalOpen(false);
      await loadCoupons();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      await api.deleteCoupon(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
      setSuccessMsg(`Coupon "${code}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete coupon');
    }
  };

  const handleToggleActive = async (c: Coupon) => {
    const updated = !c.isActive;
    try {
      await api.updateCoupon(c.id, { isActive: updated });
      setCoupons(prev => prev.map(item => item.id === c.id ? { ...item, isActive: updated } : item));
    } catch (err) {
      console.error('Failed to toggle coupon status:', err);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTestCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCode.trim()) return;
    setTestLoading(true);
    try {
      const res = await api.validateCoupon({
        code: testCode.trim(),
        subtotal: parseFloat(testSubtotal) || 0,
        quantity: parseInt(testQuantity, 10) || 1
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ valid: false, message: err.message || 'Validation error' });
    } finally {
      setTestLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(c => {
    const q = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  const activeCount = coupons.filter(c => c.isActive).length;
  const percentageCount = coupons.filter(c => c.discountType === 'percentage').length;
  const fixedCount = coupons.filter(c => c.discountType === 'fixed').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Tag className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold font-serif-heading text-slate-900">
              Coupons & Promo Codes (ডিসকাউন্ট কুপন ও কোড)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and delete discount codes that customers can apply on Product Detail pages and Bulk Quotes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কুপন যোগ করুন (Add Coupon)</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Codes</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{coupons.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase block">Active Codes</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase block">% Percentage Discounts</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{percentageCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase block">Flat ₹ Discounts</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{fixedCount}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Coupons Table / List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search coupon code or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold shrink-0">
              Showing {filteredCoupons.length} of {coupons.length}
            </span>
          </div>

          {loading ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500 font-medium">Loading coupon configurations...</p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
              <Tag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">No Coupons Found</h3>
              <p className="text-xs text-slate-500">
                {search ? 'No coupons matched your search query.' : 'No discount coupons currently configured.'}
              </p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Create First Coupon
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCoupons.map(c => {
                const isExpired = c.validUntil && c.validUntil < new Date().toISOString().split('T')[0];
                return (
                  <div
                    key={c.id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
                      !c.isActive 
                        ? 'border-slate-200 opacity-60 bg-slate-50/50' 
                        : isExpired
                          ? 'border-red-200 bg-red-50/20'
                          : 'border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      
                      {/* Left: Code badge & details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-[#0B1A30] text-amber-400 font-mono font-black text-sm px-3 py-1 rounded-lg border border-amber-400/30 shadow-xs">
                            <span>{c.code}</span>
                            <button
                              type="button"
                              title="Copy Code"
                              onClick={() => handleCopy(c.code)}
                              className="text-slate-400 hover:text-white transition-colors"
                            >
                              {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            c.discountType === 'percentage'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}>
                            {c.discountType === 'percentage' ? (
                              <>
                                <Percent className="w-3 h-3 text-amber-700" />
                                <span>{c.discountValue}% OFF</span>
                              </>
                            ) : (
                              <>
                                <IndianRupee className="w-3 h-3 text-blue-700" />
                                <span>₹{c.discountValue} FLAT OFF</span>
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggleActive(c)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors ${
                              c.isActive 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            <span>{c.isActive ? 'Active (সক্রিয়)' : 'Inactive (নিষ্ক্রিয়)'}</span>
                          </button>

                          {isExpired && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                              Expired
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {c.description || 'No description added.'}
                        </p>

                        {/* Rules chips */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                          {c.minOrderAmount ? (
                            <span>Min Order: <strong>₹{c.minOrderAmount.toLocaleString('en-IN')}</strong></span>
                          ) : (
                            <span>Min Order: <strong>None</strong></span>
                          )}
                          
                          {c.minQuantity ? (
                            <span>Min Quantity: <strong>{c.minQuantity} units</strong></span>
                          ) : (
                            <span>Min Quantity: <strong>1 unit</strong></span>
                          )}

                          {c.maxDiscount && c.discountType === 'percentage' && (
                            <span>Max Cap: <strong>₹{c.maxDiscount.toLocaleString('en-IN')}</strong></span>
                          )}

                          {c.validUntil && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>Valid Until: <strong>{c.validUntil}</strong></span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                          title="Edit Coupon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-200"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Live Validator & Quick Guidelines */}
        <div className="space-y-6">
          
          {/* Coupon Simulator / Validator Tool */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Coupon Tester / Calculator</span>
            </div>
            <p className="text-xs text-slate-500">
              Test coupon calculation logic before sharing codes with buyers.
            </p>

            <form onSubmit={handleTestCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. PUJA10"
                  value={testCode}
                  onChange={e => setTestCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subtotal (₹)</label>
                  <input
                    type="number"
                    value={testSubtotal}
                    onChange={e => setTestSubtotal(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    value={testQuantity}
                    onChange={e => setTestQuantity(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={testLoading || !testCode.trim()}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{testLoading ? 'Testing...' : 'Test Calculation'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                testResult.valid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  {testResult.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                  <span>{testResult.valid ? 'Valid Coupon' : 'Invalid / Inapplicable'}</span>
                </div>
                <p className="text-slate-700">{testResult.message}</p>
                {testResult.valid && (
                  <div className="pt-2 border-t border-emerald-200 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Discount:</span>
                      <strong className="text-emerald-700 font-bold">₹{testResult.discountAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Estimated Final:</span>
                      <strong className="text-slate-900 font-bold">₹{testResult.finalTotal.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bengali Guide Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2.5 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-amber-600 font-extrabold text-sm">💡</span>
              <span>বাংলা সহায়িকা ও টিপস (Admin Tips)</span>
            </h4>
            <ul className="space-y-2 list-disc list-inside text-slate-600">
              <li>
                <strong>Product পেজে স্বয়ংক্রিয় হিসাব:</strong> ক্রেতারা প্রোডাক্ট পেজে কোড লিখলে এবং পরিমাণ (Quantity) নির্বাচন করলে স্বয়ংক্রিয়ভাবে ডিসকাউন্ট কেটে নেট মূল্য দেখতে পারবেন।
              </li>
              <li>
                <strong>WhatsApp মেসেজে অন্তর্ভুক্ত:</strong> ক্রেতা WhatsApp বাটনে ক্লিক করলে তাঁর নির্বাচিত পরিমাণ এবং কুপন কোডের হিসাব সরাসরি মনোজিত বাবুর চ্যাটে পৌঁছে যাবে।
              </li>
              <li>
                <strong>বাল্ক ও রিটেল প্রযোজ্যতা:</strong> ন্যূনতম পরিমাণ (Min Quantity) বা ন্যূনতম অর্ডার মূল্য (Min Order Value) সেট করে বাল্ক ক্রেতাদের জন্য বিশেষ কোড তৈরি করতে পারেন।
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
            
            <div className="bg-linear-to-r from-[#0B1A30] to-[#152E54] text-white p-5 border-b-2 border-amber-400 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base font-serif-heading">
                  {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Promo Coupon'}
                </h3>
                <p className="text-xs text-slate-300">Set discount rules, minimum order constraints & validity</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Coupon Code & Discount Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Code (কুপন কোড) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PUJA10, BULK500"
                    value={formData.code || ''}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold tracking-wider uppercase focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Letters & numbers only, e.g. FESTIVE2026</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type (ছাড়ের ধরন) *</label>
                  <select
                    value={formData.discountType || 'percentage'}
                    onChange={e => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="percentage">Percentage (%) Discount</option>
                    <option value="fixed">Flat Amount (₹) Off</option>
                  </select>
                </div>
              </div>

              {/* Discount Value & Max Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {formData.discountType === 'percentage' ? 'Discount Percentage (%) *' : 'Flat Discount Amount (₹) *'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1}
                      max={formData.discountType === 'percentage' ? 95 : 100000}
                      value={formData.discountValue ?? ''}
                      onChange={e => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      {formData.discountType === 'percentage' ? '%' : '₹'}
                    </span>
                  </div>
                </div>

                {formData.discountType === 'percentage' ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Maximum Discount Cap (₹)</label>
                    <input
                      type="number"
                      placeholder="Optional, e.g. 2000"
                      value={formData.maxDiscount ?? ''}
                      onChange={e => setFormData({ ...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Limits the maximum discount amount</span>
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Minimum Order Value (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={formData.minOrderAmount ?? ''}
                      onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Min Order & Min Quantity constraints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Minimum Order Value (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1000"
                      value={formData.minOrderAmount ?? ''}
                      onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minimum Quantity Required (Units)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10 or 50 pcs"
                    value={formData.minQuantity ?? ''}
                    onChange={e => setFormData({ ...formData, minQuantity: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Buyer must choose at least this many units</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry / Valid Until Date</label>
                  <input
                    type="date"
                    value={formData.validUntil || ''}
                    onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description / Buyer Note (বাংলা বা ইংরেজিতে বিবরণ)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. দুর্গোৎসবের বিশেষ ১০% ছাড় - হস্তশিল্প গয়না ও টেরাকোটা সামগ্রীতে প্রযোজ্য"
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white outline-hidden"
                />
              </div>

              {/* Active Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Active Status (কুপনটি চালু রাখুন)</span>
                  <span className="text-[11px] text-slate-500">When enabled, buyers can apply this coupon in the live store.</span>
                </div>
                <input
                  type="checkbox"
                  id="couponIsActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {saving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
