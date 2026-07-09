import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Clipboard, Copy, Check, Bell, Shield, Eye, Settings, HelpCircle, LogOut, Moon, Sun, ChevronRight, Globe, Info, CreditCard } from 'lucide-react';
import { UserProfile, BankNotification } from '../types';

interface ProfilTabProps {
  profile: UserProfile;
  notifications: BankNotification[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClearNotifications: () => void;
  isBiometricEnabled: boolean;
  onToggleBiometric: () => void;
  isAlertSalaryEnabled: boolean;
  onToggleSalaryAlert: () => void;
  isAlertCardEnabled: boolean;
  onToggleCardAlert: () => void;
  isAlertLoginEnabled: boolean;
  onToggleLoginAlert: () => void;
}

export const ProfilTab: React.FC<ProfilTabProps> = ({
  profile,
  notifications,
  isDarkMode,
  onToggleDarkMode,
  onClearNotifications,
  isBiometricEnabled,
  onToggleBiometric,
  isAlertSalaryEnabled,
  onToggleSalaryAlert,
  isAlertCardEnabled,
  onToggleCardAlert,
  isAlertLoginEnabled,
  onToggleLoginAlert,
}) => {
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedBic, setCopiedBic] = useState(false);

  // Password edit form states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Support contact popup states
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleCopyIban = () => {
    navigator.clipboard.writeText(profile.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleCopyBic = () => {
    navigator.clipboard.writeText(profile.bic);
    setCopiedBic(true);
    setTimeout(() => setCopiedBic(false), 2000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setPasswordSuccess('Mot de passe mis à jour !');
    setTimeout(() => {
      setShowPasswordForm(false);
      setOldPassword('');
      setNewPassword('');
      setPasswordSuccess('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pt-4 px-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Votre Espace Personnel</h1>
        <p className={`text-xs mt-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Consultez vos coordonnées bancaires et paramétrez vos préférences de sécurité.
        </p>
      </div>

      {/* Profile ID Card */}
      <div className={`p-5 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden transition-colors ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900/60 to-slate-900/20 border-slate-800' 
          : 'bg-gradient-to-br from-blue-50/20 to-white border-slate-100 shadow-2xs'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* round profile photo */}
        <div className="relative mb-3">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse" />
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md relative z-10"
            referrerPolicy="no-referrer"
          />
        </div>

        <h2 className="text-base font-bold tracking-tight">{profile.name}</h2>
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold mt-2 bg-blue-500/10 text-blue-500">
          <Settings className="w-3 h-3 animate-spin" />
          <span>{profile.tier}</span>
        </span>

        {/* Credentials copy field block */}
        <div className="w-full mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5 text-left text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold">Numéro de compte</span>
            <span className="font-mono font-bold">{profile.accountNumber}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold">IBAN</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-[10px]">
              <span>{profile.iban.substring(0, 15)}...</span>
              <button
                onClick={handleCopyIban}
                className="p-1 rounded text-blue-500 hover:bg-blue-500/10 transition-colors"
                title="Copier l'IBAN"
              >
                {copiedIban ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold">Code BIC / SWIFT</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-[10px]">
              <span>{profile.bic}</span>
              <button
                onClick={handleCopyBic}
                className="p-1 rounded text-blue-500 hover:bg-blue-500/10 transition-colors"
                title="Copier le BIC"
              >
                {copiedBic ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold">Email de contact</span>
            <span className="font-bold">{profile.email}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold">Téléphone</span>
            <span className="font-bold">{profile.phone}</span>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        
        {/* SECTION A: PREFERENCES GENERALES */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-100 shadow-2xs'
        } space-y-4.5`}>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Préférences Générales
          </h3>

          {/* Dark Mode Switch */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDarkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
              }`}>
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-bold">Mode Sombre</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Activer l'ambiance lumineuse nocturne</p>
              </div>
            </div>

            <button
              onClick={onToggleDarkMode}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${
                isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                isDarkMode ? 'transform translate-x-5' : ''
              }`} />
            </button>
          </div>

          {/* Langue */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold">Langue</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Modifier la langue de l'interface</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">Français (FR)</span>
          </div>

          {/* Devise */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold">Devise Principale</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Devise d'affichage des comptes</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">Euro (€)</span>
          </div>
        </div>

        {/* SECTION B: SÉCURITÉ */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-100 shadow-2xs'
        } space-y-4.5`}>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Sécurité & Authentification
          </h3>

          {/* Biometrics */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center`}>
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold">Authentification Biométrique</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">FaceID / Empreinte digitale au démarrage</p>
              </div>
            </div>

            <button
              onClick={onToggleBiometric}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${
                isBiometricEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                isBiometricEnabled ? 'transform translate-x-5' : ''
              }`} />
            </button>
          </div>

          {/* Change Password trigger */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold">Mot de passe de l'espace</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Sécurisez votre compte d'élite</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-xs font-bold text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              Modifier
            </button>
          </div>

          {/* Change Password Drawer */}
          <AnimatePresence>
            {showPasswordForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`overflow-hidden rounded-2xl p-4 border ${
                  isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-150'
                }`}
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <input
                    type="password"
                    placeholder="Ancien mot de passe"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none ${
                      isDarkMode ? 'bg-[#030712] border-slate-800 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none ${
                      isDarkMode ? 'bg-[#030712] border-slate-800 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                  
                  {passwordSuccess && (
                    <p className="text-[10px] font-bold text-emerald-500">{passwordSuccess}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Valider le changement
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION C: NOTIFICATIONS */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-100 shadow-2xs'
        } space-y-4.5`}>
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Alertes & Notifications push
            </h3>
            <button
              onClick={onClearNotifications}
              className="text-[9px] font-extrabold text-rose-500 uppercase tracking-wider"
            >
              Vider l'historique
            </button>
          </div>

          {/* Salary alert */}
          <div className="flex justify-between items-center text-xs">
            <div>
              <h4 className="font-bold">Dépôt de salaire</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Recevoir une alerte lors des versements</p>
            </div>
            <button
              onClick={onToggleSalaryAlert}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${
                isAlertSalaryEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                isAlertSalaryEnabled ? 'transform translate-x-5' : ''
              }`} />
            </button>
          </div>

          {/* Card alert */}
          <div className="flex justify-between items-center text-xs">
            <div>
              <h4 className="font-bold">Utilisation de la carte</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Alerte push instantanée pour chaque paiement carte</p>
            </div>
            <button
              onClick={onToggleCardAlert}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${
                isAlertCardEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                isAlertCardEnabled ? 'transform translate-x-5' : ''
              }`} />
            </button>
          </div>

          {/* Login alert */}
          <div className="flex justify-between items-center text-xs">
            <div>
              <h4 className="font-bold">Connexions suspectes</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Alerter si connexion depuis un nouvel appareil</p>
            </div>
            <button
              onClick={onToggleLoginAlert}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${
                isAlertLoginEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                isAlertLoginEnabled ? 'transform translate-x-5' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* SECTION D: HELP, VERSION & SUPPORT */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-100 shadow-2xs'
        } space-y-4`}>
          <div className="flex justify-between items-center text-xs cursor-pointer" onClick={() => setShowSupportModal(true)}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold">Aide & Support Premium</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Chattez en direct avec un conseiller Élite</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold">Version de l'application</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Système d'exploitation mobile haut de gamme</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
              v4.8.2
            </span>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={() => alert('Déconnexion réussie de la session premium.')}
          className="w-full py-3.5 border border-rose-500/20 hover:bg-rose-500/5 rounded-2xl text-xs font-bold text-rose-500 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>

      </div>

      {/* Interactive Support Modal Popup */}
      <AnimatePresence>
        {showSupportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className={`w-full max-w-sm rounded-3xl p-5 border shadow-2xl relative ${
                isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
              }`}
            >
              <h3 className="text-sm font-bold tracking-tight">Support Élite de Gérad Lopez</h3>
              <p className={`text-[11px] leading-relaxed mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Votre conseiller d'affaires dédié est disponible 24h/24 par ligne directe et sécurisée au <strong>+33 1 89 22 55 00</strong> ou par email à l'adresse <strong>elite.support@bnp-premium.fr</strong>.
              </p>
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Fermer l'assistance
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
