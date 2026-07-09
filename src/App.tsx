import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';

// Types & Initial Data
import { Transaction, Payee, TransferHistory, CreditCard, BankNotification, UserProfile } from './types';
import {
  initialUserProfile,
  initialTransactions,
  initialPayees,
  initialTransferHistory,
  initialCards,
  initialNotifications,
} from './data';

// Layout & Custom Pages
import { MobileFrame } from './components/MobileFrame';
import { NotificationToast } from './components/NotificationToast';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { AccueilTab } from './components/AccueilTab';
import { VirementsTab } from './components/VirementsTab';
import { TransactionsTab } from './components/TransactionsTab';
import { CartesTab } from './components/CartesTab';
import { ProfilTab } from './components/ProfilTab';

export default function App() {
  // Global States
  const [profile, setProfile] = useState<UserProfile>(initialUserProfile);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [payees, setPayees] = useState<Payee[]>(initialPayees);
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>(initialTransferHistory);
  const [cards, setCards] = useState<CreditCard[]>(initialCards);
  const [notifications, setNotifications] = useState<BankNotification[]>(initialNotifications);

  // Applet configuration preferences
  const [activeTab, setActiveTab] = useState('accueil');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    title: string;
    description: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  // Profile preferences
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [isAlertSalaryEnabled, setIsAlertSalaryEnabled] = useState(true);
  const [isAlertCardEnabled, setIsAlertCardEnabled] = useState(true);
  const [isAlertLoginEnabled, setIsAlertLoginEnabled] = useState(true);

  // Computed values
  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;

  // Helper: Trigger high-end notification popups
  const triggerNotification = (
    title: string,
    description: string,
    type: 'success' | 'info' | 'warning'
  ) => {
    // 1. Show the dynamic HUD slide toast
    setToastNotification({
      id: Math.random().toString(),
      title,
      description,
      type,
    });

    // 2. Log in notifications list
    const newNotification: BankNotification = {
      id: Math.random().toString(),
      title,
      description,
      timestamp: "Aujourd'hui, " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      unread: true,
      type,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Action: Add new beneficiary payee
  const handleAddPayee = (newPayee: Omit<Payee, 'id'>) => {
    const payee: Payee = {
      ...newPayee,
      id: 'py-' + (payees.length + 1),
    };
    setPayees((prev) => [...prev, payee]);
    triggerNotification(
      'Nouveau bénéficiaire ajouté',
      `Le bénéficiaire ${payee.name} (${payee.bank}) a été ajouté avec succès à vos comptes.`,
      'success'
    );
  };

  // Action: Process new wire transfer (subtracts balance, logs in history & transactions)
  const handleMakeTransfer = (transfer: {
    payeeName: string;
    iban: string;
    amount: number;
    note: string;
    date: string;
  }) => {
    // Deduct balance
    setProfile((prev) => ({
      ...prev,
      balance: prev.balance - transfer.amount,
    }));

    // Generate random reference code
    const randomRef = 'REF-TX-' + Math.floor(10000 + Math.random() * 90000) + '-SEPA';
    const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // 1. Add to bank transactions
    const newTx: Transaction = {
      id: 'tx-' + (transactions.length + 1),
      name: transfer.payeeName,
      date: "Aujourd'hui",
      time: currentTime,
      amount: -transfer.amount,
      category: 'Services',
      categoryIcon: 'Send',
      status: 'Paiement validé',
      reference: randomRef,
      paymentMethod: 'Virement SEPA',
      location: 'Paris, France',
      notes: transfer.note,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 2. Add to transfer history
    const newHistory: TransferHistory = {
      id: 'tf-' + (transferHistory.length + 1),
      payeeName: transfer.payeeName,
      amount: transfer.amount,
      type: 'Envoyé',
      date: transfer.date,
      note: transfer.note,
    };
    setTransferHistory((prev) => [newHistory, ...prev]);

    // 3. Trigger alert notifications
    triggerNotification(
      'Virement complété',
      `Un virement de ${transfer.amount.toLocaleString('fr-FR')} € a été envoyé à ${transfer.payeeName}.`,
      'success'
    );

    return true;
  };

  // Action: Toggle Block / Unblock Credit Card
  const handleToggleBlockCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextState = !c.blocked;
          triggerNotification(
            nextState ? 'Carte verrouillée' : 'Carte débloquée',
            nextState
              ? 'Toutes les autorisations et paiements de votre carte Premium ont été suspendus temporairement.'
              : 'Votre carte Premium a été déverrouillée et est prête pour vos prochains paiements.',
            nextState ? 'warning' : 'success'
          );
          return { ...c, blocked: nextState };
        }
        return c;
      })
    );
  };

  // Action: Adjust weekly maximum thresholds
  const handleUpdatePlafond = (cardId: string, value: number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return { ...c, plafondWeekly: value };
        }
        return c;
      })
    );
  };

  // Action: Code PIN re-coder
  const handleUpdatePin = (cardId: string, newPin: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          triggerNotification(
            'Code PIN mis à jour',
            `Le code de sécurité confidentiel de votre carte Premium a été reconfiguré avec succès.`,
            'success'
          );
          return { ...c, pinCode: newPin };
        }
        return c;
      })
    );
  };

  // Action: Toggle international transaction allowance
  const handleToggleInternational = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextState = !c.internationalEnabled;
          triggerNotification(
            nextState ? 'Paiements internationaux activés' : 'Paiements internationaux désactivés',
            nextState
              ? 'Votre carte est autorisée à faire des achats en devises hors de l\'Union Européenne.'
              : 'Les transactions hors Union Européenne sont bloquées par mesure de protection de vos comptes.',
            'info'
          );
          return { ...c, internationalEnabled: nextState };
        }
        return c;
      })
    );
  };

  // Action: Toggle contactless NFC technology
  const handleToggleContactless = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextState = !c.contactlessEnabled;
          triggerNotification(
            nextState ? 'Sans contact activé' : 'Sans contact désactivé',
            nextState
              ? 'Vous pouvez payer rapidement sans contact chez les commerçants de proximité.'
              : 'Le paiement de proximité sans contact est désactivé sur votre puce physique.',
            'info'
          );
          return { ...c, contactlessEnabled: nextState };
        }
        return c;
      })
    );
  };

  // Action: Add virtual credit card
  const handleAddNewCard = (newCard: Omit<CreditCard, 'id' | 'iban' | 'bic' | 'blocked' | 'plafondSpent'>) => {
    const card: CreditCard = {
      ...newCard,
      id: 'card-' + (cards.length + 1),
      iban: profile.iban,
      bic: profile.bic,
      blocked: false,
      plafondSpent: 0,
    };
    setCards((prev) => [...prev, card]);
    triggerNotification(
      'Carte virtuelle activée',
      `Votre nouvelle carte virtuelle "${card.customName}" a été générée de manière ultra-sécurisée.`,
      'success'
    );
  };

  // Action: Clear alerts list history
  const handleClearNotifications = () => {
    setNotifications([]);
    triggerNotification(
      'Notifications effacées',
      'Votre historique d\'alertes de sécurité a été vidé.',
      'info'
    );
  };

  return (
    <MobileFrame
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        // Clear transaction detail modals upon switching tabs
        setSelectedTransaction(null);
      }}
      unreadNotificationsCount={unreadNotificationsCount}
      isDarkMode={isDarkMode}
    >
      {/* 1. HUD floating toast warnings inside safe space */}
      <NotificationToast
        notification={toastNotification}
        onClose={() => setToastNotification(null)}
        isDarkMode={isDarkMode}
      />

      {/* 2. Detailed Single Transaction modal drawer */}
      <AnimatePresence>
        {selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* 3. Global Views switcher based on activeTab state */}
      <AnimatePresence mode="wait">
        <div className="w-full min-h-full">
          {activeTab === 'accueil' && (
            <AccueilTab
              profile={profile}
              card={cards[0]}
              transactions={transactions}
              onSelectTab={setActiveTab}
              onSelectTransaction={setSelectedTransaction}
              onTriggerNotification={triggerNotification}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'virements' && (
            <VirementsTab
              balance={profile.balance}
              payees={payees}
              transferHistory={transferHistory}
              onAddPayee={handleAddPayee}
              onMakeTransfer={handleMakeTransfer}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTab
              transactions={transactions}
              onSelectTransaction={setSelectedTransaction}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'cartes' && (
            <CartesTab
              cards={cards}
              cardTransactions={transactions.filter((tx) => tx.paymentMethod.includes('Carte'))}
              onToggleBlockCard={handleToggleBlockCard}
              onUpdatePlafond={handleUpdatePlafond}
              onUpdatePin={handleUpdatePin}
              onToggleInternational={handleToggleInternational}
              onToggleContactless={handleToggleContactless}
              onAddNewCard={handleAddNewCard}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'profil' && (
            <ProfilTab
              profile={profile}
              notifications={notifications}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              onClearNotifications={handleClearNotifications}
              isBiometricEnabled={isBiometricEnabled}
              onToggleBiometric={() => {
                const next = !isBiometricEnabled;
                setIsBiometricEnabled(next);
                triggerNotification(
                  'Biométrie modifiée',
                  next ? 'L\'accès biométrique par FaceID/TouchID est activé.' : 'L\'accès biométrique est désactivé.',
                  'info'
                );
              }}
              isAlertSalaryEnabled={isAlertSalaryEnabled}
              onToggleSalaryAlert={() => {
                const next = !isAlertSalaryEnabled;
                setIsAlertSalaryEnabled(next);
                triggerNotification('Préférences d\'alerte', next ? 'Alertes de dépôt de salaire activées.' : 'Alertes de salaire désactivées.', 'info');
              }}
              isAlertCardEnabled={isAlertCardEnabled}
              onToggleCardAlert={() => {
                const next = !isAlertCardEnabled;
                setIsAlertCardEnabled(next);
                triggerNotification('Préférences d\'alerte', next ? 'Alertes de dépenses carte activées.' : 'Alertes carte désactivées.', 'info');
              }}
              isAlertLoginEnabled={isAlertLoginEnabled}
              onToggleLoginAlert={() => {
                const next = !isAlertLoginEnabled;
                setIsAlertLoginEnabled(next);
                triggerNotification('Préférences d\'alerte', next ? 'Alertes de connexion suspecte activées.' : 'Alertes connexion désactivées.', 'info');
              }}
            />
          )}
        </div>
      </AnimatePresence>
    </MobileFrame>
  );
}
