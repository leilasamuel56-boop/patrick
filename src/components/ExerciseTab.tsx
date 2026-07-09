import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle, Sparkles, BrainCircuit, ChevronRight, X, Play } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseTabProps {
  exercises: Exercise[];
  onCompleteExercise: (exerciseId: string, xpReward: number) => void;
}

export const ExerciseTab: React.FC<ExerciseTabProps> = ({ exercises, onCompleteExercise }) => {
  const [filter, setFilter] = useState<'Tous' | 'Facile' | 'Moyen' | 'Difficile'>('Tous');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const filteredExercises = exercises.filter(
    (ex) => filter === 'Tous' || ex.difficulty === filter
  );

  // Simple practical case question generator
  const getQuestionForExercise = (ex: Exercise) => {
    switch (ex.id) {
      case 'ex-1':
        return {
          question: "Lors d'une crise opérationnelle interne, quel est le mode d'arbitrage le plus agile ?",
          options: [
            "Le centralisme autocratique pur",
            "La consultation de crise par consentement distribué (sociocratie)",
            "L'attente d'une étude d'audit externe de 3 mois",
            "L'annulation temporaire de tous les canaux de communication"
          ],
          correct: 1,
          explanation: "La sociocratie et la décision par consentement permettent d'allier rapidité d'exécution et intelligence collective directe."
        };
      case 'ex-2':
        return {
          question: "Pour contraindre un LLM à structurer sa sortie au format JSON strict, quelle méthode est la plus robuste ?",
          options: [
            "Lui crier dessus en majuscules dans le prompt",
            "Utiliser le mode structure (System Instruction / JSON Schema) de l'API",
            "Mettre un emoji robot à la fin du texte",
            "Faire 10 prompts d'affilée pour espérer une issue"
          ],
          correct: 1,
          explanation: "La configuration d'un schéma JSON stricte (JSON schema / Structured Outputs) est le seul moyen de garantir à 100% l'intégrité de la structure."
        };
      case 'ex-3':
        return {
          question: "Quelle variable n'influe pas sur la position de la frontière efficiente de Markowitz ?",
          options: [
            "La covariance des actifs",
            "L'espérance de rendement de chaque actif",
            "L'âge du courtier effectuant l'opération",
            "La variance (ou écart-type) de chaque actif"
          ],
          correct: 2,
          explanation: "La covariance, l'espérance et la variance sont les piliers de la théorie moderne du portefeuille de Markowitz. L'âge du courtier n'y joue aucun rôle mathématique."
        };
      default:
        return {
          question: "Quelle loi ergonomique stipule que le temps requis pour atteindre une cible dépend de sa taille et de sa distance ?",
          options: [
            "La loi de Fitts",
            "La loi de Hick",
            "La loi de Jakob",
            "La loi de Miller"
          ],
          correct: 0,
          explanation: "La loi de Fitts modélise la ciblerie physique ou digitale, montrant que les boutons clés doivent être grands et proches des zones de repos du curseur."
        };
    }
  };

  const handleStartExercise = (ex: Exercise) => {
    if (ex.completed) return;
    setActiveExercise(ex);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setIsAnswered(true);
  };

  const handleFinishExercise = () => {
    if (activeExercise && selectedAnswer === getQuestionForExercise(activeExercise).correct) {
      onCompleteExercise(activeExercise.id, activeExercise.xpReward);
    }
    setActiveExercise(null);
  };

  return (
    <div className="space-y-4">
      {/* Tab Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Ateliers & Exercices</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Mettez en pratique vos connaissances et cumulez du crédit XP pour élever votre rang.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex gap-2">
        {(['Tous', 'Facile', 'Moyen', 'Difficile'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              filter === level
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-100'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        {filteredExercises.map((ex) => (
          <motion.div
            key={ex.id}
            whileHover={!ex.completed ? { y: -2 } : {}}
            onClick={() => handleStartExercise(ex)}
            className={`p-4 rounded-2xl border transition-all ${
              ex.completed
                ? 'bg-slate-50/60 border-slate-100 opacity-75'
                : 'bg-white border-slate-100 shadow-xs hover:shadow-md cursor-pointer'
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1">
                {/* Category & Difficulty pills */}
                <div className="flex gap-1.5 items-center">
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {ex.category}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                    ex.difficulty === 'Facile' 
                      ? 'bg-emerald-50 text-emerald-600'
                      : ex.difficulty === 'Moyen'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}>
                    {ex.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 pt-1 leading-snug">
                  {ex.title}
                </h3>
                
                <p className="text-[11px] text-slate-500 font-medium">
                  Sujet : {ex.subject} • {ex.questionsCount} question{ex.questionsCount > 1 ? 's' : ''}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="text-right flex-shrink-0">
                {ex.completed ? (
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Validé</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50/50 px-2 py-1 rounded-xl">
                      +{ex.xpReward} XP
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-0.5">
                      Jouer <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-6 space-y-2">
            <BrainCircuit className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Aucun atelier trouvé</p>
            <p className="text-xs text-slate-400">Modifiez vos filtres de recherche.</p>
          </div>
        )}
      </div>

      {/* Active Exercise Modal Simulation (Fits cleanly inside frame) */}
      <AnimatePresence>
        {activeExercise && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-slate-900 z-50 p-5 flex flex-col justify-between pointer-events-auto text-white pt-10"
          >
            {/* Modal Header */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Défi de Compétences
                  </span>
                  <h2 className="text-base font-bold text-white mt-2 leading-tight">
                    {activeExercise.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveExercise(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Question */}
              <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4.5 space-y-4">
                <p className="text-sm font-semibold leading-relaxed">
                  {getQuestionForExercise(activeExercise).question}
                </p>

                {/* Multiple choices */}
                <div className="space-y-2 pt-1">
                  {getQuestionForExercise(activeExercise).options.map((option, idx) => {
                    let optionStyle = 'border-white/10 hover:bg-white/5';
                    if (selectedAnswer === idx) {
                      optionStyle = 'border-blue-500 bg-blue-500/15';
                    }
                    if (isAnswered) {
                      if (idx === getQuestionForExercise(activeExercise).correct) {
                        optionStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                      } else if (selectedAnswer === idx) {
                        optionStyle = 'border-rose-500 bg-rose-500/20 text-rose-200';
                      } else {
                        optionStyle = 'border-white/5 opacity-40';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${optionStyle} flex justify-between items-center cursor-pointer`}
                      >
                        <span>{option}</span>
                        {isAnswered && idx === getQuestionForExercise(activeExercise).correct && (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        )}
                        {isAnswered && selectedAnswer === idx && idx !== getQuestionForExercise(activeExercise).correct && (
                          <X className="w-4 h-4 text-rose-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Answer feedback or submission trigger */}
            <div className="space-y-4">
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-xl text-xs flex gap-2.5 items-start ${
                    selectedAnswer === getQuestionForExercise(activeExercise).correct
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : 'bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {selectedAnswer === getQuestionForExercise(activeExercise).correct ? (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Défi relevé avec brio !</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {getQuestionForExercise(activeExercise).explanation}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Dommage...</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          La bonne réponse était la deuxième. Retentez votre chance ultérieurement !
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {!isAnswered ? (
                <button
                  disabled={selectedAnswer === null}
                  onClick={handleAnswerSubmit}
                  className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer shadow-lg ${
                    selectedAnswer === null
                      ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>Valider ma réponse</span>
                </button>
              ) : (
                <button
                  onClick={handleFinishExercise}
                  className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-bold text-sm tracking-wide transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>
                    {selectedAnswer === getQuestionForExercise(activeExercise).correct
                      ? `Encaisser +${activeExercise.xpReward} XP`
                      : 'Fermer la session'}
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
