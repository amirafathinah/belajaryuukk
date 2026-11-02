/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Flame,
  Zap,
  CheckCircle2,
  Calendar,
  Compass,
  Briefcase,
  Award,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { AppState, CurriculumModule } from '../types/curriculum';
import { PHASES } from '../data/phases';
import { ACHIEVEMENTS } from '../data/achievements';
import { MascotWidget } from './MascotWidget';
import { MascotMessage } from '../services/mascotQuotes';
import { getLocalDateString, formatIndonesianDate, diffCalendarDays } from '../services/calendar';

interface DashboardViewProps {
  state: AppState;
  plannedDay: number | null;
  daysPassed: number;
  daysRemaining: number;
  isStarted: boolean;
  currentStreak: number;
  longestStreak: number;
  streakBreakReason?: string;
  totalXp: number;
  mascotMessage: MascotMessage;
  todayModule?: CurriculumModule;
  nextIncompleteModule?: CurriculumModule;
  onOpenModule: (moduleId: string) => void;
  onStartChallenge: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  plannedDay,
  daysPassed,
  daysRemaining,
  isStarted,
  currentStreak,
  longestStreak,
  streakBreakReason,
  totalXp,
  mascotMessage,
  todayModule,
  nextIncompleteModule,
  onOpenModule,
  onStartChallenge,
  onNavigateTab,
}) => {
  const completedModules = Object.values(state.progress).filter((p) => p.completed);
  const completedCount = completedModules.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 100) * 100));

  // Hitung proyek yang telah selesai
  const completedProjects = Object.values(state.projects).filter(
    (p) => p.status === 'completed'
  );
  const projectCount = completedProjects.length;

  // Tentukan fase aktif saat ini berdasarkan plannedDay atau completedCount
  const targetDay = plannedDay || Math.max(1, completedCount + 1);
  const currentPhase = PHASES.find(
    (p) => targetDay >= p.startDay && targetDay <= p.endDay
  ) || PHASES[0];

  // Modul fokus: Jika hari ini ada modul, gunakan hari ini; jika tidak ada, gunakan modul belum selesai berikutnya
  const focusModule = todayModule || nextIncompleteModule;
  const isFocusCompleted = focusModule
    ? Boolean(state.progress[focusModule.id]?.completed)
    : false;

  // 7-Hari aktivitas terakhir (kalender nyata)
  const todayKey = getLocalDateString();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = getLocalDateString(d);
    // Cek apakah ada modul yang diselesaikan pada tanggal tersebut
    const hasActivity = Object.values(state.progress).some(
      (p) => p.completed && p.completionDateKey === dateKey
    );
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'narrow' });
    const isToday = dateKey === todayKey;

    return {
      dateKey,
      dayName,
      hasActivity,
      isToday,
      dateNum: d.getDate(),
    };
  });

  // Recent Achievements (3 teratas yang terbuka)
  const unlockedAchievementDefs = ACHIEVEMENTS.filter((a) =>
    state.unlockedAchievements.includes(a.id)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Banner Memulai Tantangan jika belum dimulai */}
      {!isStarted && (
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Program Belajar 100 Hari Dimulai Dari Sini
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Selamat Datang di Savage Learning Lab
              </h1>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Tantangan terstruktur 100 hari untuk menguasai Machine Learning & AI praktis. 70% proyek & hands-on, 30% teori bernutrisi, dengan maskot savage yang selalu menjaga akuntabilitasmu.
              </p>
            </div>
            <button
              onClick={onStartChallenge}
              className="flex-shrink-0 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm md:text-base rounded-2xl shadow-xl shadow-purple-900/50 transition-all transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              Mulai Tantangan 100 Hari Saya
            </button>
          </div>
        </div>
      )}

      {/* Mascot Widget Interaktif */}
      <MascotWidget
        message={mascotMessage}
        onActionClick={(target) => {
          if (target === 'start') onStartChallenge();
          else if (target === 'mission' && focusModule) onOpenModule(focusModule.id);
          else if (target === 'roadmap') onNavigateTab('roadmap');
          else if (target === 'portfolio') onNavigateTab('portfolio');
          else if (target === 'journal') onNavigateTab('journal');
        }}
      />

      {/* Grid Statistik Utama (4 Kartu) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kartu 1: Hari Kalender */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">
              Hari Kalender
            </span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-black text-white font-mono">
              {isStarted ? `Hari ${String(plannedDay).padStart(2, '0')}` : '--'}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {isStarted ? `${daysRemaining} hari tersisa ke target` : 'Belum dimulai'}
          </p>
        </div>

        {/* Kartu 2: Modul Selesai */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">
              Kurikulum Selesai
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-black text-white font-mono">
              {completedCount}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Kartu 3: Streak Pembelajaran */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">
              Streak Aktif
            </span>
            <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl md:text-3xl font-black font-mono ${currentStreak > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {currentStreak}
            </span>
            <span className="text-xs font-mono text-slate-500">hari berturut</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Rekor terpanjang: {longestStreak} hari
          </p>
        </div>

        {/* Kartu 4: Total XP */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">
              Total XP Terkumpul
            </span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-black text-purple-300 font-mono">
              {totalXp.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-500">XP</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {projectCount}/7 Proyek Selesai
          </p>
        </div>
      </div>

      {/* Informasi Streak Break jika ada */}
      {streakBreakReason && currentStreak === 0 && completedCount > 0 && (
        <div className="flex items-start gap-3 bg-rose-950/30 border border-rose-800/40 rounded-2xl p-4 text-rose-200 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Penjelasan Streak: </span>
            {streakBreakReason} Anda tetap dapat menyelesaikan modul yang terlewat kapan saja tanpa kehilangan catatan atau XP sebelumnya.
          </div>
        </div>
      )}

      {/* Bagian Hero: Misi Hari Ini / Lanjut Belajar & 7-Hari Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kartu Misi Utama (2 Kolom) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-900/40 rounded-3xl p-6 md:p-7 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {isStarted ? `MISI HARI ${String(plannedDay).padStart(2, '0')}` : 'MISI PERDANA'}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${currentPhase.badgeColor} border`}>
                {currentPhase.title}
              </span>
            </div>
            {isFocusCompleted && (
              <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> SUDAH TUNTAS
              </span>
            )}
          </div>

          {focusModule ? (
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {focusModule.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {focusModule.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                <span>⏱️ Estimasi: {focusModule.estimatedDuration}</span>
                <span>⚡ Kesulitan: {focusModule.difficulty}</span>
                <span>🎯 Praktik: 70% Hands-on</span>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenModule(focusModule.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-950 transition active:scale-95"
                >
                  {isFocusCompleted ? 'Tinjau Kembali Misi' : 'Lanjut Belajar Sekarang'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigateTab('roadmap')}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 transition"
                >
                  <Compass className="w-4 h-4" />
                  Jelajahi 100 Modul
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Semua Modul 100 Hari Telah Tuntas!</h3>
              <p className="text-sm text-slate-400">Selamat! Anda telah menyelesaikan seluruh kurikulum.</p>
            </div>
          )}
        </div>

        {/* 7-Hari Aktivitas Terakhir (1 Kolom) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Aktivitas 7 Hari Terakhir
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {formatIndonesianDate(todayKey)}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Streak bertambah 1 hari jika ada minimal 1 modul diselesaikan pada tanggal kalender lokal tersebut.
            </p>

            {/* Kalender Strip 7 Hari */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {last7Days.map((day) => (
                <div
                  key={day.dateKey}
                  className={`flex flex-col items-center p-2 rounded-xl border transition ${
                    day.hasActivity
                      ? 'bg-purple-600/20 border-purple-500/50 text-purple-200'
                      : day.isToday
                      ? 'bg-slate-800/80 border-purple-400/30 text-slate-300'
                      : 'bg-slate-900 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-mono font-medium">{day.dayName}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center my-1.5 text-xs font-mono font-bold ${
                      day.hasActivity
                        ? 'bg-purple-500 text-white'
                        : day.isToday
                        ? 'border border-dashed border-purple-400 text-purple-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {day.hasActivity ? '✓' : day.dateNum}
                  </div>
                  <span className="text-[9px] font-mono">
                    {day.isToday ? 'Hari Ini' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Streak Terpanjang: {longestStreak} hari</span>
            <span className="text-purple-400 font-semibold">{projectCount} Proyek Shipped</span>
          </div>
        </div>
      </div>

      {/* Progress Fase Kurikulum & Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress 7 Fase (2 Kolom) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Struktur Perjalanan 7 Fase
              </h3>
              <p className="text-xs text-slate-400">
                Dari ML In Action hingga Full Capstone Showcase
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
            >
              Buka Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {PHASES.map((phase) => {
              // Hitung modul selesai di fase ini
              const phaseModules = Object.values(state.progress).filter(
                (p) => p.completed && p.day >= phase.startDay && p.day <= phase.endDay
              );
              const totalInPhase = phase.endDay - phase.startDay + 1;
              const phasePercent = Math.round((phaseModules.length / totalInPhase) * 100);
              const isCurrent = currentPhase.id === phase.id;

              return (
                <div
                  key={phase.id}
                  onClick={() => onNavigateTab('roadmap')}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-purple-950/20 border-purple-500/40 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-400">
                        {phase.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">• {phase.dayRange}</span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500 text-white font-bold">
                          FASE AKTIF
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white truncate mt-0.5">
                      {phase.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-shrink-0">
                    <div className="w-28 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 bg-purple-500 rounded-full transition-all"
                        style={{ width: `${phasePercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400 w-12 text-right">
                      {phaseModules.length}/{totalInPhase}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements Unlocked (1 Kolom) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Pencapaian (Achievements)
              </h3>
              <span className="text-xs font-mono text-purple-400 font-bold">
                {unlockedAchievementDefs.length}/{ACHIEVEMENTS.length}
              </span>
            </div>

            {unlockedAchievementDefs.length > 0 ? (
              <div className="space-y-3">
                {unlockedAchievementDefs.slice(0, 4).map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-purple-950/20 border border-purple-500/30"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold flex-shrink-0 text-sm">
                      🏆
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold">
                          +{ach.xpValue} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs space-y-2">
                <Award className="w-8 h-8 text-slate-700 mx-auto" />
                <p>Belum ada achievement terbuka.</p>
                <p className="text-[11px] text-slate-600">
                  Selesaikan misi pertama Anda untuk membuka badge "First Mission"!
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => onNavigateTab('settings')}
              className="w-full py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-mono font-medium transition text-center"
            >
              Lihat Pengaturan & Ekspor Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
