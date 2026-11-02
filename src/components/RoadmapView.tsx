/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  AlertCircle,
  Briefcase,
  Trophy,
} from 'lucide-react';
import { AppState, CurriculumModule, PhaseId, ModuleStatus } from '../types/curriculum';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { PHASES } from '../data/phases';

interface RoadmapViewProps {
  state: AppState;
  plannedDay: number | null;
  isStarted: boolean;
  onOpenModule: (moduleId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  state,
  plannedDay,
  isStarted,
  onOpenModule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<PhaseId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'available' | 'missed'>('all');

  // Menentukan status setiap modul berdasarkan logika kurikulum
  const getModuleStatus = (m: CurriculumModule): ModuleStatus => {
    const userProgress = state.progress[m.id];
    if (userProgress?.completed) {
      return 'completed';
    }

    const hasCheckedItems = userProgress && userProgress.checkedItemIds.length > 0;
    const hasNotes = Boolean(userProgress?.notes && userProgress.notes.trim().length > 0);

    if (hasCheckedItems || hasNotes) {
      return 'in_progress';
    }

    if (!isStarted) {
      // Sebelum tantangan dimulai, Hari 01 tersedia, sisanya dapat dibuka kapan saja
      return m.day === 1 ? 'available' : 'available';
    }

    const currentTargetDay = plannedDay || 1;
    if (m.day < currentTargetDay) {
      // Hari kalender telah lewat dan modul belum selesai -> status 'missed' (dapat dikejar kapan saja)
      return 'missed';
    }

    if (m.day === currentTargetDay) {
      return 'available';
    }

    // Hari mendatang
    return 'available';
  };

  // Filter modul
  const filteredModules = useMemo(() => {
    return CURRICULUM_MODULES.filter((m) => {
      // 1. Filter Phase
      if (selectedPhase !== 'all' && m.phaseId !== selectedPhase) {
        return false;
      }

      // 2. Filter Status
      const status = getModuleStatus(m);
      if (statusFilter !== 'all') {
        if (statusFilter === 'completed' && status !== 'completed') return false;
        if (statusFilter === 'in_progress' && status !== 'in_progress') return false;
        if (statusFilter === 'available' && status !== 'available') return false;
        if (statusFilter === 'missed' && status !== 'missed') return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = m.title.toLowerCase().includes(q);
        const descMatch = m.shortDescription.toLowerCase().includes(q);
        const toolsMatch = m.requiredToolsAndDatasets.some((t) =>
          t.name.toLowerCase().includes(q)
        );
        return titleMatch || descMatch || toolsMatch;
      }

      return true;
    });
  }, [selectedPhase, statusFilter, searchQuery, state.progress, plannedDay, isStarted]);

  // Statistik progres
  const completedCount = Object.values(state.progress).filter((p) => p.completed).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
                Kurikulum Lengkap 100 Hari
              </span>
              <span className="bg-purple-950 text-purple-300 text-xs font-mono font-semibold px-2 py-0.5 rounded border border-purple-800/50">
                {completedCount} / 100 Selesai ({Math.round((completedCount / 100) * 100)}%)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Roadmap Pembelajaran Praktis
            </h1>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari topik (PyTorch, XGBoost, RAG...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition ${
              selectedPhase === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Semua Fase (100)
          </button>
          {PHASES.map((ph) => {
            const isSelected = selectedPhase === ph.id;
            return (
              <button
                key={ph.id}
                onClick={() => setSelectedPhase(ph.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{ph.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  (D{String(ph.startDay).padStart(2, '0')}-{String(ph.endDay).padStart(2, '0')})
                </span>
              </button>
            );
          })}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/80 flex-wrap text-xs font-mono">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-purple-300 font-bold border border-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-2.5 py-1 rounded-lg transition ${
              statusFilter === 'completed'
                ? 'bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✓ Selesai ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-2.5 py-1 rounded-lg transition ${
              statusFilter === 'in_progress'
                ? 'bg-amber-950/60 text-amber-300 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏳ Sedang Dikerjakan
          </button>
          <button
            onClick={() => setStatusFilter('missed')}
            className={`px-2.5 py-1 rounded-lg transition ${
              statusFilter === 'missed'
                ? 'bg-rose-950/60 text-rose-300 font-bold border border-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚠️ Terlewat (Bisa Dikejar)
          </button>
        </div>
      </div>

      {/* Grid Kartu Modul */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((m) => {
          const userProgress = state.progress[m.id];
          const isCompleted = Boolean(userProgress?.completed);
          const status = getModuleStatus(m);
          const phase = PHASES.find((p) => p.id === m.phaseId);

          const checkedCount = userProgress?.checkedItemIds.length || 0;
          const totalChecklist = m.checklist.length;
          const hasUnfinishedWork = !isCompleted && (checkedCount > 0 || Boolean(userProgress?.notes));

          const isMilestone = m.isProject;
          const isFinalCapstone = m.day === 100;

          return (
            <div
              key={m.id}
              onClick={() => onOpenModule(m.id)}
              className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                isCompleted
                  ? 'bg-slate-900/40 border-emerald-500/30 hover:border-emerald-500/60'
                  : isMilestone
                  ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border-purple-500/50 hover:border-purple-400 shadow-md shadow-purple-950/30'
                  : status === 'missed'
                  ? 'bg-slate-900/60 border-rose-900/40 hover:border-rose-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-purple-500/40'
              }`}
            >
              <div>
                {/* Header Kartu: Day + Status Pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs font-black px-2 py-0.5 rounded-lg border ${
                        isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : isMilestone
                          ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      HARI {String(m.day).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {phase?.name}
                    </span>
                  </div>

                  {/* Status Pill Badge */}
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> SELESAI
                    </span>
                  ) : status === 'in_progress' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                      ⏳ {checkedCount}/{totalChecklist}
                    </span>
                  ) : status === 'missed' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/30">
                      <AlertCircle className="w-3 h-3" /> KEJAR SEKARANG
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                      TERSEDIA
                    </span>
                  )}
                </div>

                {/* Milestone Badge if Project */}
                {isMilestone && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-purple-200 border border-purple-400/40">
                      {isFinalCapstone ? (
                        <>
                          <Trophy className="w-3 h-3 text-amber-400" /> FINAL CAPSTONE SHOWCASE
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3 h-3 text-purple-300" /> PROYEK PORTOFOLIO
                        </>
                      )}
                    </span>
                  </div>
                )}

                {/* Title & Short Description */}
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug mb-2">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {m.shortDescription}
                </p>
              </div>

              {/* Footer Kartu: Duration, Difficulty, Checklist bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {m.estimatedDuration}
                  </span>
                  <span>{m.difficulty}</span>
                </div>

                {/* Progress Mini Bar jika ada checked items */}
                {hasUnfinishedWork && (
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-amber-400 h-1 rounded-full transition-all"
                      style={{ width: `${(checkedCount / totalChecklist) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Search className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Tidak ada modul yang cocok</h3>
          <p className="text-sm text-slate-400">
            Coba ubah kata kunci pencarian atau sesuaikan filter fase dan status di atas.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPhase('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 bg-slate-800 text-purple-300 rounded-xl text-xs font-mono font-medium hover:bg-slate-700 transition"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
};
