import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Package, 
  Clock, 
  MessageCircle, 
  Bot, 
  CheckCircle2, 
  Ruler, 
  Scale, 
  Palette,
  ArrowRight,
  Tag,
  Plus,
  Minus,
  Check,
  X,
  AlertCircle,
  IndianRupee,
  Percent,
  Copy,
  ChevronDown,
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Product, Coupon, CouponValidationResult } from '../types';

interface ProductDetailPageProps {
  productIdOrSlug: string;
  onNavigate: (route: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productIdOrSlug,
  onNavigate
}) => {
  const { settings, openBulkModal, openChatWithContext } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Quantity selection state
  const [quantity, setQuantity] = useState<number>(50);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [showCouponsList, setShowCouponsList] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [data, couponsList] = await Promise.all([
          api.getProduct(productIdOrSlug),
          api.getCoupons()
        ]);
        setProduct(data);
        setActiveImage(data.primaryImage);
        setAvailableCoupons(couponsList.filter(c => c.isActive));

        // Set initial quantity to MOQ
        const initialQty = data.moq || 50;
        setQuantity(initialQty);

        // Fetch related products
        if (data.category) {
          const prods = await api.getProducts({ category: data.category });
          setRelated(prods.filter(p => p.id !== data.id).slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productIdOrSlug]);

  // Re-validate applied coupon if quantity changes
  useEffect(() => {
    if (!appliedCoupon?.coupon || !product) return;

    const unitPrice = product.bulkPrice || product.retailPrice || 0;
    const subtotal = unitPrice * quantity;

    api.validateCoupon({
      code: appliedCoupon.coupon.code,
      subtotal,
      quantity,
      categoryId: product.category
    }).then(res => {
      if (res.valid) {
        setAppliedCoupon(res);
        setCouponError(null);
      } else {
        setCouponError(res.message || 'Coupon requirement no longer met with this quantity.');
        // Don't discard appliedCoupon immediately, just mark issue
      }
    }).catch(err => {
      console.error('Failed to revalidate coupon:', err);
    });
  }, [quantity]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3 max-w-7xl mx-auto px-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-semibold">Loading handcrafted product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center px-4 space-y-4">
        <Package className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">The requested product could not be located in the catalog.</p>
        <button
          type="button"
          onClick={() => onNavigate('/products')}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  const phone = settings?.whatsappNumber || '+91 82405 85219';
  const allImages = Array.from(new Set([
    product.primaryImage,
    ...(product.images || []),
    ...((product as any).galleryImages || [])
  ])).filter(Boolean);
  const fallbackProductImg = 'https://images.unsplash.com/photo-1611591475816-3e4732c4515b?auto=format&fit=crop&w=800&q=80';
  const unitPrice = product.priceOnRequest ? 0 : (product.bulkPrice || product.retailPrice || 0);
  const subtotal = unitPrice * quantity;
  const discount = appliedCoupon?.valid ? (appliedCoupon.discountAmount || 0) : 0;
  const estimatedTotal = Math.max(0, subtotal - discount);
  const effectivePerUnit = quantity > 0 && !product.priceOnRequest ? (estimatedTotal / quantity).toFixed(1) : null;

  // Handle Quantity adjustments
  const handleQtyChange = (newQty: number) => {
    const val = Math.max(1, newQty);
    setQuantity(val);
  };

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a valid coupon code.');
      return;
    }

    setValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await api.validateCoupon({
        code,
        subtotal,
        quantity,
        categoryId: product.category
      });

      if (res.valid) {
        setAppliedCoupon(res);
        setCouponCodeInput(res.coupon?.code || code);
        setCouponError(null);
      } else {
        setAppliedCoupon(null);
        setCouponError(res.message || 'Invalid coupon code.');
      }
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.message || 'Failed to validate coupon.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
  };

  // Compose dynamic WhatsApp message with item details, quantity, coupon, and total
  const couponSummaryText = appliedCoupon?.valid
    ? `\n- Applied Coupon: ${appliedCoupon.coupon?.code} (Saved: ₹${discount.toLocaleString('en-IN')})\n- Estimated Total: ₹${estimatedTotal.toLocaleString('en-IN')}`
    : `\n- Estimated Amount: ₹${subtotal.toLocaleString('en-IN')}`;

  const whatsappMessage = encodeURIComponent(
    `Hello Monojit Dey, I am interested in placing an order for:\n- Product: ${product.name}\n- SKU: ${product.sku}\n- Target Quantity: ${quantity} pcs (MOQ: ${product.moq} pcs)${!product.priceOnRequest ? couponSummaryText : ''}\nPlease share your formal wholesale quotation and lead time.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      
      {/* Back link */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('/products')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            <img
              src={activeImage || product.primaryImage || allImages[0] || fallbackProductImg}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('unsplash')) {
                  target.src = fallbackProductImg;
                }
              }}
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <span className="bg-[#0B1A30]/90 text-amber-400 text-xs font-extrabold uppercase px-2.5 py-1 rounded shadow-xs">
                MOQ: {product.moq} pcs
              </span>
              {product.productionStatus && (
                <span className="bg-emerald-700/90 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                  {product.productionStatus}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails row */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImage === img ? 'border-amber-500 shadow-md scale-95' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info, Quantity Selector, Coupon Box & Order CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
              <span>SKU: {product.sku}</span>
              <span>&bull;</span>
              <span>Category: {product.category}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-heading text-slate-950">
              {product.name}
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase block">
                Wholesale / Bulk Rate
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {product.priceOnRequest ? "Price on Request" : `₹${product.bulkPrice || product.retailPrice}`}
                </span>
                {!product.priceOnRequest && (
                  <span className="text-xs text-slate-500 font-medium">per piece + GST</span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">
                Minimum Order Quantity
              </span>
              <span className="text-lg font-extrabold text-[#0B1A30]">
                {product.moq} Units
              </span>
            </div>
          </div>

          {/* QUANTITY SELECTOR (পরিমাণ নির্বাচন) */}
          <div className="p-4 sm:p-5 bg-white border-2 border-amber-200/80 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-600" />
                <span>Select Order Quantity (পরিমাণ নির্বাচন করুন)</span>
              </label>
              {product.moq && quantity < product.moq && (
                <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Below MOQ ({product.moq} pcs)
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Stepper */}
              <div className="inline-flex items-center bg-slate-100 border border-slate-300 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleQtyChange(quantity - (quantity > 100 ? 50 : 10))}
                  disabled={quantity <= 1}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold transition-colors cursor-pointer"
                  title="Decrease Quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => handleQtyChange(parseInt(e.target.value, 10) || 1)}
                  className="w-20 text-center font-mono font-bold text-base bg-white py-2 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleQtyChange(quantity + (quantity >= 100 ? 50 : 10))}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                  title="Increase Quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[product.moq || 50, 100, 250, 500, 1000].filter((v, idx, arr) => arr.indexOf(v) === idx).map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleQtyChange(preset)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      quantity === preset
                        ? 'bg-[#0B1A30] text-amber-400 border-[#0B1A30] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    {preset} pcs
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Enter custom quantity or click presets. Wholesale tiered quotes automatically calculate based on unit count.
            </p>
          </div>

          {/* COUPON CODE APPLICATION (কুপন কোড ও ডিসকাউন্ট) */}
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-600" />
                <span>Apply Promo / Coupon Code (কুপন কোড ব্যবহার করুন)</span>
              </label>

              {availableCoupons.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCouponsList(!showCouponsList)}
                  className="text-[11px] text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{availableCoupons.length} Offers Available</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCouponsList ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Input & Apply Button */}
            {!appliedCoupon?.valid ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. PUJA10, BULK500"
                      value={couponCodeInput}
                      onChange={e => {
                        setCouponCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ''));
                        setCouponError(null);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCoupon();
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold tracking-wider uppercase text-xs sm:text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={validatingCoupon || !couponCodeInput.trim()}
                    className="px-5 py-2 bg-[#0B1A30] hover:bg-[#152E54] disabled:opacity-50 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <span>{validatingCoupon ? 'Checking...' : 'Apply'}</span>
                  </button>
                </div>

                {couponError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}
              </div>
            ) : (
              /* Applied Coupon State Badge */
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <strong>{appliedCoupon.coupon?.code}</strong> Applied!
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                      {appliedCoupon.coupon?.discountType === 'percentage'
                        ? `${appliedCoupon.coupon.discountValue}% OFF`
                        : `₹${appliedCoupon.coupon?.discountValue} OFF`}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    {appliedCoupon.message || `You saved ₹${appliedCoupon.discountAmount.toLocaleString('en-IN')} on this order!`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove Coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Available Offers List (Collapsible / Preview) */}
            {(showCouponsList || (!appliedCoupon?.valid && availableCoupons.length > 0)) && (
              <div className="pt-2 border-t border-slate-200/80 space-y-2">
                <span className="text-[11px] text-slate-500 font-semibold block">
                  Available Offers (ট্যাপ করে সরাসরি প্রয়োগ করুন):
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableCoupons.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCouponCodeInput(c.code);
                        handleApplyCoupon(c.code);
                      }}
                      className="px-2.5 py-1.5 bg-white hover:bg-amber-50 border border-dashed border-amber-300 hover:border-amber-500 rounded-lg text-left transition-all cursor-pointer group flex items-center gap-2 shadow-2xs"
                    >
                      <span className="font-mono font-black text-xs text-slate-900 group-hover:text-amber-700">
                        {c.code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC PRICE BREAKDOWN & ESTIMATED TOTAL */}
          {!product.priceOnRequest && (
            <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Unit Wholesale Price:</span>
                <span className="font-semibold text-slate-800">₹{unitPrice} &times; {quantity} units</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold pt-1 border-t border-amber-200/60">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon Discount ({appliedCoupon?.coupon?.code}):</span>
                  </span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm sm:text-base font-black text-slate-950 pt-2 border-t-2 border-amber-300">
                <span>Estimated Wholesale Total:</span>
                <div className="text-right">
                  <span className="text-amber-700">₹{estimatedTotal.toLocaleString('en-IN')}</span>
                  {effectivePerUnit && discount > 0 && (
                    <span className="block text-[10px] text-emerald-700 font-bold">
                      Effective ~₹{effectivePerUnit} / piece
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => openBulkModal(
                product, 
                quantity, 
                appliedCoupon?.coupon?.code, 
                discount
              )}
              className="w-full py-3.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Request Wholesale Quotation for {quantity} Units</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Monojit Dey ({quantity} pcs)</span>
              </a>

              <button
                type="button"
                onClick={() => openChatWithContext(`I have a specific question about ${product.name} (SKU: ${product.sku}) for quantity ${quantity} pcs regarding custom packaging and lead time.`, product)}
                className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-amber-600" />
                <span>Ask Jit Prime Assistant</span>
              </button>
            </div>
          </div>

          {/* Quick Specifications Table */}
          <div className="border-t border-slate-200 pt-6 space-y-3 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Product Specifications & Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-600">
                <Palette className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Materials:</span>
                <strong className="text-slate-900 font-semibold">{product.materials?.join(', ') || 'Natural Clay & Organic Pigments'}</strong>
              </div>

              {product.dimensions && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Ruler className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Dimensions:</span>
                  <strong className="text-slate-900 font-semibold">{product.dimensions}</strong>
                </div>
              )}

              {product.weight && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Scale className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Approx Weight:</span>
                  <strong className="text-slate-900 font-semibold">{product.weight}</strong>
                </div>
              )}

              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Production Lead Time:</span>
                <strong className="text-slate-900 font-semibold">{product.leadTime || '7 - 14 Days'}</strong>
              </div>
            </div>
          </div>

          {/* Craft Story */}
          {product.craftStory && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-1.5">
              <span className="text-amber-900 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                The Craft Story & Heritage
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;{product.craftStory}&rdquo;
              </p>
            </div>
          )}

          {/* Full description */}
          {product.fullDescription && (
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900">Detailed Description</h4>
              <p className="whitespace-pre-line">{product.fullDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-slate-900">
            Related Handcrafted Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(rel => (
              <div
                key={rel.id}
                onClick={() => onNavigate(`/products/${rel.slug || rel.id}`)}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer p-3 group"
              >
                <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100 mb-3">
                  <img src={rel.primaryImage} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                  {rel.name}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>MOQ: {rel.moq} pcs</span>
                  <span className="font-bold text-slate-900">
                    {rel.priceOnRequest ? "On Request" : `₹${rel.bulkPrice || rel.retailPrice}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
