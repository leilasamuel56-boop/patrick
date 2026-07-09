import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Tag, ChevronDown, CheckCircle, RefreshCcw } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsTabProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  isDarkMode: boolean;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  transactions,
  onSelectTransaction,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'debits' | 'credits'>('all');
  const [activeDateSort, setActiveDateSort] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Available categories for secondary filter tag row
  const categories = useMemo(() => {
    const list = new Set(transactions.map((t) => t.category));
    return ['all', ...Array.from(list)];
  }, [transactions]);

  // Compute and filter transactions dynamically based on search, type, date range, and category
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search Query Filter
      const matchesSearch = 
        tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Debit / Credit Filter
      const matchesType =
        activeTypeFilter === 'all' ||
        (activeTypeFilter === 'debits' && tx.amount < 0) ||
        (activeTypeFilter === 'credits' && tx.amount > 0);

      // 3. Category Filter
      const matchesCategory =
        selectedCategory === 'all' || tx.category === selectedCategory;

      // 4. Date Sort / Time Period Filters (simulated date parsing from mock string)
      let matchesDate = true;
      if (activeDateSort === 'today') {
        matchesDate = tx.date === "Aujourd'hui";
      } else if (activeDateSort === 'week') {
        matchesDate = tx.date === "Aujourd'hui" || tx.date === "Hier" || tx.date.includes('juillet');
      } else if (activeDateSort === 'month') {
        // Mock data are mostly June and July which counts for this/last month
        matchesDate = tx.date.includes('juin') || tx.date.includes('juillet') || tx.date === "Aujourd'hui" || tx.date === "Hier";
      } else if (activeDateSort === 'year') {
        matchesDate = true; // All mock items are in 2026/current year
      }

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });
  }, [transactions, searchQuery, activeTypeFilter, activeDateSort, selectedCategory]);

  return (
    <div className="space-y-6 pt-4 px-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Historique des Transactions</h1>
        <p className={`text-xs mt-1 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Recherchez, filtrez et exportez l'historique complet de vos flux bancaires.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par marchand, catégorie, note..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full text-xs font-semibold p-3.5 pl-11 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all ${
            isDarkMode 
              ? 'bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500' 
              : 'bg-slate-50 border-slate-100 placeholder-slate-400 focus:border-blue-500'
          }`}
        />
      </div>

      {/* Main Sort Group Filters: Today, This week, This month, This year */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'Tout temps' },
          { id: 'today', label: "Aujourd'hui" },
          { id: 'week', label: 'Cette semaine' },
          { id: 'month', label: 'Ce mois' },
          { id: 'year', label: 'Cette année' },
        ].map((period) => (
          <button
            key={period.id}
            onClick={() => setActiveDateSort(period.id as any)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap transition-all border ${
              activeDateSort === period.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-100 border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Mini filters row (All, Debits, Credits) */}
      <div className={`p-1 rounded-xl flex gap-1 border ${
        isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100/70 border-slate-200/50'
      }`}>
        <button
          onClick={() => setActiveTypeFilter('all')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTypeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tous les flux
        </button>
        <button
          onClick={() => setActiveTypeFilter('debits')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTypeFilter === 'debits'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Débits (-)
        </button>
        <button
          onClick={() => setActiveTypeFilter('credits')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTypeFilter === 'credits'
              ? 'bg-blue-600 text-white shadow-xs'
              : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Crédits (+)
        </button>
      </div>

      {/* Horizontal Category Pill selector row */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-800 dark:border-slate-700'
                : isDarkMode
                  ? 'bg-slate-900/30 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            {cat === 'all' ? 'Toutes catégories' : cat}
          </button>
        ))}
      </div>

      {/* Core Filtered Results List */}
      <div className="space-y-3 pb-8">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Transactions ({filteredTransactions.length})
          </span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTypeFilter('all');
                setActiveDateSort('all');
                setSelectedCategory('all');
              }}
              className="text-[10px] font-bold text-blue-500 hover:text-blue-600"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Transactions list layout */}
        <div className="space-y-3">
          {filteredTransactions.map((tx) => {
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
                  {/* Credit / Debit decorative icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isCredit 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-tight">{tx.name}</h4>
                    <p className={`text-[10px] font-semibold mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {tx.date} à {tx.time} • <span className="uppercase text-[9px] font-bold text-slate-400">{tx.category}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold font-mono ${
                    isCredit ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {isCredit ? '+' : ''}{tx.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </span>
                  <span className={`block text-[8px] font-extrabold mt-1 ${
                    tx.status.includes('validé') || tx.status === 'Crédit' || tx.status.includes('entrant')
                      ? 'text-emerald-500/80'
                      : 'text-slate-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-10 space-y-2">
              <p className="text-xs text-slate-400 font-semibold">Aucune transaction trouvée</p>
              <p className="text-[10px] text-slate-400/80 max-w-xs mx-auto">
                Essayez de modifier vos mots-clés ou de réinitialiser vos filtres de recherche.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
