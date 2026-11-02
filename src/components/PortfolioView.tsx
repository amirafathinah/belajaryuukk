/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
  Trophy,
  ExternalLink,
  Github,
  Save,
  CheckCircle2,
  Clock,
  Edit3,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AppState, ProjectEntry } from '../types/curriculum';
import { DEFAULT_PROJECT_TEMPLATES } from '../data/curriculum';
import { playClickBeep } from '../services/audio';

interface PortfolioViewProps {
  state: AppState;
  onUpdateProject: (project: ProjectEntry) => void;
  onOpenModuleByDay: (day: number) => void;
  soundEnabled: boolean;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  state,
  onUpdateProject,
  onOpenModuleByDay,
  soundEnabled,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<ProjectEntry>>({});
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const startEditing = (proj: ProjectEntry) => {
    playClickBeep(soundEnabled);
    setEditingId(proj.id);
    setFormState({ ...proj });
  };

  const handleSave = (id: string) => {
    playClickBeep(soundEnabled);
    const existing = state.projects[id] || DEFAULT_PROJECT_TEMPLATES.find((p) => p.id === id);
    if (!existing) return;

    const updated: ProjectEntry = {
      ...existing,
      ...formState,
      completedAt: formState.status === 'completed' ? existing.completedAt || new Date().toISOString() : undefined,
    };

    onUpdateProject(updated);
    setEditingId(null);
    setSavedSuccessId(id);
    setTimeout(() => setSavedSuccessId(null), 2500);
  };

  const completedCount = Object.values(state.projects).filter(
    (p) => p.status === 'completed'
  ).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
              Portofolio Proyek Rekayasa AI
            </span>
            <span className="bg-purple-950 text-purple-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-purple-800/60">
              {completedCount} / 7 Proyek Selesai
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Etalase Mahakarya & Milestone Proyek
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Kumpulan 6 Mini-Project dan 1 Final Capstone yang membuktikan kompetensi praktis machine learning Anda. Rekam repositori GitHub nyata, tautan demo live, dan metrik empiris hasil evaluasimu sendiri.
          </p>
        </div>
      </div>

      {/* List Kartu Proyek */}
      <div className="space-y-6">
        {DEFAULT_PROJECT_TEMPLATES.map((tmpl) => {
          const project: ProjectEntry = state.projects[tmpl.id] || {
            ...tmpl,
            metrics: '',
            githubUrl: '',
            demoUrl: '',
            notes: '',
            status: 'not_started',
          };

          const isEditing = editingId === project.id;
          const isCapstone = project.id === 'capstone';

          return (
            <div
              key={project.id}
              className={`rounded-3xl border p-6 md:p-7 transition shadow-lg ${
                project.status === 'completed'
                  ? 'bg-slate-900/60 border-emerald-500/40 shadow-emerald-950/10'
                  : isCapstone
                  ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border-purple-500/50 shadow-purple-950/20'
                  : 'bg-slate-900/70 border-slate-800 shadow-slate-950/20'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      HARI {String(project.day).padStart(2, '0')}
                    </span>
                    {isCapstone ? (
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" /> THE FINAL CAPSTONE
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> MINI-PROJECT
                      </span>
                    )}
                    {/* Status Badge */}
                    <span
                      className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                        project.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : project.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {project.status === 'completed'
                        ? '✓ SELESAI'
                        : project.status === 'in_progress'
                        ? '⏳ SEDANG BERJALAN'
                        : 'BELUM DIMULAI'}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                    {project.title}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onOpenModuleByDay(project.day)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1"
                  >
                    Buka Modul Hari {project.day} <ExternalLink className="w-3 h-3" />
                  </button>

                  {!isEditing ? (
                    <button
                      onClick={() => startEditing(project)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-purple-300 hover:text-white bg-purple-600/30 hover:bg-purple-600/60 border border-purple-500/40 transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Data
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSave(project.id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900 transition flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" /> Simpan
                    </button>
                  )}
                </div>
              </div>

              {/* Isi Detail & Form Editing */}
              {isEditing ? (
                <div className="pt-4 space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Status Proyek:</label>
                      <select
                        value={formState.status || 'not_started'}
                        onChange={(e) =>
                          setFormState({ ...formState, status: e.target.value as any })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                      >
                        <option value="not_started">Belum Dimulai</option>
                        <option value="in_progress">Sedang Dikerjakan</option>
                        <option value="completed">Selesai (Completed)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">
                        Hasil & Metrik Nyata (Contoh: Accuracy: 92.4%, F1: 0.91, Latency: 14ms):
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: ROC-AUC: 0.942, Test RMSE: 0.42"
                        value={formState.metrics || ''}
                        onChange={(e) =>
                          setFormState({ ...formState, metrics: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">
                        Tautan Repositori GitHub:
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/username/project"
                        value={formState.githubUrl || ''}
                        onChange={(e) =>
                          setFormState({ ...formState, githubUrl: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">
                        Tautan Demo Live (Streamlit / Spaces / Web):
                      </label>
                      <input
                        type="url"
                        placeholder="https://my-app.streamlit.app"
                        value={formState.demoUrl || ''}
                        onChange={(e) =>
                          setFormState({ ...formState, demoUrl: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">
                      Refleksi & Catatan Arsitektur Proyek:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Apa arsitektur yang digunakan? Apa kendala terbesar dan bagaimana cara Anda mengatasinya?"
                      value={formState.notes || ''}
                      onChange={(e) =>
                        setFormState({ ...formState, notes: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-800"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleSave(project.id)}
                      className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold text-white bg-purple-600 hover:bg-purple-500"
                    >
                      Simpan Data Proyek
                    </button>
                  </div>
                </div>
              ) : (
                /* View Display Mode */
                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  {/* Deliverables & Metrics */}
                  <div className="space-y-1 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">
                      Target Deliverables:
                    </span>
                    <span className="text-slate-300 block">{project.deliverablesSummary}</span>
                    <div className="pt-2 border-t border-slate-800/60 mt-2">
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">
                        Hasil & Metrik Terukur:
                      </span>
                      <span className="text-purple-300 font-bold block">
                        {project.metrics || 'Belum diisi (Klik Edit Data untuk mencatat)'}
                      </span>
                    </div>
                  </div>

                  {/* Links: GitHub & Live Demo */}
                  <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                        Akses Publik:
                      </span>
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-xs font-bold truncate mb-1"
                        >
                          <Github className="w-3.5 h-3.5 flex-shrink-0" /> Repositori Kode GitHub ↗
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs block mb-1">
                          Repo: Belum ditautkan
                        </span>
                      )}

                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-xs font-bold truncate"
                        >
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" /> Live Interactive Demo ↗
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs block">
                          Demo URL: Belum ditautkan
                        </span>
                      )}
                    </div>

                    {savedSuccessId === project.id && (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        ✓ Data tersimpan aman!
                      </span>
                    )}
                  </div>

                  {/* Reflection Notes */}
                  <div className="space-y-1 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">
                      Refleksi & Catatan:
                    </span>
                    <p className="text-slate-400 line-clamp-3 text-xs leading-relaxed font-sans">
                      {project.notes || 'Belum ada catatan refleksi untuk proyek ini.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
