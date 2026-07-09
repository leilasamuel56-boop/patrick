import React from 'react';
import { motion } from 'motion/react';
import { Award, Clock, BookCheck, TrendingUp, Sparkles } from 'lucide-react';

interface StatsSectionProps {
  stats: {
    completedCourses: number;
    studyHours: number;
    certificates: number;
    xp: number;
    nextRankXp: number;
  };
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const xpPercentage = Math.min((stats.xp / stats.nextRankXp) * 100, 100);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    })
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <h2 className="text-base font-bold text-slate-800 tracking-tight">Mes statistiques</h2>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3 h-3" />
          <span>+12% cette semaine</span>
        </div>
      </div>

      {/* Grid of 3 Main Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {/* Completed Courses */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2">
            <BookCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cours Finis</span>
            <span className="font-display text-xl font-bold text-slate-800 mt-1 block">
              {stats.completedCourses}
            </span>
          </div>
        </motion.div>

        {/* Study Hours */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50/70 flex items-center justify-center text-blue-600 mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Heures</span>
            <span className="font-display text-xl font-bold text-slate-800 mt-1 block">
              {stats.studyHours}h
            </span>
          </div>
        </motion.div>

        {/* Certificates */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-2">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Certificats</span>
            <span className="font-display text-xl font-bold text-slate-800 mt-1 block">
              {stats.certificates}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Gamified XP Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-2xl shadow-sm text-white"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-xs font-bold tracking-wide uppercase">Progression de Rang</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {stats.xp} / {stats.nextRankXp} XP
          </span>
        </div>
        
        {/* Progress Tracker */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
          />
        </div>

        <p className="text-[10px] text-slate-300 font-medium">
          Plus que <span className="text-white font-bold">{stats.nextRankXp - stats.xp} XP</span> pour atteindre le grade <span className="text-amber-400 font-semibold">Master Apprenant</span>
        </p>
      </motion.div>
    </div>
  );
};
