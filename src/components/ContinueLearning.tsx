import React from 'react';
import { motion } from 'motion/react';
import { Play, Flame, Calendar, Award, BookOpen } from 'lucide-react';
import { Course } from '../types';

interface ContinueLearningProps {
  course: Course;
  onResume: (course: Course) => void;
}

export const ContinueLearning: React.FC<ContinueLearningProps> = ({ course, onResume }) => {
  // Find current active lesson (first non-completed or last completed)
  const nextLesson = course.lessons.find(l => !l.completed) || course.lessons[course.lessons.length - 1];
  const completedCount = course.lessons.filter(l => l.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden"
    >
      {/* Visual Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50/70 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-blue-100">
          <BookOpen className="w-3 h-3" />
          <span>Continuer l'apprentissage</span>
        </div>
        
        {/* Streak indicator */}
        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-amber-100">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>12 jours d'affilée</span>
        </div>
      </div>

      {/* Course Title and Active Lesson */}
      <div className="flex gap-4 items-center mb-4">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/10" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-800 leading-tight truncate">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Prochaine leçon : <span className="text-slate-700 font-semibold">{nextLesson?.title || 'Aucune'}</span>
          </p>
        </div>

        {/* Dynamic circular action button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onResume(course)}
          aria-label="Reprendre le cours"
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 cursor-pointer flex-shrink-0 transition-all"
        >
          <Play className="w-4 h-4 fill-current ml-0.5 animate-pulse" />
        </motion.button>
      </div>

      {/* Progress bar and details */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Progression générale</span>
          <span className="text-slate-700 font-bold">{course.progress}% ({completedCount}/{course.lessons.length} leçons)</span>
        </div>
        
        {/* Animated track progress bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};
