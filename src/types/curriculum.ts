/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PhaseId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'missed';

export interface ChecklistItem {
  id: string;
  label: string;
  isRequired: boolean;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface PracticalWalkthrough {
  summary: string;
  environment: string;
  codeSnippets: CodeSnippet[];
}

export interface ResourceItem {
  name: string;
  type: 'tool' | 'dataset' | 'doc';
  url?: string;
  description: string;
}

export interface TaskChallenge {
  title: string;
  description: string;
  isStretch?: boolean;
}

export interface CurriculumModule {
  id: string; // 'day-001' .. 'day-100'
  day: number; // 1 .. 100
  phaseId: PhaseId;
  title: string;
  shortDescription: string;
  difficulty: Difficulty;
  estimatedDuration: string;
  isProject?: boolean;
  projectMilestoneId?: string;
  learningObjectives: string[];
  theoryContent: string;
  practicalWalkthrough: PracticalWalkthrough;
  stepByStepInstructions: string[];
  requiredToolsAndDatasets: ResourceItem[];
  tasksAndChallenges: TaskChallenge[];
  deliverables: string[];
  checklist: ChecklistItem[];
  definitionOfDone: string[];
  reflectionQuestions: string[];
  suggestedNextStep: string;
}

export interface PhaseInfo {
  id: PhaseId;
  name: string;
  title: string;
  dayRange: string;
  startDay: number;
  endDay: number;
  description: string;
  badgeColor: string;
  iconName: string;
  accentColor: string;
}

export interface UserModuleProgress {
  moduleId: string;
  day: number;
  completed: boolean;
  completedAt?: string; // ISO date string
  completionDateKey?: string; // YYYY-MM-DD local
  checkedItemIds: string[];
  notes?: string;
  repoOrNotebookUrl?: string;
  xpAwarded: number;
}

export interface ProjectEntry {
  id: string; // 'proj-1' .. 'proj-6', 'capstone'
  day: number;
  title: string;
  description: string;
  deliverablesSummary: string;
  metrics: string; // e.g. "Accuracy: 94.2%, F1: 0.93, Latency: 42ms"
  githubUrl: string;
  demoUrl: string;
  notes: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string;
}

export interface JournalEntry {
  id: string;
  dateKey: string; // YYYY-MM-DD
  moduleId?: string;
  day?: number;
  title: string;
  learned: string;
  confused: string;
  bugsAndErrors: string;
  howSolved: string;
  nextSteps: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  xpValue: number;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface UserSettings {
  challengeStartDate: string | null; // YYYY-MM-DD
  timezone: string;
  theme: 'dark' | 'light';
  mascotIntensity: 'savage' | 'normal' | 'santuy';
  soundEnabled: boolean;
  dailyReminderEnabled: boolean;
  reminderTime: string; // HH:mm
}

export interface XpTransaction {
  id: string;
  source: 'module' | 'project' | 'achievement' | 'streak_bonus';
  refId: string;
  amount: number;
  timestamp: string;
  description: string;
}

export interface AppState {
  version: number;
  settings: UserSettings;
  progress: Record<string, UserModuleProgress>; // keyed by 'day-XXX'
  projects: Record<string, ProjectEntry>; // keyed by project id
  journal: JournalEntry[];
  unlockedAchievements: string[]; // array of achievement IDs
  xpLedger: XpTransaction[];
}
