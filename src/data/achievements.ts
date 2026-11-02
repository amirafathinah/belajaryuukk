/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Achievement } from '../types/curriculum';

export interface AchievementDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  xpValue: number;
  conditionChecker: (context: AchievementCheckContext) => boolean;
}

export interface AchievementCheckContext {
  completedModulesCount: number;
  completedProjectCount: number;
  currentStreak: number;
  longestStreak: number;
  completedDaySet: Set<number>;
  completedProjectIds: Set<string>;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_mission',
    title: 'First Mission',
    subtitle: 'Langkah Pertama ML',
    description: 'Menyelesaikan modul pembelajaran pertama dengan checklist tuntas.',
    icon: 'Flag',
    xpValue: 100,
    conditionChecker: (ctx) => ctx.completedModulesCount >= 1,
  },
  {
    id: 'streak_3',
    title: '3-Day Streak',
    subtitle: 'Mulai Konsisten',
    description: 'Mempertahankan streak belajar selama 3 hari kalender berturut-turut.',
    icon: 'Flame',
    xpValue: 150,
    conditionChecker: (ctx) => ctx.currentStreak >= 3 || ctx.longestStreak >= 3,
  },
  {
    id: 'first_project',
    title: 'First Project',
    subtitle: 'Bukan Cuma Teori',
    description: 'Menuntaskan Mini-Project 1 dan mencatat repositori kode di portofolio.',
    icon: 'Briefcase',
    xpValue: 300,
    conditionChecker: (ctx) => ctx.completedProjectCount >= 1,
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    subtitle: 'Seminggu Tanpa Alasan',
    description: 'Menyelesaikan modul setiap hari selama seminggu penuh tanpa putus.',
    icon: 'Zap',
    xpValue: 350,
    conditionChecker: (ctx) => ctx.currentStreak >= 7 || ctx.longestStreak >= 7,
  },
  {
    id: 'model_tamer',
    title: 'Model Tamer',
    subtitle: 'Pawang Overfitting',
    description: 'Menuntaskan seluruh materi Fase 2: Classical ML, XGBoost, dan Tuning.',
    icon: 'Cpu',
    xpValue: 400,
    conditionChecker: (ctx) => {
      // Days 13 to 27 completed
      for (let d = 13; d <= 27; d++) {
        if (!ctx.completedDaySet.has(d)) return false;
      }
      return true;
    },
  },
  {
    id: 'streak_14',
    title: '14-Day Streak',
    subtitle: 'Kebiasaan Terbentuk',
    description: 'Streak dua minggu berturut-turut! Belajar machine learning telah menjadi refleks harian.',
    icon: 'Activity',
    xpValue: 500,
    conditionChecker: (ctx) => ctx.currentStreak >= 14 || ctx.longestStreak >= 14,
  },
  {
    id: 'halfway_there',
    title: 'Halfway There',
    subtitle: '50 Hari Bertahan',
    description: 'Menuntaskan 50 modul kurikulum. Separuh jalan menuju penguasaan sejati.',
    icon: 'Milestone',
    xpValue: 750,
    conditionChecker: (ctx) => ctx.completedModulesCount >= 50,
  },
  {
    id: 'streak_30',
    title: '30-Day Streak',
    subtitle: 'Sebulan Penuh Keringat',
    description: '30 hari disiplin tanpa putus. Lebih tangguh daripada 99% pembelajar biasa.',
    icon: 'Award',
    xpValue: 1000,
    conditionChecker: (ctx) => ctx.currentStreak >= 30 || ctx.longestStreak >= 30,
  },
  {
    id: 'nlp_explorer',
    title: 'NLP Explorer',
    subtitle: 'Penakluk Token',
    description: 'Menuntaskan seluruh materi Fase 5: Text, Attention, Transformers, & IndoBERT.',
    icon: 'Languages',
    xpValue: 600,
    conditionChecker: (ctx) => {
      for (let d = 55; d <= 69; d++) {
        if (!ctx.completedDaySet.has(d)) return false;
      }
      return true;
    },
  },
  {
    id: 'llm_builder',
    title: 'LLM Builder',
    subtitle: 'Bukan Sekadar Prompt Engineer',
    description: 'Menuntaskan seluruh materi Fase 6: Vector DB, RAG anti-halusinasi, & Guardrails.',
    icon: 'Sparkles',
    xpValue: 800,
    conditionChecker: (ctx) => {
      for (let d = 70; d <= 85; d++) {
        if (!ctx.completedDaySet.has(d)) return false;
      }
      return true;
    },
  },
  {
    id: 'capstone_shipped',
    title: 'Capstone Shipped',
    subtitle: 'Karya Nyata di Portofolio',
    description: 'Menyelesaikan proyek Capstone, merilis live demo web app, dan menulis README kelas dunia.',
    icon: 'Rocket',
    xpValue: 1200,
    conditionChecker: (ctx) => ctx.completedProjectIds.has('capstone') || ctx.completedDaySet.has(100),
  },
  {
    id: '100_day_finisher',
    title: '100-Day Finisher',
    subtitle: 'Legenda ML Savage',
    description: 'Menamatkan seluruh 100 hari kurikulum tanpa ada misi yang tertinggal. Respect abangkuh!',
    icon: 'Trophy',
    xpValue: 2500,
    conditionChecker: (ctx) => ctx.completedModulesCount >= 100,
  },
];
