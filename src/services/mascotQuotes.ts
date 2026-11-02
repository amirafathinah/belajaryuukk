/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MascotMood = 'smug' | 'savage' | 'proud' | 'shocked' | 'thinking' | 'sleeping';

export interface MascotStatusContext {
  isStarted: boolean;
  plannedDay: number | null;
  completedCount: number;
  currentStreak: number;
  longestStreak: number;
  todayCompleted: boolean;
  yesterdayCompleted: boolean;
  missedDaysCount: number;
  recentProjectShipped: boolean;
  recentAchievementUnlocked: boolean;
  intensity: 'savage' | 'normal' | 'santuy';
  hourOfDay: number; // 0..23
}

export interface MascotMessage {
  text: string;
  subtext: string;
  mood: MascotMood;
  actionText?: string;
  actionTarget?: 'mission' | 'roadmap' | 'portfolio' | 'journal' | 'start';
}

export function getMascotMessage(ctx: MascotStatusContext): MascotMessage {
  const {
    isStarted,
    plannedDay,
    completedCount,
    currentStreak,
    todayCompleted,
    yesterdayCompleted,
    missedDaysCount,
    recentProjectShipped,
    intensity,
    hourOfDay,
  } = ctx;

  // 1. Belum Mulai Tantangan
  if (!isStarted) {
    if (intensity === 'savage') {
      return {
        text: 'Niat doang gak bikin kamu jago Machine Learning, Bos! 🤖',
        subtext: 'Berapa tab tutorial yang kamu bookmark tapi gak pernah dibuka? Klik tombol mulai sekarang sebelum GPU-mu karatan.',
        mood: 'smug',
        actionText: 'Mulai Tantangan 100 Hari',
        actionTarget: 'start',
      };
    } else if (intensity === 'santuy') {
      return {
        text: 'Siap mulai perjalanan 100 hari ML & AI? Santai tapi konsisten!',
        subtext: 'Setiap hari 60-90 menit praktik nyata. Klik tombol mulai kalau kamu sudah siap.',
        mood: 'thinking',
        actionText: 'Mulai Sekarang',
        actionTarget: 'start',
      };
    } else {
      return {
        text: 'Perjalanan 100 Hari Menuju ML Practitioner Dimulai dari Sini.',
        subtext: 'Klik tombol di bawah untuk mengunci tanggal mulai dan melacak progres harianmu.',
        mood: 'thinking',
        actionText: 'Mulai Tantangan',
        actionTarget: 'start',
      };
    }
  }

  // 2. Proyek Baru Saja Selesai Dikapalkan
  if (recentProjectShipped) {
    return {
      text: 'PROJECT SHIPPED! Bukan sekadar tutorial follower lagi! 🚀',
      subtext: 'Sekarang kamu punya bukti nyata di portofolio. Screenshot boleh, tapi jangan lupa push git commit dan dokumentasi!',
      mood: 'proud',
      actionText: 'Lihat Portofolio',
      actionTarget: 'portfolio',
    };
  }

  // 3. Modul Hari Ini Sudah Selesai
  if (todayCompleted) {
    if (currentStreak >= 14) {
      return {
        text: 'NAHHH KAN BISA! Streak 14+ hari membara! 🔥',
        subtext: 'Akhirnya ada bukti kerja nyata, bukan cuma wacana. Modelmu bangga punya engineer rajin kayak kamu. Istirahat sana, besok lanjut.',
        mood: 'proud',
        actionText: 'Tulis Jurnal Refleksi',
        actionTarget: 'journal',
      };
    }
    return {
      text: 'MISI HARI INI TUNTAS! Loss turun, akurasi naik. 🎉',
      subtext: 'Bagus. Jangan sentuh kode lagi malam ini kalau gak mau kena bug insomnia. Besok kita hajar materi berikutnya.',
      mood: 'proud',
      actionText: 'Lihat Roadmap',
      actionTarget: 'roadmap',
    };
  }

  // 4. Kembali Setelah Menghilang Beberapa Hari (Streak Putus)
  if (missedDaysCount > 2) {
    if (intensity === 'savage') {
      return {
        text: `LOOK WHO'S BACK! Menghilang ${missedDaysCount} hari kemana aja, Bestie? 🤨`,
        subtext: 'Modelmu kangen di-training. Streak emang tumbang, tapi mental jangan ikut tumbang. Sekarang waktunya comeback, bukan ghosting lagi!',
        mood: 'shocked',
        actionText: 'Kejar Misi Terlewat',
        actionTarget: 'roadmap',
      };
    }
    return {
      text: `Selamat datang kembali! Yuk lanjut dari progres terakhir.`,
      subtext: `Ada ${missedDaysCount} hari yang bisa kamu kejar pelan-pelan. Progres dan catatanmu tetap aman tersimpan.`,
      mood: 'thinking',
      actionText: 'Buka Misi',
      actionTarget: 'mission',
    };
  }

  // 5. Kemarin Kosong (Streak Baru Saja Putus Hari Ini)
  if (!yesterdayCompleted && currentStreak === 0 && completedCount > 0) {
    return {
      text: 'STREAK-NYA TUMBANG. 😭 Sedih boleh, nyerah jangan.',
      subtext: 'Tenang, semua XP dan kodemu masih aman. Sekarang waktunya bangun streak baru yang lebih kokoh. Buka misimu hari ini!',
      mood: 'shocked',
      actionText: 'Mulai Streak Baru',
      actionTarget: 'mission',
    };
  }

  // 6. Hari Sudah Malam Tapi Misi Hari Ini Belum Selesai (Jam 20:00 ke atas)
  if (hourOfDay >= 20) {
    if (intensity === 'savage') {
      return {
        text: 'DAY INI MASIH KOSONG??? Gradient descent aja bergerak, masa kamu enggak? 😤',
        subtext: 'Tengah malam sebentar lagi. Jangan sampai hari ini lewat tanpa commit kode satupun. Buka misinya sekarang!',
        mood: 'savage',
        actionText: 'Buka Misi Hari Ini',
        actionTarget: 'mission',
      };
    }
    return {
      text: 'Sudah malam nih, jangan lupa luangkan waktu untuk misi hari ini!',
      subtext: 'Cuma butuh 60-75 menit kok. Tuntaskan biar tidurmu nyenyak tanpa rasa bersalah.',
      mood: 'thinking',
      actionText: 'Buka Misi Hari Ini',
      actionTarget: 'mission',
    };
  }

  // 7. Hari Ini Belum Selesai (Default Siang / Pagi)
  const savageDayQuotes = [
    'Bestie, modelnya belum di-training, kamu juga belum. Mau sampai kapan saling menunggu? 🤖',
    'Overfitting itu bahaya, tapi overthinking tanpa coding jauh lebih bahaya. Ayo buka modul!',
    'PyTorch autograd udah siap ngitung turunan gradien, kamu kapan siap eksekusi kodenya?',
    'Jangan cuma ngeliatin dashboard-nya. Tekan tombol misi di bawah sekarang juga!',
  ];
  const quoteIdx = (plannedDay || 1) % savageDayQuotes.length;

  if (intensity === 'santuy') {
    return {
      text: `Misi Hari ke-${plannedDay || 1} menantimu! Siapkan kopi dan buka notebook.`,
      subtext: 'Fokus 60-90 menit hari ini untuk melatih keterampilan praktis barumu.',
      mood: 'thinking',
      actionText: 'Kerjakan Misi',
      actionTarget: 'mission',
    };
  }

  return {
    text: savageDayQuotes[quoteIdx],
    subtext: `Misi Hari ke-${plannedDay || 1} sudah menunggu untuk dieksekusi. 70% praktik langsung menantimu!`,
    mood: 'smug',
    actionText: 'Buka Misi Hari Ini',
    actionTarget: 'mission',
  };
}
