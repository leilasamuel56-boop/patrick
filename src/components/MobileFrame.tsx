import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wifi, Battery, Signal, Home, BookOpen, BrainCircuit, MessageSquare, User } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessagesCount: number;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  unreadMessagesCount,
}) => {
  const [time, setTime] = useState('');

  // Live premium clock update in status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Bottom Navigation tabs list
  const navTabs = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'cours', label: 'Cours', icon: BookOpen },
    { id: 'exercices', label: 'Exercices', icon: BrainCircuit },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col justify-between relative max-w-lg md:max-w-xl lg:max-w-2xl mx-auto md:shadow-[0_0_50px_rgba(0,0,0,0.06)] md:border-x border-slate-100 select-none">
      
      {/* Status Bar Header */}
      <div className="absolute top-0 inset-x-0 h-10 px-6 pt-2.5 flex justify-between items-center z-40 text-slate-900 pointer-events-none bg-slate-50/80 backdrop-blur-md">
        {/* Clock display */}
        <span className="text-xs font-semibold tracking-tight font-sans text-slate-800">
          {time || '12:54'}
        </span>

        {/* Network, Wifi, and Battery indicators */}
        <div className="flex items-center gap-1.5 text-slate-800">
          <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
          <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] font-bold tracking-tighter">98%</span>
            <Battery className="w-4 h-4 text-slate-800 fill-current" />
          </div>
        </div>
      </div>

      {/* Core Content view viewport */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar pt-10 pb-20 relative bg-slate-50">
        {children}
      </div>

      {/* Safe-Area Bottom tactile bar & navigation */}
      <div className="absolute bottom-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex flex-col items-center">
        {/* Navigation Buttons Row */}
        <div className="w-full px-6 pt-2.5 pb-1 flex justify-between items-center max-w-lg mx-auto">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center gap-0.5 w-14 py-1 cursor-pointer transition-colors"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </motion.div>
                
                <span
                  className={`text-[9px] font-bold tracking-tight transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  {tab.label}
                </span>

                {/* Notification badges count */}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute top-1.5 right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Soft home gesture indicator line */}
        <div className="w-32 h-1 bg-slate-200 rounded-full my-1.5" />
      </div>

    </div>
  );
};
