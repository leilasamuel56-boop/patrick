import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Eye, EyeOff, ShieldCheck, TrendingUp, Sparkles, Plus } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  accountNumber: string;
  name: string;
  brandColor: string;
  onAddFunds?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  accountNumber,
  name,
  brandColor,
  onAddFunds,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [displayBalance, setDisplayBalance] = useState(0);

  // Smooth Count Up animation for the balance
  useEffect(() => {
    let start = displayBalance;
    const end = balance;
    if (start === end) return;

    const duration = 1200; // ms
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - percentage, 3);
      const current = Math.floor(start + (end - start) * easeProgress);
      
      setDisplayBalance(current);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setDisplayBalance(end);
      }
    };

    requestAnimationFrame(animate);
  }, [balance]);

  // Format account number to look like a premium bank card: EDU-4587-9231-001 -> EDU4 5879 2310 01
  const formatCardNumber = (num: string) => {
    const clean = num.replace(/[^a-zA-Z0-9]/g, '');
    const segments = [];
    for (let i = 0; i < clean.length; i += 4) {
      segments.push(clean.substring(i, i + 4));
    }
    return segments.join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.15 }}
      className="relative overflow-hidden rounded-3xl premium-shadow premium-glow"
    >
      {/* Background elegant gradient mesh behind the card */}
      <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-sky-400 to-indigo-600`} />
      <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full blur-3xl opacity-20 bg-blue-500" />

      {/* Primary Glass Card body */}
      <div className="relative glass-card p-6 border border-white/60 bg-gradient-to-br from-white/80 to-white/40 shadow-inner">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900/10 flex items-center justify-center text-slate-800 backdrop-blur-md">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Compte Éducatif Personnel</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-700">Certifié CPF & État</span>
              </div>
            </div>
          </div>

          {/* Luxury dual metallic ring decoration */}
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-slate-800/10 border border-white/50 backdrop-blur-sm" />
            <div className="w-6 h-6 rounded-full bg-slate-400/20 border border-white/50 -ml-3.5 backdrop-blur-sm" />
          </div>
        </div>

        {/* Account Number Display */}
        <div className="mb-6">
          <p className="text-[10px] font-medium text-slate-400 tracking-wider mb-1">NUMÉRO DE COMPTE</p>
          <p className="font-mono text-sm font-semibold text-slate-700 tracking-widest">
            {formatCardNumber(accountNumber)}
          </p>
        </div>

        {/* Balance Amount display with privacy toggle */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Solde Disponible</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showBalance ? "Masquer le solde" : "Afficher le solde"}
              >
                {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-baseline gap-1">
              <AnimatePresence mode="wait">
                {showBalance ? (
                  <motion.div
                    key="visible-balance"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-baseline"
                  >
                    <span className="font-display text-3xl font-bold text-slate-800 tracking-tight">
                      {displayBalance.toLocaleString('fr-FR')}
                    </span>
                    <span className="font-display text-xl font-bold text-blue-600 ml-1">€</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="hidden-balance"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-display text-3xl font-bold text-slate-800 tracking-widest"
                  >
                    ••••••
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Top-up/Action button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAddFunds}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide shadow-md transition-all cursor-pointer`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Financer</span>
          </motion.button>
        </div>

        {/* Card Footer detail */}
        <div className="mt-5 pt-4 border-t border-slate-900/5 flex justify-between items-center text-[11px] text-slate-500">
          <div>
            <span className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Titulaire</span>
            <span className="font-bold text-slate-700">{name}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+2 500 € / an</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
