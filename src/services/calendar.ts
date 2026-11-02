/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utilitas tanggal lokal untuk menghindari jebakan UTC dan DST.
 * Menghasilkan format YYYY-MM-DD berdasarkan waktu lokal pengguna.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parsing string YYYY-MM-DD ke Date lokal (pukul 00:00:00 lokal)
 */
export function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Menghitung selisih hari kalender murni antara dua tanggal lokal
 */
export function diffCalendarDays(fromStr: string, toStr: string): number {
  const d1 = parseLocalDateString(fromStr);
  const d2 = parseLocalDateString(toStr);
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / msPerDay);
}

/**
 * Format tanggal ramah manusia bahasa Indonesia (contoh: "Senin, 02 Nov 2026")
 */
export function formatIndonesianDate(dateStr: string): string {
  try {
    const d = parseLocalDateString(dateStr);
    return d.toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export interface StreakCalculationResult {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: boolean;
  yesterdayCompleted: boolean;
  lastActiveDate: string | null;
  activeDatesSet: Set<string>; // Himpunan tanggal YYYY-MM-DD yang memiliki penyelesaian modul
  streakBreakReason?: string;
}

/**
 * Menghitung current streak dan longest streak secara deterministik
 * dari daftar tanggal penyelesaian modul yang tersimpan.
 *
 * Aturan:
 * - Streak bertambah maksimal 1 kali per tanggal kalender unik.
 * - Suatu hari dihitung jika minimal ada 1 modul yang diselesaikan pada tanggal lokal tersebut.
 * - Hari kemarin atau hari ini harus aktif agar streak saat ini tetap hidup.
 * - Jika hari kemarin tidak ada aktivitas dan hari ini belum ada aktivitas, streak saat ini adalah 0.
 */
export function calculateStreak(
  completionDateKeys: string[],
  todayKey: string = getLocalDateString()
): StreakCalculationResult {
  // Filter tanggal valid dan unik lalu urutkan kronologis
  const uniqueDates = Array.from(new Set(completionDateKeys.filter(Boolean))).sort();
  const activeDatesSet = new Set(uniqueDates);

  const today = parseLocalDateString(todayKey);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getLocalDateString(yesterday);

  const todayCompleted = activeDatesSet.has(todayKey);
  const yesterdayCompleted = activeDatesSet.has(yesterdayKey);

  if (uniqueDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      todayCompleted: false,
      yesterdayCompleted: false,
      lastActiveDate: null,
      activeDatesSet,
      streakBreakReason: 'Belum ada misi yang diselesaikan sejak tantangan dimulai.',
    };
  }

  // Hitung Longest Streak lintas seluruh riwayat
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of uniqueDates) {
    const currDate = parseLocalDateString(dateStr);
    if (!prevDate) {
      runningStreak = 1;
    } else {
      const diff = diffCalendarDays(getLocalDateString(prevDate), dateStr);
      if (diff === 1) {
        runningStreak += 1;
      } else if (diff > 1) {
        runningStreak = 1;
      }
    }
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = currDate;
  }

  // Hitung Current Streak mundur dari hari ini atau kemarin
  let currentStreak = 0;
  let streakBreakReason: string | undefined;

  let checkDate = new Date(today);
  if (!todayCompleted) {
    // Jika hari ini belum selesai, periksa apakah streak kemarin masih hidup
    if (yesterdayCompleted) {
      checkDate = yesterday;
    } else {
      // Kemarin kosong dan hari ini kosong -> streak terputus
      currentStreak = 0;
      const lastDate = uniqueDates[uniqueDates.length - 1];
      const missedDays = diffCalendarDays(lastDate, todayKey);
      streakBreakReason = `Streak terputus karena terlewat ${missedDays} hari tanpa penyelesaian misi.`;
      return {
        currentStreak: 0,
        longestStreak,
        todayCompleted,
        yesterdayCompleted,
        lastActiveDate: lastDate,
        activeDatesSet,
        streakBreakReason,
      };
    }
  }

  // Hitung mundur hari berturut-turut yang aktif
  while (true) {
    const key = getLocalDateString(checkDate);
    if (activeDatesSet.has(key)) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const lastDate = uniqueDates[uniqueDates.length - 1];

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    todayCompleted,
    yesterdayCompleted,
    lastActiveDate: lastDate,
    activeDatesSet,
    streakBreakReason,
  };
}

/**
 * Menghitung hari tantangan terencana (Day 1..100) berdasarkan selisih tanggal
 */
export function calculatePlannedDay(
  startDateStr: string | null,
  todayStr: string = getLocalDateString()
): {
  plannedDay: number | null;
  daysPassed: number;
  daysRemaining: number;
  isStarted: boolean;
  isOverdue: boolean;
} {
  if (!startDateStr) {
    return {
      plannedDay: null,
      daysPassed: 0,
      daysRemaining: 100,
      isStarted: false,
      isOverdue: false,
    };
  }

  const diff = diffCalendarDays(startDateStr, todayStr);
  const plannedDay = diff + 1; // Hari ke-1 dimulai pada tanggal mulai

  return {
    plannedDay: Math.max(1, Math.min(100, plannedDay)),
    daysPassed: Math.max(0, diff),
    daysRemaining: Math.max(0, 100 - plannedDay),
    isStarted: true,
    isOverdue: plannedDay > 100,
  };
}
