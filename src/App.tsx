import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Plus, RefreshCw, Layers, Sliders, Bell, CheckCircle2, Star, Award, BookOpen, Clock, Heart } from 'lucide-react';

// Data and Types
import { Course, Activity, UserProfile, Exercise, Message, Lesson } from './types';
import {
  initialUserProfile,
  initialCourses,
  initialActivities,
  initialExercises,
  initialMessages,
} from './data';

// Custom Components
import { MobileFrame } from './components/MobileFrame';
import { BalanceCard } from './components/BalanceCard';
import { ContinueLearning } from './components/ContinueLearning';
import { RecommendedCourses } from './components/RecommendedCourses';
import { StatsSection } from './components/StatsSection';
import { RecentActivities } from './components/RecentActivities';
import { NotificationToast } from './components/NotificationToast';
import { ActiveSessionModal } from './components/ActiveSessionModal';
import { ExerciseTab } from './components/ExerciseTab';
import { MessagesTab } from './components/MessagesTab';
import { ProfileTab } from './components/ProfileTab';

export default function App() {
  // Global States
  const [profile, setProfile] = useState<UserProfile>(initialUserProfile);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  
  const [activeTab, setActiveTab] = useState('accueil');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLesson, setActiveLesson] = useState<{ course: Course; lesson: Lesson } | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  
  // Custom interactive demo states
  const [themeAccent, setThemeAccent] = useState<'blue' | 'emerald' | 'indigo'>('blue');
  const [notification, setNotification] = useState<{
    id: string;
    title: string;
    description: string;
    type: 'success' | 'xp' | 'certificate' | 'credit';
  } | null>(null);

  // Computed Values
  const unreadMessagesCount = messages.filter(m => m.unread).length;
  const continueLearningCourse = courses.find(c => c.enrolled && c.progress < 100);
  const completedCoursesCount = courses.filter(c => c.progress === 100).length;
  const activeCertificatesCount = completedCoursesCount + 2; // base initial count + new completions
  
  const totalStudyHours = courses.reduce((acc, c) => {
    // estimate hours based on progress
    const numericDuration = parseInt(c.duration);
    const hoursEarned = Math.round((numericDuration * c.progress) / 100);
    return acc + hoursEarned;
  }, 45); // start with base 45 hours

  // Helper to trigger rich premium notifications
  const triggerNotification = (
    title: string,
    description: string,
    type: 'success' | 'xp' | 'certificate' | 'credit'
  ) => {
    setNotification({
      id: Math.random().toString(),
      title,
      description,
      type,
    });
  };

  // 1. Top up CPF Credit
  const handleAddFunds = () => {
    setProfile(prev => ({
      ...prev,
      balance: prev.balance + 2500,
    }));
    
    const newActivity: Activity = {
      id: Math.random().toString(),
      title: 'Subvention CPF versée',
      timestamp: 'À l\'instant',
      type: 'credit_added',
      description: 'Crédit complémentaire d\'État de +2 500 € crédité avec succès.',
      value: '+2 500 €',
    };

    setActivities(prev => [newActivity, ...prev]);
    triggerNotification('Crédit Formation Ajouté', 'Votre budget de formation s\'est enrichi de +2 500 €', 'credit');
  };

  // 2. Enroll in a recommended course (Spends CPF Balance)
  const handleEnrollCourse = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening detail modal
    
    if (course.enrolled) return;
    
    if (profile.balance < course.price) {
      triggerNotification(
        'Budget insuffisant',
        `Ce cours nécessite ${course.price.toLocaleString('fr-FR')} € sur votre CPF.`,
        'success' // error variant fallback
      );
      return;
    }

    // Deduct balance and enroll
    setProfile(prev => ({
      ...prev,
      balance: prev.balance - course.price,
    }));

    setCourses(prev =>
      prev.map(c => (c.id === course.id ? { ...c, enrolled: true, progress: 0 } : c))
    );

    const newActivity: Activity = {
      id: Math.random().toString(),
      title: 'Financement CPF approuvé',
      timestamp: 'À l\'instant',
      type: 'credit_spent',
      description: `Financement du cursus « ${course.title} » validé par l'État.`,
      value: `-${course.price.toLocaleString('fr-FR')} €`,
    };

    setActivities(prev => [newActivity, ...prev]);
    triggerNotification('Inscription Validée !', `Félicitations, vous êtes inscrit au cours d'élite.`, 'success');
  };

  // 3. Complete lesson & claim XP
  const handleCompleteLesson = (courseId: string, lessonId: string, xpEarned: number) => {
    // Find the course and update lessons
    const courseToUpdate = courses.find(c => c.id === courseId);
    if (!courseToUpdate) return;

    const updatedLessons = courseToUpdate.lessons.map(l =>
      l.id === lessonId ? { ...l, completed: true } : l
    );

    // Calculate new progress
    const completedCount = updatedLessons.filter(l => l.completed).length;
    const progress = Math.round((completedCount / updatedLessons.length) * 100);

    setCourses(prev =>
      prev.map(c =>
        c.id === courseId
          ? { ...c, lessons: updatedLessons, progress }
          : c
      )
    );

    // Update Profile XP
    let newXp = profile.xp + xpEarned;
    let nextRankXp = profile.nextRankXp;
    let currentRank = profile.rank;

    if (newXp >= nextRankXp) {
      newXp = newXp - nextRankXp;
      currentRank = 'Master Apprenant';
      triggerNotification('PROMOTION DE GRADE !', 'Vous êtes promu au grade de Master Apprenant d\'élite !', 'certificate');
    } else {
      triggerNotification('XP Encaissés !', `Vous avez accumulé +${xpEarned} XP sur votre profil.`, 'xp');
    }

    setProfile(prev => ({
      ...prev,
      xp: newXp,
      rank: currentRank,
    }));

    // Add activity log
    const selectedLesson = courseToUpdate.lessons.find(l => l.id === lessonId);
    const isCourseJustFinished = progress === 100 && courseToUpdate.progress < 100;

    const newActivity: Activity = {
      id: Math.random().toString(),
      title: isCourseJustFinished ? 'Cursus Diplomant Complété' : 'Leçon Validée',
      timestamp: 'À l\'instant',
      type: isCourseJustFinished ? 'certificate' : 'course_progress',
      description: isCourseJustFinished
        ? `Certification officielle délivrée pour : ${courseToUpdate.title}`
        : `Validation de la leçon : « ${selectedLesson?.title} »`,
      value: `+${xpEarned} XP`,
    };

    setActivities(prev => [newActivity, ...prev]);

    if (isCourseJustFinished) {
      triggerNotification('CERTIFICAT ÉMIS !', `Votre diplôme en ${courseToUpdate.title} est généré !`, 'certificate');
    }
  };

  // 4. Complete a separate practical exercise
  const handleCompleteExercise = (exerciseId: string, xpReward: number) => {
    setExercises(prev =>
      prev.map(ex => (ex.id === exerciseId ? { ...ex, completed: true } : ex))
    );

    // Update profile stats
    setProfile(prev => ({
      ...prev,
      xp: prev.xp + xpReward >= prev.nextRankXp ? (prev.xp + xpReward) - prev.nextRankXp : prev.xp + xpReward,
      rank: prev.xp + xpReward >= prev.nextRankXp ? 'Master Apprenant' : prev.rank,
    }));

    const targetEx = exercises.find(ex => ex.id === exerciseId);
    const newActivity: Activity = {
      id: Math.random().toString(),
      title: 'Atelier Pratique Validé',
      timestamp: 'À l\'instant',
      type: 'course_progress',
      description: `Vous avez brillamment réussi l'atelier : ${targetEx?.title}`,
      value: `+${xpReward} XP`,
    };

    setActivities(prev => [newActivity, ...prev]);
    triggerNotification('Exercice Réussi !', `Vous empochez +${xpReward} XP supplémentaires !`, 'xp');
  };

  // 5. Send support or instructor message
  const handleSendMessage = (conversationId: string, replyText: string) => {
    // Mark as read in list
    setMessages(prev =>
      prev.map(m => (m.id === conversationId ? { ...m, unread: false, content: replyText } : m))
    );
  };

  // 6. Quick simulate study action from presentation sidebar
  const handleSimulateStudy = () => {
    // Find first enrolled unfinished course or enroll in first course
    const activeC = courses.find(c => c.enrolled && c.progress < 100);
    if (activeC) {
      const nextL = activeC.lessons.find(l => !l.completed);
      if (nextL) {
        handleCompleteLesson(activeC.id, nextL.id, 250);
      }
    } else {
      // enroll first unenrolled
      const unenrolled = courses.find(c => !c.enrolled);
      if (unenrolled) {
        setCourses(prev =>
          prev.map(c => (c.id === unenrolled.id ? { ...c, enrolled: true, progress: 0 } : c))
        );
        triggerNotification('Inscription Automatique', `Inscrit d'office au cours : ${unenrolled.title}`, 'success');
      }
    }
  };

  // Reset demo state
  const handleResetDemo = () => {
    setProfile(initialUserProfile);
    setCourses(initialCourses);
    setActivities(initialActivities);
    setExercises(initialExercises);
    setMessages(initialMessages);
    setActiveTab('accueil');
    triggerNotification('Données Réinitialisées', 'L\'espace CPF de Gérad Lopez a été réinitialisé.', 'success');
  };

  // Filter recommended courses based on main search query
  const filteredRecommendedCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden font-sans">
      
      <MobileFrame
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // clear details or lesson screens when changing tabs
          setActiveLesson(null);
          setSelectedCourseDetail(null);
        }}
        unreadMessagesCount={unreadMessagesCount}
      >
        {/* Top Notch alert toast messages inside safe area */}
        <NotificationToast
          notification={notification}
          onClose={() => setNotification(null)}
        />

        {/* Interactive Lesson player view overlay */}
        <AnimatePresence>
          {activeLesson && (
            <ActiveSessionModal
              course={activeLesson.course}
              lesson={activeLesson.lesson}
              onClose={() => setActiveLesson(null)}
              onCompleteLesson={handleCompleteLesson}
            />
          )}
        </AnimatePresence>

        {/* MAIN TABS VIEWS SWITCHER */}
        <div className="px-4.5 pt-4 pb-6 space-y-6">
          
          {/* VIEW A: ACCUEIL */}
          {activeTab === 'accueil' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              {/* Header Welcome Bar */}
              <div className="flex justify-between items-center pt-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Espace Apprenant
                  </p>
                  <h1 className="text-lg font-display font-extrabold tracking-tight text-slate-900">
                    Bonjour Gérad Lopez
                  </h1>
                </div>

                {/* High Quality Interactive Profile Image with pulse */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('profil')}
                  className="relative cursor-pointer"
                >
                  <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>

              {/* Instant Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un cours ou sujet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Main CPF Glassmorphism Balance Card */}
              <BalanceCard
                balance={profile.balance}
                accountNumber={profile.accountNumber}
                name={profile.name}
                brandColor={themeAccent}
                onAddFunds={handleAddFunds}
              />

              {/* Search query dynamic filtering results */}
              {searchQuery ? (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Résultats de recherche ({filteredRecommendedCourses.length})</h3>
                  <RecommendedCourses
                    courses={filteredRecommendedCourses}
                    onCourseClick={(course) => setSelectedCourseDetail(course)}
                    onEnroll={handleEnrollCourse}
                  />
                </div>
              ) : (
                <>
                  {/* Continue learning active modules */}
                  {continueLearningCourse && (
                    <ContinueLearning
                      course={continueLearningCourse}
                      onResume={(course) => {
                        const unfinishedLesson = course.lessons.find(l => !l.completed) || course.lessons[0];
                        setActiveLesson({ course, lesson: unfinishedLesson });
                      }}
                    />
                  )}

                  {/* Horizontal scroll catalog of elite courses */}
                  <RecommendedCourses
                    courses={courses}
                    onCourseClick={(course) => setSelectedCourseDetail(course)}
                    onEnroll={handleEnrollCourse}
                  />

                  {/* Numerical and circular charts grid */}
                  <StatsSection
                    stats={{
                      completedCourses: completedCoursesCount,
                      studyHours: totalStudyHours,
                      certificates: activeCertificatesCount,
                      xp: profile.xp,
                      nextRankXp: profile.nextRankXp,
                    }}
                  />

                  {/* Scrolling animated timeline actions list */}
                  <RecentActivities activities={activities} />
                </>
              )}
            </motion.div>
          )}

          {/* VIEW B: COURS (CATALOG & RESUME) */}
          {activeTab === 'cours' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Vos Formations</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Accédez aux modules de formation financés et explorez de nouvelles compétences.
                </p>
              </div>

              {/* Courses List */}
              <div className="space-y-4">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedCourseDetail(course)}
                    className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${course.categoryColor}`}>
                          {course.category}
                        </span>
                        <h3 className="text-xs font-bold text-slate-800 leading-snug mt-1.5 truncate">
                          {course.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          Instructeur : {course.instructor}
                        </p>
                      </div>
                    </div>

                    {/* Course progress indicator if enrolled */}
                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                      {course.enrolled ? (
                        <div className="w-full flex items-center justify-between gap-3 text-[10px]">
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${course.progress}%` }}
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                            />
                          </div>
                          <span className="font-bold text-slate-700">{course.progress}% complété</span>
                        </div>
                      ) : (
                        <div className="w-full flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700">{course.price.toLocaleString('fr-FR')} € (Financement CPF)</span>
                          <span className="text-blue-600 font-bold flex items-center gap-0.5">S'inscrire <Plus className="w-3 h-3" /></span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* VIEW C: EXERCICES */}
          {activeTab === 'exercices' && (
            <ExerciseTab
              exercises={exercises}
              onCompleteExercise={handleCompleteExercise}
            />
          )}

          {/* VIEW D: MESSAGES */}
          {activeTab === 'messages' && (
            <MessagesTab
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          )}

          {/* VIEW E: PROFIL */}
          {activeTab === 'profil' && (
            <ProfileTab
              profile={profile}
              certificatesCount={activeCertificatesCount}
            />
          )}

        </div>

        {/* DETAIL MODAL / DRAWER FOR COURSES (Saves token space and renders inside screen beautifully) */}
        <AnimatePresence>
          {selectedCourseDetail && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-0 bg-slate-50 z-45 flex flex-col justify-between pointer-events-auto text-slate-800 pt-10"
            >
              {/* Header detail */}
              <div className="relative h-44 w-full flex-shrink-0">
                <img
                  src={selectedCourseDetail.image}
                  alt={selectedCourseDetail.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                {/* Close button */}
                <button
                  onClick={() => setSelectedCourseDetail(null)}
                  aria-label="Fermer le panneau"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 cursor-pointer"
                >
                  ×
                </button>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-300">
                    {selectedCourseDetail.category}
                  </span>
                  <h2 className="text-sm font-bold tracking-tight leading-tight mt-0.5">
                    {selectedCourseDetail.title}
                  </h2>
                </div>
              </div>

              {/* Description and lessons curriculum */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Présentation</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {selectedCourseDetail.description}
                  </p>
                </div>

                {/* Stats list */}
                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                    <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Durée</span>
                    <span className="text-[10px] font-bold text-slate-800">{selectedCourseDetail.duration}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                    <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Avis</span>
                    <span className="text-[10px] font-bold text-slate-800">{selectedCourseDetail.rating.toFixed(1)} / 5</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-center">
                    <Award className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">Niveau</span>
                    <span className="text-[10px] font-bold text-slate-800">{selectedCourseDetail.level}</span>
                  </div>
                </div>

                {/* Curriculum curriculum list */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Programme d'enseignement</h3>
                  <div className="space-y-1.5">
                    {selectedCourseDetail.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        onClick={() => {
                          if (selectedCourseDetail.enrolled) {
                            setActiveLesson({ course: selectedCourseDetail, lesson });
                            setSelectedCourseDetail(null);
                          }
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between text-[11px] font-medium transition-all ${
                          selectedCourseDetail.enrolled
                            ? 'bg-white border-slate-100 hover:border-slate-200 cursor-pointer'
                            : 'bg-slate-100/50 border-slate-100 opacity-65 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                            {index + 1}
                          </span>
                          <span className="text-slate-800 font-semibold">{lesson.title}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">{lesson.duration}</span>
                          {selectedCourseDetail.enrolled && lesson.completed && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enroll or Start button stick at bottom */}
              <div className="p-4 bg-white border-t border-slate-100">
                {selectedCourseDetail.enrolled ? (
                  <button
                    onClick={() => {
                      // Launch first incomplete lesson
                      const unfinished = selectedCourseDetail.lessons.find(l => !l.completed) || selectedCourseDetail.lessons[0];
                      setActiveLesson({ course: selectedCourseDetail, lesson: unfinished });
                      setSelectedCourseDetail(null);
                    }}
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-blue-500/15 cursor-pointer"
                  >
                    Reprendre l'étude
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      handleEnrollCourse(selectedCourseDetail, e);
                      // refresh local modal copy of course status
                      setSelectedCourseDetail({ ...selectedCourseDetail, enrolled: true });
                    }}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-all shadow-md cursor-pointer flex justify-between px-5 items-center"
                  >
                    <span>S'inscrire avec le budget CPF</span>
                    <span className="font-mono text-emerald-400 font-extrabold">{selectedCourseDetail.price.toLocaleString('fr-FR')} €</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </MobileFrame>

    </div>
  );
}
