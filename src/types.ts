export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  content?: string;
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  duration: string;
  image: string;
  instructor: string;
  rating: number;
  progress: number; // 0 to 100
  enrolled: boolean;
  level: string;
  description: string;
  lessons: Lesson[];
  price: number; // to demonstrate CPF balance deduction when enrolling!
}

export interface Activity {
  id: string;
  title: string;
  timestamp: string;
  type: 'course_start' | 'course_progress' | 'course_complete' | 'credit_added' | 'credit_spent' | 'certificate';
  description: string;
  value?: string;
}

export interface UserProfile {
  name: string;
  accountNumber: string;
  balance: number;
  avatar: string;
  rank: string;
  xp: number;
  nextRankXp: number;
}

export interface Exercise {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  xpReward: number;
  questionsCount: number;
  completed: boolean;
  category: string;
}

export interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  unread: boolean;
}
