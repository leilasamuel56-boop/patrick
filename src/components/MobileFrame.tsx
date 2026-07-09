import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, ArrowRightLeft, FileText, CreditCard, User, Signal, Wifi, Battery } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotificationsCount: number;
  isDarkMode: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  unreadNotificationsCount,
  isDarkMode,
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const navTabs = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'virements', label: 'Virements', icon: ArrowRightLeft },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'cartes', label: 'Cartes', icon: CreditCard },
    { id: 'profil', label: 'Profil', icon: User, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined },
  ];

  return (
    <div className={`w-full min-h-screen flex flex-col justify-between relative select-none transition-colors duration-300 ${
      isDarkMode ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Absolute background subtle glowing gradients for premium ambiance */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-20 dark:opacity-30 bg-blue-500/20 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-10 dark:opacity-25 bg-indigo-500/15 pointer-events-none z-0" />

      {/* Main Responsive Canvas Core (100% on mobile, centered max-width on wider desktop) */}
      <div className={`relative flex-1 w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto flex flex-col justify-between shadow-2xl z-10 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#090d1f]/90 border-x border-slate-900 shadow-blue-950/20' 
          : 'bg-white/80 border-x border-slate-100 shadow-slate-200/50'
      } backdrop-blur-xl`}>
        
        {/* Status Bar Header */}
        <div className={`sticky top-0 inset-x-0 h-11 px-6 pt-3 flex justify-between items-center z-40 pointer-events-none transition-colors duration-300 ${
          isDarkMode ? 'bg-[#090d1f]/70' : 'bg-white/70'
        } backdrop-blur-md`}>
          {/* Clock display */}
          <span className={`text-xs font-semibold tracking-tight font-sans transition-colors duration-300 ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            {time || '14:28'}
          </span>

          {/* Network, Wifi, and Battery indicators */}
          <div className={`flex items-center gap-1.5 transition-colors duration-300 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold tracking-tighter">98%</span>
              <Battery className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>

        {/* Core Content viewport */}
        <div className="flex-1 w-full pb-24 relative overflow-y-auto no-scrollbar">
          {children}
        </div>

        {/* Bottom Tactile Navigation Bar */}
        <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg md:max-w-xl lg:max-w-2xl z-40 border-t flex flex-col items-center transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-[#060a18]/95 border-slate-900/80' 
            : 'bg-white/95 border-slate-100/80'
        } backdrop-blur-xl shadow-xl shadow-black/10`}>
          
          {/* Navigation Buttons Row */}
          <div className="w-full px-4 pt-2.5 pb-2.5 flex justify-between items-center">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-btn-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-col items-center gap-1.5 w-16 py-1 cursor-pointer group focus:outline-none"
                >
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className={`p-2 rounded-2xl transition-all duration-300 relative ${
                      isActive
                        ? 'text-white bg-blue-600 shadow-md shadow-blue-600/35 scale-105'
                        : isDarkMode
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                    
                    {/* Ripple background effect */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping pointer-events-none" />
                    )}
                  </motion.div>
                  
                  <span
                    className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${
                      isActive 
                        ? 'text-blue-500 font-extrabold transform translate-y-0' 
                        : isDarkMode
                          ? 'text-slate-500 group-hover:text-slate-300'
                          : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </span>

                  {/* Notification badge counts */}
                  {tab.badge && (
                    <span className="absolute top-1 right-2 min-w-5 h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-sm animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Soft home gesture indicator line */}
          <div className={`w-36 h-1 rounded-full my-1.5 transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
          }`} />
        </div>

      </div>
    </div>
  );
};
