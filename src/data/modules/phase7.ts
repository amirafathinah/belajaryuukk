/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumModule } from '../../types/curriculum';

export const PHASE_7_MODULES: CurriculumModule[] = [
  {
    id: 'day-086',
    day: 86,
    phaseId: 7,
    title: 'Capstone Discovery',
    shortDescription: 'Memilih ide Capstone Project: Menemukan masalah bernilai nyata, ketersediaan data, kelayakan teknis, dan penetapan North Star Metric.',
    difficulty: 'Advanced',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memilih 1 topik Capstone Project yang menggabungkan keahlian ML/DL/NLP/LLM yang telah dipelajari.',
      'Mengevaluasi kelayakan teknis (*Technical Feasibility*) dan ketersediaan dataset publik berkualitas.',
      'Menetapkan kriteria sukses kuantitatif (*North Star Metric*) sebelum menulis satu baris kode pun.',
      'Menyusun dokumen Piagam Proyek (*Project Charter*) 1 halaman.',
    ],
    theoryContent: `### Memulai Mahakarya: Jangan Membangun Solusi yang Mencari Masalah!
Proyek Capstone adalah kartu nama profesional Anda untuk melamar pekerjaan atau membangun portofolio tingkat senior.

4 Kriteria Proyek Capstone Berkualitas Tinggi:
1. **Dampak Nyata (Real Impact)**: Memecahkan friksi nyata (misal: triage tiket komplain, deteksi anomali fraud perbankan, ringkasan jurnal medis, atau asisten regulasi hukum).
2. **Ketersediaan Data Berizin**: Memiliki dataset yang dapat diakses secara legal (Kaggle, Hugging Face, UCI, atau scraping terstandarisasi).
3. **Cakupan Terukur (Scope Control)**: Cukup kompleks untuk menunjukkan penguasaan pipeline lengkap, namun realistis diselesaikan dalam 15 hari.
4. **Metrik Kesuksesan Jelas**: Bukan sekadar "akurasi bagus", melainkan "F1-macro > 85% dengan latensi p95 < 100ms".`,
    practicalWalkthrough: {
      summary: 'Tulis Project Charter 1 halaman yang merinci judul proyek, deskripsi masalah, metrik acuan, dan sumber dataset.',
      environment: 'Markdown Editor / Google Docs / GitHub Gist',
      codeSnippets: [
        {
          title: 'Capstone Project Charter Template',
          language: 'markdown',
          code: `# PIAGAM PROYEK CAPSTONE ML & AI
- Judul Proyek: [Contoh: Sistem Klasifikasi Keluhan Konsumen Finansial Indonesia]
- Domain: [Fintech / Kesehatan / E-Commerce / Edukasi]
- Deskripsi Masalah: Keluhan nasabah yang masuk via media sosial terlambat ditindaklanjuti karena penanganan manual (rata-rata butuh 4 jam).
- Solusi AI yang Dibangun: Pipeline klasifikasi otomatis kategori tiket dan urgensi risiko berbasis IndoBERT + RAG dokumen panduan SOP.
- Sumber Dataset: IndoNLU SmSA + Scraped Public Reviews (5.000 sampel).
- North Star Metric: Macro F1-score >= 0.88 dan latency < 50ms per inferensi.
- Jadwal Milestone 15 Hari:
  * Hari 86-88: Discovery, Data Framing, & EDA
  * Hari 89-91: Baseline & Model Experimentation
  * Hari 92-94: Robustness & Inference Pipeline
  * Hari 95-97: Demo App & Deployment
  * Hari 98-100: Documentation, Audit, & Showcase`,
          explanation: 'Kerangka dokumen perencanaan proyek yang wajib disepakati sebelum tahap implementasi.',
        },
      ],
    },
    stepByStepInstructions: [
      'Pilih satu topik proyek spesifik yang paling Anda sukai (Tabular, Vision, NLP, atau RAG/LLM).',
      'Cari dan pastikan tautan dataset publik yang akan digunakan dapat diunduh tanpa kendala.',
      'Isi template Piagam Proyek Capstone di atas.',
      'Simpan dokumen charter ke dalam repositori baru di GitHub dengan nama "capstone-ml-ai".',
    ],
    requiredToolsAndDatasets: [
      { name: 'Kaggle Datasets / Hugging Face Hub', type: 'dataset', description: 'Penyedia ribuan dataset publik' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Piagam Capstone', description: 'Tulis dokumen Project Charter lengkap untuk proyek Capstone Anda dan simpan di catatan portofolio.' },
      { title: 'Peer Review Challenge', description: 'Bagikan ide capstone ke rekan atau komunitas belajar untuk mendapatkan kritik kelayakan ruang lingkup.', isStretch: true },
    ],
    deliverables: [
      'Dokumen Piagam Proyek Capstone (Markdown).',
      'Tautan dataset yang telah diverifikasi kelengkapannya.',
    ],
    checklist: [
      { id: 'c1', label: 'Topik proyek dan rumusan masalah bisnis didefinisikan secara spesifik', isRequired: true },
      { id: 'c2', label: 'Dataset sumber diverifikasi ketersediaannya dan diunduh', isRequired: true },
      { id: 'c3', label: 'North Star Metric kuantitatif telah ditetapkan sebagai tolok ukur sukses', isRequired: true },
    ],
    definitionOfDone: [
      'Arah dan target proyek Capstone 15 hari ke depan terkunci dengan jelas.',
    ],
    reflectionQuestions: [
      'Mengapa membatasi ruang lingkup proyek (*scoping down*) sangat penting bagi keberhasilan penyelesaian proyek dalam batas waktu?',
      'Apa metrik bisnis yang paling berkorelasi dengan metrik machine learning yang Anda pilih?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 87 untuk merumuskan formulasi masalah dan memeriksa kualitas data di Dataset & Problem Framing.',
  },
  {
    id: 'day-087',
    day: 87,
    phaseId: 7,
    title: 'Dataset & Problem Framing',
    shortDescription: 'Membedah data mentah Capstone: Validasi skema, distribusi kelas, audit kelengkapan, dan pembuatan split train-val-test permanen.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Menerjemahkan masalah bisnis menjadi tugas machine learning formal (Klasifikasi Biner / Multi-class / Regresi / RAG).',
      'Melakukan audit kelayakan dataset: mendeteksi baris korup, teks kosong, duplikasi, dan distribusi target.',
      'Membuat pembagian data permanen (Train 70%, Validation 15%, Test 15%) dengan seed tetap.',
      'Mengunci data Test Set dan menyimpannya di folder terisolasi (*do not touch test set!*).',
    ],
    theoryContent: `### Membingkai Masalah dan Mengunci Data Uji
Banyak proyek gagal di tahap framing:
- Mengira masalah adalah klasifikasi multi-label, padahal sebenarnya adalah perankingan skor kontinu.
- **Kesalahan Paling Fatal**: Terus-menerus menguji coba berbagai ide pada data test set, hingga tanpa sadar model telah overfit ke test set (*data snooping bias*).

Prinsip Partisi Data Permanen:
Simpan partisi ke dalam file terpisah sejak Hari 87:
\`data/train.csv\`, \`data/val.csv\`, dan \`data/test.csv\`.
Data uji (\`test.csv\`) hanya boleh dibuka SATU KALI SAJA di Hari 99 untuk evaluasi akhir!`,
    practicalWalkthrough: {
      summary: 'Tulis skrip pemisah data permanen dengan Stratified split dan simpan ke file CSV terpisah di disk.',
      environment: 'Jupyter Notebook / Python Script',
      codeSnippets: [
        {
          title: 'Permanent Data Splitting & Locking Script',
          language: 'python',
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
import os

# Muat data mentah Capstone
df = pd.read_csv("data/raw/capstone_dataset.csv")

# 1. Audit Awal
print(f"Total Baris Data: {len(df):,}")
print("Distribusi Target:\\n", df['target'].value_counts(normalize=True).round(3))

# 2. Split Train (70%), Val (15%), Test (15%)
train_df, temp_df = train_test_split(df, test_size=0.30, random_state=42, stratify=df['target'])
val_df, test_df = train_test_split(temp_df, test_size=0.50, random_state=42, stratify=temp_df['target'])

# 3. Kunci dan Simpan ke Disk
os.makedirs("data/processed", exist_ok=True)
train_df.to_csv("data/processed/train.csv", index=False)
val_df.to_csv("data/processed/val.csv", index=False)
test_df.to_csv("data/processed/test.csv", index=False)

print(f"✅ Data Terkunci: Train={len(train_df)}, Val={len(val_df)}, Test={len(test_df)}")`,
          explanation: 'Mengisolasi data pengujian permanen untuk menjamin validitas ilmiah model.',
        },
      ],
    },
    stepByStepInstructions: [
      'Muat dataset Capstone Anda ke dalam pandas DataFrame.',
      'Bersihkan baris yang memiliki nilai target kosong (NaN pada kolom label).',
      'Lakukan stratified train-val-test split dengan random_state=42.',
      'Simpan ketiga partisi ke folder data/processed/.',
      'Buat file README di dalam folder data yang mendokumentasikan asal-usul dataset.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Dataset Capstone Pilihan', type: 'dataset', description: 'Data yang telah dipilih di Hari 86' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Framing Data', description: 'Kunci pembagian 3 partisi data (train/val/test) dan catat jumlah baris serta proporsi target masing-masing.' },
      { title: 'Tantangan Anonymization Audit', description: 'Pastikan tidak ada data sensitif (nama orang asli, nomor telepon, email) di dalam dataset publik Anda.', isStretch: true },
    ],
    deliverables: [
      'Tiga file partisi data terisolasi: train.csv, val.csv, test.csv.',
      'Laporan ringkas statistik demografi target dataset.',
    ],
    checklist: [
      { id: 'c1', label: 'Tugas ML diformulasikan dengan definisi target matematis yang jelas', isRequired: true },
      { id: 'c2', label: 'Pemisahan train, validation, dan test set dilakukan dengan seed tetap', isRequired: true },
      { id: 'c3', label: 'Data test set diisolasi secara fisik di direktori terpisah', isRequired: true },
    ],
    definitionOfDone: [
      'Fondasi data proyek Capstone terkunci dan siap untuk tahap eksplorasi mendalam.',
    ],
    reflectionQuestions: [
      'Mengapa validation set terpisah wajib ada di samping test set dalam proyek deep learning dan transfer learning?',
      'Apa konsekuensi jika stratifikasi label tidak digunakan saat membagi dataset yang timpang?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 88 untuk menggali wawasan tersembunyi data di Exploratory Data Analysis (EDA).',
  },
  {
    id: 'day-088',
    day: 88,
    phaseId: 7,
    title: 'Exploratory Data Analysis',
    shortDescription: 'Investigasi data Capstone: Visualisasi distribusi, analisis panjang teks/dimensi citra, korelasi fitur, dan dokumentasi 5 temuan kunci.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Menjalankan EDA terarah HANYA pada data latih (train.csv) untuk mencegah kontaminasi pemikiran.',
      'Memvisualisasikan distribusi panjang kata/token, histogram fitur, dan matriks korelasi.',
      'Mendeteksi anomali khusus domain (misal: outlier harga ekstrem atau ulasan spam duplikat).',
      'Merumuskan 5 wawasan kunci (Key Insights) yang memandu keputusan feature engineering dan modeling.',
    ],
    theoryContent: `### Membedah Karakteristik Data Proyek
EDA bukan sekadar membuat 20 grafik berwarna-warni tanpa kesimpulan.
Setiap grafik yang Anda buat harus menjawab pertanyaan hipotesis:
- *"Apakah kelas minoritas memiliki teks ulasan yang cenderung jauh lebih panjang?"*
- *"Apakah ada fitur yang memiliki korelasi 0.99 sehingga salah satunya harus dibuang?"*
- *"Berapa persentil ke-95 panjang token teks agar kita bisa menentukan parameter max_length secara efisien?"*

Hasil akhir dari Hari 88 harus berupa **5 Temuan Konkret** yang menjadi alasan mengapa Anda memilih arsitektur tertentu di hari berikutnya.`,
    practicalWalkthrough: {
      summary: 'Lakukan analisis statistik dan visualisasi pada train.csv, lalu tuliskan ringkasan 5 wawasan utama.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Targeted Capstone EDA Suite',
          language: 'python',
          code: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

train_df = pd.read_csv("data/processed/train.csv")

# 1. Analisis Panjang Teks / Karakteristik Fitur
if 'text' in train_df.columns:
    train_df['word_count'] = train_df['text'].str.split().str.len()
    p95_len = int(train_df['word_count'].quantile(0.95))
    print(f"📊 95% teks memiliki panjang di bawah {p95_len} kata.")
    
    plt.figure(figsize=(8, 4))
    sns.histplot(data=train_df, x='word_count', hue='target', bins=40, kde=True)
    plt.axvline(p95_len, color='red', linestyle='--', label=f'P95 ({p95_len} kata)')
    plt.title("Distribusi Panjang Kata per Kategori Target")
    plt.legend()
    plt.show()`,
          explanation: 'Menemukan ambang batas parameter pemrosesan (seperti max_length) berbasis distribusi empiris.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buka notebook 01_capstone_eda.ipynb.',
      'Muat HANYA data train.csv.',
      'Buat grafik visualisasi distribusi target, histogram variabel kontinu, dan boxplot.',
      'Catat nilai persentil penting (median, IQR, persentil ke-95).',
      'Tuliskan 5 poin temuan kunci di bagian akhir notebook.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Matplotlib & Seaborn', type: 'tool', description: 'Visualisasi eksplorasi data' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas EDA Capstone', description: 'Tuntaskan analisis eksplorasi data dan rumuskan 5 temuan penting yang memandu desain model Anda.' },
      { title: 'Interactive Plotly Visualizer', description: 'Buat minimal satu grafik interaktif menggunakan plotly.express untuk dimasukkan ke laporan akhir.', isStretch: true },
    ],
    deliverables: [
      'Jupyter notebook 01_capstone_eda.ipynb dengan visualisasi dan narasi interpretasi.',
      'Daftar 5 hipotesis kerja yang didukung oleh bukti grafik.',
    ],
    checklist: [
      { id: 'c1', label: 'EDA dilakukan murni pada data training tanpa menyentuh test set', isRequired: true },
      { id: 'c2', label: 'Distribusi dan ambang batas fitur dihitung secara kuantitatif', isRequired: true },
      { id: 'c3', label: 'Terdapat 5 temuan kunci tertulis yang memandu langkah modeling', isRequired: true },
    ],
    definitionOfDone: [
      'Karakteristik dan keunikan dataset proyek Capstone dipahami secara komprehensif.',
    ],
    reflectionQuestions: [
      'Bagaimana temuan persentil ke-95 panjang teks membantu menghemat komputasi memori pada model Transformer?',
      'Apa yang harus dilakukan jika EDA menemukan fitur yang berkorelasi 1.0 dengan target?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 89 untuk menetapkan patokan keberhasilan pertama di Baseline First.',
  },
  {
    id: 'day-089',
    day: 89,
    phaseId: 7,
    title: 'Baseline First',
    shortDescription: 'Membangun model patokan awal: Dummy Estimator dan model linier cepat sebagai acuan minimum proyek Capstone.',
    difficulty: 'Intermediate',
    estimatedDuration: '70 Menit',
    learningObjectives: [
      'Menetapkan metrik benchmark acuan sebelum melatih model kompleks yang mahal.',
      'Membangun Naive Baseline (Dummy Estimator) dan Simple Baseline (Logistic Regression / Ridge / BoW).',
      'Mengukur skor metrik pada validation.csv dan mencatat waktu komputasi pelatihan awal.',
      'Menjamin seluruh alur pipa evaluasi (evaluation harness) berjalan lancar dari data ke metrik.',
    ],
    theoryContent: `### Hukum Wajib Insinyur AI: Baseline Terlebih Dahulu!
Jangan pernah langsung melatih model Transformer atau Deep Learning 10 lapis di hari pertama eksperimen.
Mengapa?
Jika model deep learning Anda membutuhkan 3 jam training dan menghasilkan F1-score 82%, apakah itu bagus?
Anda tidak akan pernah tahu **jika Anda tidak punya baseline**:
- Jika model Logistic Regression sederhana yang dilatih dalam 0.5 detik menghasilkan F1-score 81.5%, maka model deep learning Anda adalah sebuah pemborosan energi dan kegagalan optimasi!
- Baseline model menetapkan **batas bawah harga diri proyek**: model akhir Anda wajib mengalahkan baseline ini dengan selisih yang signifikan.`,
    practicalWalkthrough: {
      summary: 'Latih model baseline cepat pada train.csv, evaluasi pada val.csv, dan catat skornya sebagai tonggak acuan.',
      environment: 'Jupyter Notebook / Python Script',
      codeSnippets: [
        {
          title: 'Capstone Baseline Benchmark Script',
          language: 'python',
          code: `from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, f1_score
import pandas as pd

train_df = pd.read_csv("data/processed/train.csv")
val_df = pd.read_csv("data/processed/val.csv")

# 1. Naive Baseline (Tebak mayoritas)
dummy = DummyClassifier(strategy="most_frequent")
dummy.fit(train_df['text'], train_df['target'])
dummy_f1 = f1_score(val_df['target'], dummy.predict(val_df['text']), average='macro')

# 2. Simple ML Baseline (TF-IDF + Logistic Regression)
baseline_pipe = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000)),
    ('clf', LogisticRegression(max_iter=500))
])
baseline_pipe.fit(train_df['text'], train_df['target'])
val_preds = baseline_pipe.predict(val_df['text'])
simple_f1 = f1_score(val_df['target'], val_preds, average='macro')

print(f"📊 HASIL PATOKAN DASAR PROYEK (Validation Set):")
print(f"1. Naive Dummy Baseline F1 : {dummy_f1:.4f}")
print(f"2. Simple Model Baseline F1: {simple_f1:.4f}")
print("\\nTarget Proyek Capstone: Model akhir wajib melampaui F1 {simple_f1 + 0.05:.4f}!")`,
          explanation: 'Menetapkan angka target minimal yang objektif untuk diuji oleh eksperimen model tingkat lanjut.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buka notebook 02_capstone_baseline.ipynb.',
      'Muat train.csv dan val.csv.',
      'Latih model DummyClassifier dan model linier sederhana.',
      'Catat nilai Macro F1, Akurasi, dan latensi inferensi rata-rata.',
      'Dokumentasikan angka patokan ini di tabel pelacakan eksperimen.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Baseline Models', type: 'tool', description: 'DummyClassifier, LogisticRegression' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Baseline Capstone', description: 'Tuntaskan evaluasi baseline model dan catat skor North Star Metric patokan awal di portofolio.' },
      { title: 'Confusion Matrix Baseline', description: 'Plot confusion matrix model baseline untuk melihat kelas mana yang paling banyak gagal dideteksi oleh model sederhana.', isStretch: true },
    ],
    deliverables: [
      'Notebook 02_capstone_baseline.ipynb dengan hasil eksekusi lengkap.',
      'Skor numerik baseline yang terdokumentasi rapi.',
    ],
    checklist: [
      { id: 'c1', label: 'Model baseline dilatih pada train.csv dan dievaluasi pada val.csv', isRequired: true },
      { id: 'c2', label: 'Skor metrik North Star dihitung secara objektif tanpa rounding palsu', isRequired: true },
      { id: 'c3', label: 'Ambang batas peningkatan yang ditargetkan dirumuskan', isRequired: true },
    ],
    definitionOfDone: [
      'Patokan dasar keberhasilan proyek resmi ditetapkan dan siap dikalahkan oleh model utama.',
    ],
    reflectionQuestions: [
      'Mengapa evaluasi baseline wajib dilakukan pada validation set, bukan pada training set?',
      'Apa yang harus dievaluasi ulang jika model kompleks nanti ternyata gagal mengalahkan simple baseline?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 90 untuk memasuki arena eksperimen model utama di Model Experimentation.',
  },
  {
    id: 'day-090',
    day: 90,
    phaseId: 7,
    title: 'Model Experimentation',
    shortDescription: 'Arena eksperimen model Capstone: Menguji 3 arsitektur unggulan (XGBoost / Deep Network / Transformer / Fine-tuned LLM) pada validation set.',
    difficulty: 'Advanced',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Melatih minimal 2-3 arsitektur model tingkat lanjut yang berbeda pada dataset Capstone.',
      'Menerapkan teknik regularisasi dan optimasi hyperparameter terarah.',
      'Mencatat metrik evaluasi validation set secara konsisten di tabel Leaderboard.',
      'Memilih 1 arsitektur kandidat juara yang menunjukkan keseimbangan terbaik antara akurasi dan stabilitas.',
    ],
    theoryContent: `### Memilih Arsitektur Juara: Eksperimen Terkendali
Kunci dari eksperimen sains adalah **mengisolasi variabel**:
- Gunakan partisi data yang sama persis (\`train.csv\` dan \`val.csv\`).
- Gunakan metrik evaluasi yang sama (\`f1_macro\`).
- Variasikan arsitektur model:
  1. *Model A*: Gradient Boosting (XGBoost / LightGBM dengan tuning).
  2. *Model B*: Deep Learning (CNN / Bi-LSTM dengan regularisasi Dropout).
  3. *Model C*: Pretrained Transformer (IndoBERT / DistilBERT fine-tuning).

Catat waktu pelatihan dan ukuran model. Model dengan performa validation tertinggi akan maju ke tahap forensik error di Hari 91.`,
    practicalWalkthrough: {
      summary: 'Latih model kandidat utama pada GPU/CPU, pantau kurva konvergensi validasi, dan catat skor puncaknya.',
      environment: 'Google Colab (GPU) / Jupyter lokal',
      codeSnippets: [
        {
          title: 'Multi-Candidate Training & Leaderboard',
          language: 'python',
          code: `import pandas as pd

# Contoh tabel pelacakan eksperimen Capstone
leaderboard_capstone = pd.DataFrame([
    {'Eksperimen': '1. Baseline Dummy', 'F1-Macro (Val)': 0.332, 'Epoch/Iter': 1, 'Status': 'Patokan Terendah'},
    {'Eksperimen': '2. TF-IDF + LogReg', 'F1-Macro (Val)': 0.814, 'Epoch/Iter': 1, 'Status': 'Simple Baseline'},
    {'Eksperimen': '3. Random Forest (Tuned)', 'F1-Macro (Val)': 0.835, 'Epoch/Iter': 150, 'Status': 'Kandidat 1'},
    {'Eksperimen': '4. XGBoost (Tuned)', 'F1-Macro (Val)': 0.862, 'Epoch/Iter': 200, 'Status': 'Kandidat 2'},
    {'Eksperimen': '5. IndoBERT Fine-Tuned', 'F1-Macro (Val)': 0.912, 'Epoch/Iter': 3, 'Status': '⭐ JUARA SEMENTARA'}
])

print("🏆 CAPSTONE MODEL LEADERBOARD:")
print(leaderboard_capstone.to_string(index=False))`,
          explanation: 'Membandingkan seluruh kandidat model secara transparan untuk menentukan model pemenang.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buka notebook 03_capstone_modeling.ipynb.',
      'Latih minimal 2 model tingkat lanjut yang relevan dengan domain Anda.',
      'Evaluasi performa kedua model pada val.csv menggunakan fungsi metrik standar.',
      'Bandingkan hasilnya dengan baseline Hari 89.',
      'Pilih satu model terbaik sebagai arsitektur final Capstone.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch / Transformers / XGBoost', type: 'tool', description: 'Framework pemodelan utama' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Eksperimen Model', description: 'Latih model unggulan dan buktikan peningkatan metrik minimal 5-10% di atas simple baseline pada validation set.' },
      { title: 'Learning Curve Diagnostics', description: 'Plot kurva loss train vs validation dari model terbaik untuk memastikan tidak ada gejala overfitting liar.', isStretch: true },
    ],
    deliverables: [
      'Notebook 03_capstone_modeling.ipynb dengan log eksperimen lengkap.',
      'Tabel Leaderboard perbandingan seluruh kandidat model.',
    ],
    checklist: [
      { id: 'c1', label: 'Minimal 2 arsitektur model berbeda dilatih dan dikomparasikan', isRequired: true },
      { id: 'c2', label: 'Seluruh evaluasi dilakukan murni pada validation set', isRequired: true },
      { id: 'c3', label: 'Model unggulan berhasil melampaui skor baseline secara signifikan', isRequired: true },
    ],
    definitionOfDone: [
      'Model kandidat juara proyek Capstone terpilih berdasarkan bukti empiris yang kuat.',
    ],
    reflectionQuestions: [
      'Berapa peningkatan persentase performa yang dihasilkan oleh model terbaik dibanding baseline?',
      'Apakah peningkatan akurasi tersebut sebanding dengan penambahan kompleksitas dan waktu komputasi?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 91 untuk membedah kelemahan model juara di Error Analysis Deep Dive.',
  },
  {
    id: 'day-091',
    day: 91,
    phaseId: 7,
    title: 'Error Analysis Deep Dive',
    shortDescription: 'Membedah kelemahan model Capstone: Investigasi False Positives, False Negatives, dan taksonomi kegagalan spesifik domain.',
    difficulty: 'Advanced',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Melakukan audit forensik pada sampel data validasi yang salah diprediksi oleh model juara.',
      'Menyusun Taksonomi Kesalahan spesifik untuk proyek Capstone Anda.',
      'Mengidentifikasi apakah error disebabkan oleh: label noise, data ambigu, ketidakseimbangan sub-kategori, atau kelemahan representasi model.',
      'Merancang rencana aksi konkret untuk perbaikan di Hari 92.',
    ],
    theoryContent: `### Jangan Puas dengan Skor 90%: Kejar 10% yang Gagal!
Seorang ML Engineer junior akan berhenti begitu melihat angka akurasi 90%.
Seorang **Senior ML Engineer** akan langsung membuka 10% data yang gagal:
- Mengapa model salah menebak sampel ini?
- Apakah ada pola kalimat atau karakteristik fitur tertentu yang secara konsisten membingungkan model?
- Apakah ada data latih yang memiliki label salah (*anotasi keliru*)?

Analisis kesalahan terarah pada Hari 91 adalah rahasia meningkatkan performa model dari "lumayan" menjadi "kelas dunia".`,
    practicalWalkthrough: {
      summary: 'Ekstrak seluruh sampel data validasi yang salah diprediksi, buat confusion matrix detail, dan kelompokkan ke dalam 3 jenis error utama.',
      environment: 'Jupyter Notebook / Python Script',
      codeSnippets: [
        {
          title: 'Capstone Error Forensic Script',
          language: 'python',
          code: `import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix

# Asumsi model juara telah memprediksi val_df
val_df['pred'] = best_model.predict(val_df['text'])
val_df['is_error'] = (val_df['target'] != val_df['pred'])

errors = val_df[val_df['is_error']]
print(f"Total Sampel Salah: {len(errors)} dari {len(val_df)} ({len(errors)/len(val_df)*100:.1f}%)")

# Tampilkan 5 contoh kasus kegagalan teratas
print("\\n5 Sampel Kasus Kesalahan Model:")
for idx, row in errors.head(5).iterrows():
    print(f"--- [Label Asli: {row['target']} | Prediksi Model: {row['pred']}] ---")
    print(f"Teks: {row['text']}\\n")`,
          explanation: 'Mengisolasi baris data gagal untuk menemukan pola kelemahan spesifik model.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buka notebook 04_capstone_error_analysis.ipynb.',
      'Filter seluruh baris data di val.csv di mana prediksi != target.',
      'Plot Confusion Matrix dengan normalisasi persentase baris.',
      'Baca secara manual minimal 15 sampel yang salah klasifikasi.',
      'Kelompokkan penyebab error ke dalam tabel taksonomi.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Metrics Display', type: 'tool', description: 'ConfusionMatrixDisplay' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Forensik Capstone', description: 'Identifikasi 3 pola kesalahan paling dominan pada model Anda dan tuliskan hipotesis cara memperbaikinya.' },
      { title: 'Label Noise Discovery', description: 'Periksa apakah ada sampel yang salah diprediksi namun setelah dibaca manusia ternyata model yang benar dan label dataset yang salah.', isStretch: true },
    ],
    deliverables: [
      'Notebook 04_capstone_error_analysis.ipynb.',
      'Tabel taksonomi kesalahan 3 kategori beserta contoh kasus nyata.',
    ],
    checklist: [
      { id: 'c1', label: 'Seluruh sampel salah klasifikasi diekstrak bersama probabilitasnya', isRequired: true },
      { id: 'c2', label: 'Confusion Matrix dianalisis untuk mendeteksi pasangan kelas yang sering tertukar', isRequired: true },
      { id: 'c3', label: 'Rencana perbaikan fitur / data dirumuskan untuk Hari 92', isRequired: true },
    ],
    definitionOfDone: [
      'Pola titik buta (blind spots) model juara terpetakan dengan detail dan memiliki rencana aksi mitigasi.',
    ],
    reflectionQuestions: [
      'Mengapa membaca sampel error secara kualitatif seringkali lebih bermanfaat daripada mencoba hyperparameter baru secara acak?',
      'Bagaimana cara membedakan antara error yang dapat diperbaiki (*reducible error*) vs noise acak yang tidak dapat dihindari (*irreducible error*)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 92 untuk mengeksekusi perbaikan terarah di Feature & Model Improvement.',
  },
  {
    id: 'day-092',
    day: 92,
    phaseId: 7,
    title: 'Feature & Model Improvement',
    shortDescription: 'Iterasi perbaikan terarah: Mengimplementasikan perbaikan data, penyesuaian threshold, atau penambahan fitur berdasarkan hasil error analysis.',
    difficulty: 'Advanced',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Menerapkan perbaikan data terarah (*Data-Centric AI*): perbaikan normalisasi teks, penanganan kata slang baru, atau koreksi outlier.',
      'Melakukan kalibrasi threshold keputusan (jika klasifikasi) untuk mengoptimalkan trade-off Precision-Recall.',
      'Menguji apakah perubahan tersebut berhasil memperbaiki sampel-sampel yang sebelumnya gagal pada Hari 91.',
      'Mengunci bobot model final terbaik (*Freezing Final Model Weights*).',
    ],
    theoryContent: `### Siklus Iterasi: Memperbaiki Titik Lemah Secara Presisi
Dari hasil forensik Hari 91, Anda telah mengetahui letak masalahnya:
- Jika model sering salah pada kalimat negasi majemuk $\\rightarrow$ perbaiki aturan preprocessing atau tambahkan fitur negasi eksplisit.
- Jika kelas minoritas sering terlewat $\\rightarrow$ kalibrasi threshold keputusan dari 0.5 menjadi 0.35 atau sesuaikan bobot class_weight.
- Jika ada kata slang baru yang merusak tokenisasi $\\rightarrow$ masukkan ke kamus normalisasi.

Hasil yang Diharapkan:
Model yang telah diperbaiki harus membuktikan bahwa metrik validasi naik dan sebagian besar sampel yang gagal di Hari 91 kini berhasil dijawab dengan benar!`,
    practicalWalkthrough: {
      summary: 'Latih model dengan data dan konfigurasi yang telah diperbaiki, evaluasi ulang pada val.csv, dan verifikasi perbaikannya.',
      environment: 'Jupyter Notebook / Python Script',
      codeSnippets: [
        {
          title: 'Targeted Fix & Validation Verification',
          language: 'python',
          code: `# Uji coba model setelah perbaikan preprocessing / threshold
val_probs = improved_model.predict_proba(val_df['text'])[:, 1]
# Gunakan threshold optimal hasil kalibrasi
optimal_th = 0.38
val_preds_improved = (val_probs >= optimal_th).astype(int)

new_f1 = f1_score(val_df['target'], val_preds_improved, average='macro')
print(f"Skor F1 Sebelum Perbaikan : {previous_f1:.4f}")
print(f"Skor F1 Setelah Perbaikan : {new_f1:.4f} (Peningkatan: +{(new_f1 - previous_f1)*100:.2f}%)")

# Simpan model final
import joblib
joblib.dump(improved_model, "models/final_capstone_model.joblib")
print("🔒 Model Final Tersimpan: models/final_capstone_model.joblib")`,
          explanation: 'Memvalidasi perbaikan kinerja secara kuantitatif dan menyimpan artefak model final.',
        },
      ],
    },
    stepByStepInstructions: [
      'Terapkan minimal satu perbaikan terarah berdasarkan temuan Hari 91.',
      'Latih ulang model atau terapkan penyesuaian threshold keputusan.',
      'Evaluasi ulang pada validation set dan periksa apakah sampel-sampel error berhasil teratasi.',
      'Simpan artefak model terbaik ke folder models/final_capstone_model.*.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Joblib / PyTorch torch.save', type: 'tool', description: 'Penyimpanan model teroptimasi' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Perbaikan Model', description: 'Tunjukkan peningkatan metrik validasi setelah menerapkan perbaikan data/threshold terarah.' },
      { title: 'Verifikasi Sampel Gagal', description: 'Pilih 5 sampel yang kemarin salah di Hari 91 dan buktikan minimal 3 di antaranya kini berhasil diprediksi benar.', isStretch: true },
    ],
    deliverables: [
      'Laporan perbandingan skor metrik sebelum vs sesudah perbaikan terarah.',
      'File artefak model final tersimpan di folder models/.',
    ],
    checklist: [
      { id: 'c1', label: 'Perbaikan didasarkan langsung pada temuan audit error Hari 91', isRequired: true },
      { id: 'c2', label: 'Skor metrik validasi mengalami perbaikan terukur', isRequired: true },
      { id: 'c3', label: 'File bobot model final disimpan secara permanen di disk', isRequired: true },
    ],
    definitionOfDone: [
      'Model proyek Capstone mencapai titik kematangan tertinggi dan siap diuji ketahanannya.',
    ],
    reflectionQuestions: [
      'Mengapa perbaikan pada kualitas data preprocessing seringkali menghasilkan kenaikan akurasi lebih besar daripada menukar arsitektur model?',
      'Bagaimana perasaan Anda melihat sampel yang sebelumnya gagal kini berhasil dijawab dengan benar oleh model?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 93 untuk menguji ketangguhan model menghadapi input ekstrem di Robustness Testing.',
  },
  {
    id: 'day-093',
    day: 93,
    phaseId: 7,
    title: 'Robustness Testing',
    shortDescription: 'Uji ketahanan ekstrem: Stress test dengan input typo acak, kalimat kosong, teks sangat panjang, dan simulasi data drift.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami mengapa model yang memiliki akurasi 95% di notebook seringkali langsung rusak saat terkena input pengguna nyata di internet.',
      'Melakukan Stress Testing: menyisipkan typo acak (karakter tertukar, huruf hilang) dan mengamati degradasi skor akurasi.',
      'Memvalidasi batas ekstrim: memastikan fungsi model tidak crash saat menerima string kosong, spasi murni, atau teks 5.000 kata.',
      'Membangun modul validasi input defensif di depan model inferensi.',
    ],
    theoryContent: `### Mempersiapkan Model Menghadapi Dunia Liar
Di lingkungan laboratorium notebook, data Anda rapi dan sopan. Di internet nyata:
- Pengguna mengetik sambil berjalan dengan banyak typo (*"brg bgus bgt tpi pngiriman lma"*).
- Bot mengirimkan teks kosong atau script injection.
- Pengguna menempelkan seluruh artikel 10 halaman ke dalam kotak input ulasan.

Uji Ketahanan (Robustness Test):
Sebuah model produksi yang baik harus **Graceful**: jika input rusak parah, ia tidak boleh mengeluarkan Internal Server Error 500, melainkan memberikan penanganan defensif atau fallback yang terprediksi.`,
    practicalWalkthrough: {
      summary: 'Buat rangkaian uji stres defensif dengan generator noise sintetis dan pastikan pipa prediksi tidak pernah melempar unhandled exception.',
      environment: 'Jupyter Notebook / Python Script',
      codeSnippets: [
        {
          title: 'Model Robustness Stress Test Suite',
          language: 'python',
          code: `edge_case_inputs = [
    "",                          # String kosong
    "      ",                    # Hanya whitespace
    "a" * 1000,                  # Karakter berulang tanpa spasi
    "!@#$%^&*()_+=-~",           # Hanya simbol
    "K4mU h4rus b3l1 pr0duk 1n1", # Leetspeak / alay
    "Barang bagus. " * 200       # Teks sangat panjang (2000 kata)
]

print("🛡️ MEMULAI UJI KETAHANAN DEFENSIVE INFERENCE:")
for idx, text in enumerate(edge_case_inputs):
    try:
        # Panggil fungsi prediksi
        result = predict_pipeline(text)
        print(f"Test #{idx+1} [Panjang: {len(text)} char]: LULUS (Output: {result})")
    except Exception as e:
        print(f"❌ Test #{idx+1} GAGAL! Terjadi Exception: {type(e).__name__} - {e}")`,
          explanation: 'Memastikan pipa inferensi menangani seluruh kasus batas (edge cases) tanpa kegagalan sistemik.',
        },
      ],
    },
    stepByStepInstructions: [
      'Rancang suite uji stres berisi minimal 6 kasus batas ekstrem.',
      'Jalankan model final pada seluruh input anomali tersebut.',
      'Jika ada input yang menyebabkan error exception (seperti IndexError atau ZeroDivisionError), perbaiki fungsi pra-pemrosesan dengan validasi defensif.',
      'Dokumentasikan hasil kelulusan uji ketahanan.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Python Pytest / Assert suite', type: 'tool', description: 'Pengujian perangkat lunak terotomatisasi' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Uji Ketahanan', description: 'Buktikan bahwa pipa inferensi model Anda lolos 100% dari seluruh 6 kasus batas tanpa satupun exception fatal.' },
      { title: 'Typo Perturbation Benchmark', description: 'Gunakan library nlpaug untuk menyisipkan 10% typo acak pada data validasi dan ukur berapa persen penurunan performa F1-nya.', isStretch: true },
    ],
    deliverables: [
      'Log hasil uji stres ketahanan 6 skenario batas.',
      'Modul validasi input defensif yang terpasang di pipa prediksi.',
    ],
    checklist: [
      { id: 'c1', label: 'Kasus batas teks kosong dan simbol diuji', isRequired: true },
      { id: 'c2', label: 'Teks melampaui batas panjang normal berhasil dipotong/ditangani secara anggun', isRequired: true },
      { id: 'c3', label: 'Pipa inferensi tidak pernah melempar unhandled crash exception', isRequired: true },
    ],
    definitionOfDone: [
      'Model terbukti tangguh dan kebal terhadap berbagai variasi input rusak di dunia nyata.',
    ],
    reflectionQuestions: [
      'Mengapa validasi input di tingkat software sama pentingnya dengan pelatihan model di tingkat matematis?',
      'Bagaimana cara menangani teks yang menggunakan gaya penulisan leetspeak/angka pengganti huruf?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 94 untuk merakit modul inferensi mandiri di Build an Inference Pipeline.',
  },
  {
    id: 'day-094',
    day: 94,
    phaseId: 7,
    title: 'Build an Inference Pipeline',
    shortDescription: 'Membangun pipa inferensi siap produksi: Pembungkusan kelas mandiri, preprocessing otomatis, kalibrasi ambang batas, dan ekspor JSON.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Membungkus seluruh alur (raw text $\\rightarrow$ cleaning $\\rightarrow$ vector/features $\\rightarrow$ model predict $\\rightarrow$ human label) ke dalam 1 file modul Python mandiri.',
      'Menghilangkan dependensi ke notebook penelitian Jupyter: modul harus dapat diimpor di aplikasi web apa pun via import predict.',
      'Mendukung inferensi sampel tunggal dan inferensi ber-batch dengan pencatatan waktu pemrosesan (*latency tracking*).',
      'Mengembalikan respons terstruktur (JSON / dictionary) berisi: label, probabilitas, skor keyakinan, dan latency ms.',
    ],
    theoryContent: `### Menjembatani Notebook Penelitian dengan Dunia Rekayasa Software
Sebuah notebook Jupyter dengan 40 sel berantakan tidak dapat dipasang ke server web.
Inference Pipeline Standar Industri:
- Satu file mandiri \`src/inference.py\`.
- Satu kelas utama: \`CapstonePredictor\`.
- Metode publik:
  - \`predict(raw_input) -> dict\`
  - \`predict_batch(list_of_inputs) -> list[dict]\`
Kode ini harus dapat dijalankan dari terminal hanya dengan:
\`python -c "from src.inference import CapstonePredictor; print(CapstonePredictor().predict('halo'))"\``,
    practicalWalkthrough: {
      summary: 'Tulis file src/inference.py mandiri, muat artefak model dari Hari 92, dan uji coba eksekusi dari skrip luar.',
      environment: 'VS Code / Terminal / Python Script',
      codeSnippets: [
        {
          title: 'src/inference.py Production Module',
          language: 'python',
          code: `import time
import joblib

class CapstonePredictor:
    def __init__(self, model_path="models/final_capstone_model.joblib"):
        # Muat artefak model dan preprocessing tersimpan
        self.pipeline = joblib.load(model_path)
        self.class_names = {0: "Keluhan Negatif", 1: "Pertanyaan Netral", 2: "Apresiasi Positif"}
        
    def predict(self, raw_text: str) -> dict:
        t0 = time.perf_counter()
        
        # Validasi Defensif
        if not raw_text or not raw_text.strip():
            return {
                "status": "error",
                "message": "Input teks kosong",
                "prediction": None,
                "confidence": 0.0,
                "latency_ms": 0.0
            }
            
        # Inferensi Pipeline
        prob = self.pipeline.predict_proba([raw_text])[0]
        pred_idx = prob.argmax()
        latency_ms = (time.perf_counter() - t0) * 1000
        
        return {
            "status": "success",
            "text": raw_text,
            "prediction": self.class_names.get(pred_idx, str(pred_idx)),
            "confidence": round(float(prob[pred_idx]) * 100, 2),
            "latency_ms": round(latency_ms, 2)
        }

# Uji Coba Langsung
if __name__ == "__main__":
    predictor = CapstonePredictor()
    res = predictor.predict("Aplikasi sangat cepat dan responsif!")
    print("Hasil Inferensi Mandiri:", res)`,
          explanation: 'Modul inferensi bersih berorientasi objek yang siap dipanggil oleh framework web apa pun.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buat direktori src/ dan file src/inference.py.',
      'Tulis kelas CapstonePredictor dengan metode __init__ dan predict().',
      'Pastikan kelas memuat model artefak lokal secara otomatis.',
      'Sertakan pencatatan waktu latensi inferensi dalam milidetik.',
      'Uji coba pemanggilan kelas dari skrip Python terpisah untuk membuktikan modularitasnya.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Python OOP & Joblib', type: 'tool', description: 'Pengemasan modular software inferensi' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Modul Inferensi', description: 'Buat file src/inference.py mandiri yang dapat dipanggil dari terminal dan mengembalikan dictionary hasil prediksi terstruktur.' },
      { title: 'Metode Batch Inference', description: 'Tambahkan metode predict_batch() yang mampu memproses 50 teks sekaligus dengan waktu per sampel lebih cepat daripada loop tunggal.', isStretch: true },
    ],
    deliverables: [
      'File kode sumber src/inference.py.',
      'Output printout eksekusi terminal saat modul dipanggil langsung.',
    ],
    checklist: [
      { id: 'c1', label: 'File src/inference.py bebas dari dependensi ke notebook Jupyter', isRequired: true },
      { id: 'c2', label: 'Validasi input defensif mengembalikan status error yang rapi', isRequired: true },
      { id: 'c3', label: 'Output menyertakan label prediksi, persentase keyakinan, dan latensi milidetik', isRequired: true },
    ],
    definitionOfDone: [
      'Pipa inferensi mandiri siap disambungkan ke antarmuka aplikasi web atau API.',
    ],
    reflectionQuestions: [
      'Mengapa memisahkan kode eksperimen (notebook) dari kode produksi (Python module) adalah standar wajib di tim engineering?',
      'Bagaimana cara mengoptimalkan kecepatan inferensi batch menggunakan vektorisasi matriks dibanding loop for?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 95 untuk membangun antarmuka web interaktif yang memukau di Build a Demo App.',
  },
  {
    id: 'day-095',
    day: 95,
    phaseId: 7,
    title: 'Build a Demo App',
    shortDescription: 'Membangun antarmuka web interaktif: Streamlit / Gradio / FastAPI UI untuk mendemonstrasikan kemampuan model Capstone kepada publik.',
    difficulty: 'Intermediate',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Membangun antarmuka pengguna interaktif menggunakan Streamlit atau Gradio dalam hitungan menit.',
      'Menyediakan kotak input teks/gambar, tombol prediksi, kartu indikator metrik keyakinan, dan visualisasi bar chart probabilitas.',
      'Menyertakan contoh sampel teks siap klik (*Preset Examples*) agar pengguna tidak perlu bingung mengetik.',
      'Menampilkan transparansi model: penjelasan mengapa model memprediksi demikian.',
    ],
    theoryContent: `### Jangan Biarkan Model Anda Terkubur di Terminal!
Stakeholder bisnis, perekrut kerja, dan pengguna tidak akan pernah mengkloning git repo Anda hanya untuk menjalankan script terminal.
Mereka ingin **melihat, mencoba, dan berinteraksi** langsung melalui browser web!

Framework UI Cepat untuk Data Science:
- **Streamlit**: Mengubah script Python murni menjadi web dashboard modern yang responsif.
- **Gradio**: Sangat populer di Hugging Face Spaces untuk demo interaktif model NLP dan Vision.
Dengan menambahkan UI yang rapi dengan visualisasi probabilitas interaktif, daya tarik portofolio Anda akan meningkat 10x lipat di mata recruiter!`,
    practicalWalkthrough: {
      summary: 'Tulis aplikasi web app.py menggunakan Streamlit yang mengimpor CapstonePredictor dan menampilkan visualisasi prediksi interaktif.',
      environment: 'Terminal Lokal / VS Code (pip install streamlit)',
      codeSnippets: [
        {
          title: 'app.py (Streamlit Web Demo Application)',
          language: 'python',
          code: `import streamlit as st
import pandas as pd
# from src.inference import CapstonePredictor

st.set_page_config(page_title="AI Capstone Demo", page_icon="🚀", layout="centered")

st.title("🚀 Sistem Klasifikasi Cerdas — Capstone AI")
st.markdown("Masukkan teks ulasan atau keluhan pelanggan untuk dianalisis oleh model secara real-time.")

# Contoh Preset Siap Klik
presets = [
    "Pelayanan CS sangat responsif dan ramah, masalah saya selesai 5 menit!",
    "Barang rusak pas dibuka dan sellernya tidak mau tanggung jawab sama sekali.",
    "Berapa lama proses pengiriman reguler ke luar pulau Jawa?"
]

selected_preset = st.selectbox("Atau pilih contoh teks di bawah ini:", ["-- Ketik Sendiri --"] + presets)
user_input = st.text_area("Teks Input:", value="" if selected_preset == "-- Ketik Sendiri --" else selected_preset, height=100)

if st.button("Analisis Sentimen Sekarang", type="primary"):
    if user_input.strip():
        with st.spinner("Model sedang memproses..."):
            # Simulasi respons dari CapstonePredictor
            # res = predictor.predict(user_input)
            st.success(f"Hasil Analisis: **Keluhan Positif** (Keyakinan: 94.8%)")
            st.caption("⏱️ Waktu Inferensi: 12.4 ms")
            
            # Tampilkan Grafik Distribusi Probabilitas
            chart_data = pd.DataFrame({
                'Kategori': ['Negatif', 'Netral', 'Positif'],
                'Probabilitas (%)': [2.1, 3.1, 94.8]
            })
            st.bar_chart(chart_data.set_index('Kategori'))
    else:
        st.warning("Silakan ketikkan teks terlebih dahulu.")`,
          explanation: 'Aplikasi web interaktif lengkap yang siap dideploy ke cloud untuk showcase portofolio publik.',
        },
      ],
    },
    stepByStepInstructions: [
      'Instal streamlit atau gradio via pip.',
      'Buat file app.py yang mengintegrasikan modul CapstonePredictor.',
      'Tambahkan tombol aksi, visualisasi chart probabilitas, dan contoh preset teks.',
      'Jalankan server demo lokal dengan perintah streamlit run app.py di terminal.',
      'Uji coba aplikasi di browser pada alamat http://localhost:8501.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Streamlit / Gradio', type: 'tool', url: 'https://streamlit.io/', description: 'Framework antarmuka web interaktif Python' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Web Demo', description: 'Bangun dan jalankan aplikasi web demo interaktif berbasis Streamlit/Gradio yang terhubung ke model Capstone Anda.' },
      { title: 'Feature Explanation Widget', description: 'Tambahkan widget di Streamlit yang menampilkan 3 kata paling berpengaruh terhadap hasil prediksi kalimat tersebut.', isStretch: true },
    ],
    deliverables: [
      'File aplikasi web app.py.',
      'Screenshot aplikasi demo web yang menampilkan hasil analisis teks interaktif.',
    ],
    checklist: [
      { id: 'c1', label: 'Aplikasi web mengimpor modul inferensi mandiri dari Hari 94', isRequired: true },
      { id: 'c2', label: 'Tersedia tombol aksi, hasil keyakinan, dan visualisasi chart', isRequired: true },
      { id: 'c3', label: 'Contoh preset teks disediakan untuk kemudahan pengujian', isRequired: true },
    ],
    definitionOfDone: [
      'Aplikasi web demo berfungsi mulus secara lokal dan siap dideploy ke internet publik.',
    ],
    reflectionQuestions: [
      'Mengapa menyertakan contoh kalimat siap klik (*preset examples*) sangat penting bagi kenyamanan pengunjung portofolio?',
      'Bagaimana perbedaan arsitektur antara Streamlit (Python UI) vs Frontend React terpisah yang memanggil FastAPI backend?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 96 untuk mempublikasikan aplikasi Anda ke internet gratis di Deployment Day.',
  },
  {
    id: 'day-096',
    day: 96,
    phaseId: 7,
    title: 'Deployment Day',
    shortDescription: 'Mempublikasikan aplikasi ke internet: Deploy gratis ke Streamlit Community Cloud atau Hugging Face Spaces.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Mempersiapkan repositori GitHub untuk deployment cloud otomatis: requirements.txt dan file konfigurasi runtime.',
      'Mendistribusikan aplikasi secara publik 100% gratis menggunakan Streamlit Community Cloud atau Hugging Face Spaces.',
      'Mengonfigurasi Git LFS (Large File Storage) jika file bobot model berukuran di atas 25 MB.',
      'Memverifikasi bahwa aplikasi online dapat diakses oleh siapa saja di seluruh dunia melalui tautan URL publik.',
    ],
    theoryContent: `### Menghidupkan Portofolio di Internet Global
Sebuah proyek di laptop Anda hanya dilihat oleh Anda sendiri.
Sebuah proyek yang memiliki **URL aktif (live URL)** yang dapat diklik dari resume atau profil LinkedIn Anda membuktikan bahwa Anda menguasai siklus penuh end-to-end:
1. **Streamlit Community Cloud**: Otomatis mendeploy dari repo GitHub Anda dalam 2 menit. Setiap kali Anda melakukan \`git push\`, aplikasi online langsung ter-update secara otomatis (*Continuous Deployment*).
2. **Hugging Face Spaces**: Tempat berkumpulnya para peneliti dan praktisi AI dunia. Sangat cocok untuk memamerkan model Transformer dan demo Gradio/Streamlit.`,
    practicalWalkthrough: {
      summary: 'Kunci requirements.txt, push repositori ke GitHub publik, dan hubungkan ke Streamlit Cloud atau Hugging Face Spaces.',
      environment: 'Terminal / GitHub / Streamlit Cloud (share.streamlit.io)',
      codeSnippets: [
        {
          title: 'Deployment Preparation Commands',
          language: 'bash',
          code: `# 1. Pastikan requirements.txt bersih tanpa library lokal yang tidak perlu
cat << EOF > requirements.txt
streamlit>=1.35.0
scikit-learn>=1.4.0
joblib>=1.3.0
pandas>=2.2.0
EOF

# 2. Commit dan Push ke GitHub
git add requirements.txt app.py src/ models/
git commit -m "feat: Siapkan konfigurasi deployment cloud"
git push origin main

# 3. Langkah di Streamlit Cloud:
# - Buka share.streamlit.io
# - Pilih Repositori GitHub Anda
# - Tentukan Main file path: app.py
# - Klik Deploy! Selesai dalam 2 menit.`,
          explanation: 'Menyusun dependensi minimal yang kompatibel untuk proses build container cloud otomatis.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buat file requirements.txt yang hanya memuat dependensi yang dibutuhkan oleh aplikasi web.',
      'Pastikan model artefak tersimpan di repositori (jika berukuran besar, unduh via script atau simpan di release asset).',
      'Masuk ke share.streamlit.io atau huggingface.co/spaces.',
      'Hubungkan repositori GitHub Anda dan luncurkan proses deployment.',
      'Salin URL publik yang dihasilkan (misal: https://my-capstone-ai.streamlit.app).',
      'Uji coba membuka URL tersebut dari ponsel pintar atau tab browser incognito.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Streamlit Community Cloud', type: 'tool', url: 'https://share.streamlit.io/', description: 'Platform hosting aplikasi Python gratis' },
      { name: 'Hugging Face Spaces', type: 'tool', url: 'https://huggingface.co/spaces', description: 'Hosting demo AI terkemuka' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Deployment Publik', description: 'Deploy aplikasi Capstone Anda ke internet dan dapatkan live URL publik yang berfungsi normal.' },
      { title: 'Custom Favicon & Meta Tags', description: 'Kustomisasi judul tab browser, ikon favicon, dan deskripsi pratinjau media sosial pada aplikasi web Anda.', isStretch: true },
    ],
    deliverables: [
      'Live URL publik aplikasi Capstone yang dapat diakses dari internet.',
      'Repositori GitHub yang terhubung dengan status deployment aktif.',
    ],
    checklist: [
      { id: 'c1', label: 'File requirements.txt terkonfigurasi dengan versi paket yang kompatibel', isRequired: true },
      { id: 'c2', label: 'Aplikasi berhasil ter-deploy ke cloud tanpa build error', isRequired: true },
      { id: 'c3', label: 'Tautan URL publik berfungsi normal saat dibuka dari perangkat lain', isRequired: true },
    ],
    definitionOfDone: [
      'Aplikasi AI Capstone resmi mengudara di internet global dan dapat diakses publik.',
    ],
    reflectionQuestions: [
      'Apa kendala paling umum saat mendeploy model deep learning ke cloud gratis (misal batasan memori RAM container)?',
      'Bagaimana cara mengamankan aplikasi web agar tidak diserang spam request otomatis di internet publik?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 97 untuk menguji seluruh fitur dan membasmi bug di Testing & Bug Fixing.',
  },
  {
    id: 'day-097',
    day: 97,
    phaseId: 7,
    title: 'Testing & Bug Fixing',
    shortDescription: 'Memperbaiki celah akhir: Pengujian lintas browser & mobile, penanganan latency, memory leaks, dan error recovery.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Menguji aplikasi live di berbagai ukuran layar: desktop monitor, tablet, dan layar ponsel pintar (*mobile responsiveness*).',
      'Mengidentifikasi dan membasmi bug tampilan UI, teks terpotong, atau tombol yang tidak merespons.',
      'Memeriksa konsumsi memori server agar aplikasi tidak mengalami restart mendadak (Out-Of-Memory / OOM kill).',
      'Menambahkan pesan panduan yang jelas jika pengguna memasukkan format data yang tidak didukung.',
    ],
    theoryContent: `### Memoles Aplikasi Menjadi Standar Produksi Tanpa Cacat
Banyak proyek mahasiswa atau pemula tampak bagus di laptop pembuatnya, tetapi hancur saat dibuka di ponsel atau saat koneksi internet lambat:
- Teks judul bertumpuk di layar vertikal smartphone.
- Tidak ada indikator pemrosesan (*loading spinner*) sehingga pengguna mengira aplikasi macet dan menekan tombol berulang-ulang.
- Error traceback Python mentah bocor ke layar pengguna jika terjadi anomali input.

Tahap Hari 97 adalah tentang **Polish & Reliability**:
Memastikan aplikasi Anda terasa kokoh, cepat, ramah seluler, dan profesional dari sudut pandang pengguna awam.`,
    practicalWalkthrough: {
      summary: 'Lakukan audit QA menyeluruh pada aplikasi live menggunakan browser developer tools (mode mobile) dan perbaiki bug yang ditemukan.',
      environment: 'Browser DevTools / VS Code',
      codeSnippets: [
        {
          title: 'Defensive UI Exception Wrapper',
          language: 'python',
          code: `# Memastikan traceback internal tidak pernah bocor ke pengguna di UI
try:
    with st.spinner("Model sedang memproses inferensi..."):
        result = predictor.predict(user_text)
        if result['status'] == 'success':
            st.success(f"Hasil: {result['prediction']}")
        else:
            st.warning(result['message'])
except Exception as e:
    # Tangkap error tak terduga dengan pesan ramah
    st.error("Maaf, terjadi kendala saat memproses teks Anda. Silakan coba kembali dengan kalimat lain.")
    # Log error internal ke terminal backend untuk investigasi developer
    print(f"[INTERNAL ERROR LOG]: {e}")`,
          explanation: 'Melindungi antarmuka pengguna dari tampilan crash layar merah Python.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buka URL publik aplikasi Anda di Google Chrome desktop.',
      'Buka DevTools (F12) dan aktifkan mode "Device Toolbar" (ikon smartphone).',
      'Uji coba seluruh tombol dan interaksi pada resolusi layar iPhone dan Android.',
      'Coba masukkan input teks aneh dan pastikan aplikasi tetap menampilkan pesan panduan yang ramah.',
      'Lakukan git commit dan push untuk setiap perbaikan bug yang dilakukan.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Chrome DevTools', type: 'tool', description: 'Simulasi mobile view dan audit performa' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Audit Kualitas', description: 'Uji aplikasi di perangkat mobile dan buktikan seluruh widget responsif tanpa ada elemen yang rusak.' },
      { title: 'Lighthouse Performance Audit', description: 'Jalankan Google Lighthouse pada aplikasi web demo Anda dan perbaiki skor Accessibility hingga di atas 85.', isStretch: true },
    ],
    deliverables: [
      'Log daftar bug yang ditemukan dan tindakan perbaikan yang dilakukan.',
      'Screenshot aplikasi web yang tampil sempurna di layar ponsel.',
    ],
    checklist: [
      { id: 'c1', label: 'Aplikasi diuji coba pada tampilan mobile viewport', isRequired: true },
      { id: 'c2', label: 'Indikator loading spinner aktif saat model memproses inferensi', isRequired: true },
      { id: 'c3', label: 'Tidak ada unhandled exception crash atau traceback merah yang muncul di UI', isRequired: true },
    ],
    definitionOfDone: [
      'Aplikasi live terverifikasi stabil, responsif seluler, dan bebas dari cacat visual utama.',
    ],
    reflectionQuestions: [
      'Mengapa menyembunyikan raw error traceback dari layar pengguna adalah aturan standar keamanan software?',
      'Bagaimana pengalaman Anda memperbaiki aplikasi hingga benar-benar mulus digunakan orang lain?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 98 untuk menyusun dokumentasi portofolio profesional di Write a Professional README.',
  },
  {
    id: 'day-098',
    day: 98,
    phaseId: 7,
    title: 'Write a Professional README',
    shortDescription: 'Etalase portofolio GitHub: Struktur dokumentasi kelas dunia — arsitektur sistem, metrik benchmark, petunjuk instalasi, dan live demo badges.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Menulis file README.md kelas dunia yang membuat recruiter dan engineer lain terkesan dalam 30 detik pertama.',
      'Menyusun struktur baku: Judul Proyek, Live Demo Badges, Ringkasan Masalah, Diagram Arsitektur, Hasil Metrik Kuantitatif, dan Panduan Instalasi Lokal.',
      'Menyematkan animasi GIF demonstrasi atau tangkapan layar antarmuka aplikasi.',
      'Menyertakan lisensi open-source (MIT License) dan informasi atribusi.',
    ],
    theoryContent: `### README.md Adalah CV Teknis Anda yang Sebenarnya!
90% perekrut kerja atau engineering lead hanya akan membuka halaman repositori GitHub Anda dan membaca file \`README.md\`.
Jika README Anda kosong, atau hanya berisi tulisan default *"# My Project"*, mereka akan langsung menutup tab dalam 5 detik.

Anatomi README Kelas Dunia:
1. **Header & Badges**: Nama proyek mencolok + Badge Status Deploy (Streamlit, Python 3.10+, Lisensi MIT, Live Demo URL).
2. **Visual Hook**: GIF atau gambar antarmuka demo yang menarik di bagian paling atas.
3. **Problem & Business Value**: Mengapa proyek ini dibuat dan siapa yang diuntungkan?
4. **Leaderboard Table**: Bukti kuantitatif bahwa model Anda melampaui baseline model.
5. **How to Run Locally**: Perintah bash 3 langkah yang benar-benar bisa di-copy-paste orang lain tanpa error.`,
    practicalWalkthrough: {
      summary: 'Susun file README.md lengkap dan profesional mengikuti standar industri teratas untuk repositori Capstone Anda.',
      environment: 'VS Code / Markdown Editor / GitHub',
      codeSnippets: [
        {
          title: 'Professional Capstone README.md Template',
          language: 'markdown',
          code: `# 🚀 Sistem Klasifikasi Sentimen Konsumen Cerdas (IndoBERT + XAI)

[![Live Demo](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://my-capstone-ai.streamlit.app)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Sistem machine learning end-to-end untuk mendeteksi, mengkategorikan, dan menganalisis urgensi keluhan konsumen berbahasa Indonesia secara real-time.

---

## 🌟 Fitur Utama
- **Model Mutakhir**: Fine-tuned IndoBERT teroptimasi dengan kuantisasi INT8 (hemat memori 75%).
- **Explainable AI (XAI)**: Visualisasi atribusi kata terpenting yang memicu keputusan model.
- **Tahan Banting**: Dilengkapi modul pembersih bahasa gaul, penanganan typo, dan validasi input defensif.
- **Web Demo Interaktif**: Dibangun dengan antarmuka Streamlit yang responsif desktop & mobile.

---

## 📊 Hasil Benchmark Kuantitatif
Model akhir berhasil mengungguli baseline model linier sebesar **+9.8% F1-score**:

| Model | Macro F1 | Akurasi | Latensi / Sampel | Ukuran Model |
| :--- | :---: | :---: | :---: | :---: |
| Dummy Baseline | 0.332 | 48.0% | < 0.1 ms | - |
| TF-IDF + Logistic Reg | 0.814 | 82.1% | 0.4 ms | 3.2 MB |
| Random Forest (Tuned) | 0.835 | 84.3% | 4.8 ms | 18.5 MB |
| **IndoBERT INT8 (Final)** | **0.912** | **91.8%** | **14.2 ms** | **110 MB** |

---

## 💻 Panduan Instalasi Lokal
\`\`\`bash
# 1. Kloning repositori
git clone https://github.com/username/capstone-ml-ai.git
cd capstone-ml-ai

# 2. Buat virtual environment & install dependensi
python -m venv .venv
source .venv/bin/activate  # Di Windows: .venv\\Scripts\\activate
pip install -r requirements.txt

# 3. Jalankan aplikasi web lokal
streamlit run app.py
\`\`\``,
          explanation: 'Format dokumentasi profesional yang memancarkan kompetensi dan kesiapan industri.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan template di atas dan sesuaikan dengan data riil proyek Capstone Anda.',
      'Sematkan link demo publik yang telah aktif dari Hari 96.',
      'Sertakan tabel hasil benchmark kuantitatif yang jujur dari hasil eksperimen Anda.',
      'Tambahkan file screenshot aplikasi ke folder assets/ dan tautkan di dalam README.',
      'Commit dan push ke GitHub, lalu periksa tampilan formatting markdown di browser.',
    ],
    requiredToolsAndDatasets: [
      { name: 'GitHub Markdown & Shields.io', type: 'tool', url: 'https://shields.io/', description: 'Pembuat badge status dokumentasi repositori' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Dokumentasi README', description: 'Tulis dan publikasikan README.md profesional lengkap dengan live demo badge, tabel metrik, dan panduan instalasi.' },
      { title: 'Architecture Diagram', description: 'Buat diagram alur arsitektur sistem menggunakan Mermaid.js di dalam README atau diagram visual di Excalidraw.', isStretch: true },
    ],
    deliverables: [
      'File README.md yang tampil memukau di halaman utama repositori GitHub Anda.',
      'Diagram alur arsitektur data dan inferensi.',
    ],
    checklist: [
      { id: 'c1', label: 'README memiliki judul jelas, ringkasan masalah, dan live demo link', isRequired: true },
      { id: 'c2', label: 'Tabel metrik kuantitatif membandingkan model dengan baseline', isRequired: true },
      { id: 'c3', label: 'Petunjuk instalasi lokal dapat direproduksi tanpa error dependensi', isRequired: true },
    ],
    definitionOfDone: [
      'Repositori GitHub memiliki dokumentasi kelas dunia yang siap dipamerkan ke profesional industri.',
    ],
    reflectionQuestions: [
      'Mengapa menyajikan tabel perbandingan metrik secara jujur jauh lebih dihormati recruiter dibanding klaim sepihak tanpa angka?',
      'Bagaimana diagram visual arsitektur membantu orang non-teknis memahami alur kerja AI Anda?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 99 untuk membuka brankas data uji yang terkunci di Final Evaluation.',
  },
  {
    id: 'day-099',
    day: 99,
    phaseId: 7,
    title: 'Final Evaluation',
    shortDescription: 'Momen kebenaran: Membuka data test set (test.csv) yang terkunci sejak Hari 87 untuk mengukur performa generalisasi sejati.',
    difficulty: 'Advanced',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Membuka data test set (test.csv) yang sama sekali belum pernah dilihat oleh model maupun proses tuning.',
      'Menjalankan model final HANYA SATU KALI pada data uji untuk mendapatkan angka generalisasi murni tanpa bias.',
      'Membandingkan hasil performa test set vs validation set: memastikan tidak terjadi overfitting ke validation set.',
      'Menulis laporan evaluasi final objektif dan menandatangani sertifikat integritas data.',
    ],
    theoryContent: `### Momen Pembuktian Ilmiah Sejati: Test Set Evaluation
Sejak Hari 87, Anda telah mendisiplinkan diri untuk **TIDAK PERNAH MENYENTUH** file \`data/processed/test.csv\`.
Hari ini adalah hari di mana brankas tersebut dibuka:
- Jika performa pada Test Set berada di rentang $\\pm 1-2\\%$ dari skor Validation Set, berarti model Anda adalah **GENERALISATOR SEJATI**.
- Jika skor tiba-tiba anjlok drastis (misal dari F1 91% di val menjadi 74% di test), berarti Anda telah melakukan *Overfitting to Validation Set* selama proses tuning hyperparameter.

Kejujuran Intelektual:
Apapun hasil skor test set hari ini, itulah angka kebenaran sejati model Anda di dunia nyata. Laporkan angka tersebut dengan bangga dan transparan!`,
    practicalWalkthrough: {
      summary: 'Jalankan evaluasi inferensi tunggal pada test.csv, cetak classification report komprehensif, dan verifikasi gap generalisasi.',
      environment: 'Jupyter Notebook / Python Script',
      codeSnippets: [
        {
          title: 'Final Test Set Evaluation Script',
          language: 'python',
          code: `import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, f1_score
import joblib

# 1. Buka Brankas Data Uji Murni
test_df = pd.read_csv("data/processed/test.csv")
print(f"🔓 MEMBUKA TEST SET: {len(test_df)} sampel yang belum pernah dilihat model.")

# 2. Muat Model Final
model = joblib.load("models/final_capstone_model.joblib")

# 3. Jalankan Prediksi Tunggal Akhir
y_test_true = test_df['target']
y_test_pred = model.predict(test_df['text'])

# 4. Laporan Final
final_f1 = f1_score(y_test_true, y_test_pred, average='macro')
print("\\n" + "="*50)
print(f"🏁 HASIL AKHIR GENERALISASI TEST SET:")
print(f"Macro F1-Score : {final_f1:.4f}")
print("="*50 + "\\n")

print("Laporan Klasifikasi Komprehensif:")
print(classification_report(y_test_true, y_test_pred, digits=4))`,
          explanation: 'Menguji performa model pada data masa depan murni yang belum pernah terkontaminasi oleh eksperimen.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buka notebook 05_capstone_final_test.ipynb.',
      'Muat data/processed/test.csv.',
      'Jalankan prediksi menggunakan model final dari Hari 92.',
      'Cetak Classification Report dan Confusion Matrix data uji.',
      'Hitung selisih gap skor: |F1_val - F1_test|.',
      'Perbarui tabel di README dengan angka test set final yang terverifikasi.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Test Set Permanen (test.csv)', type: 'dataset', description: 'Data evaluasi terisolasi sejak Hari 87' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Evaluasi Akhir', description: 'Jalankan evaluasi pada test set dan laporkan skor Macro F1 serta generalisasi gap secara jujur.' },
      { title: 'Per-Class Error Deep Dive', description: 'Analisis kelas mana yang memiliki skor F1 terendah pada test set dan berikan penjelasan penyebab linguistik/fiturnya.', isStretch: true },
    ],
    deliverables: [
      'Notebook 05_capstone_final_test.ipynb dengan output eksekusi test set final.',
      'Laporan metrik performa akhir yang tidak dapat diubah lagi.',
    ],
    checklist: [
      { id: 'c1', label: 'Test set dievaluasi HANYA SEKALI tanpa ada iterasi coba-coba susulan', isRequired: true },
      { id: 'c2', label: 'Classification report mencakup Precision, Recall, dan F1 per kelas', isRequired: true },
      { id: 'c3', label: 'Selisih performa validation vs test dianalisis secara objektif', isRequired: true },
    ],
    definitionOfDone: [
      'Model Capstone terbukti secara ilmiah memiliki performa generalisasi sejati yang terverifikasi.',
    ],
    reflectionQuestions: [
      'Berapa gap perbedaan skor antara validation set dan test set Anda? Apakah model terbukti tahan generalisasi?',
      'Bagaimana rasa kepuasan Anda menjaga integritas data pengujian tetap murni hingga hari ke-99?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 100 untuk merayakan kelulusan dan mempublikasikan karya nyata Anda di Final Showcase!',
  },
  {
    id: 'day-100',
    day: 100,
    phaseId: 7,
    title: 'Final Showcase',
    shortDescription: 'Puncak 100 Hari: Publikasi artefak portofolio lengkap, tulisan refleksi perjalanan 100 hari, sertifikat pencapaian, dan showcase karya ke publik.',
    difficulty: 'Advanced',
    estimatedDuration: '90 Menit',
    isProject: true,
    projectMilestoneId: 'capstone',
    learningObjectives: [
      'Menuntaskan seluruh 100 hari kurikulum praktis Machine Learning & AI.',
      'Memvalidasi kelengkapan artefak Capstone: repositori GitHub publik, live interactive web app, dan README profesional.',
      'Menulis esai refleksi komprehensif: evaluasi transformasi dari Intermediate menjadi Practitioner tangguh.',
      'Membagikan karya portofolio ke LinkedIn / X / Komunitas AI untuk membuka peluang karier nyata.',
    ],
    theoryContent: `### HARI 100: ANDA BUKAN LAGI ORANG YANG SAMA!
100 hari yang lalu, Anda memulai perjalanan ini dari setup lingkungan Python dan menginspeksi dataset tabular pertama di Hari 01.
Lihat apa yang telah Anda taklukkan selama 100 hari penuh disiplin:
- **Fase 1**: Pipeline Scikit-Learn anti-leakage, baseline modeling, dan metrik presisi.
- **Fase 2**: Pohon keputusan, XGBoost, Optuna hyperparameter tuning, dan Explainable AI (SHAP).
- **Fase 3**: Clustering tanpa label, reduksi dimensi PCA, dan deteksi anomali.
- **Fase 4**: Deep learning PyTorch dari nol, autograd, CNN computer vision, dan transfer learning ResNet.
- **Fase 5**: NLP tokenization, self-attention mathematics, Transformer architecture, dan fine-tuning IndoBERT.
- **Fase 6**: Generative AI, prompt engineering, structured output Pydantic, vector database ChromaDB, dan RAG anti-halusinasi ber-sitasi.
- **Fase 7**: Membangun Capstone Project end-to-end lengkap dengan aplikasi web ter-deploy dan audit evaluasi ilmiah murni!

Anda telah membuktikan bahwa konsistensi mengalahkan bakat. Karya Anda nyata, portofolio Anda hidup, dan Anda resmi menjadi **Savage ML & AI Practitioner**!`,
    practicalWalkthrough: {
      summary: 'Tulis esai refleksi 100 hari, pastikan tautan portofolio dan demo Capstone tersimpan di tab Portofolio aplikasi ini, dan bagikan ringkasan pencapaian ke publik.',
      environment: 'Aplikasi Web 100 Days Lab / LinkedIn / GitHub',
      codeSnippets: [
        {
          title: 'Template Refleksi 100 Hari Pembelajaran',
          language: 'markdown',
          code: `# REFLEKSI PERJALANAN 100 DAYS TO ML & AI
- Nama Praktisi: [Nama Anda]
- Tanggal Mulai: [Challenge Start Date]
- Tanggal Selesai: [Hari Ini]
- Total XP Terkumpul: [XP Ledger]
- Capstone Project: [Judul Capstone Anda]
- Live Demo URL: [Tautan Aplikasi Online]
- GitHub Repository: [Tautan Repositori Kode]

## 1. TRANSFORMASI PALING BERMAKNA
Konsep paling mengubah cara berpikir saya adalah...

## 2. KENDALA TERBESAR & CARA SAYA MENAKLUKKANNYA
Momen ketika kode atau model paling membuat saya frustrasi terjadi pada... dan solusinya adalah...

## 3. ARTEFAK NYATA YANG SAYA MILIKI HARI INI
Bukan sekadar sertifikat kosong, saya memiliki 6 Mini-Projects dan 1 Full Capstone yang hidup di internet...

## 4. LANGKAH BERIKUTNYA DALAM KARIER SAYA
Rencana saya untuk memanfaatkan keahlian ini adalah...`,
          explanation: 'Esai refleksi tertulis yang mendokumentasikan pertumbuhan kompetensi dan kedewasaan rekayasa software AI Anda.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buka tab Portofolio di aplikasi ini dan pastikan semua data Capstone Project (metrik, repo URL, demo URL) terisi lengkap.',
      'Tuliskan esai refleksi pembelajaran Anda di formulir catatan Hari 100.',
      'Klik tombol "Tandai Selesai" untuk menyelesaikan misi ke-100 dan membuka Achievement 100-Day Finisher!',
      'Bagikan pencapaian Anda ke profil LinkedIn atau media sosial bersama tautan live demo Capstone Anda.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Portofolio Repositori GitHub & Live App', type: 'doc', description: 'Karya nyata hasil 100 hari pembelajaran' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Puncak Capstone', description: 'Tuntaskan Hari 100 dengan mendokumentasikan tautan repositori, live demo URL, dan esai refleksi tertulis lengkap.' },
      { title: 'Public Showcase Post', description: 'Tulis postingan ringkasan profesional di LinkedIn yang membagikan apa yang Anda bangun selama 100 hari beserta link demo.', isStretch: true },
    ],
    deliverables: [
      'Tautan Repositori GitHub Proyek Capstone Final.',
      'Tautan Live Web App yang aktif dan dapat dicoba.',
      'Esai refleksi tertulis lengkap di catatan portofolio.',
      'Status kurikulum 100/100 (100% Complete) di aplikasi ini.',
    ],
    checklist: [
      { id: 'c1', label: 'Repositori GitHub Capstone dilengkapi README profesional', isRequired: true },
      { id: 'c2', label: 'Live Demo Web App aktif di internet dan dapat diakses publik', isRequired: true },
      { id: 'c3', label: 'Esai refleksi tertulis diselesaikan di catatan modul', isRequired: true },
      { id: 'c4', label: 'Tautan proyek disimpan secara permanen di tab Portofolio', isRequired: true },
    ],
    definitionOfDone: [
      'Kurikulum 100 Days to ML & AI resmi diselesaikan dengan integritas tinggi dan bukti karya portofolio nyata.',
      'Gelar Savage ML Finisher resmi diraih!',
    ],
    reflectionQuestions: [
      'Bagaimana perasaan Anda melihat kembali perjalanan dari Hari 01 hingga mencapai Hari 100 hari ini?',
      'Apa nasihat paling berharga yang akan Anda berikan kepada diri Anda di masa lalu yang baru memulai hari pertama?',
    ],
    suggestedNextStep: 'Selamat! Anda telah resmi menamatkan 100 Days to ML & AI — Savage Learning Lab. Terus bangun karya nyata dan jangan pernah berhenti berinovasi!',
  },
];
