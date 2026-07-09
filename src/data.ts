import { Transaction, Payee, TransferHistory, CreditCard, BankNotification, UserProfile } from './types';

export const initialUserProfile: UserProfile = {
  name: 'Gérad Lopez',
  accountNumber: 'EDU-4587-9231-001',
  iban: 'FR76 3000 4000 5500 0000 1234 567',
  bic: 'BNPAFRPPXXX',
  balance: 38000,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
  email: 'gerad.lopez@premium-edu.fr',
  phone: '+33 6 12 34 56 78',
  tier: 'Compte Premium'
};

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    name: 'Carrefour Market',
    date: 'Aujourd\'hui',
    time: '12:45',
    amount: -84.30,
    category: 'Alimentation',
    categoryIcon: 'ShoppingBag',
    status: 'Paiement validé',
    reference: 'REF-TX-84931-CARREFOUR',
    paymentMethod: 'Carte Premium •••• 9021',
    location: 'Paris, France',
    notes: 'Courses de la semaine'
  },
  {
    id: 'tx-2',
    name: 'Amazon Europe',
    date: 'Aujourd\'hui',
    time: '10:14',
    amount: -129.99,
    category: 'Shopping',
    categoryIcon: 'ShoppingBag',
    status: 'Paiement CB',
    reference: 'REF-TX-22104-AMZN',
    paymentMethod: 'Carte Premium •••• 9021',
    location: 'Internet (Luxembourg)',
    notes: 'Écran de bureau USB-C'
  },
  {
    id: 'tx-3',
    name: 'Netflix',
    date: 'Hier',
    time: '04:12',
    amount: -15.99,
    category: 'Loisirs',
    categoryIcon: 'Tv',
    status: 'Abonnement',
    reference: 'REF-TX-44810-NTFLX',
    paymentMethod: 'Prélèvement automatique',
    location: 'Internet (USA)',
    notes: 'Abonnement mensuel Ultra HD'
  },
  {
    id: 'tx-4',
    name: 'Salaire',
    date: '01 juillet',
    time: '08:00',
    amount: 4500.00,
    category: 'Revenus',
    categoryIcon: 'DollarSign',
    status: 'Crédit',
    reference: 'REF-TX-00921-SALAIRE',
    paymentMethod: 'Virement SEPA',
    location: 'Paris, France',
    notes: 'Rémunération mensuelle brute'
  },
  {
    id: 'tx-5',
    name: 'Orange',
    date: '29 juin',
    time: '09:30',
    amount: -42.99,
    category: 'Services',
    categoryIcon: 'Wifi',
    status: 'Facture',
    reference: 'REF-TX-99824-ORANGE',
    paymentMethod: 'Prélèvement automatique',
    location: 'Paris, France',
    notes: 'Forfait mobile & fibre 5G'
  },
  {
    id: 'tx-6',
    name: 'Uber',
    date: '28 juin',
    time: '23:15',
    amount: -18.40,
    category: 'Transport',
    categoryIcon: 'Car',
    status: 'Transport',
    reference: 'REF-TX-33412-UBER',
    paymentMethod: 'Apple Pay',
    location: 'Lyon, France',
    notes: 'Course retour soirée'
  },
  {
    id: 'tx-7',
    name: 'Air France',
    date: '26 juin',
    time: '14:20',
    amount: -685.00,
    category: 'Voyage',
    categoryIcon: 'Plane',
    status: 'Voyage',
    reference: 'REF-TX-77821-AFR',
    paymentMethod: 'Carte Premium •••• 9021',
    location: 'Paris-CDG, France',
    notes: 'Vol Aller-Retour Paris-Nice premium'
  },
  {
    id: 'tx-8',
    name: 'Apple',
    date: '25 juin',
    time: '11:10',
    amount: -2.99,
    category: 'Services',
    categoryIcon: 'Cloud',
    status: 'Stockage',
    reference: 'REF-TX-88214-APPLE',
    paymentMethod: 'Apple Pay',
    location: 'Cupertino, USA',
    notes: 'Abonnement iCloud+ 200 Go'
  },
  {
    id: 'tx-9',
    name: 'Spotify',
    date: '24 juin',
    time: '05:30',
    amount: -10.99,
    category: 'Loisirs',
    categoryIcon: 'Music',
    status: 'Musique',
    reference: 'REF-TX-11204-SPTFY',
    paymentMethod: 'Prélèvement automatique',
    location: 'Stockholm, Suède',
    notes: 'Abonnement Premium Individuel'
  },
  {
    id: 'tx-10',
    name: 'Restaurant Le Gourmet',
    date: '22 juin',
    time: '20:45',
    amount: -83.00,
    category: 'Alimentation',
    categoryIcon: 'Coffee',
    status: 'Paiement',
    reference: 'REF-TX-55410-REST',
    paymentMethod: 'Carte Premium •••• 9021',
    location: 'Bordeaux, France',
    notes: 'Dîner d\'affaires gastronomique'
  },
  {
    id: 'tx-11',
    name: 'Remboursement Assurance',
    date: '20 juin',
    time: '15:22',
    amount: 275.00,
    category: 'Revenus',
    categoryIcon: 'ShieldCheck',
    status: 'Crédit',
    reference: 'REF-TX-22109-ASSUR',
    paymentMethod: 'Virement SEPA',
    location: 'Nantes, France',
    notes: 'Remboursement sinistre bris de glace'
  },
  {
    id: 'tx-12',
    name: 'TotalEnergies',
    date: '18 juin',
    time: '17:40',
    amount: -72.00,
    category: 'Transport',
    categoryIcon: 'Gauge',
    status: 'Carburant',
    reference: 'REF-TX-44510-TOTAL',
    paymentMethod: 'Carte Premium •••• 9021',
    location: 'Marseille, France',
    notes: 'Plein de sans-plomb 98'
  },
  {
    id: 'tx-13',
    name: 'Fnac',
    date: '17 juin',
    time: '16:15',
    amount: -219.00,
    category: 'Shopping',
    categoryIcon: 'Smartphone',
    status: 'Achat',
    reference: 'REF-TX-11824-FNAC',
    paymentMethod: 'Carte Premium •••• 9021',
    location: 'Paris, France',
    notes: 'Casque audio réducteur de bruit'
  },
  {
    id: 'tx-14',
    name: 'Décathlon',
    date: '15 juin',
    time: '14:02',
    amount: -146.00,
    category: 'Loisirs',
    categoryIcon: 'Activity',
    status: 'Sport',
    reference: 'REF-TX-33821-DECAT',
    paymentMethod: 'Carte Premium •••• 9021',
    location: 'Nice, France',
    notes: 'Vêtements techniques running'
  },
  {
    id: 'tx-15',
    name: 'Paiement reçu',
    date: '13 juin',
    time: '10:30',
    amount: 800.00,
    category: 'Revenus',
    categoryIcon: 'User',
    status: 'Virement entrant',
    reference: 'REF-TX-00938-PAYRECD',
    paymentMethod: 'Virement SEPA',
    location: 'Toulouse, France',
    notes: 'Remboursement frais week-end'
  },
  {
    id: 'tx-16',
    name: 'Loyer',
    date: '10 juin',
    time: '02:00',
    amount: -950.00,
    category: 'Logement',
    categoryIcon: 'Home',
    status: 'Prélèvement',
    reference: 'REF-TX-66512-LOYER',
    paymentMethod: 'Prélèvement automatique',
    location: 'Paris, France',
    notes: 'Échéance mensuelle loyer studio'
  },
  {
    id: 'tx-17',
    name: 'EDF',
    date: '09 juin',
    time: '08:30',
    amount: -136.00,
    category: 'Logement',
    categoryIcon: 'Zap',
    status: 'Électricité',
    reference: 'REF-TX-22415-EDF',
    paymentMethod: 'Prélèvement automatique',
    location: 'Lyon, France',
    notes: 'Facturation bimestrielle électricité'
  },
  {
    id: 'tx-18',
    name: 'Canal+',
    date: '08 juin',
    time: '12:00',
    amount: -29.00,
    category: 'Loisirs',
    categoryIcon: 'Tv',
    status: 'Télévision',
    reference: 'REF-TX-99823-CANAL',
    paymentMethod: 'Prélèvement automatique',
    location: 'Internet (France)',
    notes: 'Abonnement Canal+ Sport'
  },
  {
    id: 'tx-19',
    name: 'Google One',
    date: '06 juin',
    time: '09:00',
    amount: -1.99,
    category: 'Services',
    categoryIcon: 'HardDrive',
    status: 'Stockage',
    reference: 'REF-TX-11234-G1',
    paymentMethod: 'Apple Pay',
    location: 'Mountain View, USA',
    notes: 'Abonnement Google One 100 Go'
  }
];

export const initialPayees: Payee[] = [
  {
    id: 'py-1',
    name: 'Marie Dubois',
    iban: 'FR76 1002 4009 1100 2234 5678 901',
    bank: 'Société Générale',
    email: 'marie.dubois@gmail.com',
    phone: '+33 6 88 12 34 56'
  },
  {
    id: 'py-2',
    name: 'Thomas Bernard',
    iban: 'FR76 3004 5500 2200 9988 1122 334',
    bank: 'BNP Paribas',
    email: 'thomas.bernard@outlook.com',
    phone: '+33 6 55 98 76 54'
  },
  {
    id: 'py-3',
    name: 'Paul Martin',
    iban: 'FR76 2000 3300 4400 5500 6677 889',
    bank: 'Crédit Agricole',
    email: 'paul.martin@yahoo.fr',
    phone: '+33 6 44 22 11 00'
  },
  {
    id: 'py-4',
    name: 'Julie Robert',
    iban: 'FR76 1122 3344 5566 7788 9900 112',
    bank: 'LCL',
    email: 'julie.robert@laposte.net',
    phone: '+33 6 12 90 78 56'
  },
  {
    id: 'py-5',
    name: 'Entreprise ABC',
    iban: 'FR76 3000 1000 2000 3000 4000 500',
    bank: 'CIC',
    email: 'billing@enterprise-abc.com',
    phone: '+33 1 40 50 60 70'
  }
];

export const initialTransferHistory: TransferHistory[] = [
  {
    id: 'tf-1',
    payeeName: 'Marie Dubois',
    amount: 350.00,
    type: 'Envoyé',
    date: '05 juillet 2026',
    note: 'Cadeau anniversaire'
  },
  {
    id: 'tf-2',
    payeeName: 'Thomas Bernard',
    amount: 120.00,
    type: 'Reçu',
    date: '03 juillet 2026',
    note: 'Remboursement resto'
  },
  {
    id: 'tf-3',
    payeeName: 'Paul Martin',
    amount: 1200.00,
    type: 'Envoyé',
    date: '30 juin 2026',
    note: 'Achat vélo électrique'
  },
  {
    id: 'tf-4',
    payeeName: 'Julie Robert',
    amount: 500.00,
    type: 'Programmé',
    date: '15 juillet 2026',
    note: 'Épargne projet été'
  },
  {
    id: 'tf-5',
    payeeName: 'Entreprise ABC',
    amount: 4500.00,
    type: 'Reçu',
    date: '01 juillet 2026',
    note: 'Acompte prestations conseil'
  }
];

export const initialCards: CreditCard[] = [
  {
    id: 'card-1',
    type: 'Premium',
    number: '4587 9021 5564 1234',
    expiry: '12/29',
    cvv: '883',
    holder: 'Gérad Lopez',
    iban: 'FR76 3000 4000 5500 0000 1234 567',
    bic: 'BNPAFRPPXXX',
    blocked: false,
    plafondWeekly: 5000,
    plafondSpent: 1234.50,
    pinCode: '1984',
    internationalEnabled: true,
    contactlessEnabled: true,
    colorTheme: 'blue'
  }
];

export const initialNotifications: BankNotification[] = [
  {
    id: 'nt-1',
    title: 'Salaire reçu',
    description: 'Votre salaire de 4 500,00 € a été crédité sur votre compte Premium.',
    timestamp: '01 juillet, 08:00',
    unread: false,
    type: 'success'
  },
  {
    id: 'nt-2',
    title: 'Paiement validé',
    description: 'Paiement de 129,99 € validé chez Amazon Europe par Carte Premium.',
    timestamp: 'Aujourd\'hui, 10:14',
    unread: false,
    type: 'success'
  },
  {
    id: 'nt-3',
    title: 'Connexion réussie',
    description: 'Une connexion sécurisée à votre espace client a été établie depuis Paris, France.',
    timestamp: 'Aujourd\'hui, 09:00',
    unread: false,
    type: 'info'
  },
  {
    id: 'nt-4',
    title: 'Nouveau bénéficiaire ajouté',
    description: 'Le bénéficiaire Marie Dubois a été ajouté avec succès.',
    timestamp: '05 juillet, 11:00',
    unread: false,
    type: 'info'
  }
];
