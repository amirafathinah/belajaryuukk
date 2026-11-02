/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Briefcase,
  BookMarked,
  Settings,
  Flame,
  Zap,
  Calendar,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export type NavigationTab = 'dashboard' | 'roadmap' | 'room' | 'portfolio' | 'journal' | 'settings';

interface NavbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  plannedDay: number | null;
  currentStreak: number;
  totalXp: number;
  completedCount: number;
  isStarted: boolean;
  onStartChallenge: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  plannedDay,
  currentStreak,
  totalXp,
  completedCount,
  isStarted,
  onStartChallenge,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap 100 Hari', icon: Compass },
    { id: 'room', label: 'Learning Room', icon: BookOpen },
    { id: 'portfolio', label: 'Portofolio', icon: Briefcase },
    { id: 'journal', label: 'Jurnal Belajar', icon: BookMarked },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-violet-400 p-0.5 shadow-lg shadow-purple-900/30 group-hover:shadow-purple-700/50 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 text-lg">
                  100
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm md:text-base text-white tracking-tight">
                  100 Days to ML & AI
                </span>
                <span className="bg-purple-950 text-purple-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-purple-800/60 uppercase">
                  Savage
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                Learning Lab • {completedCount}/100 Selesai
              </p>
            </div>
          </div>

          {/* Status Badges Header (Desktop) */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Day Badge */}
            {isStarted ? (
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Hari {String(plannedDay).padStart(2, '0')}/100</span>
              </div>
            ) : (
              <button
                onClick={onStartChallenge}
                className="flex items-center gap-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                Mulai Tantangan
              </button>
            )}

            {/* Streak Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                currentStreak > 0
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />
              <span>{currentStreak} HARI STREAK</span>
            </div>

            {/* XP Badge */}
            <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>{totalXp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-1 rounded-lg text-[11px] font-mono font-bold">
              <Flame className="w-3 h-3 text-amber-400" />
              {currentStreak}d
            </div>
            <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2 py-1 rounded-lg text-[11px] font-mono font-bold">
              <Zap className="w-3 h-3 text-purple-400" />
              {totalXp}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-purple-900/40 px-4 pt-2 pb-4 space-y-1">
          {!isStarted && (
            <button
              onClick={() => {
                onStartChallenge();
                setMobileMenuOpen(false);
              }}
              className="w-full mb-2 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-xs font-mono"
            >
              <Sparkles className="w-4 h-4" /> Mulai Tantangan 100 Hari
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
