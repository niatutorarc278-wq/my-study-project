import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { Check, Tag, CreditCard, Lock, Sparkles, ShieldCheck } from 'lucide-react';

export const BuyCourseModal = ({ isOpen, onClose, course }) => {
  const { buyCourse, coupons, showToast } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!course) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const coupon = coupons.find(
      c => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.status === 'Active'
    );

    if (coupon) {
      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = (course.price * coupon.discountValue) / 100;
      } else {
        discountAmount = Math.min(course.price, coupon.discountValue);
      }
      setAppliedDiscount({
        code: coupon.code,
        amount: discountAmount,
        details: coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`
      });
      showToast(`Coupon "${coupon.code}" applied!`, 'success');
    } else {
      setAppliedDiscount(null);
      showToast('Invalid or expired coupon code', 'error');
    }
  };

  const finalPrice = appliedDiscount
    ? Math.max(0, course.price - appliedDiscount.amount)
    : course.price;

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      buyCourse(course.id, appliedDiscount ? appliedDiscount.code : '', paymentMethod);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Course Checkout" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Course Summary Card */}
        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-24 h-20 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              {course.category}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
              {course.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instructor: {course.instructor} • {course.duration}
            </p>
          </div>
        </div>

        {/* Coupon Code Form */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Have a Promo Coupon?
          </label>
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. WELCOME50"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none uppercase font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors"
            >
              Apply
            </button>
          </form>

          {appliedDiscount && (
            <div className="mt-2 flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Coupon '{appliedDiscount.code}' Applied ({appliedDiscount.details})
              </span>
              <button
                type="button"
                onClick={() => {
                  setAppliedDiscount(null);
                  setCouponCode('');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Select Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Credit Card', 'PayPal', 'Apple Pay'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  paymentMethod === method
                    ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/30'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span>{method}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Breakdown Table */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Course List Price</span>
            <span>₹{course.price.toLocaleString()}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Coupon Discount ({appliedDiscount.code})</span>
              <span>-₹{appliedDiscount.amount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Estimated Taxes</span>
            <span>₹0</span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Total Payable</span>
            <span className="text-indigo-600 dark:text-indigo-400">₹{finalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirmPurchase}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Processing Payment...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Confirm & Pay ₹{finalPrice.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-Bit SSL Encrypted & 30-Day Money Back Guarantee</span>
        </div>
      </div>
    </Modal>
  );
};
