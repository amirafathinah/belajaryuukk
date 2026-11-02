/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Save,
  BookOpen,
  Cpu,
  Layers,
  Terminal,
  HelpCircle,
  FileText,
  Link as LinkIcon,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import { AppState, CurriculumModule, UserModuleProgress } from '../types/curriculum';
import { PHASES } from '../data/phases';
import { getModuleByDay } from '../data/curriculum';
import { playClickBeep } from '../services/audio';

interface LearningRoomViewProps {
  module: CurriculumModule;
  state: AppState;
  onBackToRoadmap: () => void;
  onNavigateModule: (moduleId: string) => void;
  onUpdateChecklist: (moduleId: string, checkedItemIds: string[]) => void;
  onUpdateNotes: (moduleId: string, notes: string) => void;
  onUpdateRepoUrl: (moduleId: string, url: string) => void;
  onCompleteMission: (module: CurriculumModule) => void;
  soundEnabled: boolean;
}

export const LearningRoomView: React.FC<LearningRoomViewProps> = ({
  module,
  state,
  onBackToRoadmap,
  onNavigateModule,
  onUpdateChecklist,
  onUpdateNotes,
  onUpdateRepoUrl,
  onCompleteMission,
  soundEnabled,
}) => {
  const userProgress: UserModuleProgress | undefined = state.progress[module.id];
  const isCompleted = Boolean(userProgress?.completed);
  const checkedItemIds = userProgress?.checkedItemIds || [];

  const [notes, setNotes] = useState(userProgress?.notes || '');
  const [repoUrl, setRepoUrl] = useState(userProgress?.repoOrNotebookUrl || '');
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saveNotesSuccess, setSaveNotesSuccess] = useState(false);

  // Sync state ketika modul berganti
  useEffect(() => {
    setNotes(userProgress?.notes || '');
    setRepoUrl(userProgress?.repoOrNotebookUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [module.id, userProgress]);

  // Cek apakah semua checklist wajib sudah tercentang
  const requiredChecklist = module.checklist.filter((item) => item.isRequired);
  const allRequiredChecked = requiredChecklist.every((item) =>
    checkedItemIds.includes(item.id)
  );

  const handleToggleChecklist = (itemId: string) => {
    playClickBeep(soundEnabled);
    let nextChecked: string[];
    if (checkedItemIds.includes(itemId)) {
      nextChecked = checkedItemIds.filter((id) => id !== itemId);
    } else {
      nextChecked = [...checkedItemIds, itemId];
    }
    onUpdateChecklist(module.id, nextChecked);
  };

  const handleSaveNotes = () => {
    playClickBeep(soundEnabled);
    onUpdateNotes(module.id, notes);
    onUpdateRepoUrl(module.id, repoUrl);
    setSaveNotesSuccess(true);
    setTimeout(() => setSaveNotesSuccess(false), 2000);
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  const phase = PHASES.find((p) => p.id === module.phaseId);
  const prevModule = module.day > 1 ? getModuleByDay(module.day - 1) : null;
  const nextModule = module.day < 100 ? getModuleByDay(module.day + 1) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToRoadmap}
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Roadmap
        </button>

        <div className="flex items-center gap-2">
          {prevModule && (
            <button
              onClick={() => onNavigateModule(prevModule.id)}
              className="px-3 py-2 text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition flex items-center gap-1"
              title={prevModule.title}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Hari {String(prevModule.day).padStart(2, '0')}
            </button>
          )}
          {nextModule && (
            <button
              onClick={() => onNavigateModule(nextModule.id)}
              className="px-3 py-2 text-xs font-mono text-purple-300 hover:text-white bg-slate-900 border border-purple-900/40 rounded-xl transition flex items-center gap-1"
              title={nextModule.title}
            >
              Hari {String(nextModule.day).padStart(2, '0')} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Header Banner Modul */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
            HARI {String(module.day).padStart(2, '0')} DARI 100
          </span>
          <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${phase?.badgeColor} border`}>
            {phase?.title}
          </span>
          {isCompleted && (
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> SELESAI ({userProgress?.completedAt ? new Date(userProgress.completedAt).toLocaleDateString('id-ID') : 'Tuntas'})
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
          {module.title}
        </h1>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
          {module.shortDescription}
        </p>

        <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-slate-400 mt-5 pt-4 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-400" />
            Durasi: {module.estimatedDuration}
          </span>
          <span>Tingkat: {module.difficulty}</span>
          <span>Proporsi: 30% Teori, 70% Hands-on Praktik</span>
          {module.isProject && (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> MILESTONE PROJECT (+300 XP)
            </span>
          )}
        </div>
      </div>

      {/* 1. Mission Briefing & 2. Learning Objectives */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          1. Mission Briefing & 2. Learning Objectives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {module.learningObjectives.map((obj, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 leading-relaxed"
            >
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold flex-shrink-0 text-[10px]">
                {i + 1}
              </span>
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Concise Theory (30% Teori Padat) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          3. Concise Theory (Teori Ringkas Esensial)
        </h2>
        <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-5 rounded-2xl border border-slate-800/60 whitespace-pre-line font-sans">
          {module.theoryContent}
        </div>
      </div>

      {/* 4. Practical Walkthrough & Executable Code (70% Praktik) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            4. Practical Walkthrough & Executable Code
          </h2>
          <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40">
            Lingkungan: {module.practicalWalkthrough.environment}
          </span>
        </div>

        <p className="text-sm text-slate-300">
          {module.practicalWalkthrough.summary}
        </p>

        {/* Code Snippets */}
        <div className="space-y-4 pt-2">
          {module.practicalWalkthrough.codeSnippets.map((snippet, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800">
                <span className="font-mono text-xs font-bold text-slate-300">
                  {snippet.title}
                </span>
                <button
                  onClick={() => handleCopyCode(snippet.code, idx)}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md transition"
                >
                  {copiedSnippetIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Salin Kode
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono text-purple-200 leading-relaxed bg-slate-950/90 scrollbar-thin">
                <code>{snippet.code}</code>
              </pre>
              {snippet.explanation && (
                <div className="px-4 py-2.5 bg-slate-900/40 border-t border-slate-800/60 text-xs text-slate-400 leading-snug">
                  <span className="text-purple-400 font-semibold font-mono">Penjelasan: </span>
                  {snippet.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Step-by-Step Instructions & 6. Required Tools / Datasets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-by-Step Instructions */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            5. Langkah-Langkah Instruksi
          </h2>
          <ol className="space-y-2.5 text-xs text-slate-300 pt-1">
            {module.stepByStepInstructions.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                <span className="font-mono font-bold text-purple-400 text-xs mt-0.5">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Required Tools and Datasets */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            6. Tools & Dataset Rujukan
          </h2>
          <div className="space-y-2.5 pt-1">
            {module.requiredToolsAndDatasets.map((res, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {res.name}
                  </span>
                  {res.url && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5 font-mono"
                    >
                      Buka Docs <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] leading-snug">{res.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Tasks & Challenges & 8. Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            7. Tasks & Challenges
          </h2>
          <div className="space-y-2.5 pt-1">
            {module.tasksAndChallenges.map((task, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  task.isStretch
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{task.title}</span>
                  {task.isStretch && (
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                      STRETCH
                    </span>
                  )}
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            8. Deliverables (Hasil Nyata)
          </h2>
          <ul className="space-y-2 text-xs text-slate-300 pt-1">
            {module.deliverables.map((deliv, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
                <span className="text-purple-400 font-bold">•</span>
                <span>{deliv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 9. Completion Checklist & 10. Definition of Done */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-400" />
              9. Completion Checklist & 10. Definition of Done
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Centang semua item wajib untuk membuka tombol penyelesaian misi dan klaim XP.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 self-start sm:self-auto">
            {checkedItemIds.length}/{module.checklist.length} Tercentang
          </span>
        </div>

        {/* Interactive Checklist Items */}
        <div className="space-y-2.5">
          {module.checklist.map((item) => {
            const isChecked = checkedItemIds.includes(item.id);
            return (
              <label
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-purple-950/30 border-purple-500/50 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                    isChecked
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'border-slate-600 bg-slate-900'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-1 text-xs leading-relaxed">
                  <span className={isChecked ? 'line-through text-slate-400' : ''}>
                    {item.label}
                  </span>
                  {item.isRequired ? (
                    <span className="ml-2 text-[10px] font-mono text-purple-400 font-bold uppercase">
                      (Wajib)
                    </span>
                  ) : (
                    <span className="ml-2 text-[10px] font-mono text-slate-500 uppercase">
                      (Opsional)
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* Definition of Done Summary */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
          <span className="font-bold text-slate-300 uppercase tracking-wider font-mono text-[11px] block">
            Kriteria Objektif Definition of Done:
          </span>
          <ul className="space-y-1 text-slate-400">
            {module.definitionOfDone.map((dod, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{dod}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Big Complete Mission Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {!allRequiredChecked ? (
              <span className="text-amber-400 flex items-center gap-1 font-mono">
                <AlertCircle className="w-4 h-4" /> Masih ada checklist wajib yang belum tercentang
              </span>
            ) : isCompleted ? (
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-4 h-4" /> Misi ini sudah tuntas diselesaikan! (+{userProgress?.xpAwarded || 100} XP telah diberikan)
              </span>
            ) : (
              <span className="text-purple-300 font-mono">
                ✓ Semua syarat terpenuhi! Klik tombol untuk menyelesaikan misi.
              </span>
            )}
          </div>

          <button
            disabled={!allRequiredChecked}
            onClick={() => {
              if (isCompleted) {
                // Modul sudah selesai, hanya pemicu konfirmasi ulang jika ingin
                setShowConfirmModal(true);
              } else {
                setShowConfirmModal(true);
              }
            }}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm font-mono shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
              allRequiredChecked
                ? isCompleted
                  ? 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/50'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/50'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Misi Sudah Tuntas (Tinjau)' : 'Tandai Selesai Misi Hari Ini (+100 XP)'}
          </button>
        </div>
      </div>

      {/* 11. Reflection Questions */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-3">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          11. Reflection Questions (Pertanyaan Refleksi Diri)
        </h2>
        <div className="space-y-2 pt-1 text-xs text-slate-300">
          {module.reflectionQuestions.map((q, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 leading-relaxed font-mono"
            >
              <span className="text-purple-400 font-bold mr-2">Q{i + 1}:</span>
              {q}
            </div>
          ))}
        </div>
      </div>

      {/* 12. Personal Notes & 13. Repo/Notebook Link */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            12. Catatan Pribadi & 13. Tautan Repositori
          </h2>
          {saveNotesSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <Check className="w-3.5 h-3.5" /> Tersimpan di localStorage!
            </span>
          )}
        </div>

        {/* Repository / Notebook URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
            Tautan Repositori GitHub / Google Colab / Gist:
          </label>
          <input
            type="url"
            placeholder="https://github.com/username/project atau https://colab.research.google.com/..."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Personal Notes Text Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-400">
            Catatan Belajar, Kesulitan, atau Eksperimen Khusus:
          </label>
          <textarea
            rows={4}
            placeholder="Tuliskan temuan kuncimu hari ini, rumus yang berhasil dibuktikan, atau bug yang sempat bikin pusing..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed font-mono"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveNotes}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Catatan & Tautan
          </button>
        </div>
      </div>

      {/* 14. Suggested Next Step */}
      <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between gap-4">
        <div className="text-xs text-slate-300">
          <span className="font-bold text-purple-400 font-mono block mb-1">
            14. LANGKAH BERIKUTNYA:
          </span>
          {module.suggestedNextStep}
        </div>
        {nextModule && (
          <button
            onClick={() => onNavigateModule(nextModule.id)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-bold transition shadow"
          >
            Lanjut Hari {String(nextModule.day).padStart(2, '0')} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Modal Konfirmasi Penyelesaian Misi */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto text-xl">
              🎯
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {isCompleted ? 'Misi Sudah Pernah Diselesaikan' : 'Tandai Misi Hari Ini Selesai?'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isCompleted
                  ? 'Modul ini sudah tercatat tuntas di ledger progres. XP hanya diberikan sekali dan tidak akan berlipat ganda.'
                  : `Anda telah mencentang seluruh checklist wajib untuk "${module.title}". Status modul, streak harian, dan XP (+100 XP) akan diperbarui secara permanen.`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-mono font-medium text-slate-400 hover:text-white bg-slate-800 transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  onCompleteMission(module);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950 transition"
              >
                {isCompleted ? 'Tutup & Simpan' : 'Ya, Selesaikan Misi! 🚀'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
