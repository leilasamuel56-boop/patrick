import React from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Clock, Clipboard, CreditCard, MapPin, Tag, MessageSquare, ShieldCheck, Check } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
  isDarkMode: boolean;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  isDarkMode,
}) => {
  const isCredit = transaction.amount > 0;

  // Copy reference code to clipboard helper
  const handleCopyReference = () => {
    navigator.clipboard.writeText(transaction.reference);
    // Simple visual feed is handled by temporary popup if needed, or we just rely on standard prompt
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end pointer-events-auto">
      {/* Click outside backdrop close helper */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className={`w-full rounded-t-[32px] p-6 max-h-[90%] overflow-y-auto z-10 border-t transition-colors duration-300 relative ${
          isDarkMode 
            ? 'bg-[#0f172a]/95 border-slate-800 text-slate-100 shadow-2xl' 
            : 'bg-white/95 border-slate-100 text-slate-800 shadow-2xl'
        } backdrop-blur-xl`}
      >
        {/* Soft Drag Handle */}
        <div className={`w-12 h-1.5 rounded-full mx-auto mb-6 ${
          isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
        }`} onClick={onClose} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Transaction Hero Info */}
        <div className="text-center mb-6">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
            isCredit 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : 'bg-rose-500/10 text-rose-500'
          }`}>
            <Tag className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold tracking-tight">{transaction.name}</h2>
          <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {transaction.category}
          </p>

          <h3 className={`text-2xl font-extrabold font-mono mt-3 tracking-tight ${
            isCredit ? 'text-emerald-500' : 'text-rose-500'
          }`}>
            {isCredit ? '+' : ''}{transaction.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </h3>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold mt-3 bg-blue-500/10 text-blue-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{transaction.status}</span>
          </div>
        </div>

        {/* Detail Parameters List */}
        <div className={`space-y-4 rounded-2xl p-4 border ${
          isDarkMode ? 'bg-slate-900/50 border-slate-800/80' : 'bg-slate-50/50 border-slate-100'
        }`}>
          {/* Date & Time */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>Date et Heure</span>
            </div>
            <span className="font-bold">{transaction.date} à {transaction.time}</span>
          </div>

          {/* Reference with copy */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Clipboard className="w-4 h-4" />
              <span>Référence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold tracking-tight text-[10px] bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {transaction.reference}
              </span>
              <button
                onClick={handleCopyReference}
                className="text-blue-500 hover:text-blue-600 font-extrabold cursor-pointer text-[10px]"
              >
                Copier
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <CreditCard className="w-4 h-4" />
              <span>Méthode</span>
            </div>
            <span className="font-bold">{transaction.paymentMethod}</span>
          </div>

          {/* Location */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>Localisation</span>
            </div>
            <span className="font-bold">{transaction.location}</span>
          </div>

          {/* Notes */}
          <div className="flex justify-between items-start text-xs pt-3 border-t border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mt-0.5">
              <MessageSquare className="w-4 h-4" />
              <span>Note</span>
            </div>
            <p className="font-bold text-right max-w-[180px] break-words">{transaction.notes || 'Aucune note'}</p>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-blue-500/15 cursor-pointer text-center"
          >
            Fermer le reçu
          </button>
        </div>
      </motion.div>
    </div>
  );
};
