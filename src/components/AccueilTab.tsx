import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Plus, ScanLine, ArrowDownLeft, FileDown, Eye, EyeOff, ChevronRight, CheckCircle2, ShieldCheck, HelpCircle, QrCode } from 'lucide-react';
import { UserProfile, Transaction, CreditCard } from '../types';

interface AccueilTabProps {
  profile: UserProfile;
  card: CreditCard;
  transactions: Transaction[];
  onSelectTab: (tab: string) => void;
  onSelectTransaction: (tx: Transaction) => void;
  onTriggerNotification: (title: string, desc: string, type: 'success' | 'info' | 'warning') => void;
  isDarkMode: boolean;
}

export const AccueilTab: React.FC<AccueilTabProps> = ({
  profile,
  card,
  transactions,
  onSelectTab,
  onSelectTransaction,
  onTriggerNotification,
  isDarkMode,
}) => {
  const [showFullCard, setShowFullCard] = useState(false);
  
  // Custom modals/popups for quick actions
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [downloadingRib, setDownloadingRib] = useState(false);

  // Helper to copy/download RIB
  const handleDownloadRib = () => {
    setDownloadingRib(true);
    onTriggerNotification("Téléchargement du RIB", "Génération du document PDF sécurisé en cours...", "info");
    
    setTimeout(() => {
      setDownloadingRib(false);
      onTriggerNotification(
        "RIB Téléchargé",
        "Le RIB (FR76 3000... 1234 567) a été enregistré dans vos téléchargements d'élite.",
        "success"
      );
    }, 2500);
  };

  return (
    <div className="space-y-6 pt-4 px-6 relative">
      
      {/* Header Profile Info row */}
      <div className="flex justify-between items-center">
        <div>
          <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Bonjour,
          </span>
          <h1 className="text-xl font-bold tracking-tight mt-0.5">{profile.name}</h1>
          <span className="block text-[10px] font-extrabold text-blue-500 uppercase mt-1 tracking-wider">
            {profile.tier}
          </span>
        </div>

        {/* Profile photo circle - clicking opens profile tab */}
        <button
          onClick={() => onSelectTab('profil')}
          className="relative w-12 h-12 rounded-full border-2 border-blue-500/30 p-0.5 overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>

      {/* Main Glassmorphic Bank Card Box */}
      <div className="relative">
        <div className={`w-full bg-gradient-to-tr from-blue-700 via-indigo-800 to-blue-900 rounded-[28px] p-6 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden aspect-[1.58/1]`}>
          
          {/* Subtle grid accent design */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />
          
          {/* Card Top Block */}
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest opacity-80 uppercase">
                Compte Premium Privé
              </span>
              <p className="text-[8px] font-bold text-blue-300 tracking-wider uppercase mt-0.5">
                IBAN: {profile.iban.substring(0, 15)}...
              </p>
            </div>
            {/* Contactless waves symbol */}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white/90" />
            </div>
          </div>

          {/* Card Middle Balance Row */}
          <div className="z-10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200/80">Solde disponible</span>
            <div className="flex items-baseline gap-1 mt-1">
              <h2 className="text-3xl font-extrabold font-mono tracking-tight">
                {profile.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
              </h2>
              <span className="text-lg font-bold text-blue-200">€</span>
            </div>
          </div>

          {/* Card Bottom Details & Clickable Button */}
          <div className="flex justify-between items-end z-10 border-t border-white/10 pt-3">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-blue-200/75">Titulaire du compte</span>
              <span className="text-xs font-bold uppercase tracking-wider">{profile.name}</span>
            </div>

            {/* "Voir les détails" action button */}
            <button
              onClick={() => setShowFullCard(!showFullCard)}
              className="py-1.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-[10px] font-bold tracking-tight flex items-center gap-1 transition-all cursor-pointer backdrop-blur-md"
            >
              {showFullCard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showFullCard ? 'Masquer' : 'Voir les détails'}</span>
            </button>
          </div>

          {/* Smooth drop card overlay holding complete details */}
          <AnimatePresence>
            {showFullCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-20 p-5 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                    Détails du compte Premium
                  </span>
                  <button
                    onClick={() => setShowFullCard(false)}
                    className="text-xs font-extrabold text-white/60 hover:text-white"
                  >
                    Fermer
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Numéro de compte :</span>
                    <span className="font-mono font-bold text-white">{profile.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IBAN fictif :</span>
                    <span className="font-mono font-bold text-white text-[10px]">{profile.iban}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">BIC :</span>
                    <span className="font-mono font-bold text-white">{profile.bic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Carte virtuelle :</span>
                    <span className="font-mono font-bold text-white">{card.number}</span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[8px] font-extrabold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Statut : Compte Actif
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* QUICK ACTIONS ROW: 5 actions requested:
          - Faire un virement (Virements tab)
          - Ajouter un bénéficiaire (Virements tab + form)
          - Scanner un QR Code (Popup QR code)
          - Recevoir un paiement (Popup QR code)
          - Télécharger un RIB (Trigger RIB download) */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Actions rapides
        </h3>

        {/* Action icons Grid */}
        <div className="grid grid-cols-5 gap-1.5">
          
          {/* Action 1: Faire un virement */}
          <button
            onClick={() => onSelectTab('virements')}
            className="flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600/20' 
                : 'bg-blue-50 border border-blue-100/50 text-blue-600 group-hover:bg-blue-100'
            }`}>
              <ArrowUpRight className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[8px] font-extrabold text-center tracking-tighter max-w-[55px] uppercase opacity-85">
              Virement
            </span>
          </button>

          {/* Action 2: Ajouter bénéficiaire */}
          <button
            onClick={() => onSelectTab('virements')}
            className="flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600/20' 
                : 'bg-blue-50 border border-blue-100/50 text-blue-600 group-hover:bg-blue-100'
            }`}>
              <Plus className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[8px] font-extrabold text-center tracking-tighter max-w-[55px] uppercase opacity-85">
              Bénéficiaire
            </span>
          </button>

          {/* Action 3: Scanner un QR Code */}
          <button
            onClick={() => setShowQrScanner(true)}
            className="flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600/20' 
                : 'bg-blue-50 border border-blue-100/50 text-blue-600 group-hover:bg-blue-100'
            }`}>
              <ScanLine className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[8px] font-extrabold text-center tracking-tighter max-w-[55px] uppercase opacity-85">
              Scanner QR
            </span>
          </button>

          {/* Action 4: Recevoir paiement */}
          <button
            onClick={() => setShowReceiveModal(true)}
            className="flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600/20' 
                : 'bg-blue-50 border border-blue-100/50 text-blue-600 group-hover:bg-blue-100'
            }`}>
              <ArrowDownLeft className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[8px] font-extrabold text-center tracking-tighter max-w-[55px] uppercase opacity-85">
              Recevoir
            </span>
          </button>

          {/* Action 5: Télécharger RIB */}
          <button
            onClick={handleDownloadRib}
            disabled={downloadingRib}
            className="flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isDarkMode 
                ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-600/20' 
                : 'bg-blue-50 border border-blue-100/50 text-blue-600 group-hover:bg-blue-100'
            }`}>
              <FileDown className={`w-5 h-5 stroke-[2] ${downloadingRib ? 'animate-bounce' : ''}`} />
            </div>
            <span className="text-[8px] font-extrabold text-center tracking-tighter max-w-[55px] uppercase opacity-85">
              RIB
            </span>
          </button>

        </div>
      </div>

      {/* RECENT TRANSACTIONS SECTION */}
      <div className="space-y-3 pb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Activité récente
          </h3>
          <button
            onClick={() => onSelectTab('transactions')}
            className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Voir tout</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* List (first 5) */}
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx) => {
            const isCredit = tx.amount > 0;
            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className={`rounded-2xl p-4 border flex justify-between items-center cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] ${
                  isDarkMode 
                    ? 'bg-slate-900/30 hover:bg-slate-900/50 border-slate-800/80' 
                    : 'bg-white hover:bg-slate-50 border-slate-100 shadow-2xs'
                }`}
              >
                <div className="flex gap-3.5 items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCredit 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {tx.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-tight">{tx.name}</h4>
                    <p className={`text-[10px] font-semibold mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {tx.date} • {tx.time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold font-mono ${
                    isCredit ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {isCredit ? '+' : ''}{tx.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </span>
                  <span className="block text-[8px] font-extrabold text-slate-400 mt-1">
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK MODALS AND OVERLAYS */}

      {/* Modal A: QR Code Scanner (Simulated camera scan) */}
      <AnimatePresence>
        {showQrScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-between p-6 pointer-events-auto text-white"
          >
            <div className="flex justify-between items-center mt-8">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Scanneur de QR Code
              </span>
              <button
                onClick={() => setShowQrScanner(false)}
                className="text-xs font-bold text-white/70 hover:text-white"
              >
                Fermer
              </button>
            </div>

            {/* Scanner Area */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative w-64 h-64 border-4 border-dashed border-blue-500 rounded-3xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5" />
                {/* Simulated scan line laser movement */}
                <div className="w-full h-1 bg-blue-500 shadow-lg shadow-blue-500 absolute top-0 animate-[bounce_3s_infinite]" />
                <QrCode className="w-20 h-20 text-white/35" />
              </div>
              <p className="text-[11px] font-semibold text-center text-slate-300 max-w-xs leading-relaxed">
                Positionnez le code QR de paiement à l'intérieur du cadre pour une détection et un transfert ultra-rapide.
              </p>
            </div>

            <div className="mb-10 text-center">
              <button
                onClick={() => {
                  setShowQrScanner(false);
                  onTriggerNotification(
                    "QR Code Détecté",
                    "Scan réussi. Transfert de 42,00 € vers Cafétéria Lounge validé.",
                    "success"
                  );
                }}
                className="py-3 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-xs"
              >
                Simuler un scan réussi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal B: Recevoir un paiement (Simulated QR Code generation) */}
      <AnimatePresence>
        {showReceiveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md z-50 flex flex-col justify-end pointer-events-auto"
          >
            <div className="absolute inset-0 z-0" onClick={() => setShowReceiveModal(false)} />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className={`w-full rounded-t-[32px] p-6 text-center z-10 transition-colors duration-300 ${
                isDarkMode ? 'bg-[#0f172a] text-white border-t border-slate-800' : 'bg-white text-slate-800'
              }`}
            >
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-5" onClick={() => setShowReceiveModal(false)} />
              
              <h3 className="text-sm font-bold tracking-tight">Recevoir un paiement</h3>
              <p className={`text-[10px] mt-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Présentez ce code QR à l'émetteur pour recevoir des fonds instantanément.
              </p>

              {/* QR display card */}
              <div className="my-6 p-4 bg-white rounded-3xl max-w-[200px] mx-auto border border-slate-100 shadow-md">
                <QrCode className="w-40 h-40 text-slate-900 mx-auto" />
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider">Vos coordonnées de virement</p>
                <p className="font-mono font-bold select-all bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl text-[10px]">
                  {profile.iban}
                </p>
                <p className="font-mono font-bold text-slate-400">BIC: {profile.bic}</p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(profile.iban);
                  setShowReceiveModal(false);
                  onTriggerNotification("IBAN Copié", "Les coordonnées bancaires ont été stockées pour partage.", "success");
                }}
                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl cursor-pointer"
              >
                Copier mon IBAN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
