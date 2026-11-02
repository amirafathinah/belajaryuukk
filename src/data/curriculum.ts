/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumModule, PhaseId } from '../types/curriculum';
import { PHASE_1_MODULES } from './modules/phase1';
import { PHASE_2_MODULES } from './modules/phase2';
import { PHASE_3_MODULES } from './modules/phase3';
import { PHASE_4_MODULES } from './modules/phase4';
import { PHASE_5_MODULES } from './modules/phase5';
import { PHASE_6_MODULES } from './modules/phase6';
import { PHASE_7_MODULES } from './modules/phase7';

export const CURRICULUM_MODULES: CurriculumModule[] = [
  ...PHASE_1_MODULES,
  ...PHASE_2_MODULES,
  ...PHASE_3_MODULES,
  ...PHASE_4_MODULES,
  ...PHASE_5_MODULES,
  ...PHASE_6_MODULES,
  ...PHASE_7_MODULES,
];

// Map lookup untuk performa O(1)
const MODULES_BY_ID_MAP = new Map<string, CurriculumModule>();
const MODULES_BY_DAY_MAP = new Map<number, CurriculumModule>();

CURRICULUM_MODULES.forEach((mod) => {
  MODULES_BY_ID_MAP.set(mod.id, mod);
  MODULES_BY_DAY_MAP.set(mod.day, mod);
});

export function getModuleById(id: string): CurriculumModule | undefined {
  return MODULES_BY_ID_MAP.get(id);
}

export function getModuleByDay(day: number): CurriculumModule | undefined {
  return MODULES_BY_DAY_MAP.get(day);
}

export function getModulesByPhase(phaseId: PhaseId): CurriculumModule[] {
  return CURRICULUM_MODULES.filter((m) => m.phaseId === phaseId);
}

export const PROJECT_MODULES = CURRICULUM_MODULES.filter((m) => m.isProject);

export const DEFAULT_PROJECT_TEMPLATES = [
  {
    id: 'proj-1',
    day: 12,
    title: 'Mini-project 1: End-to-End Prediction Notebook',
    description: 'Notebook machine learning tabular lengkap dari EDA, pembersihan data anti-leakage, baseline comparison, 5-fold cross validation, hingga evaluasi bisnis.',
    deliverablesSummary: 'Jupyter / Colab Notebook + Model Artifact (.joblib)',
    metrics: '',
    githubUrl: '',
    demoUrl: '',
    notes: '',
    status: 'not_started' as const,
  },
  {
    id: 'proj-2',
    day: 27,
    title: 'Mini-project 2: Model Comparison Report',
    description: 'Laporan komparasi model tabular (Linear vs Random Forest vs XGBoost) dengan tuning Optuna dan analisis transparansi Explainable AI (SHAP).',
    deliverablesSummary: 'Laporan Teknis + Leaderboard Table + SHAP Visualizations',
    metrics: '',
    githubUrl: '',
    demoUrl: '',
    status: 'not_started' as const,
    notes: '',
  },
  {
    id: 'proj-3',
    day: 39,
    title: 'Mini-project 3: Unsupervised Discovery Report',
    description: 'Eksplorasi wawasan dari data tanpa label melalui optimasi K clustering (Elbow & Silhouette), profiling persona pelanggan (RFM), dan deteksi anomali.',
    deliverablesSummary: 'Notebook Segmentasi + Profiling Persona + Visualisasi PCA 2D',
    metrics: '',
    githubUrl: '',
    demoUrl: '',
    status: 'not_started' as const,
    notes: '',
  },
  {
    id: 'proj-4',
    day: 54,
    title: 'Mini-project 4: Image Classifier',
    description: 'Sistem klasifikasi citra transfer learning berbasis PyTorch & ResNet/MobileNet dengan augmentasi data dan serialisasi TorchScript/ONNX.',
    deliverablesSummary: 'Pipeline Vision + Model TorchScript (.pt) + Single Image Predictor',
    metrics: '',
    githubUrl: '',
    demoUrl: '',
    status: 'not_started' as const,
    notes: '',
  },
  {
    id: 'proj-5',
    day: 69,
    title: 'Mini-project 5: Indonesian Text Classification',
    description: 'Klasifikasi teks bahasa Indonesia informal berbasis IndoBERT, penanganan bahasa gaul/slang, dan optimasi kuantisasi INT8 siap produksi.',
    deliverablesSummary: 'IndoBERT Fine-Tuned + INT8 Quantized Model + Robust API Script',
    metrics: '',
    githubUrl: '',
    demoUrl: '',
    status: 'not_started' as const,
    notes: '',
  },
  {
    id: 'proj-6',
    day: 85,
    title: 'Mini-project 6: Document Q&A Assistant',
    description: 'Asisten tanya-jawab dokumen cerdas berbasis RAG lokal (ChromaDB + SentenceTransformers + LLM lokal) dengan sitasi bukti grounded dan guardrails.',
    deliverablesSummary: 'Pipa RAG End-to-End + Vector DB Persistent + Anti-Hallucination Guard',
    metrics: '',
    githubUrl: '',
    demoUrl: '',
    status: 'not_started' as const,
    notes: '',
  },
  {
    id: 'capstone',
    day: 100,
    title: 'Final Capstone: Production AI Solution & Showcase',
    description: 'Mahakarya AI skala penuh dari formulasi masalah bisnis, audit kebocoran data, model terlatih, pipa inferensi mandiri, hingga web app interaktif publik.',
    deliverablesSummary: 'Repositori GitHub Profesional + Live Interactive Web Demo + Laporan Evaluasi Murni',
    metrics: '',
    githubUrl: '',
    demoUrl: '',
    status: 'not_started' as const,
    notes: '',
  },
];
