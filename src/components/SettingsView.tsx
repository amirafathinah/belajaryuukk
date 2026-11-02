/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  Clock,
  Globe,
  Flame,
  ShieldAlert,
  Check,
  AlertTriangle,
  Github,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AppState, UserSettings } from '../types/curriculum';
import {
  exportAppStateToJson,
  validateImportJson,
  mergeAppState,
  resetStorage,
  ImportValidationResult,
} from '../services/storage';
import { getLocalDateString, formatIndonesianDate } from '../services/calendar';
import { playClickBeep } from '../services/audio';

interface SettingsViewProps {
  state: AppState;
  onUpdateSettings: (settings: UserSettings) => void;
  onStateRestored: (newState: AppState) => void;
  onStartChallengeDate: (dateStr: string) => void;
  soundEnabled: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdateSettings,
  onStateRestored,
  onStartChallengeDate,
  soundEnabled,
}) => {
  const [settings, setSettings] = useState<UserSettings>(state.settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Import State Modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importValidation, setImportValidation] = useState<ImportValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset Modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetConfirmationText, setResetConfirmationText] = useState('');

  const handleSettingChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    playClickBeep(soundEnabled);
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    onUpdateSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExport = () => {
    playClickBeep(soundEnabled);
    const jsonStr = exportAppStateToJson(state);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mlai100_backup_${getLocalDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = validateImportJson(content);
      setImportValidation(result);
      setImportModalOpen(true);
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleConfirmImport = (mode: 'merge' | 'replace') => {
    if (!importValidation?.importedState) return;

    let finalState: AppState;
    if (mode === 'merge') {
      finalState = mergeAppState(state, importValidation.importedState);
    } else {
      finalState = importValidation.importedState;
    }

    onStateRestored(finalState);
    setImportModalOpen(false);
    setImportValidation(null);
    alert('Progres berhasil dipulihkan dari berkas cadangan!');
  };

  const handleConfirmReset = () => {
    if (resetConfirmationText.trim().toUpperCase() !== 'RESET') return;
    const freshState = resetStorage();
    onStateRestored(freshState);
    setResetModalOpen(false);
    setResetConfirmationText('');
    alert('Seluruh data progres lokal berhasil direset ke kondisi awal.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
        <div className="max-w-2xl space-y-1">
          <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
            Preferensi & Manajemen Penyimpanan
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Pengaturan & Portabilitas Data
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Semua progres belajar disimpan secara lokal di browser Anda. Tidak ada akun, tidak ada tracking pihak ketiga. Ekspor cadangan JSON Anda kapan saja secara mandiri.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm font-mono flex items-center gap-2">
          <Check className="w-4 h-4" /> Pengaturan berhasil disimpan otomatis!
        </div>
      )}

      {/* Bagian 1: Preferensi Tantangan & Maskot */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-6">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 border-b border-slate-800 pb-3">
          <Settings className="w-4 h-4 text-purple-400" />
          Konfigurasi Tantangan & Kepribadian Maskot
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              Tanggal Mulai Tantangan 100 Hari:
            </label>
            <input
              type="date"
              value={settings.challengeStartDate || ''}
              onChange={(e) => {
                const val = e.target.value || null;
                handleSettingChange('challengeStartDate', val);
                if (val) onStartChallengeDate(val);
              }}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2 text-xs font-mono text-slate-200 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 leading-snug">
              {settings.challengeStartDate
                ? `Dimulai pada: ${formatIndonesianDate(settings.challengeStartDate)}`
                : 'Tantangan belum memiliki tanggal mulai resmi.'}
            </p>
          </div>

          {/* Timezone Info */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-purple-400" />
              Zona Waktu Pengguna:
            </label>
            <input
              type="text"
              readOnly
              value={settings.timezone}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-400 cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-500 leading-snug">
              Digunakan untuk kalkulasi pergantian tanggal lokal kalender tepat tengah malam.
            </p>
          </div>

          {/* Mascot Intensity */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-purple-400" />
              Intensitas Kepribadian Maskot:
            </label>
            <select
              value={settings.mascotIntensity}
              onChange={(e) =>
                handleSettingChange('mascotIntensity', e.target.value as any)
              }
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
            >
              <option value="savage">🔥 Pedas / Savage (Sarkastik & Menantang - Rekomendasi)</option>
              <option value="normal">⚖️ Normal (Seimbang & Informatif)</option>
              <option value="santuy">☕ Santuy (Ramah & Pengertian)</option>
            </select>
          </div>

          {/* Sound Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              Efek Suara Sintetis (Web Audio API):
            </label>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border ${
                  settings.soundEnabled
                    ? 'bg-purple-600/30 text-purple-200 border-purple-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {settings.soundEnabled ? '✓ Suara Aktif' : '✕ Suara Dinonaktifkan (Default)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 2: Ekspor, Impor, & Cadangan Mandiri */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Download className="w-4 h-4 text-purple-400" />
            Cadangan & Pemulihan Data (Export / Import)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Unduh seluruh riwayat belajar, catatan, repositori proyek, dan XP ke dalam file JSON tunggal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Button */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-purple-400" /> Ekspor Progres (JSON)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unduh salinan lengkap semua 100 modul, catatan jurnal, dan portofolio Anda. Simpan berkas ini di Google Drive atau GitHub.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-bold transition shadow-md shadow-purple-950"
            >
              <Download className="w-4 h-4" /> Unduh Cadangan JSON
            </button>
          </div>

          {/* Import Button */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" /> Impor Progres (JSON)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pulihkan progres dari komputer lain. Sistem akan memvalidasi integritas file cadangan dan menawarkan opsi merge aman.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 rounded-xl text-xs font-mono font-bold transition"
              >
                <Upload className="w-4 h-4" /> Pilih Berkas Cadangan JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 3: Petunjuk Deployment GitHub Pages */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-7 space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Github className="w-4 h-4 text-purple-400" />
          Panduan Deployment ke GitHub Pages
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Aplikasi ini dirancang 100% statis tanpa backend eksternal, sehingga dapat di-hosting secara gratis di GitHub Pages dengan subpath repositori.
        </p>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto scrollbar-thin">
          <div className="text-purple-400 font-bold"># Langkah Deploy ke GitHub Pages:</div>
          <div>1. Pastikan file vite.config.ts memiliki konfigurasi: <span className="text-emerald-400">base: './'</span></div>
          <div>2. Jalankan build produksi: <span className="text-amber-400">npm run build</span></div>
          <div>3. Deploy folder <span className="text-purple-300">dist/</span> ke branch <span className="text-purple-300">gh-pages</span> menggunakan perintah:</div>
          <div className="bg-slate-900 p-2.5 rounded-lg text-purple-200">
            npx gh-pages -d dist
          </div>
          <div>4. Buka tab <strong>Settings &gt; Pages</strong> di repositori GitHub Anda dan pilih sumber dari branch <strong>gh-pages</strong>. Selesai!</div>
        </div>
      </div>

      {/* Bagian 4: Danger Zone - Reset Progres */}
      <div className="bg-rose-950/20 border border-rose-900/40 rounded-3xl p-6 md:p-7 space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <h2 className="text-base font-bold tracking-tight">Zona Berbahaya: Reset Seluruh Progres</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Tindakan ini akan menghapus semua modul selesai, catatan jurnal, portofolio, dan XP dari penyimpanan lokal browser Anda. Data tidak dapat dipulihkan kecuali Anda memiliki berkas ekspor cadangan JSON.
        </p>
        <button
          onClick={() => {
            playClickBeep(soundEnabled);
            setResetModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 text-xs font-mono font-bold transition flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset Seluruh Progres Belajar...
        </button>
      </div>

      {/* Modal Preview Impor */}
      {importModalOpen && importValidation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-7 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-400" />
              Validasi Berkas Cadangan JSON
            </h3>

            {importValidation.isValid && importValidation.summary ? (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300">
                  Berkas cadangan valid! Ringkasan isi berkas:
                </p>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono space-y-1 text-slate-300">
                  <div>• Tanggal Cadangan: {importValidation.summary.exportDate}</div>
                  <div>• Modul Selesai: {importValidation.summary.completedModules} / 100</div>
                  <div>• Proyek Aktif: {importValidation.summary.projectsStarted} / 7</div>
                  <div>• Total XP: {importValidation.summary.totalXp} XP</div>
                </div>
                <p className="text-slate-400">
                  Pilih cara pemulihan: <strong>Gabungkan (Merge)</strong> aman tanpa menghapus data baru, atau <strong>Ganti Penuh (Replace)</strong>.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setImportModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleConfirmImport('merge')}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow"
                  >
                    Gabungkan (Merge Aman)
                  </button>
                  <button
                    onClick={() => handleConfirmImport('replace')}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-mono font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 transition"
                  >
                    Ganti Penuh (Replace)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300">
                  <span className="font-bold">Gagal Validasi: </span>
                  {importValidation.error || 'Format berkas tidak valid.'}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setImportModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 bg-slate-800"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Reset Eksplisit */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl p-6 md:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Konfirmasi Reset Progres
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tindakan ini permanen. Semua riwayat, checklist, catatan, dan XP akan dikosongkan.
              </p>
              <p className="text-xs font-mono text-slate-400">
                Ketik kata <span className="text-rose-400 font-bold">RESET</span> di bawah untuk mengonfirmasi:
              </p>
              <input
                type="text"
                placeholder="Ketik RESET"
                value={resetConfirmationText}
                onChange={(e) => setResetConfirmationText(e.target.value)}
                className="w-full text-center bg-slate-950 border border-rose-500/40 focus:border-rose-500 rounded-xl px-4 py-2 text-sm font-mono text-white focus:outline-none uppercase"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setResetModalOpen(false);
                  setResetConfirmationText('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-800"
              >
                Batal
              </button>
              <button
                disabled={resetConfirmationText.trim().toUpperCase() !== 'RESET'}
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed shadow transition"
              >
                Ya, Hapus Semua Progres
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
