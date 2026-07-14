export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
  _count?: { tests: number; questions: number };
}

export interface TestSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  durationMin: number;
  passingScore: number;
  tags: string;
  categoryId: string;
  createdAt: string;
  category: Category;
  _count: { questions: number; attempts: number };
}

export interface TestQuestionOption {
  id: string;
  text: string;
}

export interface TestQuestion {
  id: string;
  text: string;
  difficulty: Difficulty;
  options: TestQuestionOption[];
}

export interface TestForTaking {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  durationMin: number;
  passingScore: number;
  tags: string;
  category: Category;
  questions: TestQuestion[];
}

export interface GradedOption extends TestQuestionOption {
  isCorrect: boolean;
}

export interface GradedQuestion {
  questionId: string;
  questionText: string;
  explanation: string;
  difficulty: Difficulty;
  selectedOptionId: string | null;
  correctOptionId: string | null;
  options: GradedOption[];
  isCorrect: boolean;
}

export interface SubmitResult {
  attemptId: string;
  testId: string;
  testTitle: string;
  category: Category;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSec: number;
  passed: boolean;
  passingScore: number;
  difficulty: Difficulty;
  graded: GradedQuestion[];
}

export interface BankQuestion {
  id: string;
  text: string;
  explanation: string;
  difficulty: Difficulty;
  categoryId: string;
  testId: string | null;
  createdAt: string;
  category: Category;
  options: GradedOption[];
}

export interface AttemptSummary {
  id: string;
  testId: string;
  testTitle: string;
  category: Category;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSec: number;
  passed: boolean;
  completedAt: string;
}

export interface CategoryStat {
  name: string;
  color: string;
  attempts: number;
  totalScore: number;
  avgScore: number;
}

export interface Stats {
  tests: number;
  questions: number;
  categories: number;
  totalAttempts: number;
  passedAttempts: number;
  avgScore: number;
  totalTimeSpent: number;
  testsCompleted: number;
  recentAttempts: AttemptSummary[];
  categoryBreakdown: CategoryStat[];
}

export type View =
  | { name: "home" }
  | { name: "tests" }
  | { name: "runner"; testId: string }
  | { name: "results"; attemptId: string }
  | { name: "bank" }
  | { name: "dashboard" }
  | { name: "drill" };
