/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookMarked,
  Plus,
  Trash2,
  Calendar,
  Save,
  Check,
  AlertCircle,
  HelpCircle,
  Bug,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { AppState, JournalEntry } from '../types/curriculum';
import { getLocalDateString, formatIndonesianDate } from '../services/calendar';
import { playClickBeep } from '../services/audio';

interface JournalViewProps {
  state: AppState;
  onSaveEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  soundEnabled: boolean;
}

export const JournalView: React.FC<JournalViewProps> = ({
  state,
  onSaveEntry,
  onDeleteEntry,
  soundEnabled,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [day, setDay] = useState<number | ''>('');
  const [learned, setLearned] = useState('');
  const [confused, setConfused] = useState('');
  const [bugsAndErrors, setBugsAndErrors] = useState('');
  const [howSolved, setHowSolved] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !learned.trim()) return;

    playClickBeep(soundEnabled);
    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      dateKey: getLocalDateString(),
      title: title.trim() || `Refleksi Harian ${formatIndonesianDate(getLocalDateString())}`,
      day: typeof day === 'number' ? day : undefined,
      learned,
      confused,
      bugsAndErrors,
      howSolved,
      nextSteps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveEntry(newEntry);
    setIsCreating(false);
    // Reset form
    setTitle('');
    setDay('');
    setLearned('');
    setConfused('');
    setBugsAndErrors('');
    setHowSolved('');
    setNextSteps('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-2xl space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
              Jurnal Pembelajaran Pribadi
            </span>
            <span className="bg-purple-950 text-purple-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-purple-800/60">
              {state.journal.length} Catatan Refleksi
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Learning Journal & Bug Forensics
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Mencatat apa yang Anda pelajari, apa yang sempat membingungkan, error yang Anda pecahkan, dan cara menyelesaikannya. Refleksi harian adalah kunci ingatan jangka panjang.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => {
              playClickBeep(soundEnabled);
              setIsCreating(true);
            }}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-950 transition active:scale-95"
          >
            <Plus className="w-4 h-4" /> Tulis Refleksi Baru
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm font-mono flex items-center gap-2">
          <Check className="w-4 h-4" /> Jurnal belajar berhasil disimpan secara permanen di browser!
        </div>
      )}

      {/* Formulir Penulisan Jurnal Baru */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-6 md:p-7 space-y-5 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-purple-400" />
              Tulis Catatan Refleksi Harian
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {formatIndonesianDate(getLocalDateString())}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-mono text-slate-400">Judul Refleksi:</label>
              <input
                type="text"
                required
                placeholder="Contoh: Menaklukkan Autograd PyTorch dan Memory Leak"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400">Terkait Hari ke- (Opsional):</label>
              <input
                type="number"
                min={1}
                max={100}
                placeholder="Contoh: 42"
                value={day}
                onChange={(e) => setDay(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* 5 Bidang Pertanyaan Refleksi */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                1. Apa yang saya pelajari hari ini? (Key Learnings)
              </label>
              <textarea
                rows={2}
                placeholder="Konsep baru, rumus, atau library yang berhasil saya pahami..."
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-amber-400 flex items-center gap-1.5 font-bold">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                2. Apa yang masih membingungkan atau belum saya kuasai penuh?
              </label>
              <textarea
                rows={2}
                placeholder="Teori matematika, konsep abstrak, atau parameter yang masih belum 100% intuitif..."
                value={confused}
                onChange={(e) => setConfused(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-rose-400 flex items-center gap-1.5 font-bold">
                  <Bug className="w-4 h-4 text-rose-400" />
                  3. Bug / Error apa yang saya hadapi?
                </label>
                <textarea
                  rows={3}
                  placeholder="Pesan error terminal, RuntimeError shape mismatch, atau NaN loss..."
                  value={bugsAndErrors}
                  onChange={(e) => setBugsAndErrors(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none font-mono text-[11px] leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4 text-cyan-400" />
                  4. Bagaimana saya menyelesaikannya? (The Fix)
                </label>
                <textarea
                  rows={3}
                  placeholder="Langkah perbaikan spesifik, baris kode yang diubah, atau trik yang berhasil..."
                  value={howSolved}
                  onChange={(e) => setHowSolved(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none font-mono text-[11px] leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-purple-400 flex items-center gap-1.5 font-bold">
                <ArrowRight className="w-4 h-4 text-purple-400" />
                5. Langkah berikutnya / Rencana besok:
              </label>
              <textarea
                rows={2}
                placeholder="Modul yang ingin saya kerjakan besok atau eksperimen lanjutan..."
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900 transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Simpan Jurnal
            </button>
          </div>
        </form>
      )}

      {/* Daftar Entri Jurnal Masa Lalu */}
      <div className="space-y-4">
        {state.journal.length > 0 ? (
          state.journal.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-4 shadow-md hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {entry.day && (
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      HARI {String(entry.day).padStart(2, '0')}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {entry.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-600" />
                    {formatIndonesianDate(entry.dateKey)}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus catatan jurnal ini?')) {
                        onDeleteEntry(entry.id);
                      }
                    }}
                    title="Hapus entri"
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Isi Refleksi 5 Bagian */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                {entry.learned && (
                  <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/60 space-y-1">
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1 text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5" /> Hal yang Dipelajari:
                    </span>
                    <p className="text-slate-300 whitespace-pre-line">{entry.learned}</p>
                  </div>
                )}

                {entry.confused && (
                  <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/60 space-y-1">
                    <span className="text-amber-400 font-mono font-bold flex items-center gap-1 text-[11px]">
                      <HelpCircle className="w-3.5 h-3.5" /> Hal yang Membingungkan:
                    </span>
                    <p className="text-slate-300 whitespace-pre-line">{entry.confused}</p>
                  </div>
                )}

                {entry.bugsAndErrors && (
                  <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/60 space-y-1">
                    <span className="text-rose-400 font-mono font-bold flex items-center gap-1 text-[11px]">
                      <Bug className="w-3.5 h-3.5" /> Bug / Error yang Muncul:
                    </span>
                    <p className="text-rose-200/90 font-mono text-[11px] whitespace-pre-line">
                      {entry.bugsAndErrors}
                    </p>
                  </div>
                )}

                {entry.howSolved && (
                  <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/60 space-y-1">
                    <span className="text-cyan-400 font-mono font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3.5 h-3.5" /> Cara Memecahkan:
                    </span>
                    <p className="text-cyan-200/90 font-mono text-[11px] whitespace-pre-line">
                      {entry.howSolved}
                    </p>
                  </div>
                )}
              </div>

              {entry.nextSteps && (
                <div className="bg-purple-950/20 p-3 rounded-xl border border-purple-900/30 text-xs flex items-center gap-2 text-purple-200">
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>
                    <strong className="text-purple-400 font-mono">Next Step: </strong>
                    {entry.nextSteps}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <BookMarked className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Belum ada catatan jurnal</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Biasakan menulis refleksi 3 menit setiap kali Anda menyelesaikan modul untuk mengabadikan pemahaman Anda.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-mono font-bold transition shadow"
            >
              Tulis Refleksi Pertamamu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
