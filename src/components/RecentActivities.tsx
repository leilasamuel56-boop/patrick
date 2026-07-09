import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Award, PlusCircle, MinusCircle, CheckCircle2, Star } from 'lucide-react';
import { Activity } from '../types';

interface RecentActivitiesProps {
  activities: Activity[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10, y: 10 },
    show: { opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 120 } }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'course_start':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
        );
      case 'course_progress':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'course_complete':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-bounce">
            <Star className="w-4 h-4 fill-current" />
          </div>
        );
      case 'credit_added':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PlusCircle className="w-4 h-4" />
          </div>
        );
      case 'credit_spent':
        return (
          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <MinusCircle className="w-4 h-4" />
          </div>
        );
      case 'certificate':
        return (
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <h2 className="text-base font-bold text-slate-800 tracking-tight">Activités récentes</h2>
        <span className="text-xs text-slate-400 font-medium">Tout voir</span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar pr-1 pb-2"
      >
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-50 shadow-xs hover:border-slate-100 transition-all"
          >
            {/* Left Icon with color indicator */}
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>

            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {activity.title}
                </h4>
                <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                  {activity.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5 line-clamp-1">
                {activity.description}
              </p>
            </div>

            {/* Right Badge detail */}
            {activity.value && (
              <div className="flex-shrink-0 text-right ml-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activity.value.startsWith('+') 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : activity.value.startsWith('-')
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {activity.value}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
