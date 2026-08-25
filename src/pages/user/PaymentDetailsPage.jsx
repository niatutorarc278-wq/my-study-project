import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { CreditCard, DollarSign, Download, FileText, CheckCircle2, Clock, Search } from 'lucide-react';

export const PaymentDetailsPage = () => {
  const { payments, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const totalSpent = (payments || [])
    .filter(p => p.status === 'Completed')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const filteredPayments = (payments || []).filter(p => {
    const pId = p.id || '';
    const pTitle = p.courseTitle || p.course_title || '';
    const pMethod = p.paymentMethod || p.payment_method || '';
    const q = searchQuery.toLowerCase();
    return (
      pId.toLowerCase().includes(q) ||
      pTitle.toLowerCase().includes(q) ||
      pMethod.toLowerCase().includes(q)
    );
  });

  const handleDownloadReceipt = (txn) => {
    showToast(`Invoice receipt for ${txn.id} downloaded!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Payment & Transaction History</h1>
        <p className="text-xs text-slate-500">View all course purchase receipts and payment logs.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Spent On Courses" value={`₹${totalSpent.toLocaleString()}`} subValue="Lifetime Spending" change="Verified" changeType="positive" icon={DollarSign} color="emerald" />
        <StatCard title="Successful Purchases" value={payments.length} subValue="Transactions" change="100% Success" changeType="info" icon={CheckCircle2} color="indigo" />
        <StatCard title="Default Payment Method" value="Visa •••• 4242" subValue="Primary Card" change="Active" changeType="neutral" icon={CreditCard} color="purple" />
      </div>

      {/* Table Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Order Logs & Receipts</h3>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transaction ID or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">Txn ID</th>
                <th className="py-3 px-4">Course Item</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Coupon Used</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {txn.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                    {txn.courseTitle}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{txn.date}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{txn.paymentMethod}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                      {txn.couponCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 dark:text-slate-100">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        txn.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedReceipt(txn)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title={`Receipt - ${selectedReceipt?.id}`}
        maxWidth="max-w-lg"
      >
        {selectedReceipt && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Payer Name</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedReceipt.user}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">User Email</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedReceipt.userEmail}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Date</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Payment Method</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>{selectedReceipt.courseTitle}</span>
                <span>₹{selectedReceipt.originalPrice.toLocaleString()}</span>
              </div>
              {selectedReceipt.couponCode !== 'None' && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount ({selectedReceipt.couponCode})</span>
                  <span>-₹{(selectedReceipt.originalPrice - selectedReceipt.amount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount Paid</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹{selectedReceipt.amount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => handleDownloadReceipt(selectedReceipt)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Download className="w-4 h-4" /> Download Official PDF Invoice
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
