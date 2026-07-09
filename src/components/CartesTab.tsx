import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Eye, EyeOff, ShieldAlert, Sparkles, Check, CheckCircle2, ChevronRight, Globe, Wifi, Settings, HelpCircle, ArrowRightLeft, CreditCard } from 'lucide-react';
import { CreditCard as CardType, Transaction } from '../types';

interface CartesTabProps {
  cards: CardType[];
  cardTransactions: Transaction[];
  onToggleBlockCard: (cardId: string) => void;
  onUpdatePlafond: (cardId: string, value: number) => void;
  onUpdatePin: (cardId: string, newPin: string) => void;
  onToggleInternational: (cardId: string) => void;
  onToggleContactless: (cardId: string) => void;
  onAddNewCard: (card: Omit<CardType, 'id' | 'iban' | 'bic' | 'blocked' | 'plafondSpent'>) => void;
  isDarkMode: boolean;
}

export const CartesTab: React.FC<CartesTabProps> = ({
  cards,
  cardTransactions,
  onToggleBlockCard,
  onUpdatePlafond,
  onUpdatePin,
  onToggleInternational,
  onToggleContactless,
  onAddNewCard,
  isDarkMode,
}) => {
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');
  const [showCardNumbers, setShowCardNumbers] = useState(false);

  // States for PIN code change
  const [showPinForm, setShowPinForm] = useState(false);
  const [newPinCode, setNewPinCode] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');

  // States for new card creation
  const [showCreateCardForm, setShowCreateCardForm] = useState(false);
  const [customCardName, setCustomCardName] = useState('');
  const [customCardColor, setCustomCardColor] = useState<'blue' | 'dark' | 'gold' | 'rose' | 'purple'>('dark');
  const [newCardSuccessMsg, setNewCardSuccessMsg] = useState('');

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  // Helper to change card PIN code
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinCode.length !== 4 || isNaN(parseInt(newPinCode))) {
      alert('Le code PIN doit comporter exactement 4 chiffres.');
      return;
    }
    onUpdatePin(selectedCard.id, newPinCode);
    setPinSuccessMsg('Code PIN modifié avec succès !');
    setTimeout(() => {
      setShowPinForm(false);
      setNewPinCode('');
      setPinSuccessMsg('');
    }, 1500);
  };

  // Helper to generate a new virtual card
  const handleCreateVirtualCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCardName.trim()) {
      alert('Veuillez donner un nom à la carte virtuelle.');
      return;
    }

    // Generate random card details
    const randomCardNumber = Array.from({ length: 4 }, () =>
      Math.floor(1000 + Math.random() * 9000)
    ).join(' ');
    const randomCvv = Math.floor(100 + Math.random() * 900).toString();
    const futureYear = new Date().getFullYear() + 4;
    const futureMonth = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0');
    const expiry = `${futureMonth}/${futureYear.toString().slice(-2)}`;

    onAddNewCard({
      type: 'Virtuelle',
      number: randomCardNumber,
      expiry: expiry,
      cvv: randomCvv,
      holder: 'Gérad Lopez',
      plafondWeekly: 2500,
      pinCode: '0000',
      internationalEnabled: true,
      contactlessEnabled: true,
      colorTheme: customCardColor,
      customName: customCardName,
    });

    setNewCardSuccessMsg('Carte virtuelle générée instantanément !');
    setTimeout(() => {
      setShowCreateCardForm(false);
      setCustomCardName('');
      setCustomCardColor('dark');
      setNewCardSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pt-4 px-6">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Vos Cartes Bancaires</h1>
          <p className={`text-xs mt-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Configurez vos limites de paiement, bloquez vos cartes et générez des cartes virtuelles.
          </p>
        </div>
      </div>

      {/* Cards Scroll list if multiple */}
      {cards.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCardId(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCardId === c.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-white border-slate-200/50 text-slate-500 hover:text-slate-800'
              }`}
            >
              {c.customName || `Carte ${c.type}`} •••• {c.number.slice(-4)}
            </button>
          ))}
        </div>
      )}

      {selectedCard && (
        <div className="space-y-6">
          
          {/* Card Layout Stage */}
          <div className="relative">
            {/* The physical-looking styled credit card container */}
            <motion.div
              layout
              className={`w-full aspect-[1.58/1] rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl transition-all ${
                selectedCard.colorTheme === 'blue'
                  ? 'bg-gradient-to-tr from-blue-700 via-indigo-800 to-blue-900'
                  : selectedCard.colorTheme === 'dark'
                    ? 'bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-850'
                    : selectedCard.colorTheme === 'gold'
                      ? 'bg-gradient-to-tr from-amber-600 via-amber-700 to-yellow-800'
                      : selectedCard.colorTheme === 'rose'
                        ? 'bg-gradient-to-tr from-rose-600 via-pink-700 to-rose-800'
                        : 'bg-gradient-to-tr from-purple-800 via-fuchsia-900 to-purple-950'
              }`}
            >
              {/* Overlay grid lines for premium tech style */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />

              {/* Card Top section */}
              <div className="flex justify-between items-start z-10">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80">
                    {selectedCard.customName || 'Edu-Elite Premium Bank'}
                  </span>
                  <span className="block text-[9px] font-bold text-blue-300 uppercase mt-0.5 tracking-wider">
                    {selectedCard.type} Account
                  </span>
                </div>
                
                {/* Simulated credit card contactless and chip symbol */}
                <div className="flex items-center gap-2.5">
                  <Wifi className="w-4 h-4 text-white/70" />
                  <div className="w-10 h-7 rounded bg-amber-400/20 border border-amber-400/40 opacity-75 relative flex items-center justify-center">
                    <div className="w-5 h-4 border-r border-b border-amber-400/40 absolute left-0 top-0" />
                  </div>
                </div>
              </div>

              {/* Card Numbers section */}
              <div className="space-y-1.5 z-10">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold tracking-widest font-mono text-slate-100">
                    {showCardNumbers 
                      ? selectedCard.number 
                      : `••••  ••••  ••••  ${selectedCard.number.slice(-4)}`
                    }
                  </p>
                  
                  {/* Eye trigger to show numbers */}
                  <button
                    onClick={() => setShowCardNumbers(!showCardNumbers)}
                    className="p-1 rounded text-white/60 hover:text-white transition-colors"
                  >
                    {showCardNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-4 text-[10px] font-medium text-slate-300">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400">Expiration</span>
                    <span className="font-mono font-bold text-slate-100">{selectedCard.expiry}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400">CVV</span>
                    <span className="font-mono font-bold text-slate-100">{showCardNumbers ? selectedCard.cvv : '•••'}</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom section */}
              <div className="flex justify-between items-end z-10 border-t border-white/10 pt-3">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {selectedCard.holder}
                </span>

                {/* Mastercard-like circle symbols */}
                <div className="flex">
                  <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
                  <div className="w-6 h-6 rounded-full bg-amber-500 -ml-3 opacity-80 mix-blend-screen" />
                </div>
              </div>

              {/* Blurring Lock overlay if card is blocked */}
              <AnimatePresence>
                {selectedCard.blocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6"
                  >
                    <Lock className="w-10 h-10 text-rose-500 animate-bounce mb-2" />
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-100">
                      Carte Verrouillée
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
                      Toutes les transactions et autorisations sont suspendues.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Quick Actions Panel */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Block / Unblock Card button */}
            <button
              onClick={() => onToggleBlockCard(selectedCard.id)}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                selectedCard.blocked
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Sécurité</span>
                <span className="text-xs font-bold">{selectedCard.blocked ? 'Débloquer' : 'Verrouiller'}</span>
              </div>
              {selectedCard.blocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </button>

            {/* Change PIN button */}
            <button
              onClick={() => setShowPinForm(!showPinForm)}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Code PIN</span>
                <span className="text-xs font-bold">Changer PIN</span>
              </div>
              <Settings className="w-5 h-5 text-blue-500" />
            </button>

          </div>

          {/* Inline PIN Update Drawer */}
          <AnimatePresence>
            {showPinForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`overflow-hidden rounded-2xl p-4 border ${
                  isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <form onSubmit={handlePinSubmit} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">Définir un nouveau code PIN</span>
                    <span className="text-[10px] font-mono text-slate-400">Actuel : {selectedCard.pinCode}</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={newPinCode}
                      onChange={(e) => setNewPinCode(e.target.value)}
                      className={`flex-1 p-2 rounded-lg text-center font-bold tracking-widest text-sm border focus:outline-none ${
                        isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </div>

                  {pinSuccessMsg && (
                    <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {pinSuccessMsg}
                    </p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ceiling Plafond adjusting sliders */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-100 shadow-2xs'
          } space-y-4`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold">Plafond de paiement hebdomadaire</h4>
                <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Consommé cette semaine : {selectedCard.plafondSpent.toLocaleString('fr-FR')} €
                </p>
              </div>
              <span className="text-xs font-extrabold text-blue-500 font-mono">
                {selectedCard.plafondWeekly.toLocaleString('fr-FR')} € max
              </span>
            </div>

            {/* Simulated slider to adjust limit */}
            <div className="space-y-2">
              <input
                type="range"
                min={1500}
                max={15000}
                step={500}
                value={selectedCard.plafondWeekly}
                onChange={(e) => onUpdatePlafond(selectedCard.id, parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:bg-slate-800"
              />
              <div className="flex justify-between text-[8px] font-extrabold uppercase text-slate-400 tracking-wider">
                <span>Min: 1 500 €</span>
                <span>Max: 15 000 €</span>
              </div>
            </div>
          </div>

          {/* Toggle Features Section */}
          <div className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-100 shadow-2xs'
          } space-y-4`}>
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Autorisations de la carte
            </h3>

            {/* Feature A: International Payments */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  selectedCard.internationalEnabled ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-400'
                }`}>
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Paiements internationaux</h4>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Autoriser les transactions hors Europe</p>
                </div>
              </div>
              
              <button
                onClick={() => onToggleInternational(selectedCard.id)}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${
                  selectedCard.internationalEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                  selectedCard.internationalEnabled ? 'transform translate-x-5' : ''
                }`} />
              </button>
            </div>

            {/* Feature B: Contactless Payments */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  selectedCard.contactlessEnabled ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-400'
                }`}>
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Paiement sans contact</h4>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Autoriser le sans contact de proximité</p>
                </div>
              </div>
              
              <button
                onClick={() => onToggleContactless(selectedCard.id)}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${
                  selectedCard.contactlessEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                  selectedCard.contactlessEnabled ? 'transform translate-x-5' : ''
                }`} />
              </button>
            </div>

          </div>

          {/* Create Virtual Card trigger form */}
          {!showCreateCardForm ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowCreateCardForm(true)}
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 dark:bg-slate-800"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              Créer une nouvelle carte virtuelle
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
                  Générer une Carte Virtuelle
                </h3>
                <button
                  onClick={() => setShowCreateCardForm(false)}
                  className="text-xs font-extrabold text-slate-400 hover:text-slate-600"
                >
                  Fermer
                </button>
              </div>

              <form onSubmit={handleCreateVirtualCard} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Nom de la carte (Ex: Achats Amazon)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Achats Internet, Netflix"
                    value={customCardName}
                    onChange={(e) => setCustomCardName(e.target.value)}
                    required
                    className={`w-full text-xs font-semibold p-3 rounded-xl border focus:outline-none transition-all ${
                      isDarkMode ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-100'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Couleur de la carte
                  </label>
                  <div className="flex gap-3">
                    {(['dark', 'blue', 'gold', 'rose', 'purple'] as const).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCustomCardColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          customCardColor === color ? 'border-blue-500 scale-110' : 'border-transparent'
                        } ${
                          color === 'blue'
                            ? 'bg-blue-600'
                            : color === 'dark'
                              ? 'bg-slate-950'
                              : color === 'gold'
                                ? 'bg-amber-600'
                                : color === 'rose'
                                  ? 'bg-rose-600'
                                  : 'bg-purple-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {newCardSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{newCardSuccessMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer transition-all"
                >
                  Générer instantanément
                </button>
              </form>
            </motion.div>
          )}

          {/* History header for CARD specifically */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Historique des dépenses de la carte
            </h3>

            {/* List */}
            <div className="space-y-3">
              {cardTransactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className={`rounded-2xl p-4 border flex justify-between items-center transition-colors ${
                    isDarkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white border-slate-100 shadow-2xs'
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{tx.name}</h4>
                      <p className={`text-[10px] font-semibold mt-0.5 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {tx.date} à {tx.time}
                      </p>
                    </div>
                  </div>
                  
                  <span className="text-xs font-extrabold font-mono text-rose-500">
                    -{Math.abs(tx.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </span>
                </div>
              ))}

              {cardTransactions.length === 0 && (
                <p className="text-xs text-center text-slate-400 font-semibold py-4">
                  Aucune transaction enregistrée pour cette carte.
                </p>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
