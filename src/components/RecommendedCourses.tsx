import React from 'react';
import { motion } from 'motion/react';
import { Star, Clock, Award, Check } from 'lucide-react';
import { Course } from '../types';

interface RecommendedCoursesProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
  onEnroll: (course: Course, e: React.MouseEvent) => void;
}

export const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({
  courses,
  onCourseClick,
  onEnroll,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <h2 className="text-base font-bold text-slate-800 tracking-tight">Cours recommandés</h2>
        <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">Tout voir</span>
      </div>

      {/* Horizontal snap scroll container */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -4 }}
            onClick={() => onCourseClick(course)}
            className="flex-shrink-0 w-[260px] snap-start bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Cover Image & Category Badges */}
              <div className="relative h-32 w-full bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                
                {/* Level / Price Badges */}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md bg-white/90 text-slate-800 shadow-sm`}>
                    {course.level}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between items-end">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${course.categoryColor}`}>
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Content body */}
              <div className="p-3.5 space-y-2">
                <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 min-h-[32px]">
                  {course.title}
                </h3>
                
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  Par {course.instructor}
                </p>

                {/* Stars and Duration */}
                <div className="flex items-center gap-2.5 pt-1 text-[10px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom pricing or enroll state */}
            <div className="p-3.5 pt-0 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tarif CPF</p>
                <p className="text-xs font-bold text-slate-800">
                  {course.enrolled ? 'Déjà inscrit' : `${course.price.toLocaleString('fr-FR')} €`}
                </p>
              </div>

              {course.enrolled ? (
                <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => onEnroll(course, e)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold tracking-wide transition-all cursor-pointer shadow-sm shadow-blue-500/15"
                >
                  S'inscrire
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
