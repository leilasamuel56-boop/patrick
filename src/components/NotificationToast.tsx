import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, CheckCircle2, Award, Coins } from 'lucide-react';

interface NotificationToastProps {
  notification: {
    id: string;
    title: string;
    description: string;
    type: 'success' | 'xp' | 'certificate' | 'credit';
  } | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
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
          initial={{ opacity: 0, y: -80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="absolute top-14 left-4 right-4 z-50 glass-card rounded-2xl p-4 shadow-xl border border-white/40 flex items-start gap-3 pointer-events-auto"
        >
          <div className="flex-shrink-0 mt-0.5">
            {notification.type === 'success' && (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {notification.type === 'xp' && (
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            {notification.type === 'certificate' && (
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <Award className="w-5 h-5" />
              </div>
            )}
            {notification.type === 'credit' && (
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Coins className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
              {notification.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
              {notification.description}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <span className="text-xs font-bold">×</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
