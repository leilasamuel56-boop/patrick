import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Plus, ArrowRightLeft, User, Clipboard, Calendar, DollarSign, FileText, Check, Landmark, Mail, Phone, AlertCircle } from 'lucide-react';
import { Payee, TransferHistory } from '../types';

interface VirementsTabProps {
  balance: number;
  payees: Payee[];
  transferHistory: TransferHistory[];
  onAddPayee: (payee: Omit<Payee, 'id'>) => void;
  onMakeTransfer: (transfer: { payeeName: string; iban: string; amount: number; note: string; date: string }) => boolean;
  isDarkMode: boolean;
}

export const VirementsTab: React.FC<VirementsTabProps> = ({
  balance,
  payees,
  transferHistory,
  onAddPayee,
  onMakeTransfer,
  isDarkMode,
}) => {
  // Tabs for the Virements view
  const [activeSubTab, setActiveSubTab] = useState<'send' | 'payees'>('send');

  // Virement form states
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [selectedPayeeId, setSelectedPayeeId] = useState('');
  const [customPayeeName, setCustomPayeeName] = useState('');
  const [customIban, setCustomIban] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Beneficiary form states
  const [showAddPayeeForm, setShowAddPayeeForm] = useState(false);
  const [payeeName, setPayeeName] = useState('');
  const [payeeIban, setPayeeIban] = useState('');
  const [payeeBank, setPayeeBank] = useState('');
  const [payeeEmail, setPayeeEmail] = useState('');
  const [payeePhone, setPayeePhone] = useState('');
  const [payeeSuccessMsg, setPayeeSuccessMsg] = useState('');

  // Handle transaction submission
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setErrorMsg('Veuillez saisir un montant supérieur à 0 €.');
      return;
    }

    if (transferAmount > balance) {
      setErrorMsg('Solde insuffisant pour effectuer ce virement.');
      return;
    }

    let recipientName = '';
    let recipientIban = '';

    if (selectedPayeeId === 'custom') {
      if (!customPayeeName.trim() || !customIban.trim()) {
        setErrorMsg('Veuillez renseigner le nom et l\'IBAN du bénéficiaire.');
        return;
      }
      recipientName = customPayeeName;
      recipientIban = customIban;
    } else {
      const selectedPayee = payees.find((p) => p.id === selectedPayeeId);
      if (!selectedPayee) {
        setErrorMsg('Veuillez sélectionner un bénéficiaire.');
        return;
      }
      recipientName = selectedPayee.name;
      recipientIban = selectedPayee.iban;
    }

    // Trigger parent state update
    const result = onMakeTransfer({
      payeeName: recipientName,
      iban: recipientIban,
      amount: transferAmount,
      note: note || 'Virement sortant',
      date: date,
    });

    if (result) {
      setSuccessMsg('Virement enregistré avec succès !');
      setTimeout(() => {
        setShowTransferForm(false);
        // Reset states
        setSelectedPayeeId('');
        setCustomPayeeName('');
        setCustomIban('');
        setAmount('');
        setNote('');
        setSuccessMsg('');
      }, 1500);
    } else {
      setErrorMsg('Une erreur est survenue lors du virement.');
    }
  };

  // Handle adding a payee
  const handleAddPayeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayeeSuccessMsg('');

    if (!payeeName.trim() || !payeeIban.trim() || !payeeBank.trim()) {
      alert('Veuillez remplir les champs obligatoires (Nom, IBAN, Banque).');
      return;
    }

    onAddPayee({
      name: payeeName,
      iban: payeeIban,
      bank: payeeBank,
      email: payeeEmail,
      phone: payeePhone,
    });

    setPayeeSuccessMsg('Bénéficiaire ajouté avec succès !');
    setTimeout(() => {
      setShowAddPayeeForm(false);
      // Reset payee fields
      setPayeeName('');
      setPayeeIban('');
      setPayeeBank('');
      setPayeeEmail('');
      setPayeePhone('');
      setPayeeSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pt-4 px-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Virements & Transferts</h1>
        <p className={`text-xs mt-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Gérez vos bénéficiaires et envoyez des fonds de manière instantanée et sécurisée.
        </p>
      </div>

      {/* Mini Tabs Selector */}
      <div className={`p-1 rounded-xl flex gap-1 border ${
        isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100/70 border-slate-200/50'
      }`}>
        <button
          onClick={() => setActiveSubTab('send')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'send'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Transférer
        </button>
        <button
          onClick={() => setActiveSubTab('payees')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'payees'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Bénéficiaires ({payees.length})
        </button>
      </div>

      {/* TAB 1: TRANSFÉRER */}
      {activeSubTab === 'send' && (
        <div className="space-y-6">
          
          {/* Action Trigger Button */}
          {!showTransferForm ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowTransferForm(true)}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Nouveau virement
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-5 border ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
              } space-y-4`}
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-blue-500">
                  Saisir un virement
                </h3>
                <button
                  onClick={() => setShowTransferForm(false)}
                  className="text-xs font-extrabold text-slate-400 hover:text-slate-600"
                >
                  Annuler
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleTransferSubmit} className="space-y-4">
                
                {/* Beneficiary Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Bénéficiaire
                  </label>
                  <select
                    value={selectedPayeeId}
                    onChange={(e) => setSelectedPayeeId(e.target.value)}
                    required
                    className={`w-full text-xs font-semibold p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all ${
                      isDarkMode 
                        ? 'bg-[#0f172a] border-slate-800 text-white focus:border-blue-500' 
                        : 'bg-white border-slate-100 focus:border-blue-500'
                    }`}
                  >
                    <option value="">-- Choisir un bénéficiaire --</option>
                    {payees.map((payee) => (
                      <option key={payee.id} value={payee.id}>
                        {payee.name} ({payee.bank})
                      </option>
                    ))}
                    <option value="custom">+ Nouveau bénéficiaire temporaire</option>
                  </select>
                </div>

                {/* Custom Beneficiary Fields if "custom" is selected */}
                <AnimatePresence>
                  {selectedPayeeId === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Jean Dupont"
                          value={customPayeeName}
                          onChange={(e) => setCustomPayeeName(e.target.value)}
                          className={`w-full text-xs font-semibold p-3 rounded-xl border focus:outline-none transition-all ${
                            isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          IBAN du bénéficiaire
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: FR76 3000..."
                          value={customIban}
                          onChange={(e) => setCustomIban(e.target.value)}
                          className={`w-full text-xs font-semibold p-3 rounded-xl border focus:outline-none transition-all ${
                            isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Amount input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                    <span>Montant</span>
                    <span className="text-blue-500">Solde disponible : {balance.toLocaleString('fr-FR')} €</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className={`w-full text-xs font-mono font-bold p-3 pl-9 pr-12 rounded-xl border focus:outline-none transition-all ${
                        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      EUR
                    </span>
                  </div>
                </div>

                {/* Motif / Note */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Motif du virement
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: Remboursement ou Loyer"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className={`w-full text-xs font-semibold p-3 pl-9 rounded-xl border focus:outline-none transition-all ${
                        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                      }`}
                    />
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Date d'exécution
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className={`w-full text-xs font-semibold p-3 pl-9 rounded-xl border focus:outline-none transition-all ${
                        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                      }`}
                    />
                  </div>
                </div>

                {/* Feedback Alerts */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-2 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2 text-xs font-semibold">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer transition-all flex justify-center items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Valider le Virement
                </button>
              </form>
            </motion.div>
          )}

          {/* Transfer History Header */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Historique des virements
            </h3>

            {/* List */}
            <div className="space-y-3">
              {transferHistory.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl p-4 border flex justify-between items-center transition-colors ${
                    isDarkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white border-slate-100 shadow-2xs'
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.type === 'Reçu' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : item.type === 'Programmé'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{item.payeeName}</h4>
                      <p className={`text-[10px] font-semibold mt-0.5 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {item.date} {item.note ? `• ${item.note}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-extrabold font-mono ${
                      item.type === 'Reçu' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {item.type === 'Reçu' ? '+' : '-'}{item.amount.toLocaleString('fr-FR')} €
                    </span>
                    <span className={`block text-[8px] uppercase tracking-wider font-extrabold mt-1 ${
                      item.type === 'Reçu' 
                        ? 'text-emerald-500' 
                        : item.type === 'Programmé'
                          ? 'text-amber-500'
                          : 'text-slate-400'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BÉNÉFICIAIRES */}
      {activeSubTab === 'payees' && (
        <div className="space-y-6">
          
          {/* Add payee toggle */}
          {!showAddPayeeForm ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowAddPayeeForm(true)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              Ajouter un bénéficiaire
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-5 border ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
              } space-y-4`}
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Nouveau Bénéficiaire
                </h3>
                <button
                  onClick={() => setShowAddPayeeForm(false)}
                  className="text-xs font-extrabold text-slate-400 hover:text-slate-600"
                >
                  Fermer
                </button>
              </div>

              <form onSubmit={handleAddPayeeSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Nom complet *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: Marie Dubois"
                      value={payeeName}
                      onChange={(e) => setPayeeName(e.target.value)}
                      required
                      className={`w-full text-xs font-semibold p-3 pl-9 rounded-xl border focus:outline-none transition-all ${
                        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    IBAN *
                  </label>
                  <div className="relative">
                    <Clipboard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: FR76 3004..."
                      value={payeeIban}
                      onChange={(e) => setPayeeIban(e.target.value)}
                      required
                      className={`w-full text-xs font-semibold p-3 pl-9 rounded-xl border focus:outline-none transition-all ${
                        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Banque *
                  </label>
                  <div className="relative">
                    <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: BNP Paribas, LCL"
                      value={payeeBank}
                      onChange={(e) => setPayeeBank(e.target.value)}
                      required
                      className={`w-full text-xs font-semibold p-3 pl-9 rounded-xl border focus:outline-none transition-all ${
                        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="Ex: marie@gmail.com"
                        value={payeeEmail}
                        onChange={(e) => setPayeeEmail(e.target.value)}
                        className={`w-full text-xs font-semibold p-3 pl-9 rounded-xl border focus:outline-none transition-all ${
                          isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Ex: 06 00 00 00"
                        value={payeePhone}
                        onChange={(e) => setPayeePhone(e.target.value)}
                        className={`w-full text-xs font-semibold p-3 pl-9 rounded-xl border focus:outline-none transition-all ${
                          isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {payeeSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2 text-xs font-semibold">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>{payeeSuccessMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer transition-all"
                >
                  Enregistrer
                </button>
              </form>
            </motion.div>
          )}

          {/* Payees list */}
          <div className="grid grid-cols-1 gap-3">
            {payees.map((payee) => (
              <div
                key={payee.id}
                className={`rounded-2xl p-4 border flex justify-between items-center transition-colors ${
                  isDarkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white border-slate-100 shadow-2xs'
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white`}>
                    {payee.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{payee.name}</h4>
                    <p className={`text-[10px] font-semibold mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {payee.bank} • {payee.iban.substring(0, 15)}...
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Set selected payee to start a transfer
                    setSelectedPayeeId(payee.id);
                    setActiveSubTab('send');
                    setShowTransferForm(true);
                  }}
                  className="text-xs font-extrabold text-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  Envoyer
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
