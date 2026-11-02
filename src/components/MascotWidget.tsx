/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MascotMood, MascotMessage } from '../services/mascotQuotes';
import { Sparkles, MessageSquare, Zap, RefreshCw } from 'lucide-react';

interface MascotWidgetProps {
  message: MascotMessage;
  onActionClick?: (target?: string) => void;
  compact?: boolean;
}

export const MascotWidget: React.FC<MascotWidgetProps> = ({
  message,
  onActionClick,
  compact = false,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [extraRoast, setExtraRoast] = useState<string | null>(null);

  const savagePokes = [
    'Ngapain ngeklik-ngeklik kepala gue? Buka notebook-nya sana! ⚡',
    'GPU-mu gak akan lebih kenceng cuma gara-gara kamu noel-noel gue, Bos! 🤖',
    'Awas kesetrum 10.000 volt loss function! Buruan lanjut coding!',
    'Klik tombol Complete Mission tuh di dalam modul, bukan di jidat gue! 😤',
    'Kamu ngeklik gue 5 kali berturut-turut. Ini pertanda prokrastinasi akut. Ayo tobat!',
  ];

  const handleMascotPoke = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    const roast = savagePokes[(nextCount - 1) % savagePokes.length];
    setExtraRoast(roast);
  };

  const currentText = extraRoast || message.text;

  return (
    <div
      className={`relative flex ${
        compact ? 'flex-row items-center gap-4' : 'flex-col md:flex-row items-center md:items-start gap-6'
      } bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 shadow-xl shadow-purple-950/20 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50`}
    >
      {/* Visual Mascot SVG */}
      <div
        onClick={handleMascotPoke}
        title="Klik maskot untuk roast instan!"
        className="relative flex-shrink-0 cursor-pointer group select-none transition-transform active:scale-95 hover:scale-105"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
        <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-b from-slate-900 to-purple-950/80 rounded-2xl border border-purple-400/40 p-2 flex items-center justify-center shadow-inner overflow-hidden">
          <MascotSvg mood={extraRoast ? 'savage' : message.mood} />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-purple-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-purple-300 shadow flex items-center gap-1 text-white uppercase tracking-wider">
          <Zap className="w-2.5 h-2.5" />
          {extraRoast ? 'ROAST!' : message.mood}
        </div>
      </div>

      {/* Speech Bubble / Copy */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Byte, Savage AI Companion
          </span>
          {extraRoast && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExtraRoast(null);
              }}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Balik ke status
            </button>
          )}
        </div>

        <p className="text-base md:text-lg font-semibold text-slate-100 leading-snug tracking-tight">
          "{currentText}"
        </p>

        {!extraRoast && message.subtext && (
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">{message.subtext}</p>
        )}

        {message.actionText && onActionClick && !extraRoast && (
          <div className="mt-3.5 flex items-center gap-3">
            <button
              onClick={() => onActionClick(message.actionTarget)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-md shadow-purple-900/40 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <MessageSquare className="w-4 h-4" />
              {message.actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const MascotSvg: React.FC<{ mood: MascotMood }> = ({ mood }) => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Antenna */}
      <line x1="50" y1="20" x2="50" y2="8" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
      <circle
        cx="50"
        cy="7"
        r="5"
        fill={mood === 'savage' ? '#f43f5e' : mood === 'proud' ? '#38bdf8' : '#c084fc'}
        filter="url(#neonGlow)"
        className={mood === 'savage' ? 'animate-pulse' : ''}
      />

      {/* Ear Pods */}
      <rect x="14" y="40" width="6" height="18" rx="3" fill="#6d28d9" stroke="#c084fc" strokeWidth="1" />
      <rect x="80" y="40" width="6" height="18" rx="3" fill="#6d28d9" stroke="#c084fc" strokeWidth="1" />

      {/* Robot Head Body */}
      <rect
        x="20"
        y="20"
        width="60"
        height="56"
        rx="14"
        fill="url(#bodyGrad)"
        stroke="#c084fc"
        strokeWidth="2"
      />

      {/* Screen Visor */}
      <rect
        x="26"
        y="28"
        width="48"
        height="36"
        rx="9"
        fill="url(#visorGrad)"
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Eyes based on Mood */}
      {mood === 'smug' && (
        <g filter="url(#neonGlow)">
          {/* Left eye half squint */}
          <path d="M 33 42 Q 40 37 47 43" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Right eye arched high */}
          <circle cx="63" cy="42" r="4.5" fill="#38bdf8" />
          {/* Smug smirk mouth */}
          <path d="M 45 54 Q 54 58 60 52" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {mood === 'savage' && (
        <g filter="url(#neonGlow)">
          {/* Fierce angled brows & sharp glowing eyes */}
          <path d="M 32 37 L 46 43" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
          <path d="M 68 37 L 54 43" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="38" cy="45" rx="4" ry="2.5" fill="#f43f5e" />
          <ellipse cx="62" cy="45" rx="4" ry="2.5" fill="#f43f5e" />
          {/* Sharp grinning teeth mouth */}
          <path d="M 40 55 L 44 52 L 48 55 L 52 52 L 56 55 L 60 52" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}

      {mood === 'proud' && (
        <g filter="url(#neonGlow)">
          {/* Star eyes */}
          <polygon points="38,38 40,43 45,43 41,46 43,51 38,48 33,51 35,46 31,43 36,43" fill="#38bdf8" />
          <polygon points="62,38 64,43 69,43 65,46 67,51 62,48 57,51 59,46 55,43 60,43" fill="#38bdf8" />
          {/* Big happy mouth */}
          <path d="M 40 54 Q 50 62 60 54" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}

      {mood === 'shocked' && (
        <g filter="url(#neonGlow)">
          {/* Wide rounded eyes */}
          <circle cx="38" cy="43" r="5.5" fill="#fbbf24" />
          <circle cx="62" cy="43" r="5.5" fill="#fbbf24" />
          {/* O-mouth */}
          <ellipse cx="50" cy="54" rx="4" ry="5.5" fill="#fbbf24" />
        </g>
      )}

      {mood === 'thinking' && (
        <g filter="url(#neonGlow)">
          {/* One eye looking up */}
          <circle cx="38" cy="40" r="4" fill="#a78bfa" />
          {/* One eye squinting */}
          <path d="M 57 44 Q 63 40 68 44" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Wavy mouth */}
          <path d="M 43 55 Q 49 53 53 56 Q 57 59 61 54" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {mood === 'sleeping' && (
        <g filter="url(#neonGlow)">
          {/* Closed eyes - - */}
          <line x1="33" y1="44" x2="43" y2="44" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <line x1="57" y1="44" x2="67" y2="44" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <path d="M 46 54 Q 50 56 54 54" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Zzz text */}
          <text x="68" y="24" fill="#a78bfa" fontSize="12" fontFamily="monospace" fontWeight="bold">
            z
          </text>
          <text x="76" y="16" fill="#c084fc" fontSize="14" fontFamily="monospace" fontWeight="bold">
            Z
          </text>
        </g>
      )}

      {/* Chest / Body Stems */}
      <path d="M 38 76 L 38 88" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
      <path d="M 62 76 L 62 88" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="38" cy="88" rx="6" ry="3" fill="#6d28d9" />
      <ellipse cx="62" cy="88" rx="6" ry="3" fill="#6d28d9" />
    </svg>
  );
};
