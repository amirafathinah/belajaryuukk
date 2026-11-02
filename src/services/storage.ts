/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState, ProjectEntry, UserSettings, XpTransaction, UserModuleProgress } from '../types/curriculum';
import { DEFAULT_PROJECT_TEMPLATES } from '../data/curriculum';

export const STORAGE_KEY = 'mlai100:v1:state';
export const CURRENT_SCHEMA_VERSION = 1;

export function getDefaultProjects(): Record<string, ProjectEntry> {
  const projects: Record<string, ProjectEntry> = {};
  for (const t of DEFAULT_PROJECT_TEMPLATES) {
    projects[t.id] = {
      id: t.id,
      day: t.day,
      title: t.title,
      description: t.description,
      deliverablesSummary: t.deliverablesSummary,
      metrics: '',
      githubUrl: '',
      demoUrl: '',
      notes: '',
      status: 'not_started',
    };
  }
  return projects;
}

export function getDefaultSettings(): UserSettings {
  let timezone = 'Asia/Jakarta';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta';
  } catch {
    timezone = 'Asia/Jakarta';
  }

  return {
    challengeStartDate: null,
    timezone,
    theme: 'dark',
    mascotIntensity: 'savage',
    soundEnabled: false,
    dailyReminderEnabled: true,
    reminderTime: '20:00',
  };
}

export function createInitialState(): AppState {
  return {
    version: CURRENT_SCHEMA_VERSION,
    settings: getDefaultSettings(),
    progress: {},
    projects: getDefaultProjects(),
    journal: [],
    unlockedAchievements: [],
    xpLedger: [],
  };
}

/**
 * Memuat state tersimpan dari browser localStorage dengan penanganan error aman
 */
export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState();
    }
    const parsed = JSON.parse(raw) as Partial<AppState>;

    // Migrasi atau fallback field jika tidak lengkap
    const defaultState = createInitialState();
    const mergedState: AppState = {
      version: CURRENT_SCHEMA_VERSION,
      settings: { ...defaultState.settings, ...(parsed.settings || {}) },
      progress: parsed.progress || {},
      projects: { ...defaultState.projects, ...(parsed.projects || {}) },
      journal: Array.isArray(parsed.journal) ? parsed.journal : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      xpLedger: Array.isArray(parsed.xpLedger) ? parsed.xpLedger : [],
    };

    return mergedState;
  } catch (err) {
    console.warn('Gagal memuat state dari localStorage, menggunakan initial state:', err);
    return createInitialState();
  }
}

/**
 * Menyimpan state ke localStorage dengan perlindungan kuota storage
 */
export function saveAppState(state: AppState): boolean {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.error('Gagal menyimpan state ke localStorage (mungkin kuota penuh):', err);
    return false;
  }
}

/**
 * Menambahkan transaksi XP secara IDEMPOTENT.
 * Jika sumber dan refId yang sama sudah ada di xpLedger, tidak akan menambahkan XP ganda!
 */
export function addXpIdempotent(
  state: AppState,
  source: XpTransaction['source'],
  refId: string,
  amount: number,
  description: string
): { newState: AppState; awarded: boolean } {
  const transactionId = `${source}:${refId}`;
  const alreadyAwarded = state.xpLedger.some((t) => t.id === transactionId);

  if (alreadyAwarded) {
    return { newState: state, awarded: false };
  }

  const newTx: XpTransaction = {
    id: transactionId,
    source,
    refId,
    amount,
    timestamp: new Date().toISOString(),
    description,
  };

  const newState: AppState = {
    ...state,
    xpLedger: [newTx, ...state.xpLedger],
  };

  saveAppState(newState);
  return { newState, awarded: true };
}

/**
 * Menghitung total akumulasi XP dari riwayat ledger transaksi
 */
export function calculateTotalXp(state: AppState): number {
  return state.xpLedger.reduce((sum, tx) => sum + tx.amount, 0);
}

/**
 * Menghasilkan file JSON backup cadangan untuk diekspor
 */
export function exportAppStateToJson(state: AppState): string {
  const exportData = {
    app: '100 Days to ML & AI — Savage Learning Lab',
    exportVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    challengeStartDate: state.settings.challengeStartDate,
    state,
  };
  return JSON.stringify(exportData, null, 2);
}

export interface ImportValidationResult {
  isValid: boolean;
  importedState?: AppState;
  summary?: {
    completedModules: number;
    projectsStarted: number;
    totalXp: number;
    exportDate: string;
  };
  error?: string;
}

/**
 * Memvalidasi file JSON cadangan sebelum diimpor ke sistem
 */
export function validateImportJson(jsonString: string): ImportValidationResult {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'Format file tidak valid (bukan JSON object).' };
    }

    const targetState = parsed.state || parsed;
    if (!targetState || typeof targetState !== 'object') {
      return { isValid: false, error: 'Data state tidak ditemukan di dalam berkas cadangan.' };
    }

    if (!targetState.settings || typeof targetState.progress !== 'object') {
      return { isValid: false, error: 'Struktur data cadangan tidak kompatibel dengan skema kurikulum.' };
    }

    const defaultState = createInitialState();
    const cleanState: AppState = {
      version: CURRENT_SCHEMA_VERSION,
      settings: { ...defaultState.settings, ...(targetState.settings || {}) },
      progress: targetState.progress || {},
      projects: { ...defaultState.projects, ...(targetState.projects || {}) },
      journal: Array.isArray(targetState.journal) ? targetState.journal : [],
      unlockedAchievements: Array.isArray(targetState.unlockedAchievements)
        ? targetState.unlockedAchievements
        : [],
      xpLedger: Array.isArray(targetState.xpLedger) ? targetState.xpLedger : [],
    };

    const completedModules = Object.values(cleanState.progress).filter(
      (p: UserModuleProgress) => p.completed
    ).length;
    const projectsStarted = Object.values(cleanState.projects).filter(
      (p: ProjectEntry) => p.status !== 'not_started'
    ).length;
    const totalXp = calculateTotalXp(cleanState);

    return {
      isValid: true,
      importedState: cleanState,
      summary: {
        completedModules,
        projectsStarted,
        totalXp,
        exportDate: parsed.exportedAt || 'Tidak diketahui',
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Kesalahan parsing JSON.';
    return { isValid: false, error: `Gagal membaca berkas: ${errorMsg}` };
  }
}

/**
 * Menggabungkan (merge) state impor dengan state saat ini secara aman
 */
export function mergeAppState(currentState: AppState, importedState: AppState): AppState {
  const mergedProgress = { ...currentState.progress };
  for (const [modId, impProg] of Object.entries(importedState.progress)) {
    const curr = mergedProgress[modId];
    if (!curr) {
      mergedProgress[modId] = impProg;
    } else {
      // Pertahankan status selesai jika salah satunya selesai
      const completed = curr.completed || impProg.completed;
      const completedAt = curr.completedAt || impProg.completedAt;
      const completionDateKey = curr.completionDateKey || impProg.completionDateKey;
      const mergedChecked = Array.from(new Set([...curr.checkedItemIds, ...impProg.checkedItemIds]));
      const notes = [curr.notes, impProg.notes].filter(Boolean).join('\n---\n');

      mergedProgress[modId] = {
        ...curr,
        completed,
        completedAt,
        completionDateKey,
        checkedItemIds: mergedChecked,
        notes: notes || undefined,
        repoOrNotebookUrl: curr.repoOrNotebookUrl || impProg.repoOrNotebookUrl,
        xpAwarded: Math.max(curr.xpAwarded, impProg.xpAwarded),
      };
    }
  }

  // Gabungkan XP ledger tanpa duplikasi ID
  const existingTxIds = new Set(currentState.xpLedger.map((t) => t.id));
  const newTxs = importedState.xpLedger.filter((t) => !existingTxIds.has(t.id));
  const mergedLedger = [...currentState.xpLedger, ...newTxs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Gabungkan achievements
  const mergedAchievements = Array.from(
    new Set([...currentState.unlockedAchievements, ...importedState.unlockedAchievements])
  );

  return {
    version: CURRENT_SCHEMA_VERSION,
    settings: {
      ...currentState.settings,
      challengeStartDate: currentState.settings.challengeStartDate || importedState.settings.challengeStartDate,
    },
    progress: mergedProgress,
    projects: { ...importedState.projects, ...currentState.projects },
    journal: [...importedState.journal, ...currentState.journal],
    unlockedAchievements: mergedAchievements,
    xpLedger: mergedLedger,
  };
}

/**
 * Mereset state kembali ke kondisi awal bersih
 */
export function resetStorage(): AppState {
  const fresh = createInitialState();
  saveAppState(fresh);
  return fresh;
}
