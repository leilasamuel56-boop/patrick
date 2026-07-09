import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, User, Settings2, Shield, QrCode, CreditCard, ChevronRight, Share2, HelpCircle, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  certificatesCount: number;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, certificatesCount }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="space-y-4">
      {/* Tab Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Mon Espace</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gérez vos diplômes, accréditations d'État et paramètres d'authentification.
          </p>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tactile Digital Pass (Apple Wallet style flip card) */}
      <div className="perspective-1000 w-full h-52 relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full h-full transform-style-3d relative"
        >
          {/* Card Front (Student Badge) */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-xl border border-white/15 flex flex-col justify-between overflow-hidden">
            {/* Glossy background textures */}
            <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full blur-3xl opacity-20 bg-blue-500" />
            <div className="absolute left-10 bottom-10 w-40 h-40 rounded-full blur-2xl opacity-10 bg-emerald-500" />

            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-blue-400 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">Carte d'Étudiant</h3>
                  <p className="text-[9px] text-indigo-200 font-semibold tracking-wider">EDU PRESTIGE ACADEMY</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md uppercase">
                  Statut Actif
                </span>
              </div>
            </div>

            {/* Profile Avatar and Info */}
            <div className="flex gap-4 items-center z-10">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0 shadow-md">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-base font-bold text-white tracking-tight">
                  {profile.name}
                </h4>
                <p className="text-[11px] text-slate-300 font-medium">
                  {profile.rank}
                </p>
                <p className="font-mono text-[10px] text-slate-400 tracking-wider">
                  ID : {profile.accountNumber}
                </p>
              </div>
            </div>

            {/* Tap to flip action indicator */}
            <div className="flex justify-between items-center text-[9px] text-indigo-200 border-t border-white/10 pt-2 z-10 font-semibold">
              <span>PROFIL OFFICIEL CERTIFIÉ</span>
              <span className="flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                <span>Toucher pour scanner</span>
              </span>
            </div>
          </div>

          {/* Card Back (QR Code / Scan code) */}
          <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-xl border border-white/15 flex flex-col justify-between overflow-hidden">
            <div className="text-center space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Validation Numérique</h3>
              <p className="text-[9px] text-indigo-300 font-semibold">Scannez ce QR Code pour partager votre dossier d'apprentissage</p>
            </div>

            {/* QR Code Center block */}
            <div className="flex justify-center items-center">
              <div className="w-24 h-24 bg-white p-2 rounded-2xl flex items-center justify-center shadow-md border border-white/20">
                {/* Simulated high quality luxury vector QR code */}
                <div className="grid grid-cols-5 gap-1.5 w-full h-full">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 3 === 0 || i % 7 === 0 || i < 5 || i > 20 || i % 5 === 0) && i !== 12
                          ? 'bg-slate-900'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tap to flip back */}
            <div className="flex justify-between items-center text-[9px] text-indigo-200 border-t border-white/10 pt-2 font-semibold">
              <span>RETOURNER LA CARTE</span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Détails d'identité</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile menu categories */}
      <div className="space-y-2">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mt-2">Dossier Certificats</h2>
        
        {/* Certificates Section */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Award className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Diplômes universitaires acquis</p>
              <p className="text-[10px] text-slate-500 font-medium">{certificatesCount} certificats officiels d'État émis</p>
            </div>
          </div>
          <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all">
            Consulter
          </button>
        </div>

        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mt-4">Assistance & Sécurité</h2>

        {/* Security / Preferences list */}
        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-2xs text-xs font-medium text-slate-700">
          <div className="flex justify-between items-center p-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Authentification Double Facteur (2FA)</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Activée</span>
          </div>

          <div className="flex justify-between items-center p-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Exporter mon rapport CPF d'heures d'étude</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex justify-between items-center p-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>FAQ & Support d'inscription d'État</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Global CSS perspective needed for flipping effects */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};
