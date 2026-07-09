import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface NotificationToastProps {
  notification: {
    id: string;
    title: string;
    description: string;
    type: 'success' | 'info' | 'warning';
  } | null;
  onClose: () => void;
  isDarkMode: boolean;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose, isDarkMode }) => {
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className={`absolute top-14 left-4 right-4 z-50 rounded-2xl p-4 shadow-xl flex items-start gap-3 pointer-events-auto border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-[#0f172a]/95 border-slate-800 text-white shadow-blue-950/20' 
              : 'bg-white/95 border-slate-100 text-slate-800 shadow-slate-200/50'
          } backdrop-blur-xl`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {notification.type === 'success' && (
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {notification.type === 'info' && (
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Info className="w-5 h-5" />
              </div>
            )}
            {notification.type === 'warning' && (
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold tracking-tight">
              {notification.title}
            </h4>
            <p className={`text-[11px] font-medium leading-relaxed mt-0.5 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {notification.description}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer"
            className={`flex-shrink-0 transition-colors p-1 rounded-lg ${
              isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
