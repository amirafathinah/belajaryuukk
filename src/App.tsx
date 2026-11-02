/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppState,
  CurriculumModule,
  ProjectEntry,
  JournalEntry,
  UserSettings,
} from './types/curriculum';
import {
  loadAppState,
  saveAppState,
  addXpIdempotent,
  calculateTotalXp,
} from './services/storage';
import {
  getLocalDateString,
  calculateStreak,
  calculatePlannedDay,
} from './services/calendar';
import { getMascotMessage } from './services/mascotQuotes';
import { playSuccessChime, playFanfare } from './services/audio';
import { CURRICULUM_MODULES, getModuleByDay, getModuleById } from './data/curriculum';
import { ACHIEVEMENTS } from './data/achievements';

import { Navbar, NavigationTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { RoadmapView } from './components/RoadmapView';
import { LearningRoomView } from './components/LearningRoomView';
import { PortfolioView } from './components/PortfolioView';
import { JournalView } from './components/JournalView';
import { SettingsView } from './components/SettingsView';
import { Confetti } from './components/Confetti';
import { ToastContainer, ToastItem } from './components/ToastContainer';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('day-001');
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [recentProjectShipped, setRecentProjectShipped] = useState(false);
  const [recentAchievementUnlocked, setRecentAchievementUnlocked] = useState(false);

  // Helper untuk menambah toast
  const addToast = useCallback(
    (type: ToastItem['type'], title: string, message?: string) => {
      const newToast: ToastItem = {
        id: `toast-${Date.now()}-${Math.random()}`,
        type,
        title,
        message,
      };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Simpan state setiap ada perubahan
  const updateStateAndPersist = useCallback((updater: (prev: AppState) => AppState) => {
    setAppState((prev) => {
      const next = updater(prev);
      saveAppState(next);
      return next;
    });
  }, []);

  // Hitung tanggal lokal hari ini
  const todayKey = getLocalDateString();
  const currentHour = new Date().getHours();

  // Hitung hari terencana kalender
  const { plannedDay, daysPassed, daysRemaining, isStarted } = useMemo(() => {
    return calculatePlannedDay(appState.settings.challengeStartDate, todayKey);
  }, [appState.settings.challengeStartDate, todayKey]);

  // Hitung riwayat tanggal penyelesaian untuk kalkulasi streak
  const completionDateKeys = useMemo(() => {
    return Object.values(appState.progress)
      .filter((p) => p.completed && p.completionDateKey)
      .map((p) => p.completionDateKey as string);
  }, [appState.progress]);

  // Hitung streak kalender lokal
  const streakResult = useMemo(() => {
    return calculateStreak(completionDateKeys, todayKey);
  }, [completionDateKeys, todayKey]);

  // Modul hari ini & Modul belum selesai berikutnya
  const todayModule = useMemo(() => {
    const dayNum = plannedDay || 1;
    return getModuleByDay(dayNum) || CURRICULUM_MODULES[0];
  }, [plannedDay]);

  const nextIncompleteModule = useMemo(() => {
    return (
      CURRICULUM_MODULES.find((m) => !appState.progress[m.id]?.completed) ||
      CURRICULUM_MODULES[0]
    );
  }, [appState.progress]);

  // Hitung total completed & XP
  const completedModulesList = useMemo(() => {
    return Object.values(appState.progress).filter((p) => p.completed);
  }, [appState.progress]);
  const completedCount = completedModulesList.length;
  const totalXp = useMemo(() => calculateTotalXp(appState), [appState]);

  // Hitung missed days count (hari kalender terlewat tanpa penyelesaian)
  const missedDaysCount = useMemo(() => {
    if (!isStarted || !plannedDay) return 0;
    let missed = 0;
    for (let d = 1; d < plannedDay; d++) {
      const mod = getModuleByDay(d);
      if (mod && !appState.progress[mod.id]?.completed) {
        missed += 1;
      }
    }
    return missed;
  }, [isStarted, plannedDay, appState.progress]);

  // Evaluasi pencapaian (Achievements Check) otomatis
  useEffect(() => {
    const completedDaySet = new Set<number>();
    completedModulesList.forEach((p) => completedDaySet.add(p.day));

    const completedProjectIds = new Set<string>();
    Object.values(appState.projects).forEach((proj) => {
      if (proj.status === 'completed') completedProjectIds.add(proj.id);
    });

    const context = {
      completedModulesCount: completedCount,
      completedProjectCount: completedProjectIds.size,
      currentStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      completedDaySet,
      completedProjectIds,
    };

    let stateModified = false;
    let intermediateState = { ...appState };

    for (const ach of ACHIEVEMENTS) {
      if (!intermediateState.unlockedAchievements.includes(ach.id)) {
        if (ach.conditionChecker(context)) {
          // Berikan penghargaan achievement baru!
          stateModified = true;
          intermediateState.unlockedAchievements = [
            ...intermediateState.unlockedAchievements,
            ach.id,
          ];
          const { newState } = addXpIdempotent(
            intermediateState,
            'achievement',
            ach.id,
            ach.xpValue,
            `Membuka Achievement: ${ach.title}`
          );
          intermediateState = newState;

          // Efek suara & notifikasi
          playFanfare(appState.settings.soundEnabled);
          setRecentAchievementUnlocked(true);
          addToast('success', `🏆 Achievement Terbuka: ${ach.title}!`, `${ach.subtitle} (+${ach.xpValue} XP)`);
        }
      }
    }

    if (stateModified) {
      setAppState(intermediateState);
      saveAppState(intermediateState);
    }
  }, [
    completedCount,
    streakResult.currentStreak,
    streakResult.longestStreak,
    appState.progress,
    appState.projects,
    appState.settings.soundEnabled,
    addToast,
  ]);

  // Savage Mascot message generator
  const mascotMessage = useMemo(() => {
    return getMascotMessage({
      isStarted,
      plannedDay,
      completedCount,
      currentStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      todayCompleted: streakResult.todayCompleted,
      yesterdayCompleted: streakResult.yesterdayCompleted,
      missedDaysCount,
      recentProjectShipped,
      recentAchievementUnlocked,
      intensity: appState.settings.mascotIntensity,
      hourOfDay: currentHour,
    });
  }, [
    isStarted,
    plannedDay,
    completedCount,
    streakResult.currentStreak,
    streakResult.longestStreak,
    streakResult.todayCompleted,
    streakResult.yesterdayCompleted,
    missedDaysCount,
    recentProjectShipped,
    recentAchievementUnlocked,
    appState.settings.mascotIntensity,
    currentHour,
  ]);

  // Handler: Mulai Tantangan 100 Hari
  const handleStartChallenge = (startDateStr: string = todayKey) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        challengeStartDate: startDateStr,
      },
    }));
    addToast('success', 'Tantangan 100 Hari Resmi Dimulai!', `Hari ke-1 terkunci pada ${startDateStr}. Good luck!`);
    setSelectedModuleId('day-001');
    setActiveTab('room');
  };

  // Handler: Buka Modul Spesifik
  const handleOpenModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setActiveTab('room');
  };

  // Handler: Selesaikan Misi Modul
  const handleCompleteMission = (mod: CurriculumModule) => {
    const existing = appState.progress[mod.id];
    const isAlreadyCompleted = Boolean(existing?.completed);

    const completionDate = existing?.completedAt || new Date().toISOString();
    const dateKey = existing?.completionDateKey || todayKey;

    // Tentukan nilai XP
    const xpReward = mod.day === 100 ? 1000 : mod.isProject ? 300 : 100;

    // Perbarui progress modul
    const updatedProgress: Record<string, any> = {
      ...appState.progress,
      [mod.id]: {
        moduleId: mod.id,
        day: mod.day,
        completed: true,
        completedAt: completionDate,
        completionDateKey: dateKey,
        checkedItemIds: mod.checklist.map((c) => c.id),
        notes: existing?.notes,
        repoOrNotebookUrl: existing?.repoOrNotebookUrl,
        xpAwarded: xpReward,
      },
    };

    // Jika ini adalah milestone project, perbarui juga state proyek jika ada
    let updatedProjects = { ...appState.projects };
    if (mod.projectMilestoneId && updatedProjects[mod.projectMilestoneId]) {
      updatedProjects[mod.projectMilestoneId] = {
        ...updatedProjects[mod.projectMilestoneId],
        status: 'completed',
        completedAt: completionDate,
      };
      setRecentProjectShipped(true);
    }

    let nextState: AppState = {
      ...appState,
      progress: updatedProgress,
      projects: updatedProjects,
    };

    // Tambahkan XP secara idempotent
    const { newState, awarded } = addXpIdempotent(
      nextState,
      'module',
      mod.id,
      xpReward,
      `Penyelesaian Hari ${String(mod.day).padStart(2, '0')}: ${mod.title}`
    );

    setAppState(newState);
    saveAppState(newState);

    // Efek perayaan
    setConfettiActive(true);
    playSuccessChime(appState.settings.soundEnabled);

    if (awarded) {
      addToast(
        'success',
        `Misi Hari ${String(mod.day).padStart(2, '0')} Selesai! 🎉`,
        `+${xpReward} XP berhasil diklaim ke portofolio Anda.`
      );
    } else {
      addToast('info', `Misi Hari ${String(mod.day).padStart(2, '0')} Tuntas!`, 'Progres tersimpan rapi.');
    }
  };

  // Handler checklist update
  const handleUpdateChecklist = (moduleId: string, checkedItemIds: string[]) => {
    updateStateAndPersist((prev) => {
      const existing = prev.progress[moduleId] || {
        moduleId,
        day: getModuleById(moduleId)?.day || 1,
        completed: false,
        checkedItemIds: [],
        xpAwarded: 0,
      };
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [moduleId]: {
            ...existing,
            checkedItemIds,
          },
        },
      };
    });
  };

  // Handler notes update
  const handleUpdateNotes = (moduleId: string, notes: string) => {
    updateStateAndPersist((prev) => {
      const existing = prev.progress[moduleId] || {
        moduleId,
        day: getModuleById(moduleId)?.day || 1,
        completed: false,
        checkedItemIds: [],
        xpAwarded: 0,
      };
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [moduleId]: {
            ...existing,
            notes,
          },
        },
      };
    });
  };

  // Handler repo url update
  const handleUpdateRepoUrl = (moduleId: string, repoOrNotebookUrl: string) => {
    updateStateAndPersist((prev) => {
      const existing = prev.progress[moduleId] || {
        moduleId,
        day: getModuleById(moduleId)?.day || 1,
        completed: false,
        checkedItemIds: [],
        xpAwarded: 0,
      };
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [moduleId]: {
            ...existing,
            repoOrNotebookUrl,
          },
        },
      };
    });
  };

  // Handler Project Update
  const handleUpdateProject = (updatedProj: ProjectEntry) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        [updatedProj.id]: updatedProj,
      },
    }));
    addToast('success', 'Data Proyek Disimpan', `Portofolio "${updatedProj.title}" berhasil diperbarui.`);
  };

  // Handler Journal Save
  const handleSaveJournalEntry = (entry: JournalEntry) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      journal: [entry, ...prev.journal.filter((j) => j.id !== entry.id)],
    }));
  };

  // Handler Journal Delete
  const handleDeleteJournalEntry = (id: string) => {
    updateStateAndPersist((prev) => ({
      ...prev,
      journal: prev.journal.filter((j) => j.id !== id),
    }));
    addToast('info', 'Catatan Dihapus', 'Entri jurnal telah dihapus dari riwayat.');
  };

  // Modul aktif untuk Learning Room
  const activeModule = getModuleById(selectedModuleId) || CURRICULUM_MODULES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white antialiased">
      {/* Celebration Confetti */}
      <Confetti active={confettiActive} onComplete={() => setConfettiActive(false)} />

      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        plannedDay={plannedDay}
        currentStreak={streakResult.currentStreak}
        totalXp={totalXp}
        completedCount={completedCount}
        isStarted={isStarted}
        onStartChallenge={() => handleStartChallenge()}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            state={appState}
            plannedDay={plannedDay}
            daysPassed={daysPassed}
            daysRemaining={daysRemaining}
            isStarted={isStarted}
            currentStreak={streakResult.currentStreak}
            longestStreak={streakResult.longestStreak}
            streakBreakReason={streakResult.streakBreakReason}
            totalXp={totalXp}
            mascotMessage={mascotMessage}
            todayModule={todayModule}
            nextIncompleteModule={nextIncompleteModule}
            onOpenModule={handleOpenModule}
            onStartChallenge={() => handleStartChallenge()}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            state={appState}
            plannedDay={plannedDay}
            isStarted={isStarted}
            onOpenModule={handleOpenModule}
          />
        )}

        {activeTab === 'room' && (
          <LearningRoomView
            module={activeModule}
            state={appState}
            onBackToRoadmap={() => setActiveTab('roadmap')}
            onNavigateModule={(modId) => setSelectedModuleId(modId)}
            onUpdateChecklist={handleUpdateChecklist}
            onUpdateNotes={handleUpdateNotes}
            onUpdateRepoUrl={handleUpdateRepoUrl}
            onCompleteMission={handleCompleteMission}
            soundEnabled={appState.settings.soundEnabled}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView
            state={appState}
            onUpdateProject={handleUpdateProject}
            onOpenModuleByDay={(dayNum) => {
              const mod = getModuleByDay(dayNum);
              if (mod) handleOpenModule(mod.id);
            }}
            soundEnabled={appState.settings.soundEnabled}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView
            state={appState}
            onSaveEntry={handleSaveJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
            soundEnabled={appState.settings.soundEnabled}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            state={appState}
            onUpdateSettings={(newSettings) => {
              updateStateAndPersist((prev) => ({
                ...prev,
                settings: newSettings,
              }));
            }}
            onStateRestored={(restored) => {
              setAppState(restored);
              saveAppState(restored);
            }}
            onStartChallengeDate={(dateStr) => handleStartChallenge(dateStr)}
            soundEnabled={appState.settings.soundEnabled}
          />
        )}
      </main>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            100 Days to ML & AI — Savage Learning Lab • Local-first Personal Platform
          </p>
          <p className="text-[11px] text-slate-600">
            70% Hands-on Practice • 30% Concise Theory • No External Secrets Required
          </p>
        </div>
      </footer>
    </div>
  );
}
