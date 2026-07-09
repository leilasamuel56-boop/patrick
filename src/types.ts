export interface Transaction {
  id: string;
  name: string;
  date: string; // e.g. "Aujourd'hui", "Hier", "01 juillet"
  time: string; // e.g. "14:28", "09:15"
  amount: number; // positive for credits, negative for debits
  category: string; // "Alimentation", "Shopping", "Loisirs", "Logement", "Services", "Revenus", "Voyage", "Transport"
  categoryIcon: string; // Lucide icon name
  status: "Paiement validé" | "Paiement CB" | "Abonnement" | "Crédit" | "Facture" | "Transport" | "Voyage" | "Musique" | "Paiement" | "Virement entrant" | "Prélèvement" | "Électricité" | "Télévision" | "Stockage" | "En attente" | "Carburant" | "Achat" | "Sport";
  reference: string;
  paymentMethod: string;
  location: string;
  notes: string;
}

export interface Payee {
  id: string;
  name: string;
  iban: string;
  bank: string;
  email: string;
  phone: string;
}

export interface TransferHistory {
  id: string;
  payeeName: string;
  amount: number;
  type: "Envoyé" | "Reçu" | "Programmé";
  date: string;
  note?: string;
}

export interface CreditCard {
  id: string;
  type: "Premium" | "Virtuelle" | "Standard";
  number: string;
  expiry: string;
  cvv: string;
  holder: string;
  iban: string;
  bic: string;
  blocked: boolean;
  plafondWeekly: number; // Maximum threshold e.g. 5000
  plafondSpent: number; // Current spent this week e.g. 1200
  pinCode: string;
  internationalEnabled: boolean;
  contactlessEnabled: boolean;
  colorTheme: "blue" | "dark" | "gold" | "rose" | "purple";
  customName?: string;
}

export interface BankNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string; // e.g. "Aujourd'hui, 10:45"
  unread: boolean;
  type: "info" | "success" | "warning";
}

export interface UserProfile {
  name: string;
  accountNumber: string;
  iban: string;
  bic: string;
  balance: number;
  avatar: string;
  email: string;
  phone: string;
  tier: string;
}
