import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Award, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { Course, Lesson, QuizQuestion } from '../types';

interface ActiveSessionModalProps {
  course: Course;
  lesson: Lesson;
  onClose: () => void;
  onCompleteLesson: (courseId: string, lessonId: string, xpEarned: number) => void;
}

export const ActiveSessionModal: React.FC<ActiveSessionModalProps> = ({
  course,
  lesson,
  onClose,
  onCompleteLesson,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  const quiz: QuizQuestion | undefined = lesson.quiz?.[0];

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !quiz) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === quiz.correctAnswerIndex;
    setQuizSuccess(isCorrect);
  };

  const handleContinue = () => {
    if (quizSuccess) {
      // Award 250 XP
      onCompleteLesson(course.id, lesson.id, 250);
      onClose();
    } else {
      // Reset quiz to retry
      setSelectedOption(null);
      setIsSubmitted(false);
      setQuizSuccess(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="absolute inset-0 bg-slate-900 z-50 flex flex-col pointer-events-auto text-white overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center px-4 pt-8 pb-3 bg-slate-950/80 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SESSION DE COURS</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Lesson Content Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 space-y-6">
        {/* Course Info Header */}
        <div className="space-y-1.5">
          <p className="text-xs text-blue-400 font-semibold">{course.title}</p>
          <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
            {lesson.title}
          </h2>
          <div className="flex items-center gap-2.5 text-xs text-slate-400 pt-1 font-medium">
            <span>Durée : {lesson.duration}</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">+250 XP</span>
          </div>
        </div>

        {/* Real Rich Lesson Content Block */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4.5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">CONTENU DU COURS</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {lesson.content || "Ce module de formation d'élite se focalise sur les applications réelles de concepts stratégiques avancés. L'acquisition de compétences solides nécessite un engagement actif et de la mise en situation réelle."}
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] text-blue-300 font-semibold">
            <Check className="w-3.5 h-3.5" />
            <span>Concepts clés assimilés</span>
          </div>
        </div>

        {/* Micro-Quiz section */}
        {quiz && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Vérification des acquis</h3>
            </div>

            {/* Quiz Card */}
            <div className="bg-slate-950/50 border border-white/10 rounded-2xl p-5 space-y-4">
              <p className="text-sm font-bold text-white leading-relaxed">
                {quiz.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {quiz.options.map((option, index) => {
                  let optionStyle = "border-white/10 hover:bg-white/5";
                  if (selectedOption === index) {
                    optionStyle = "border-blue-500 bg-blue-500/15 text-blue-100";
                  }
                  if (isSubmitted) {
                    if (index === quiz.correctAnswerIndex) {
                      optionStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-100";
                    } else if (selectedOption === index) {
                      optionStyle = "border-rose-500 bg-rose-500/20 text-rose-100";
                    } else {
                      optionStyle = "border-white/5 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={isSubmitted}
                      onClick={() => handleOptionSelect(index)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && index === quiz.correctAnswerIndex && (
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      {isSubmitted && selectedOption === index && index !== quiz.correctAnswerIndex && (
                        <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status and Actions */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl flex items-start gap-2.5 text-xs ${
                      quizSuccess 
                        ? 'bg-emerald-500/10 text-emerald-300' 
                        : 'bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    {quizSuccess ? (
                      <>
                        <Award className="w-4.5 h-4.5 flex-shrink-0 text-emerald-400" />
                        <div>
                          <p className="font-bold">Excellent travail !</p>
                          <p className="text-[11px] text-slate-300 mt-0.5">Vous venez de valider cette leçon stratégique. +250 XP vous sont accordés.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-rose-400" />
                        <div>
                          <p className="font-bold">Réponse incorrecte</p>
                          <p className="text-[11px] text-slate-300 mt-0.5">Relisez attentivement la leçon ci-dessus et tentez à nouveau votre chance.</p>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Sticky Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-8">
        {!isSubmitted ? (
          <button
            disabled={selectedOption === null}
            onClick={handleSubmit}
            className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg ${
              selectedOption === null
                ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10'
            }`}
          >
            <span>Valider ma réponse</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg ${
              quizSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/15'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <span>{quizSuccess ? 'Continuer & Réclamer +250 XP' : 'Essayer à nouveau'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
