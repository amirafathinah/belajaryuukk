/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumModule } from '../../types/curriculum';

export const PHASE_1_MODULES: CurriculumModule[] = [
  {
    id: 'day-001',
    day: 1,
    phaseId: 1,
    title: 'ML Project Setup',
    shortDescription: 'Inisialisasi lingkungan kerja machine learning modern, virtual environment, dan standar struktur direktori proyek standar industri.',
    difficulty: 'Beginner',
    estimatedDuration: '60 Menit',
    learningObjectives: [
      'Membuat virtual environment Python terisolasi (venv atau conda).',
      'Menginstal dependensi inti ML: numpy, pandas, scikit-learn, matplotlib, seaborn, jupyter.',
      'Menyusun struktur direktori proyek standar reproduktif (data/, notebooks/, src/, models/).',
      'Mengunci dependensi versi menggunakan requirements.txt dan verifikasi instalasi CUDA/CPU.',
    ],
    theoryContent: `### Mengapa ML Project Setup Begitu Penting?
Banyak proyek ML gagal bukan karena matematika yang salah, melainkan **dependency hell** dan struktur folder yang berantakan sehingga tidak dapat direproduksi (*reproducibility crisis*).

Prinsip Utama:
1. **Isolasi Lingkungan**: Jangan pernah menginstal paket ML ke lingkungan global OS. Gunakan \`python -m venv .venv\` atau Conda.
2. **Struktur Terpisah**: Pisahkan data mentah (\`raw\`) yang bersifat *read-only* dari data yang sudah diproses (\`processed\`).
3. **Reproducibility**: Catat versi spesifik di \`requirements.txt\` atau \`pyproject.toml\` dan tentukan seed (\`random_state\`) sejak awal.`,
    practicalWalkthrough: {
      summary: 'Setup folder proyek ML terstruktur dan uji eksekusi import modul serta cek environment info.',
      environment: 'Terminal Lokal / VS Code / Google Colab',
      codeSnippets: [
        {
          title: 'Bash Setup Script',
          language: 'bash',
          code: `# Buat folder proyek & virtual environment
mkdir ml-savage-lab && cd ml-savage-lab
python3 -m venv .venv
source .venv/bin/activate  # Linux/macOS atau .venv\\Scripts\\activate di Windows

# Install dependensi dasar
pip install --upgrade pip
pip install numpy pandas scikit-learn matplotlib seaborn jupyterlab`,
          explanation: 'Membuat isolasi sistem untuk memastikan versi scikit-learn dan pandas tidak konflik dengan pustaka lain.',
        },
        {
          title: '01_check_environment.py',
          language: 'python',
          code: `import sys
import numpy as np
import pandas as pd
import sklearn

print(f"Python version : {sys.version.split()[0]}")
print(f"NumPy version  : {np.__version__}")
print(f"Pandas version : {pd.__version__}")
print(f"Scikit-learn   : {sklearn.__version__}")

# Buat folder direktori jika belum ada
import os
for folder in ["data/raw", "data/processed", "notebooks", "src", "models"]:
    os.makedirs(folder, exist_ok=True)
print("Struktur folder berhasil dibuat!")`,
          explanation: 'Memvalidasi instalasi dan menghasilkan scaffold folder proyek secara otomatis.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buka terminal atau buat notebook baru di Google Colab / VS Code.',
      'Jalankan script pembuatan virtual environment dan instal paket yang disyaratkan.',
      'Eksekusi script verifikasi untuk memastikan semua package berhasil diimpor tanpa warning broken install.',
      'Inisialisasi git repository lokal dengan file .gitignore yang mengecualikan folder .venv/, data/, dan file model berukuran besar.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Python 3.10+', type: 'tool', description: 'Runtime interpreter utama' },
      { name: 'JupyterLab / VS Code / Colab', type: 'tool', description: 'Lingkungan interaktif notebook' },
      { name: 'Scikit-Learn Docs', type: 'doc', url: 'https://scikit-learn.org/stable/', description: 'Dokumentasi resmi' },
    ],
    tasksAndChallenges: [
      { title: 'Task Utama', description: 'Jalankan script verifikasi environment dan buat struktur folder 5 level (data/raw, data/processed, notebooks, src, models).' },
      { title: 'Tantangan Tambahan (Stretch)', description: 'Tambahkan file Makefile atau bash script "run_setup.sh" yang otomatis menjalankan testing instalasi dalam satu perintah.', isStretch: true },
    ],
    deliverables: [
      'Screenshot terminal atau notebook yang menampilkan versi library yang sukses diinstal.',
      'File requirements.txt berisi daftar dependensi terkunci.',
      'Repositori git lokal dengan file .gitignore yang rapi.',
    ],
    checklist: [
      { id: 'c1', label: 'Virtual environment berhasil dibuat dan diaktivasi', isRequired: true },
      { id: 'c2', label: 'Paket numpy, pandas, scikit-learn, matplotlib berhasil diinstal', isRequired: true },
      { id: 'c3', label: 'Struktur folder proyek berhasil dibuat', isRequired: true },
      { id: 'c4', label: 'File .gitignore dikonfigurasi untuk mengecualikan data besar dan cache', isRequired: false },
    ],
    definitionOfDone: [
      'Script verifikasi berjalan tanpa error import (exit code 0).',
      'Folder proyek memiliki direktori data/raw, notebooks, src, dan models.',
      'Semua checklist wajib tercentang.',
    ],
    reflectionQuestions: [
      'Mengapa file dataset mentah sebaiknya tidak pernah dimodifikasi secara in-place?',
      'Apa konsekuensi jika versi library ML tidak dikunci dalam requirements.txt saat dideploy?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 02 untuk melakukan inspeksi investigasi dataset pertama.',
  },
  {
    id: 'day-002',
    day: 2,
    phaseId: 1,
    title: 'Dataset Detective',
    shortDescription: 'Teknik Exploratory Data Analysis (EDA) sistematis untuk membongkar tipe data, skewness, anomali, dan korelasi tersembunyi.',
    difficulty: 'Beginner',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami tipe-tipe fitur: numerik kontinu, diskrit, kategorikal nominal, dan ordinal.',
      'Menghitung statistik ringkasan 5-angka (Tukey 5-number summary) dan mendeteksi skewness.',
      'Mengidentifikasi outlier menggunakan aturan IQR (Interquartile Range) dan Z-score.',
      'Menganalisis matriks korelasi Pearson dan Spearman untuk menemukan fitur yang berpotensi redundan.',
    ],
    theoryContent: `### Menjadi Detektif Data Sebelum Membangun Model
"Garbage In, Garbage Out". Memasukkan data mentah langsung ke algoritma ML tanpa memahami distribusinya adalah kesalahan pemula nomor satu.

Metrik Deteksi Krusial:
- **Skewness Positif/Negatif**: Jika skewness > 1 atau < -1, data memiliki ekor panjang (butuh log transform atau Box-Cox).
- **Kardinalitas Kategorikal**: Kolom kategorikal dengan 1000+ kategori unik (high cardinality) berbahaya bagi One-Hot Encoding.
- **Multikolinearitas**: Dua fitur dengan korelasi Pearson > 0.9 dapat mengacaukan estimasi bobot model linier.`,
    practicalWalkthrough: {
      summary: 'Lakukan audit menyeluruh pada dataset California Housing atau Titanic untuk menemukan anomali dan korelasi.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Dataset Audit Script',
          language: 'python',
          code: `import pandas as pd
import numpy as np
from sklearn.datasets import fetch_california_housing

# Muat dataset
housing = fetch_california_housing(as_frame=True)
df = housing.frame

# 1. Inspeksi bentuk dan tipe
print(f"Dimensi data: {df.shape}")
print("\\nMissing values per kolom:\\n", df.isnull().sum())

# 2. Deteksi skewness
print("\\nSkewness kolom numerik:\\n", df.skew().round(2))

# 3. Hitung korelasi dengan target (MedHouseVal)
correlations = df.corr()['MedHouseVal'].sort_values(ascending=False)
print("\\nKorelasi terhadap Target:\\n", correlations)`,
          explanation: 'Mendeteksi fitur dengan korelasi tertinggi terhadap harga rumah dan mencari variabel dengan distribusi miring (skewed).',
        },
      ],
    },
    stepByStepInstructions: [
      'Muat dataset California Housing atau dataset tabular pilihan Anda ke pandas DataFrame.',
      'Jalankan fungsi df.info(), df.describe(include="all"), dan cek persentase missing value.',
      'Gunakan seaborn pairplot atau heatmap korelasi untuk memvisualisasikan hubungan antar variabel.',
      'Buat daftar temuan "Red Flags": fitur mana yang paling skewed, mana yang memiliki outlier ekstrim.',
    ],
    requiredToolsAndDatasets: [
      { name: 'California Housing Dataset', type: 'dataset', description: 'Tersedia langsung di sklearn.datasets' },
      { name: 'Pandas & Seaborn', type: 'tool', description: 'Manipulasi dan visualisasi distribusi' },
    ],
    tasksAndChallenges: [
      { title: 'Audit Laporan EDA', description: 'Tulis ringkasan 5 poin kunci dari dataset: 1 target, 2 fitur paling berpengaruh, 1 fitur anomali, dan 1 rekomendasi transformasi.' },
      { title: 'IQR Outlier Filter', description: 'Hitung batas bawah (Q1 - 1.5*IQR) dan batas atas (Q3 + 1.5*IQR) untuk variabel MedInc dan hitung jumlah outlier.', isStretch: true },
    ],
    deliverables: [
      'Jupyter notebook berisi visualisasi distribusi (histogram/boxplot) dan heatmap korelasi.',
      'Catatan teks 5 poin investigasi data di bagian notes.',
    ],
    checklist: [
      { id: 'c1', label: 'Dataset berhasil dimuat dan diperiksa bentuk serta missing value-nya', isRequired: true },
      { id: 'c2', label: 'Distribusi dan skewness fitur numerik telah dihitung', isRequired: true },
      { id: 'c3', label: 'Heatmap korelasi telah dibuat dan dianalisis', isRequired: true },
      { id: 'c4', label: 'Mencatat minimal 3 hipotesis awal mengenai fitur penting', isRequired: false },
    ],
    definitionOfDone: [
      'Notebook berhasil mengeksekusi analisis statistik deskriptif dan menghasilkan visualisasi tanpa error.',
      'Terdapat interpretasi tertulis dari korelasi fitur terhadap target.',
    ],
    reflectionQuestions: [
      'Mengapa korelasi Pearson tinggi tidak selalu berarti ada hubungan sebab-akibat (kausalitas)?',
      'Kapan median lebih representatif daripada mean sebagai ukuran pemusatan data?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 03 untuk membersihkan missing value dan menangani anomali data.',
  },
  {
    id: 'day-003',
    day: 3,
    phaseId: 1,
    title: 'Data Cleaning Challenge',
    shortDescription: 'Strategi penanganan missing values (MCAR, MAR, MNAR), encoding kategorikal, dan deteksi data duplikat.',
    difficulty: 'Beginner',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Membedakan mekanisme hilangnya data: Missing Completely at Random (MCAR) vs Missing at Random (MAR).',
      'Menerapkan SimpleImputer (mean, median, most_frequent) dan KNNImputer.',
      'Mencegah data leakage: menghitung nilai imputasi HANYA pada data training.',
      'Menangani duplikasi baris dan inkonsistensi string/kategorikal.',
    ],
    theoryContent: `### Aturan Emas Data Cleaning: Jangan Biarkan Data Testing Bocor!
Kesalahan fatal yang sering dilakukan praktisi adalah mengisi missing value menggunakan mean dari **seluruh dataset** sebelum split train-test.

Mekanisme Missing Value:
- **MCAR**: Hilang tanpa pola (misal sensor terputus sesaat). Aman diimputasi dengan median/mean.
- **MAR**: Hilang berkaitan dengan fitur lain (misal wanita lebih jarang mengisi kolom berat badan).
- **MNAR**: Hilang berkaitan dengan nilai itu sendiri (misal orang berpenghasilan super tinggi menolak mengisi kolom gaji).

Prinsip Pemisahan:
\`train_df\` dihitung mean/median-nya, lalu angka tersebut diaplikasikan pada \`test_df\`.`,
    practicalWalkthrough: {
      summary: 'Gunakan SimpleImputer dan KNNImputer pada dataset yang memiliki missing values nyata (misal Titanic).',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Leak-Free Imputation',
          language: 'python',
          code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer, KNNImputer

# Contoh dengan data sintetis missing
df = pd.DataFrame({
    'age': [22, 38, np.nan, 35, np.nan, 54, 2],
    'fare': [7.25, 71.28, 8.05, 53.1, 8.45, 51.86, 21.07],
    'survived': [0, 1, 1, 1, 0, 0, 1]
})

# 1. SPLIT DULU SEBELUM IMPUTASI!
X_train, X_test, y_train, y_test = train_test_split(
    df[['age', 'fare']], df['survived'], test_size=0.3, random_state=42
)

# 2. Fit HANYA pada X_train, transform pada keduanya
imputer = SimpleImputer(strategy='median')
X_train_clean = imputer.fit_transform(X_train)
X_test_clean = imputer.transform(X_test)  # Pakai transform, BUKAN fit_transform!

print("Median dari Train yang digunakan:", imputer.statistics_)`,
          explanation: 'Menjamin tidak ada statistik data uji yang bocor ke proses pelatihan model.',
        },
      ],
    },
    stepByStepInstructions: [
      'Muat dataset yang memiliki banyak missing values (misalnya Titanic dari seaborn / kaggle).',
      'Hitung persentase nilai null di setiap kolom.',
      'Bagi dataset menjadi data latih (75%) dan data uji (25%) menggunakan train_test_split.',
      'Terapkan SimpleImputer(strategy="median") untuk fitur numerik dan strategy="most_frequent" untuk kategorikal.',
      'Bandingkan hasilnya jika menggunakan KNNImputer(n_neighbors=5).',
    ],
    requiredToolsAndDatasets: [
      { name: 'Titanic Dataset', type: 'dataset', description: 'Tersedia via seaborn.load_dataset("titanic")' },
      { name: 'Scikit-learn Impute', type: 'tool', description: 'SimpleImputer & KNNImputer' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Imputasi', description: 'Terapkan strategi imputasi yang berbeda pada kolom numerik dan kategorikal, lalu verifikasi tidak ada NaN tersisa.' },
      { title: 'Tantangan KNNImputer', description: 'Evaluasi waktu komputasi KNNImputer vs SimpleImputer dan amati perbedaannya pada distribusi data hasil imputasi.', isStretch: true },
    ],
    deliverables: [
      'Notebook yang menunjukkan perbandingan sebelum dan sesudah pembersihan data.',
      'Output assert df.isnull().sum().sum() == 0 sebagai bukti tidak ada data bocor/kosong.',
    ],
    checklist: [
      { id: 'c1', label: 'Train-test split dilakukan sebelum kalkulasi imputasi nilai', isRequired: true },
      { id: 'c2', label: 'Imputasi numerik dan kategorikal diterapkan dengan benar', isRequired: true },
      { id: 'c3', label: 'Verifikasi tidak ada missing values tersisa di train maupun test', isRequired: true },
    ],
    definitionOfDone: [
      'Kode imputasi dijalankan tanpa error dan mengikuti kaidah anti-data-leakage.',
      'Dataset bersih siap digunakan untuk tahap feature engineering.',
    ],
    reflectionQuestions: [
      'Kapan menghapus baris (dropna) lebih bijak daripada mengisi nilai (imputasi)?',
      'Mengapa memanggil fit_transform pada data uji merupakan dosa besar dalam machine learning?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 04 untuk mengekstrak fitur bernilai tinggi dari data mentah.',
  },
  {
    id: 'day-004',
    day: 4,
    phaseId: 1,
    title: 'Feature Engineering Lab',
    shortDescription: 'Membuat fitur turunan, interaksi variabel, binning, dan scaling (StandardScaler vs RobustScaler).',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Membuat fitur interaksi rasio dan perkalian (domain-specific features).',
      'Memahami perbedaan StandardScaler, MinMaxScaler, dan RobustScaler (tahan outlier).',
      'Menerapkan One-Hot Encoding vs Ordinal Encoding pada fitur kategorikal.',
      'Menganalisis dampak scaling terhadap performa algoritma berbasis jarak (KNN, SVM, Regresi Linier).',
    ],
    theoryContent: `### Seni Feature Engineering: Mengajari Algoritma Berpikir
Algoritma machine learning hanya memahami angka. Feature engineering adalah proses mentransformasikan data mentah menjadi representasi yang mempermudah model menemukan sinyal.

Teknik Kunci:
1. **Feature Crossing / Rasio**: Pada data rumah, \`rooms_per_household = total_rooms / households\` jauh lebih prediktif daripada jumlah kamar mentah.
2. **Feature Scaling**:
   - \`StandardScaler\`: Mengubah mean=0, std=1 (sensitif terhadap outlier).
   - \`RobustScaler\`: Menggunakan median dan IQR (sangat tangguh terhadap outlier).
   - \`MinMaxScaler\`: Membatasi rentang [0, 1] (wajib untuk data citra atau jaringan syaraf tiruan).`,
    practicalWalkthrough: {
      summary: 'Buat 3 fitur rasio baru pada California Housing dan bandingkan distribusi sebelum dan sesudah RobustScaler.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Feature Engineering & Scaling',
          language: 'python',
          code: `import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.preprocessing import StandardScaler, RobustScaler

housing = fetch_california_housing(as_frame=True)
df = housing.frame.copy()

# 1. Feature Interaction / Ratios
df['rooms_per_household'] = df['AveRooms'] / df['AveOccup']
df['bedrooms_ratio'] = df['AveBedrms'] / df['AveRooms']
df['income_per_occupant'] = df['MedInc'] / df['AveOccup']

# 2. Scaling dengan RobustScaler untuk menahan outlier
scaler = RobustScaler()
scaled_features = scaler.fit_transform(df[['rooms_per_household', 'bedrooms_ratio', 'income_per_occupant']])
scaled_df = pd.DataFrame(scaled_features, columns=['rooms_sc', 'beds_sc', 'inc_sc'])

print(scaled_df.describe().round(2))`,
          explanation: 'Menciptakan representasi sinyal bisnis yang lebih kaya dan menormalisasi skala data.',
        },
      ],
    },
    stepByStepInstructions: [
      'Ambil dataset California Housing atau dataset perbankan / retail.',
      'Buat minimal 2 fitur baru berbasis domain knowledge (misal rasio hutang/pendapatan, kamar per penghuni).',
      'Uji distribusi fitur baru menggunakan boxplot.',
      'Bandingkan output StandardScaler vs RobustScaler pada fitur yang memiliki outlier ekstrim.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Preprocessing', type: 'tool', description: 'StandardScaler, RobustScaler, OneHotEncoder' },
      { name: 'California Housing', type: 'dataset', description: 'Dataset standar benchmark regresi' },
    ],
    tasksAndChallenges: [
      { title: 'Feature Creation', description: 'Buat minimal 2 fitur turunan baru yang memiliki korelasi lebih tinggi terhadap target dibanding fitur aslinya.' },
      { title: 'Outlier Resistance Test', description: 'Bandingkan mean dan varians hasil StandardScaler vs RobustScaler pada data yang disisipi nilai outlier ekstrem.', isStretch: true },
    ],
    deliverables: [
      'Visualisasi boxplot sebelum vs sesudah scaling.',
      'Tabel ringkasan korelasi fitur baru terhadap variabel target.',
    ],
    checklist: [
      { id: 'c1', label: 'Minimal 2 fitur baru berhasil dibuat dari kombinasi fitur yang ada', isRequired: true },
      { id: 'c2', label: 'Scaler di-fit hanya pada data training dan ditransformasikan ke test', isRequired: true },
      { id: 'c3', label: 'Dampak scaling pada distribusi fitur telah diverifikasi', isRequired: true },
    ],
    definitionOfDone: [
      'Dataset memiliki fitur baru yang valid tanpa nilai infinity atau NaN.',
      'Kode scaling terisolasi tanpa ada leakage.',
    ],
    reflectionQuestions: [
      'Apakah Decision Tree membutuhkan feature scaling? Mengapa ya atau tidak?',
      'Kapan One-Hot Encoding menjadi tidak praktis digunakan?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 05 untuk membangun model baseline pertama sebagai patokan.',
  },
  {
    id: 'day-005',
    day: 5,
    phaseId: 1,
    title: 'Your First Baseline',
    shortDescription: 'Membangun DummyClassifier / DummyRegressor sebagai patokan dasar evaluasi sebelum menggunakan model kompleks.',
    difficulty: 'Beginner',
    estimatedDuration: '60 Menit',
    learningObjectives: [
      'Memahami esensi baseline model: patokan terendah yang harus dikalahkan oleh model ML apa pun.',
      'Menggunakan DummyClassifier (strategi: most_frequent, stratified) dan DummyRegressor (mean, median).',
      'Menghindari ilusi akurasi semu (accuracy paradox) pada data tidak seimbang.',
      'Menetapkan metrik keberhasilan proyek (North Star Metric).',
    ],
    theoryContent: `### Mengapa Model Pertama Anda Harus "Bodoh"?
Jika Anda memprediksi kanker langka dengan prevalensi 1%, menebak "TIDAK KANKER" untuk semua pasien akan menghasilkan akurasi 99%!
Model ML yang menghasilkan akurasi 98% sebenarnya **tidak berguna** jika baseline model yang hanya menebak kelas mayoritas mendapatkan 99%.

Prinsip Baseline:
- Selalu bangun model naive terlebih dahulu.
- Jika model kompleks Anda tidak bisa mengalahkan DummyRegressor atau tebakan rata-rata, proyek Anda belum menghasilkan nilai tambah.`,
    practicalWalkthrough: {
      summary: 'Bangun baseline DummyClassifier pada dataset klasifikasi dan hitung skor acuan dasar.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Naive Baseline Benchmark',
          language: 'python',
          code: `from sklearn.dummy import DummyClassifier, DummyRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error
import numpy as np

# Contoh pada data klasifikasi biner dengan ketidakseimbangan kelas
X = np.random.randn(1000, 5)
y = np.random.choice([0, 1], size=1000, p=[0.90, 0.10]) # 90% kelas 0

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Buat baseline yang selalu menebak kelas terbanyak
dummy = DummyClassifier(strategy="most_frequent")
dummy.fit(X_train, y_train)
y_pred_dummy = dummy.predict(X_test)

print(f"Baseline Accuracy: {accuracy_score(y_test, y_pred_dummy):.4f}")
print(f"Baseline Macro F1: {f1_score(y_test, y_pred_dummy, average='macro'):.4f}")`,
          explanation: 'Menunjukkan bahwa akurasi tinggi (0.90) bisa menyesatkan, sedangkan F1-score mengungkap bahwa baseline sama sekali tidak mendeteksi kelas 1.',
        },
      ],
    },
    stepByStepInstructions: [
      'Pilih dataset target (misal dataset churn pelanggan atau prediksi harga rumah).',
      'Bagi data menjadi train dan test set dengan random_state tetap.',
      'Latih DummyClassifier atau DummyRegressor sesuai tipe masalah.',
      'Hitung dan catat skor metrik baseline: ini adalah skor minimum yang wajib dilampaui.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-Learn Dummy Estimators', type: 'tool', description: 'DummyClassifier & DummyRegressor' },
      { name: 'Kaggle Titanic / Churn Dataset', type: 'dataset', description: 'Dataset klasifikasi biner' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Baseline', description: 'Latih DummyRegressor (strategy="mean") pada California Housing dan catat RMSE dasarnya.' },
      { title: 'Uji Banding', description: 'Bandingkan strategy="mean" vs strategy="median" pada data yang memiliki target terdistribusi miring.', isStretch: true },
    ],
    deliverables: [
      'Catatan nilai skor baseline (RMSE atau Macro F1) di jurnal atau notebook.',
      'Argumen tertulis mengapa metrik tersebut dipilih sebagai patokan.',
    ],
    checklist: [
      { id: 'c1', label: 'Baseline dummy model berhasil dilatih pada data latih', isRequired: true },
      { id: 'c2', label: 'Metrik acuan dihitung pada data uji yang belum pernah dilihat model', isRequired: true },
      { id: 'c3', label: 'Nilai patokan minimal dicatat sebagai batas ambang keberhasilan', isRequired: true },
    ],
    definitionOfDone: [
      'Ada angka kuantitatif baseline terukur yang siap dibandingkan dengan model sebenarnya.',
    ],
    reflectionQuestions: [
      'Mengapa klien bisnis sering terkecoh oleh laporan akurasi 95%?',
      'Kapan tebakan median lebih baik sebagai baseline daripada tebakan rata-rata?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 06 untuk melatih model regresi riil dan melampaui baseline.',
  },
  {
    id: 'day-006',
    day: 6,
    phaseId: 1,
    title: 'Regression in Practice',
    shortDescription: 'Linear Regression, Ridge (L2), dan Lasso (L1). Memahami koefisien, intercept, dan penyusutan bobot (shrinkage).',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Mengimplementasikan LinearRegression, Ridge, dan Lasso dari Scikit-Learn.',
      'Memahami penalti L2 (Ridge) untuk mengatasi multikolinearitas vs L1 (Lasso) untuk seleksi fitur otomatis.',
      'Mengevaluasi model regresi menggunakan MAE, MSE, RMSE, dan R-squared.',
      'Menganalisis koefisien model untuk interpretasi bobot pengaruh fitur.',
    ],
    theoryContent: `### Linear vs Regularized Regression
Persamaan Regresi Linier Standar meminimalkan SSE (*Sum of Squared Errors*). Namun jika fitur berkorelasi tinggi, bobot koefisien bisa meledak menjadi sangat besar.

Solusi Regularisasi:
1. **Ridge (Penalti L2)**: Menambahkan $\\lambda \\sum \\beta_i^2$ ke fungsi loss. Menyusutkan bobot mendekati nol tetapi tidak pernah benar-benar nol.
2. **Lasso (Penalti L1)**: Menambahkan $\\lambda \\sum |\\beta_i|$. Mampu memaksa koefisien fitur yang tidak penting menjadi **tepat nol**, menjadikannya fitur selector otomatis!
3. **Kapan menggunakan apa?** Jika banyak fitur tidak relevan -> Lasso. Jika banyak fitur saling berkorelasi -> Ridge.`,
    practicalWalkthrough: {
      summary: 'Latih Linear, Ridge, dan Lasso pada California Housing, bandingkan koefisien dan nilai RMSE.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Ridge vs Lasso Comparison',
          language: 'python',
          code: `from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.metrics import root_mean_squared_error, r2_score
import pandas as pd

# Asumsi X_train, X_test, y_train, y_test sudah distandarisasi
lr = LinearRegression().fit(X_train, y_train)
ridge = Ridge(alpha=10.0).fit(X_train, y_train)
lasso = Lasso(alpha=0.1).fit(X_train, y_train)

models = {'Linear': lr, 'Ridge': ridge, 'Lasso': lasso}
for name, m in models.items():
    pred = m.predict(X_test)
    rmse = root_mean_squared_error(y_test, pred)
    r2 = r2_score(y_test, pred)
    zero_coefs = sum(m.coef_ == 0)
    print(f"{name:8s} | RMSE: {rmse:.4f} | R2: {r2:.4f} | Fitur Nol: {zero_coefs}")`,
          explanation: 'Memperlihatkan perbandingan performa dan membuktikan kemampuan Lasso mengeliminasi fitur menjadi nol.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset California Housing yang sudah diskalakan (StandardScaler wajib untuk regularisasi!).',
      'Latih model LinearRegression, Ridge, dan Lasso.',
      'Plot koefisien dari ketiga model untuk melihat efek penyusutan bobot.',
      'Hitung metrik RMSE dan bandingkan dengan baseline DummyRegressor dari Hari 05.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Linear Model', type: 'tool', description: 'Ridge, Lasso, LinearRegression' },
      { name: 'California Housing', type: 'dataset', description: 'Data regresi harga properti' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Regresi', description: 'Buktikan bahwa Ridge atau Lasso menghasilkan test RMSE lebih rendah daripada Linear Regression tanpa regularisasi.' },
      { title: 'Alpha Tuning Loop', description: 'Buat loop nilai alpha [0.001, 0.01, 0.1, 1, 10, 100] untuk Lasso dan temukan berapa banyak fitur yang disusutkan menjadi nol pada tiap nilai alpha.', isStretch: true },
    ],
    deliverables: [
      'Plot perbandingan koefisien fitur (Horizontal Bar Chart).',
      'Tabel metrik evaluasi MAE, RMSE, dan R2 untuk ketiga model.',
    ],
    checklist: [
      { id: 'c1', label: 'Fitur telah distandarisasi sebelum dilatih ke Ridge/Lasso', isRequired: true },
      { id: 'c2', label: 'Linear, Ridge, dan Lasso berhasil dilatih dan dievaluasi pada test set', isRequired: true },
      { id: 'c3', label: 'Performa berhasil melampaui skor baseline Hari 05', isRequired: true },
    ],
    definitionOfDone: [
      'Model regresi berhasil mengalahkan baseline model.',
      'Analisis koefisien menunjukkan fitur paling berpengaruh terhadap target.',
    ],
    reflectionQuestions: [
      'Mengapa scaling wajib dilakukan sebelum melatih model Ridge atau Lasso?',
      'Apa arti fisis dari nilai R-squared yang negatif pada data uji?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 07 untuk menguasai klasifikasi dan probabilitas output.',
  },
  {
    id: 'day-007',
    day: 7,
    phaseId: 1,
    title: 'Classification in Practice',
    shortDescription: 'Logistic Regression, decision boundary, kalibrasi probabilitas predict_proba, dan threshold tuning awal.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami fungsi Sigmoid dan bagaimana regresi logistik memodelkan log-odds.',
      'Menggunakan model.predict() vs model.predict_proba() untuk pengambilan keputusan fleksibel.',
      'Memvisualisasikan decision boundary pada 2 fitur utama.',
      'Mengatur hyperparameter regularisasi C (inverse of regularization strength).',
    ],
    theoryContent: `### Klasifikasi Bukan Sekadar Label: Pahami Probabilitas!
Dalam bisnis nyata (misalnya fraud detection atau diagnosis medis), label biner 0 atau 1 seringkali tidak cukup. Kita memerlukan estimasi probabilitas:
$$P(Y=1|X) = \\frac{1}{1 + e^{-(\\beta_0 + \\beta^T X)}}$$

Aturan Ambang Batas Default (Threshold = 0.5):
Jika $P > 0.5$ maka Kelas 1. Namun, pada deteksi penipuan kartu kredit, kita mungkin ingin menurunkan threshold ke 0.2 agar menangkap lebih banyak transaksi mencurigakan, meskipun meningkatkan false alarm.`,
    practicalWalkthrough: {
      summary: 'Latih LogisticRegression pada data klasifikasi dan amati distribusi probabilitas prediksinya.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Logistic Regression with Custom Threshold',
          language: 'python',
          code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

# Inisialisasi dan fit
clf = LogisticRegression(C=1.0, max_iter=1000, random_state=42)
clf.fit(X_train, y_train)

# Dapatkan probabilitas kelas 1 (bukan cuma label 0/1)
probabilities = clf.predict_proba(X_test)[:, 1]

# Coba threshold kustom 0.3 (lebih sensitif)
custom_preds = (probabilities >= 0.3).astype(int)

print("Confusion Matrix (Threshold 0.3):")
print(confusion_matrix(y_test, custom_preds))
print("\\nLaporan Klasifikasi:")
print(classification_report(y_test, custom_preds))`,
          explanation: 'Menunjukkan cara menggunakan predict_proba untuk memanipulasi sensitivitas model terhadap kelas positif.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset Titanic atau dataset Breast Cancer dari sklearn.datasets.',
      'Bagi data menjadi train dan test set.',
      'Latih model LogisticRegression dengan solver="lbfgs".',
      'Ekstrak nilai probabilitas menggunakan .predict_proba(X_test).',
      'Plot histogram sebaran probabilitas untuk melihat seberapa percaya diri model memisahkan kedua kelas.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Breast Cancer Wisconsin Dataset', type: 'dataset', description: 'Klasifikasi biner tumor jinak vs ganas' },
      { name: 'Scikit-learn LogisticRegression', type: 'tool', description: 'Model linier untuk klasifikasi' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Probabilitas', description: 'Tampilkan 5 sampel data di mana model paling ragu-ragu (probabilitas berada di rentang 0.45 - 0.55).' },
      { title: 'Tantangan Threshold Sweep', description: 'Plot kurva Precision vs Recall pada variasi threshold 0.1 sampai 0.9.', isStretch: true },
    ],
    deliverables: [
      'Histogram distribusi nilai predict_proba.',
      'Confusion matrix pada threshold 0.5 vs threshold 0.3.',
    ],
    checklist: [
      { id: 'c1', label: 'LogisticRegression berhasil di-fit dan dievaluasi', isRequired: true },
      { id: 'c2', label: 'Probabilitas diekstrak menggunakan predict_proba', isRequired: true },
      { id: 'c3', label: 'Dampak perubahan threshold terhadap false positive/negative dianalisis', isRequired: true },
    ],
    definitionOfDone: [
      'Model menghasilkan evaluasi klasifikasi yang jelas dengan metrik Precision, Recall, dan F1.',
    ],
    reflectionQuestions: [
      'Mengapa log-odds diubah menjadi probabilitas menggunakan fungsi sigmoid?',
      'Pada skenario medis, mana yang lebih berbahaya: False Positive atau False Negative?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 08 untuk membedah metrik evaluasi secara komprehensif di Evaluation Lab.',
  },
  {
    id: 'day-008',
    day: 8,
    phaseId: 1,
    title: 'Evaluation Lab',
    shortDescription: 'Membedah Confusion Matrix, Precision, Recall, F1, ROC-AUC, dan PR-AUC. Jangan tertipu metrik tunggal.',
    difficulty: 'Intermediate',
    estimatedDuration: '90 Menit',
    learningObjectives: [
      'Menghitung dan menginterpretasikan True Positive (TP), FP, TN, dan FN.',
      'Memahami tradeoff antara Precision (kualitas tebakan) dan Recall (kelengkapan deteksi).',
      'Membuat dan menganalisis kurva ROC (Receiver Operating Characteristic) dan AUC.',
      'Mengetahui kapan harus memilih Precision-Recall AUC dibanding ROC-AUC (khusus data highly imbalanced).',
    ],
    theoryContent: `### Memilih Metrik yang Tepat Sesuai Dampak Bisnis
Seringkali praktisi pemula hanya melihat Akurasi. Namun di dunia nyata:
- **Precision**: $\\frac{TP}{TP + FP}$ -> "Dari semua yang kita curigai spam, berapa persen yang benar-benar spam?" (Penting jika biaya salah tuduh tinggi).
- **Recall**: $\\frac{TP}{TP + FN}$ -> "Dari semua pasien kanker nyata, berapa persen yang berhasil kita temukan?" (Penting jika konsekuensi kelolosan fatal).
- **F1-Score**: Harmonic mean dari Precision dan Recall.
- **ROC-AUC**: Mengukur kemampuan model memeringkat probabilitas di semua kemungkinan threshold.`,
    practicalWalkthrough: {
      summary: 'Plot ROC Curve dan Precision-Recall Curve secara bersamaan pada data uji dan bandingkan skor AUC-nya.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Comprehensive Metric Suite',
          language: 'python',
          code: `from sklearn.metrics import roc_curve, roc_auc_score, precision_recall_curve, average_precision_score
import matplotlib.pyplot as plt

# Dapatkan skor probabilitas
y_scores = clf.predict_proba(X_test)[:, 1]

# 1. ROC AUC
fpr, tpr, _ = roc_curve(y_test, y_scores)
roc_auc = roc_auc_score(y_test, y_scores)

# 2. Precision-Recall AUC
precision, recall, _ = precision_recall_curve(y_test, y_scores)
pr_auc = average_precision_score(y_test, y_scores)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
ax1.plot(fpr, tpr, label=f'ROC-AUC = {roc_auc:.3f}')
ax1.plot([0, 1], [0, 1], 'k--')
ax1.set_title('ROC Curve')
ax1.set_xlabel('False Positive Rate')
ax1.set_ylabel('True Positive Rate')
ax1.legend()

ax2.plot(recall, precision, label=f'PR-AUC = {pr_auc:.3f}', color='orange')
ax2.set_title('Precision-Recall Curve')
ax2.set_xlabel('Recall')
ax2.set_ylabel('Precision')
ax2.legend()
plt.tight_layout()
plt.show()`,
          explanation: 'Membuat dua kurva evaluasi standar emas untuk mengevaluasi ketahanan model klasifikasi.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan model klasifikasi dari Hari 07.',
      'Generate Confusion Matrix interaktif dengan ConfusionMatrixDisplay.',
      'Hitung Classification Report dengan output dict atau format rapi.',
      'Plot kurva ROC dan kurva PR bersebelahan.',
      'Identifikasi titik optimal (sweet spot threshold) yang menyeimbangkan precision dan recall.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Metrics', type: 'tool', description: 'classification_report, roc_curve, PR-curve' },
      { name: 'Matplotlib', type: 'tool', description: 'Visualisasi kurva evaluasi' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Evaluasi', description: 'Tuliskan rekomendasi threshold operasional berdasarkan skenario: "Biaya False Negative 5x lebih mahal dibanding False Positive".' },
      { title: 'Tantangan Kurva Imbalance', description: 'Uji model pada dataset dengan rasio kelas 98:2 dan buktikan ROC-AUC terlihat optimis berlebihan dibanding PR-AUC.', isStretch: true },
    ],
    deliverables: [
      'Gambar gabungan kurva ROC dan Precision-Recall.',
      'Tabel analisis dampak bisnis untuk 3 pilihan threshold berbeda (0.3, 0.5, 0.7).',
    ],
    checklist: [
      { id: 'c1', label: 'Confusion matrix berhasil diplot dan dianalisis', isRequired: true },
      { id: 'c2', label: 'Kurva ROC dan PR berhasil digambar dengan nilai AUC yang benar', isRequired: true },
      { id: 'c3', label: 'Threshold optimum ditentukan berdasarkan konsekuensi bisnis', isRequired: true },
    ],
    definitionOfDone: [
      'Semua metrik dievaluasi dengan pemahaman jelas mengenai trade-off antar metrik.',
    ],
    reflectionQuestions: [
      'Mengapa rata-rata harmonik (F1) digunakan alih-alih rata-rata aritmatika biasa untuk Precision dan Recall?',
      'Kapan ROC-AUC memberikan ilusi performa bagus padahal model sebenarnya gagal mendeteksi kelas minoritas?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 09 untuk mendeteksi overfitting dan mengaudit learning curve.',
  },
  {
    id: 'day-009',
    day: 9,
    phaseId: 1,
    title: 'Overfitting Detective',
    shortDescription: 'Menganalisis bias-variance tradeoff menggunakan learning curves, validation curves, dan gap train-vs-val.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Mengidentifikasi gejala Overfitting (High Variance) vs Underfitting (High Bias).',
      'Menggunakan learning_curve dari Scikit-Learn untuk memplot performa seiring pertambahan ukuran sampel.',
      'Menggunakan validation_curve untuk mendeteksi nilai hyperparameter yang menyebabkan over-kompleksitas.',
      'Menentukan strategi mitigasi yang tepat: menambah data vs menambah regularisasi.',
    ],
    theoryContent: `### Diagnosis Model: Apakah Model Anda Menghafal Data?
- **Underfitting (High Bias)**: Error training tinggi DAN error validation tinggi. Model terlalu sederhana (misal fitting garis lurus pada kurva polinomial derajat 4).
  *Solusi*: Tambah kapasitas model, tambah fitur, kurangi regularisasi.
- **Overfitting (High Variance)**: Error training mendekati 0, tetapi error validation sangat tinggi. Model menghafal noise data latih.
  *Solusi*: Tambah data training, lakukan feature selection, tambah penalti regularisasi (L1/L2), kurangi kedalaman pohon.`,
    practicalWalkthrough: {
      summary: 'Plot Learning Curve pada model kompleks vs model ter-regularisasi untuk melihat celah (gap) train-val.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Learning Curve Plotter',
          language: 'python',
          code: `from sklearn.model_selection import learning_curve
import numpy as np
import matplotlib.pyplot as plt

train_sizes, train_scores, val_scores = learning_curve(
    estimator=clf,
    X=X_train,
    y=y_train,
    train_sizes=np.linspace(0.1, 1.0, 5),
    cv=5,
    scoring='f1_macro',
    n_jobs=-1
)

train_mean = np.mean(train_scores, axis=1)
val_mean = np.mean(val_scores, axis=1)

plt.figure(figsize=(8, 5))
plt.plot(train_sizes, train_mean, 'o-', color='blue', label='Training Score')
plt.plot(train_sizes, val_mean, 's-', color='red', label='Cross-Validation Score')
plt.xlabel('Jumlah Data Training')
plt.ylabel('F1 Score')
plt.title('Learning Curve Diagnostik')
plt.legend()
plt.grid(True)
plt.show()`,
          explanation: 'Jika kurva training dan validasi memiliki gap lebar yang tidak menyempit, model mengalami overfitting.',
        },
      ],
    },
    stepByStepInstructions: [
      'Pilih model yang rentan overfit (misal DecisionTreeClassifier tanpa max_depth atau PolynomialRegression derajat tinggi).',
      'Generate learning curve dengan minimal 5 variasi ukuran dataset.',
      'Hitung gap skor akhir antara training set dan validation set.',
      'Terapkan teknik regularisasi dan buktikan gap tersebut menyempit.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Model Selection', type: 'tool', description: 'learning_curve, validation_curve' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Diagnosa', description: 'Tentukan apakah model Anda mengalami High Bias atau High Variance berdasarkan visualisasi learning curve.' },
      { title: 'Tantangan Gap Reduction', description: 'Ubah hyperparameter model hingga perbedaan (gap) skor train dan val kurang dari 0.05 tanpa menurunkan val score secara drastis.', isStretch: true },
    ],
    deliverables: [
      'Grafik Learning Curve dengan label dan interpretasi tertulis.',
      'Paragraf refleksi mengenai diagnosa bias vs variance.',
    ],
    checklist: [
      { id: 'c1', label: 'Learning curve dihitung menggunakan cross-validation', isRequired: true },
      { id: 'c2', label: 'Gap antara performa train dan validation diukur secara kuantitatif', isRequired: true },
      { id: 'c3', label: 'Tindakan mitigasi overfitting/underfitting diterapkan', isRequired: true },
    ],
    definitionOfDone: [
      'Dapat menjelaskan kondisi model (underfitting/overfitting) dengan bukti kurva empiris.',
    ],
    reflectionQuestions: [
      'Kapan penambahan jumlah data latih TIDAK AKAN membantu memperbaiki performa model?',
      'Mengapa model dengan training accuracy 100% hampir selalu dicurigai bermasalah?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 10 untuk membungkus preprocessing dan modeling ke dalam Scikit-Learn Pipeline.',
  },
  {
    id: 'day-010',
    day: 10,
    phaseId: 1,
    title: 'Pipeline Builder',
    shortDescription: 'Membangun pipeline scikit-learn modular dengan ColumnTransformer untuk menangani data numerik dan kategorikal secara bersih.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami arsitektur Pipeline dan ColumnTransformer di Scikit-Learn.',
      'Mengisolasi transformasi numerik (imputasi + scaling) dan kategorikal (imputasi + one-hot) secara paralel.',
      'Menjamin zero data leakage saat cross-validation maupun inferensi produksi.',
      'Menyimpan dan memuat seluruh pipeline sebagai satu unit utuh (joblib / pickle).',
    ],
    theoryContent: `### Mengapa Pipeline Adalah Standar Industri Wajib?
Menulis langkah preprocessing manual secara terpisah di Jupyter Notebook sangat rawan bug:
1. Anda lupa melakukan transformasi yang sama pada data baru di production.
2. Leakage terjadi saat cross-validation karena scaler di-fit sebelum data di-split per fold.

Dengan \`Pipeline\` dan \`ColumnTransformer\`:
- Seluruh langkah (imputer -> scaler -> encoder -> estimator) dienkapsulasi menjadi satu objek: \`pipeline.fit(X_train, y_train)\` dan \`pipeline.predict(X_new)\`.`,
    practicalWalkthrough: {
      summary: 'Bangun ColumnTransformer lengkap untuk data campuran numerik & kategorikal, lalu sambungkan ke estimator.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Production-Ready ML Pipeline',
          language: 'python',
          code: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

num_features = ['age', 'fare', 'sibsp']
cat_features = ['sex', 'embarked']

# 1. Pipeline untuk fitur numerik
num_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# 2. Pipeline untuk fitur kategorikal
cat_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

# 3. Gabungkan dalam ColumnTransformer
preprocessor = ColumnTransformer(transformers=[
    ('num', num_transformer, num_features),
    ('cat', cat_transformer, cat_features)
])

# 4. Final Full Pipeline
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(random_state=42))
])

full_pipeline.fit(X_train, y_train)
print(f"Test Accuracy: {full_pipeline.score(X_test, y_test):.4f}")`,
          explanation: 'Pipeline siap produksi yang menerima data mentah secara langsung dan menghasilkan prediksi terkalibrasi.',
        },
      ],
    },
    stepByStepInstructions: [
      'Identifikasi kolom numerik dan kategorikal dalam dataset pilihan Anda.',
      'Bangun sub-pipeline untuk numerik (imputer + scaler) dan kategorikal (imputer + one-hot).',
      'Satukan dengan ColumnTransformer.',
      'Tambahkan estimator model di akhir pipeline.',
      'Uji panggil .predict() dengan data sampel mentah berisi string dan missing value.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Compose & Pipeline', type: 'tool', description: 'Pipeline & ColumnTransformer' },
      { name: 'Joblib', type: 'tool', description: 'Serialisasi model machine learning' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Pipeline', description: 'Bangun full pipeline yang dapat menerima baris data mentah baru dalam format pandas DataFrame dan langsung mengeluarkan prediksi.' },
      { title: 'Tantangan Serialisasi', description: 'Simpan pipeline ke file "model.joblib", muat ulang dalam sesi Python terpisah, dan verifikasi output prediksi identik.', isStretch: true },
    ],
    deliverables: [
      'Kode pipeline lengkap tanpa script preprocessing manual di luar pipeline.',
      'File artefak tersimpan "model.joblib".',
    ],
    checklist: [
      { id: 'c1', label: 'ColumnTransformer berhasil memisahkan proses numerik dan kategorikal', isRequired: true },
      { id: 'c2', label: 'Pipeline utuh berhasil di-fit dari data mentah sampai tahap prediksi', isRequired: true },
      { id: 'c3', label: 'Pipeline diuji pada data sampel baru tanpa menimbulkan error', isRequired: true },
    ],
    definitionOfDone: [
      'Seluruh alur kerja preprocessing dan estimasi model terikat dalam 1 objek pipeline teruji.',
    ],
    reflectionQuestions: [
      'Mengapa parameter handle_unknown="ignore" pada OneHotEncoder sangat penting di production?',
      'Bagaimana pipeline mencegah data leakage selama proses k-fold cross validation?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 11 untuk mengevaluasi pipeline dengan K-Fold Cross-Validation yang kokoh.',
  },
  {
    id: 'day-011',
    day: 11,
    phaseId: 1,
    title: 'Cross-Validation Lab',
    shortDescription: 'K-Fold, Stratified K-Fold, TimeSeriesSplit, dan teknik evaluasi stabilitas varians model.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami mengapa single train-test split rentan terhadap bias pemilihan sampel (sampling luck).',
      'Menerapkan K-Fold CV dan Stratified K-Fold CV untuk menjaga proporsi label kelas.',
      'Memahami TimeSeriesSplit untuk data temporal agar tidak melihat masa depan (*lookahead bias*).',
      'Mengevaluasi mean dan standard deviation metrik performa lintas folds.',
    ],
    theoryContent: `### Jangan Percaya Pada Satu Kali Train-Test Split!
Jika Anda membagi data 80-20 sekali saja, performa 85% bisa jadi hanya kebetulan mendapatkan data uji yang mudah (*lucky split*).

Strategi Cross-Validation:
1. **Standard K-Fold**: Membagi data menjadi $K$ bagian. Latih pada $K-1$, uji pada 1 bagian sisa. Ulangi $K$ kali.
2. **Stratified K-Fold**: Wajib untuk klasifikasi, terutama data imbalance. Menjamin tiap fold memiliki rasio kelas yang sama persis dengan populasi.
3. **TimeSeriesSplit**: Untuk data sekuensial (harga saham, cuaca, log transaksi). Lipatan hanya boleh melatih data masa lalu untuk memprediksi masa depan!`,
    practicalWalkthrough: {
      summary: 'Jalankan 5-Fold Stratified Cross-Validation pada pipeline yang telah dibuat dan amati varians skor.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Stratified K-Fold with Pipeline',
          language: 'python',
          code: `from sklearn.model_selection import StratifiedKFold, cross_val_score
import numpy as np

# Gunakan pipeline dari Hari 10
cv_strategy = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Hitung skor lintas fold (Pipeline menjamin fit scaler terjadi per fold!)
scores = cross_val_score(
    estimator=full_pipeline,
    X=X,
    y=y,
    cv=cv_strategy,
    scoring='roc_auc',
    n_jobs=-1
)

print(f"Skor per Fold : {np.round(scores, 4)}")
print(f"Mean ROC-AUC  : {scores.mean():.4f}")
print(f"Std Dev       : {scores.std():.4f}")
print(f"95% Confidence Interval: [{scores.mean() - 2*scores.std():.4f}, {scores.mean() + 2*scores.std():.4f}]")`,
          explanation: 'Memberikan rentang estimasi performa statistik model yang jauh lebih reliabel daripada angka tunggal.',
        },
      ],
    },
    stepByStepInstructions: [
      'Terapkan cross_val_score dengan minimal 5 folds pada dataset Anda.',
      'Bandingkan K-Fold standar dengan Stratified K-Fold pada dataset klasifikasi.',
      'Catat rata-rata (mean) dan standar deviasi dari metrik evaluasi.',
      'Analisis jika ada satu fold tertentu yang skornya anjlok drastis (identifikasi fold outlier).',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Model Selection', type: 'tool', description: 'StratifiedKFold, cross_val_score' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Cross-Validation', description: 'Hitung mean dan confidence interval 95% dari skor F1 model Anda menggunakan 5-Fold CV.' },
      { title: 'Tantangan TimeSeries CV', description: 'Buat simulasi time series dan buktikan mengapa KFold standar menghasilkan skor bocor yang palsu dibanding TimeSeriesSplit.', isStretch: true },
    ],
    deliverables: [
      'Hasil printout 5 fold cross validation beserta mean dan standar deviasi.',
      'Penjelasan tertulis mengenai stabilitas model berdasarkan nilai variansnya.',
    ],
    checklist: [
      { id: 'c1', label: 'Cross-validation dijalankan bersama pipeline utuh', isRequired: true },
      { id: 'c2', label: 'Stratified CV digunakan untuk masalah klasifikasi', isRequired: true },
      { id: 'c3', label: 'Nilai mean dan standar deviasi dilaporkan dengan transparan', isRequired: true },
    ],
    definitionOfDone: [
      'Performa model dibuktikan stabil lintas 5 folds dengan rentang keyakinan yang wajar.',
    ],
    reflectionQuestions: [
      'Berapa nilai K yang umum digunakan dan apa kompromi antara K=5 vs K=10 vs Leave-One-Out?',
      'Mengapa shuffle=False wajib saat melakukan cross validation pada data deret waktu (time series)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 12 untuk menyelesaikan Mini-Project 1: Notebook Prediksi End-to-End!',
  },
  {
    id: 'day-012',
    day: 12,
    phaseId: 1,
    title: 'Mini-project 1: End-to-End Prediction Notebook',
    shortDescription: 'Proyek akhir Fase 1: Membangun notebook prediksi lengkap dari EDA, imputasi, feature engineering, pipeline, baseline, hingga evaluasi.',
    difficulty: 'Intermediate',
    estimatedDuration: '90 Menit',
    isProject: true,
    projectMilestoneId: 'proj-1',
    learningObjectives: [
      'Mengintegrasikan seluruh materi Hari 01 sampai 11 ke dalam satu notebook terstruktur profesional.',
      'Menerapkan baseline model dan membuktikan model akhir melampaui baseline minimal 10%.',
      'Membungkus alur preprocessing ke dalam Scikit-Learn Pipeline anti-leakage.',
      'Menulis laporan ringkas eksekutif mengenai temuan data dan dampak prediksi.',
    ],
    theoryContent: `### Mini-Project 1: Standar Portofolio Nyata
Sebuah notebook portofolio machine learning yang baik harus dapat dibaca oleh **engineer lain** maupun **manajer bisnis**:
1. **Business Problem Framing**: Apa masalah yang dipecahkan dan apa metrik kesuksesannya?
2. **Exploratory Insights**: Bukan cuma 20 chart tanpa arti, tapi 3 temuan paling tajam.
3. **Reproducible Pipeline**: Kode bersih yang bisa di-restart dan dijalankan ulang dari cell pertama sampai terakhir (*Restart & Run All*) tanpa error.
4. **Baseline Comparison**: Bukti empiris peningkatan performa dibanding naive baseline.`,
    practicalWalkthrough: {
      summary: 'Kompilasi notebook end-to-end lengkap, uji eksekusi dari atas ke bawah, simpan model artefak dan tulis ringkasan metrik.',
      environment: 'Jupyter Notebook / Google Colab / GitHub Gist',
      codeSnippets: [
        {
          title: 'Template Struktur Notebook Mini-Project 1',
          language: 'python',
          code: `# MINI-PROJECT 1: END-TO-END PREDICTION NOTEBOOK
# Author: Intermediate ML Practitioner
# Dataset: California Housing / Telco Churn / Titanic

# 1. SETUP & IMPORTS
# 2. DATA UNDERSTANDING & 3 KEY EDA FINDINGS
# 3. BASELINE MODEL EVALUATION (Patokan dasar)
# 4. LEAK-FREE PREPROCESSING PIPELINE
# 5. MODEL TRAINING & REGULARIZATION
# 6. 5-FOLD STRATIFIED CROSS VALIDATION RESULTS
# 7. ERROR ANALYSIS & FINAL TEST SET EVALUATION
# 8. BUSINESS CONCLUSION & NEXT STEPS`,
          explanation: 'Struktur profesional 8 bagian yang wajib diikuti untuk memenuhi kriteria portofolio industri.',
        },
      ],
    },
    stepByStepInstructions: [
      'Pilih salah satu dataset benchmark (California Housing untuk regresi, Titanic atau Telco Customer Churn untuk klasifikasi).',
      'Susun notebook mengikuti 8 bagian struktur standar di atas.',
      'Pastikan ada perbandingan eksplisit antara skor Baseline vs skor Final Model.',
      'Jalankan "Restart Kernel and Run All Cells" untuk membuktikan tidak ada bug urutan eksekusi.',
      'Unggah notebook ke repositori GitHub atau Google Drive dan salin tautannya ke portofolio aplikasi ini.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Dataset Pilihan (Churn / Housing / Titanic)', type: 'dataset', description: 'Dataset tabular publik' },
      { name: 'Scikit-Learn, Pandas, Matplotlib', type: 'tool', description: 'Stack lengkap ML dasar' },
      { name: 'GitHub / Colab', type: 'doc', description: 'Media penyimpanan portofolio' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Mini-Project 1', description: 'Selesaikan dan publikasikan notebook end-to-end yang mengungguli skor baseline dan memiliki pipeline modular.' },
      { title: 'Tantangan Model Artifact', description: 'Ekspor model terlatih menggunakan joblib bersama file metadata JSON berisi metrik performa akhir.', isStretch: true },
    ],
    deliverables: [
      'Tautan notebook (GitHub repo atau Google Colab publik).',
      'Ringkasan metrik performa akhir (Baseline vs Final Score).',
      'Catatan refleksi pembelajaran Fase 1.',
    ],
    checklist: [
      { id: 'c1', label: 'Notebook memiliki 8 struktur standar dan berjalan sukses dari cell 1 sampai akhir', isRequired: true },
      { id: 'c2', label: 'Ada perbandingan kuantitatif model vs baseline', isRequired: true },
      { id: 'c3', label: 'Seluruh transformasi dibungkus rapi dalam Scikit-Learn Pipeline', isRequired: true },
      { id: 'c4', label: 'Link repositori / notebook disimpan di halaman Portofolio Proyek', isRequired: true },
    ],
    definitionOfDone: [
      'Mini-project 1 selesai, diuji coba, dan tautan publik didokumentasikan di tab Portofolio.',
      'Fase 1 resmi tuntas!',
    ],
    reflectionQuestions: [
      'Apa tantangan terbesar yang Anda hadapi saat menyatukan seluruh alur ke dalam satu pipeline?',
      'Bagaimana perasaan Anda menyelesaikan proyek machine learning end-to-end pertama Anda?',
    ],
    suggestedNextStep: 'Selamat! Anda telah menaklukkan Fase 1. Besok kita melangkah ke Fase 2: Classical ML & Model Optimization (Decision Trees, Random Forest, XGBoost).',
  },
];
