import { Course, Activity, UserProfile, Exercise, Message } from './types';

export const initialUserProfile: UserProfile = {
  name: 'Gérad Lopez',
  accountNumber: 'EDU-4587-9231-001',
  balance: 38000,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200', // Premium studio shot
  rank: 'Executive Apprenant',
  xp: 4250,
  nextRankXp: 5000,
};

export const initialCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Management Stratégique & Leadership d\'Élite',
    category: 'Business & Management',
    categoryColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    duration: '24 heures',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600&h=400',
    instructor: 'Prof. Laurent Clavel',
    rating: 4.9,
    progress: 75, // For "Continuer l'apprentissage"
    enrolled: true,
    level: 'Avancé',
    price: 3400,
    description: 'Devenez un leader capable de piloter le changement organisationnel à haute échelle, de motiver des équipes multidisciplinaires et d\'exécuter des stratégies d\'innovation disruptives.',
    lessons: [
      {
        id: 'c1-l1',
        title: 'Fondations de l\'autorité inspirante',
        duration: '45 min',
        completed: true,
        content: 'Le leadership d\'élite ne réside pas dans le contrôle, mais dans l\'alignement de la vision. Un leader inspirant communique le "Pourquoi" avant de détailler le "Comment".',
        quiz: [
          {
            question: "Quel est le principe fondamental du Golden Circle de Simon Sinek ?",
            options: [
              "Commencer par le Comment (How)",
              "Commencer par le Pourquoi (Why)",
              "Commencer par le Quoi (What)",
              "Se concentrer sur le profit à court terme"
            ],
            correctAnswerIndex: 1
          }
        ]
      },
      {
        id: 'c1-l2',
        title: 'Communication en situation de crise',
        duration: '1h 15m',
        completed: true,
        content: 'Lors d\'une crise, l\'incertitude engendre la panique. La règle d\'or est d\'agir avec transparence absolue, d\'admettre les limites et de définir des étapes itératives claires.',
        quiz: [
          {
            question: "Quelle est la première action recommandée lors d'une crise managériale ?",
            options: [
              "Dissimuler les faits jusqu'à résolution",
              "Prendre la parole rapidement avec transparence",
              "Déléguer la communication aux subordonnés",
              "Attendre l'avis des actionnaires externes"
            ],
            correctAnswerIndex: 1
          }
        ]
      },
      {
        id: 'c1-l3',
        title: 'Négociation à hauts enjeux et arbitrage',
        duration: '2h 00m',
        completed: true,
        content: 'La négociation n\'est pas un jeu à somme nulle. La méthode Harvard préconise de se concentrer sur les intérêts sous-jacents plutôt que sur les positions affichées.',
        quiz: [
          {
            question: "Que préconise l'approche de négociation raisonnée de Harvard ?",
            options: [
              "Forcer l'adversaire à capituler",
              "Se concentrer sur les intérêts réels plutôt que les positions rigides",
              "Faire des concessions continues et sans contrepartie",
              "Ignorer les critères objectifs"
            ],
            correctAnswerIndex: 1
          }
        ]
      },
      {
        id: 'c1-l4',
        title: 'Gouvernance Agile et prise de décision',
        duration: '1h 30m',
        completed: false,
        content: 'La gouvernance moderne s\'appuie sur la sociocratie et l\'intelligence collective. Apprenez à distribuer le pouvoir de décision au niveau le plus proche du terrain.',
        quiz: [
          {
            question: "Quel outil favorise la prise de décision distribuée en gouvernance agile ?",
            options: [
              "Le vote majoritaire imposé",
              "Le consentement par objections raisonnables",
              "La dictature bienveillante",
              "Le consensus absolu systématique"
            ],
            correctAnswerIndex: 1
          }
        ]
      },
      {
        id: 'c1-l5',
        title: 'Pilotage de la Performance & OKRs d\'Équipe',
        duration: '1h 50m',
        completed: false,
        content: 'Les OKRs (Objectives and Key Results) s\'alignent sur les aspirations stratégiques globales. Ils doivent être ambitieux, mesurables et décorrélés de la rémunération directe.',
        quiz: [
          {
            question: "Un bon Key Result (KR) doit être...",
            options: [
              "Subjectif et long terme",
              "Chiffré, mesurable et orienté impact",
              "Une simple liste de tâches opérationnelles",
              "Fixé uniquement par le comité de direction"
            ],
            correctAnswerIndex: 1
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Intelligence Artificielle Générative pour Décideurs',
    category: 'Technologie & IA',
    categoryColor: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    duration: '18 heures',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600&h=400',
    instructor: 'Dr. Sarah Kaddour',
    rating: 4.8,
    progress: 0,
    enrolled: false,
    level: 'Intermédiaire',
    price: 4800,
    description: 'Maîtrisez les concepts fondamentaux des modèles LLM et de diffusion pour optimiser la productivité de votre entreprise et inventer de nouveaux workflows opérationnels.',
    lessons: [
      {
        id: 'c2-l1',
        title: 'Introduction aux Transformers et LLM',
        duration: '1h 10m',
        completed: false,
        content: 'Les architectures de type Transformer reposent sur les mécanismes de self-attention, permettant de capturer les relations sémantiques lointaines dans un texte.',
        quiz: [
          {
            question: "Quel mécanisme clé a révolutionné le traitement du langage naturel en 2017 ?",
            options: [
              "Les réseaux de neurones récurrents simples",
              "Le mécanisme d'Attention (Self-Attention)",
              "Le filtrage collaboratif bayésien",
              "Le lissage de Laplace"
            ],
            correctAnswerIndex: 1
          }
        ]
      },
      {
        id: 'c2-l2',
        title: 'Prompt Engineering Avancé',
        duration: '1h 45m',
        completed: false,
        content: 'Le prompt engineering utilise des stratégies comme le Few-Shot prompting ou le Chain-of-Thought pour contraindre et structurer le raisonnement du modèle.',
        quiz: [
          {
            question: "Qu'est-ce que le Chain-of-Thought Prompting ?",
            options: [
              "Une suite de prompts aléatoires",
              "Une technique incitant le modèle à décomposer son raisonnement étape par étape",
              "Un protocole de sécurité contre les injections",
              "Un algorithme d'entraînement de poids"
            ],
            correctAnswerIndex: 1
          }
        ]
      },
      {
        id: 'c2-l3',
        title: 'Éthique, Sécurité et RGPD de l\'IA',
        duration: '2h 15m',
        completed: false,
        content: 'Le déploiement d\'IA en Europe exige le respect absolu de la protection des données. Évitez d\'envoyer des données nominatives ou confidentielles aux APIs publiques.',
        quiz: [
          {
            question: "Comment sécuriser l'usage d'un LLM tiers en entreprise ?",
            options: [
              "Autoriser tout le personnel à envoyer les bases clients",
              "Utiliser des passerelles d'anonymisation et des contrats de protection",
              "Ignorer les contraintes réglementaires",
              "Bloquer entièrement l'accès à internet"
            ],
            correctAnswerIndex: 1
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Finance Quantitative & Gestion d\'Actifs',
    category: 'Finance',
    categoryColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    duration: '32 heures',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600&h=400',
    instructor: 'Marc-Antoine Sarda',
    rating: 4.9,
    progress: 0,
    enrolled: false,
    level: 'Expert',
    price: 5200,
    description: 'Une formation mathématique et pratique de haut niveau sur la gestion de portefeuille, la modélisation de risques et l\'implémentation d\'algorithmes financiers.',
    lessons: [
      {
        id: 'c3-l1',
        title: 'Théorie moderne du portefeuille de Markowitz',
        duration: '2h 15m',
        completed: false,
        content: 'La diversification permet de réduire le risque global du portefeuille sans nécessairement sacrifier son rendement espéré, en exploitant la covariance des actifs.',
        quiz: [
          {
            question: "Selon Markowitz, comment définit-on la frontière efficiente ?",
            options: [
              "L'ensemble des portefeuilles maximisant le rendement pour un niveau de risque donné",
              "L'arbitrage d'un seul actif hautement spéculatif",
              "Le portefeuille composé uniquement d'obligations d'État",
              "Une courbe mathématique sans application pratique"
            ],
            correctAnswerIndex: 0
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Design d\'Expérience & Neuro-Ergonomie',
    category: 'Design & UX',
    categoryColor: 'bg-amber-50 text-amber-600 border border-amber-100',
    duration: '15 heures',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600&h=400',
    instructor: 'Aline Mercier',
    rating: 4.7,
    progress: 0,
    enrolled: false,
    level: 'Débutant',
    price: 2900,
    description: 'Appliquez les neurosciences cognitives à la conception de vos interfaces digitales pour maximiser l\'engagement des utilisateurs de manière éthique et inclusive.',
    lessons: [
      {
        id: 'c4-l1',
        title: 'Loi de Fitts et Loi de Hick',
        duration: '1h 05m',
        completed: false,
        content: 'La Loi de Hick stipule que le temps de prise de décision augmente de manière logarithmique avec le nombre d\'options proposées.',
        quiz: [
          {
            question: "Quelle recommandation découle directement de la Loi de Hick ?",
            options: [
              "Augmenter le nombre d'options dans le menu principal",
              "Simplifier les choix et catégoriser l'information pour l'utilisateur",
              "Rendre les boutons de clic minuscules",
              "Utiliser des animations agressives"
            ],
            correctAnswerIndex: 1
          }
        ]
      }
    ]
  }
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'Validation de module',
    timestamp: 'Aujourd\'hui, 10:45',
    type: 'course_progress',
    description: 'Vous avez complété la leçon « Négociation à hauts enjeux » avec un score parfait de 100%.',
    value: '+150 XP'
  },
  {
    id: 'act-2',
    title: 'Certification Émise',
    timestamp: 'Hier, 16:30',
    type: 'certificate',
    description: 'Votre certificat officiel en « Leadership Distribué & Conduite du Changement » est disponible.',
    value: 'Voir'
  },
  {
    id: 'act-3',
    title: 'Incrémentation Budget Formation',
    timestamp: 'Il y a 3 jours',
    type: 'credit_added',
    description: 'Crédit annuel d\'État CPF versé avec succès sur votre espace personnel d\'apprentissage.',
    value: '+2 500 €'
  },
  {
    id: 'act-4',
    title: 'Inscription au cours',
    timestamp: 'Il y a 1 semaine',
    type: 'course_start',
    description: 'Vous vous êtes inscrit au cursus « Management Stratégique & Leadership d\'Élite ».',
    value: '-3 400 €'
  }
];

export const initialExercises: Exercise[] = [
  {
    id: 'ex-1',
    title: 'Cas Pratique : Arbitrage & Résolution de Crise',
    category: 'Management',
    subject: 'Gouvernance',
    difficulty: 'Difficile',
    xpReward: 300,
    questionsCount: 4,
    completed: false,
  },
  {
    id: 'ex-2',
    title: 'Optimisation de Prompts d\'Entreprise',
    category: 'Technologie',
    subject: 'IA Générative',
    difficulty: 'Moyen',
    xpReward: 150,
    questionsCount: 3,
    completed: false,
  },
  {
    id: 'ex-3',
    title: 'Validation des Formules de Diversification',
    category: 'Finance',
    subject: 'Markowitz & Risques',
    difficulty: 'Difficile',
    xpReward: 400,
    questionsCount: 5,
    completed: false,
  },
  {
    id: 'ex-4',
    title: 'Quiz Fondamentaux Loi de Hick & Fitts',
    category: 'Design & UX',
    subject: 'Neuro-ergonomie',
    difficulty: 'Facile',
    xpReward: 100,
    questionsCount: 2,
    completed: true,
  }
];

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    sender: {
      name: 'Sarah Kaddour',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
      role: 'Professeure de Data Science'
    },
    content: 'Bonjour Gérad, j\'ai passé en revue vos dernières propositions de prompt pour le service marketing. C\'est remarquable. Je vous conseille de tester la technique de Chain-of-Thought sur la question du budget.',
    timestamp: 'Aujourd\'hui, 09:15',
    unread: true,
  },
  {
    id: 'msg-2',
    sender: {
      name: 'Yannick Moreau',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
      role: 'Administrateur Pédagogique'
    },
    content: 'Félicitations pour l\'obtention de votre dernier certificat ! Votre solde de 38 000 € est disponible pour tout autre cursus de votre choix.',
    timestamp: 'Hier, 17:00',
    unread: false,
  }
];
