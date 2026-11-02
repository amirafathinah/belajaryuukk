/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumModule } from '../../types/curriculum';

export const PHASE_3_MODULES: CurriculumModule[] = [
  {
    id: 'day-028',
    day: 28,
    phaseId: 3,
    title: 'Clustering Playground',
    shortDescription: 'Eksplorasi unsupervised learning dengan K-Means: Inisialisasi K-Means++, konvergensi centroid, dan batas asumsi spherical cluster.',
    difficulty: 'Intermediate',
    estimatedDuration: '70 Menit',
    learningObjectives: [
      'Memahami konsep unsupervised learning: menemukan struktur alami tanpa label target.',
      'Membedah algoritma Lloyd untuk K-Means (assignment step & update centroid step).',
      'Mengapa inisialisasi K-Means++ penting untuk menghindari local minima yang buruk.',
      'Memahami batasan K-Means pada bentuk cluster non-bulat atau densitas berbeda.',
    ],
    theoryContent: `### Menemukan Pola Tanpa Bimbingan Guru (Unsupervised)
K-Means meminimalkan inersia (Within-Cluster Sum of Squares / WCSS):
$$WCSS = \\sum_{i=1}^K \\sum_{x \\in C_i} ||x - \\mu_i||^2$$

Dua Langkah Iteratif:
1. **Assignment**: Setiap titik data dialokasikan ke centroid terdekat (jarak Euclidean).
2. **Update**: Centroid diperbarui menjadi posisi rata-rata (mean) seluruh anggota cluster.

Asumsi K-Means:
K-Means mengasumsikan cluster berbentuk bola (*spherical*) dengan varians dan ukuran serupa. Jika data berbentuk bulan sabit atau elips panjang, K-Means akan memotongnya secara keliru.`,
    practicalWalkthrough: {
      summary: 'Latih KMeans pada dataset 2D sintetis dan visualisasikan pergerakan posisi centroid.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'K-Means Clustering & Centroid Plot',
          language: 'python',
          code: `from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Buat data 3 cluster
X, _ = make_blobs(n_samples=500, centers=3, cluster_std=1.2, random_state=42)
X_scaled = StandardScaler().fit_transform(X)

# Latih K-Means dengan inisialisasi k-means++
kmeans = KMeans(n_clusters=3, init='k-means++', n_init=10, random_state=42)
labels = kmeans.fit_predict(X_scaled)
centroids = kmeans.cluster_centers_

# Visualisasi
plt.figure(figsize=(7, 5))
plt.scatter(X_scaled[:, 0], X_scaled[:, 1], c=labels, cmap='viridis', alpha=0.6, s=30)
plt.scatter(centroids[:, 0], centroids[:, 1], c='red', marker='X', s=200, label='Centroids', edgecolor='black')
plt.title(f"K-Means (Inersia: {kmeans.inertia_:.1f})")
plt.legend()
plt.show()`,
          explanation: 'Memperlihatkan alokasi titik-titik data ke masing-masing centroid pusat cluster.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan make_blobs untuk membuat cluster terkontrol.',
      'Skalakan fitur selalu menggunakan StandardScaler (K-Means berbasis jarak Euclidean).',
      'Latih KMeans dengan k=3 dan tampilkan koordinat cluster_centers_.',
      'Coba ganti init="random" vs init="k-means++" dan perhatikan stabilitas nilai inersia.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Cluster', type: 'tool', description: 'KMeans, make_blobs' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas K-Means', description: 'Visualisasikan pembagian 4 cluster pada dataset buatan dan plot titik centroid merah.' },
      { title: 'Tantangan Non-Spherical', description: 'Gunakan make_moons dan tunjukkan secara visual bagaimana K-Means gagal memisahkan cluster non-linear.', isStretch: true },
    ],
    deliverables: [
      'Scatter plot visualisasi cluster beserta centroid.',
      'Catatan nilai inersia pada berbagai inisialisasi.',
    ],
    checklist: [
      { id: 'c1', label: 'Data distandarisasi sebelum K-Means', isRequired: true },
      { id: 'c2', label: 'Inisialisasi k-means++ digunakan', isRequired: true },
      { id: 'c3', label: 'Centroid berhasil diekstrak dan diplot', isRequired: true },
    ],
    definitionOfDone: [
      'Memahami mekanisme kerja matematis K-Means dan batas-batas asumsinya.',
    ],
    reflectionQuestions: [
      'Mengapa nilai inersia akan selalu menurun ketika jumlah K dinaikkan hingga K=N?',
      'Mengapa scaling wajib mutlak dilakukan sebelum menjalankan K-Means?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 29 untuk menentukan jumlah K optimal secara ilmiah di Find the Right K.',
  },
  {
    id: 'day-029',
    day: 29,
    phaseId: 3,
    title: 'Find the Right K',
    shortDescription: 'Menemukan jumlah cluster optimal: Metode Siku (Elbow Method), Koefisien Silhouette, dan Davies-Bouldin Index.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami mengapa menentukan K tidak bisa sekadar tebak-tebakan.',
      'Membuat grafik Elbow Method (Inersia vs K) dan mencari titik tekuk.',
      'Menghitung dan memvisualisasikan Silhouette Score (-1 hingga +1) dan Silhouette Analysis per cluster.',
      'Menggunakan Davies-Bouldin Index (makin rendah makin baik) sebagai metrik pembanding.',
    ],
    theoryContent: `### Bagaimana Cara Mengetahui Ada Berapa Cluster?
Karena tidak ada label ground truth, kita membutuhkan metrik validasi internal:
1. **Elbow Method**: Mencari titik penurunan inersia yang melambat tajam (membentuk siku). Namun seringkali sikunya landai dan ambigu.
2. **Silhouette Coefficient**: Mengukur seberapa dekat suatu titik ke anggota cluster-nya sendiri ($a$) dibanding ke cluster tetangga terdekat ($b$):
$$s = \\frac{b - a}{\\max(a, b)}$$
Nilai mendekati +1 berarti titik terisolasi sempurna di dalam kelompoknya. Nilai mendekati 0 berarti berada di perbatasan. Nilai negatif berarti salah kelompok!`,
    practicalWalkthrough: {
      summary: 'Hitung Elbow curve dan Silhouette Score untuk K=2 hingga K=10, lalu tentukan K terbaik.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Elbow & Silhouette Evaluation',
          language: 'python',
          code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score
import matplotlib.pyplot as plt

k_range = range(2, 9)
inertias = []
silhouettes = []
db_scores = []

for k in k_range:
    km = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=42)
    labels = km.fit_predict(X_scaled)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X_scaled, labels))
    db_scores.append(davies_bouldin_score(X_scaled, labels))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
ax1.plot(k_range, inertias, 'bo-')
ax1.set_title("Elbow Method (Inersia)")
ax1.set_xlabel("Jumlah K")

ax2.plot(k_range, silhouettes, 'rs-', label='Silhouette (Higher = Better)')
ax2.set_title("Silhouette Score vs K")
ax2.set_xlabel("Jumlah K")
plt.tight_layout()
plt.show()`,
          explanation: 'Kombinasi kurva siku dan silhouette score memberikan kepastian kuantitatif pemilihan K.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset multi-dimensi (misal Iris atau data pelanggan Mall Customers).',
      'Jalankan iterasi K dari 2 hingga 8.',
      'Simpan nilai WCSS dan Silhouette Score untuk tiap K.',
      'Tentukan nilai K yang memiliki Silhouette Score puncak.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Metrics', type: 'tool', description: 'silhouette_score, davies_bouldin_score' },
      { name: 'Mall Customer Segmentation Dataset', type: 'dataset', description: 'Data spending score vs income' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Optimasi K', description: 'Pilih nilai K terbaik berdasarkan perpaduan Elbow plot dan Silhouette Score tertinggi.' },
      { title: 'Silhouette Plot Per Cluster', description: 'Gunakan yellowbrick.cluster.silhouette_visualizer untuk melihat ketebalan pisau silhouette tiap cluster.', isStretch: true },
    ],
    deliverables: [
      'Grafik gabungan Elbow Method dan Silhouette Score.',
      'Rekomendasi nilai K final beserta justifikasi numeriknya.',
    ],
    checklist: [
      { id: 'c1', label: 'Rentang nilai K diuji minimal dari 2 sampai 8', isRequired: true },
      { id: 'c2', label: 'Elbow curve dan Silhouette score diplot dengan benar', isRequired: true },
      { id: 'c3', label: 'K optimal dipilih dengan justifikasi ilmiah', isRequired: true },
    ],
    definitionOfDone: [
      'Jumlah cluster K terbukti optimal secara matematis.',
    ],
    reflectionQuestions: [
      'Mengapa Silhouette Score tidak bisa dihitung untuk K=1?',
      'Jika Elbow Method menyarankan K=3 tetapi Silhouette menyarankan K=4, bagaimana Anda memutuskan dari sudut pandang bisnis?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 30 untuk mengaplikasikan clustering pada kasus riil: Customer Segmentation (RFM).',
  },
  {
    id: 'day-030',
    day: 30,
    phaseId: 3,
    title: 'Customer Segmentation',
    shortDescription: 'Penerapan bisnis nyata: Segmentasi pelanggan RFM (Recency, Frequency, Monetary) dan profil Persona Pelanggan.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Membangun metrik transaksi RFM: Recency (hari sejak belanja terakhir), Frequency (jumlah transaksi), Monetary (total belanja).',
      'Mengatasi skewness data transaksi dengan log-transformation sebelum scaling.',
      'Melatih K-Means pada ruang 3D RFM yang telah dinormalisasi.',
      'Menerjemahkan cluster angka menjadi Persona Bisnis (misal: "Sultan Setia", "Pelanggan Pasif", "Pemburu Diskon").',
    ],
    theoryContent: `### Menghidupkan Data: Dari Angka Menjadi Persona Pelanggan
Data transaksi mentah di e-commerce tidak berguna bagi tim marketing jika tidak dirangkum ke dalam kerangka **RFM**:
- **Recency**: Seberapa baru pelanggan berbelanja? (Makin kecil makin bagus).
- **Frequency**: Seberapa sering mereka belanja?
- **Monetary**: Berapa total uang yang mereka habiskan?

Karena nilai Monetary seringkali sangat miring (beberapa pelanggan belanja puluhan juta, mayoritas ratusan ribu), kita wajib menerapkan transformasi logaritma:
$$x_{clean} = \\log(x + 1)$$
sebelum memasukkannya ke dalam StandardScaler dan K-Means.`,
    practicalWalkthrough: {
      summary: 'Hitung tabel RFM dari riwayat transaksi, transformasikan secara logaritmik, lalu buat 4 persona pelanggan.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'RFM Calculation & Clustering Persona',
          language: 'python',
          code: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# Simulasi data RFM
np.random.seed(42)
n_cust = 500
rfm_df = pd.DataFrame({
    'recency': np.random.exponential(scale=30, size=n_cust),
    'frequency': np.random.poisson(lam=4, size=n_cust) + 1,
    'monetary': np.random.exponential(scale=1000, size=n_cust) + 50
})

# 1. Log Transformasi untuk mengatasi heavy skewness
rfm_log = np.log1p(rfm_df)

# 2. Standarisasi
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm_log)

# 3. K-Means dengan K=4
km = KMeans(n_clusters=4, random_state=42, n_init=10)
rfm_df['Cluster'] = km.fit_predict(rfm_scaled)

# 4. Ringkasan Karakteristik Persona
persona_summary = rfm_df.groupby('Cluster').agg({
    'recency': 'mean',
    'frequency': 'mean',
    'monetary': 'mean'
}).round(1)
print(persona_summary)`,
          explanation: 'Menghitung rata-rata nilai asli RFM per cluster untuk menamai persona bisnis.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset transaksi e-commerce (Online Retail Dataset UCI).',
      'Hitung nilai Recency, Frequency, dan Monetary per Customer ID.',
      'Terapkan log1p transform dan StandardScaler.',
      'Bagi data menjadi 3 atau 4 cluster dengan K-Means.',
      'Beri nama bisnis kreatif untuk tiap kelompok (misal: "Whales/VIP", "At-Risk", "Newbies").',
    ],
    requiredToolsAndDatasets: [
      { name: 'Online Retail II Dataset', type: 'dataset', description: 'Data riwayat transaksi faktur e-commerce' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Profiling Persona', description: 'Buat tabel profil 4 persona pelanggan dan tulis strategi aksi marketing untuk masing-masing kelompok.' },
      { title: 'Visualisasi Snake Plot', description: 'Buat grafik Snake Plot (line plot rata-rata z-score per fitur RFM untuk tiap cluster).', isStretch: true },
    ],
    deliverables: [
      'Tabel ringkasan RFM per cluster.',
      'Deskripsi narasi 4 persona pelanggan dan rekomendasi kampanye promosi.',
    ],
    checklist: [
      { id: 'c1', label: 'Metrik Recency, Frequency, Monetary berhasil dihitung', isRequired: true },
      { id: 'c2', label: 'Transformasi logaritma diterapkan untuk mengatasi skewness', isRequired: true },
      { id: 'c3', label: 'Setiap cluster diberi nama persona bisnis yang bermakna', isRequired: true },
    ],
    definitionOfDone: [
      'Hasil clustering diterjemahkan menjadi rencana aksi bisnis strategis.',
    ],
    reflectionQuestions: [
      'Mengapa kita mentransformasikan data kembali ke skala aslinya saat menganalisis mean persona?',
      'Bagaimana strategi penanganan pelanggan di cluster "At Risk" (Recency tinggi, Monetary tinggi masa lalu)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 31 untuk mempelajari algoritma berbasis kepadatan: DBSCAN Lab.',
  },
  {
    id: 'day-031',
    day: 31,
    phaseId: 3,
    title: 'DBSCAN Lab',
    shortDescription: 'Density-Based Spatial Clustering: Deteksi cluster bentuk arbitrer, Core Points, Border Points, dan Noise Filtering.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami keunggulan DBSCAN: tidak perlu menentukan K di awal dan mampu menemukan cluster bentuk melengkung/bebas.',
      'Memahami konsep radius $\\epsilon$ (eps) dan ambang tetangga min_samples.',
      'Mengklasifikasikan titik: Core points, Border points, dan Noise (label -1).',
      'Menggunakan K-distance graph untuk menentukan parameter eps optimal.',
    ],
    theoryContent: `### Clustering Berbasis Kepadatan: Bebas dari Belenggu K
K-Means gagal total pada pola geometris kompleks seperti cincin konsentris atau kurva bulan sabit. **DBSCAN** (*Density-Based Spatial Clustering of Applications with Noise*) mengelompokkan titik berdasarkan kerapatan ruang:
1. **Core Point**: Memiliki minimal \`min_samples\` titik dalam radius $\\epsilon$.
2. **Border Point**: Berada dalam radius $\\epsilon$ dari Core Point, tetapi tidak memiliki cukup tetangga sendiri.
3. **Noise**: Titik terisolasi yang tidak memenuhi kriteria di atas (diberi label \`-1\`). Otomatis mendeteksi anomali!`,
    practicalWalkthrough: {
      summary: 'Latih DBSCAN pada dataset make_moons dan bandingkan hasilnya dengan K-Means.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'DBSCAN vs K-Means on Complex Geometry',
          language: 'python',
          code: `from sklearn.cluster import DBSCAN, KMeans
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

X, _ = make_moons(n_samples=400, noise=0.07, random_state=42)
X_scaled = StandardScaler().fit_transform(X)

# 1. K-Means
km = KMeans(n_clusters=2, random_state=42, n_init=10)
labels_km = km.fit_predict(X_scaled)

# 2. DBSCAN
dbscan = DBSCAN(eps=0.3, min_samples=5)
labels_db = dbscan.fit_predict(X_scaled)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))
ax1.scatter(X_scaled[:, 0], X_scaled[:, 1], c=labels_km, cmap='viridis')
ax1.set_title("K-Means (Gagal pada Bentuk Kurva)")

ax2.scatter(X_scaled[:, 0], X_scaled[:, 1], c=labels_db, cmap='coolwarm')
ax2.set_title(f"DBSCAN (Berhasil! Noise: {sum(labels_db == -1)})")
plt.show()`,
          explanation: 'Memperlihatkan keunggulan DBSCAN dalam melacak kontur kepadatan alami.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan make_moons atau make_circles untuk menguji batas algoritma.',
      'Latih DBSCAN dengan eps=0.3 dan min_samples=5.',
      'Identifikasi berapa banyak titik yang dilabeli sebagai noise (-1).',
      'Gunakan NearestNeighbors untuk memplot k-distance graph untuk mencari siku nilai eps.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn DBSCAN', type: 'tool', description: 'DBSCAN & NearestNeighbors' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas DBSCAN', description: 'Buktikan DBSCAN mampu memisahkan dua bentuk bulan sabit tanpa kesalahan split.' },
      { title: 'Tantangan Noise Filtering', description: 'Sisipkan 20 titik outlier ekstrem acak ke dataset dan tunjukkan DBSCAN menandainya sebagai -1.', isStretch: true },
    ],
    deliverables: [
      'Visualisasi perbandingan K-Means vs DBSCAN berdampingan.',
      'Catatan jumlah cluster dan noise point yang terdeteksi.',
    ],
    checklist: [
      { id: 'c1', label: 'DBSCAN dilatih pada data terstandarisasi', isRequired: true },
      { id: 'c2', label: 'Titik noise (label -1) berhasil diidentifikasi', isRequired: true },
      { id: 'c3', label: 'Parameter eps dan min_samples disesuaikan secara logis', isRequired: true },
    ],
    definitionOfDone: [
      'Mampu memilih DBSCAN ketika menghadapi pola cluster geometri kompleks dan mendeteksi outlier.',
    ],
    reflectionQuestions: [
      'Mengapa DBSCAN kesulitan jika dataset memiliki cluster dengan tingkat kepadatan (densitas) yang sangat berbeda-beda?',
      'Apa yang terjadi jika nilai eps disetel terlalu besar atau terlalu kecil?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 32 untuk mereduksi dimensi data menggunakan Principal Component Analysis (PCA).',
  },
  {
    id: 'day-032',
    day: 32,
    phaseId: 3,
    title: 'PCA Visualization',
    shortDescription: 'Principal Component Analysis: Dekomposisi nilai eigen, proyeksi ortogonal, dan Explained Variance Ratio.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami tujuan reduksi dimensi: memadatkan informasi dan visualisasi data multi-dimensi.',
      'Memahami konsep Principal Components: sumbu ortogonal yang menangkap varians data terbesar.',
      'Menghitung dan memplot Scree Plot (Cumulative Explained Variance Ratio).',
      'Memproyeksikan dataset 30-dimensi ke ruang 2D untuk visualisasi sebaran kelas.',
    ],
    theoryContent: `### Memadatkan Dimensi Tanpa Kehilangan Jiwa Data
Bagaimana cara melihat data dengan 30 atau 100 fitur? Kita tidak bisa menggambar grafik 30-dimensi.
**PCA (Principal Component Analysis)** mencari sumbu rotasi baru:
1. **PC1**: Garis lurus yang melewati data dengan varians terbesar.
2. **PC2**: Garis tegak lurus (*ortogonal*) terhadap PC1 yang menangkap sisa varians terbesar berikutnya.
3. **Explained Variance Ratio**: Persentase total informasi yang dipertahankan oleh tiap komponen utama.
Jika 2 komponen pertama berhasil mempertahankan 85% varians data asli, kita dapat memvisualisasikan data 30-dimensi ke bidang 2D tanpa kehilangan gambaran esensial!`,
    practicalWalkthrough: {
      summary: 'Proyeksikan Breast Cancer dataset (30 fitur) ke 2 komponen utama dan buat visualisasi 2D scatter plot.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'PCA 2D Projection & Scree Plot',
          language: 'python',
          code: `from sklearn.decomposition import PCA
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import numpy as np

data = load_breast_cancer()
X_scaled = StandardScaler().fit_transform(data.data)

# Reduksi ke 2 Komponen Utama
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

print(f"Explained Variance Ratio: {pca.explained_variance_ratio_}")
print(f"Total Varians Tersimpan : {np.sum(pca.explained_variance_ratio_) * 100:.2f}%")

# Plot 2D
plt.figure(figsize=(8, 5))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=data.target, cmap='viridis', alpha=0.7)
plt.title("Proyeksi 2D PCA (Breast Cancer)")
plt.xlabel(f"PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)")
plt.ylabel(f"PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)")
plt.colorbar(scatter, label="Target (0: Malignant, 1: Benign)")
plt.show()`,
          explanation: 'Memproyeksikan ruang 30D ke 2D dengan mempertahankan struktur pemisahan kelas alami.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset dengan minimal 10 fitur numerik.',
      'Wajib standarisasi fitur dengan StandardScaler (PCA sangat sensitif terhadap skala fitur!).',
      'Hitung PCA dengan n_components penuh dan plot kurva kumulatif explained variance (Scree Plot).',
      'Tentukan berapa komponen yang dibutuhkan untuk mempertahankan minimal 90% varians.',
      'Buat scatter plot 2D menggunakan PC1 dan PC2.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Decomposition', type: 'tool', description: 'PCA, IncrementalPCA' },
      { name: 'Breast Cancer Wisconsin', type: 'dataset', description: '30 fitur numerik biopsi sel' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Visualisasi PCA', description: 'Reduksi dataset 30D ke 2D dan periksa apakah kedua kelas terpisah secara visual di ruang komponen utama.' },
      { title: 'Tantangan 95% Threshold', description: 'Gunakan PCA(n_components=0.95) dan catat berapa banyak fitur yang berhasil dihemat model.', isStretch: true },
    ],
    deliverables: [
      'Grafik scatter plot 2D hasil reduksi dimensi PCA.',
      'Kurva kumulatif explained variance (Scree plot).',
    ],
    checklist: [
      { id: 'c1', label: 'Standarisasi StandardScaler diterapkan sebelum PCA', isRequired: true },
      { id: 'c2', label: 'Explained variance ratio dihitung untuk tiap komponen', isRequired: true },
      { id: 'c3', label: 'Scatter plot 2D diberi label sumbu persentase varians', isRequired: true },
    ],
    definitionOfDone: [
      'Data berdimensi tinggi berhasil dikompresi dan divisualisasikan dengan retensi varians terukur.',
    ],
    reflectionQuestions: [
      'Mengapa komponen utama selalu ortogonal (tegak lurus) satu sama lain?',
      'Apa kelemahan PCA dalam hal interpretasi bisnis dibanding fitur asli?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 33 untuk mendeteksi transaksi aneh via Anomaly Detection.',
  },
  {
    id: 'day-033',
    day: 33,
    phaseId: 3,
    title: 'Anomaly Detection',
    shortDescription: 'Mendeteksi hal tak lazim: Isolation Forest, Local Outlier Factor (LOF), dan EllipticEnvelope.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami formulasi unsupervised anomaly detection saat tidak ada label fraud.',
      'Memahami prinsip Isolation Forest: titik anomali membutuhkan split pohon lebih sedikit untuk diisolasi.',
      'Mengatur parameter contamination (estimasi persentase anomali dalam populasi).',
      'Mengekstrak anomaly score kontinu dan membedakan anomali global vs anomali lokal.',
    ],
    theoryContent: `### Titik Mana yang Terasa Asing? (Anomaly Detection)
Bagaimana mendeteksi serangan siber baru (*zero-day attack*) jika polanya belum pernah tercatat sebelumnya?
Kita mencari titik yang **berbeda dari normalitas**:

Prinsip Isolation Forest:
Alih-alih memodelkan titik normal, algoritma ini berusaha mengisolasi setiap titik menggunakan partisi acak:
- Titik normal berkerumun padat di tengah $\\rightarrow$ butuh banyak partisi pohon untuk memisahkannya (jalur pohon dalam).
- Titik anomali berada jauh terpencil di sudut $\\rightarrow$ sangat mudah diisolasi hanya dengan 1 atau 2 split acak (jalur pohon dangkal)!`,
    practicalWalkthrough: {
      summary: 'Latih IsolationForest pada data transaksi dan visualisasikan titik anomali yang ditandai merah.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Isolation Forest Anomaly Lab',
          language: 'python',
          code: `from sklearn.ensemble import IsolationForest
import numpy as np
import matplotlib.pyplot as plt

# Data normal berkerumun + beberapa outlier jauh
X_normal = 0.3 * np.random.randn(300, 2)
X_outliers = np.random.uniform(low=-4, high=4, size=(20, 2))
X = np.vstack([X_normal, X_outliers])

# Latih Isolation Forest
iso = IsolationForest(contamination=0.06, random_state=42)
preds = iso.fit_predict(X) # 1: Inlier (Normal), -1: Outlier (Anomali)
scores = iso.decision_function(X) # Skor anomali negatif

plt.figure(figsize=(7, 5))
plt.scatter(X[preds == 1, 0], X[preds == 1, 1], c='blue', label='Normal (Inlier)', alpha=0.5)
plt.scatter(X[preds == -1, 0], X[preds == -1, 1], c='red', marker='x', s=100, label='Anomali Terdeteksi')
plt.title("Deteksi Anomali dengan Isolation Forest")
plt.legend()
plt.show()`,
          explanation: 'Membedakan titik normal dan anomali berdasarkan kedalaman pohon pemisah.',
        },
      ],
    },
    stepByStepInstructions: [
      'Siapkan dataset numerik tanpa label anomali.',
      'Terapkan IsolationForest dengan asumsi contamination=0.02 (2% anomali).',
      'Ekstrak skor keputusan dengan decision_function.',
      'Inspeksi baris-baris data yang diberi label -1 dan analisis mengapa nilainya janggal.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Ensemble', type: 'tool', description: 'IsolationForest' },
      { name: 'Scikit-learn Neighbors', type: 'tool', description: 'LocalOutlierFactor' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Anomali', description: 'Identifikasi 10 data paling anomali pada dataset Anda dan jelaskan fitur penyebab keanehannya.' },
      { title: 'Tantangan Kontaminasi', description: 'Bandingkan sensitivitas hasil deteksi saat parameter contamination diubah dari 0.01 ke 0.05.', isStretch: true },
    ],
    deliverables: [
      'Scatter plot titik normal vs anomali.',
      'Daftar 5 sampel data dengan anomaly score paling negatif.',
    ],
    checklist: [
      { id: 'c1', label: 'IsolationForest berhasil dilatih tanpa supervisi label', isRequired: true },
      { id: 'c2', label: 'Titik anomali berhasil diisolasi dan diplot', isRequired: true },
      { id: 'c3', label: 'Anomaly score kontinu dianalisis distribusinya', isRequired: true },
    ],
    definitionOfDone: [
      'Sistem deteksi anomali mampu mengisolasi outlier tanpa memerlukan data training berlabel.',
    ],
    reflectionQuestions: [
      'Mengapa Isolation Forest sangat efisien secara komputasi ($O(n \\log n)$)?',
      'Apa kelemahan jika nilai parameter contamination ditebak terlalu tinggi?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 34 untuk menganalisis keranjang belanja menggunakan Association Rules (Market Basket Analysis).',
  },
  {
    id: 'day-034',
    day: 34,
    phaseId: 3,
    title: 'Association Rules',
    shortDescription: 'Market Basket Analysis: Algoritma Apriori, FP-Growth, dan metrik Support, Confidence, serta Lift.',
    difficulty: 'Intermediate',
    estimatedDuration: '70 Menit',
    learningObjectives: [
      'Memahami konsep penambangan aturan asosiasi (*Association Rule Mining*).',
      'Membedah metrik utama: Support (frekuensi), Confidence (keandalan aturan), dan Lift (korelasi nyata di atas kebetulan).',
      'Menggunakan algoritma Apriori dan FP-Growth (Frequent Pattern Growth).',
      'Menerjemahkan aturan "$A \\rightarrow B$" menjadi strategi penempatan produk di rak supermarket.',
    ],
    theoryContent: `### Market Basket Analysis: Mengapa Bir dan Popok Ditaruh Berdekatan?
Kisah klasik ritel: Pria muda yang disuruh membeli popok bayi di hari Jumat seringkali membeli bir sekaligus.

Tiga Metrik Keranjang Belanja:
1. **Support**: Seberapa sering kombinasi $\{A, B\}$ muncul di seluruh transaksi:
$$\\text{Support}(A \\rightarrow B) = \\frac{\\text{Frekuensi}(A, B)}{N}$$
2. **Confidence**: Jika pelanggan membeli $A$, berapa persen kemungkinan mereka juga membeli $B$:
$$\\text{Confidence}(A \\rightarrow B) = \\frac{\\text{Support}(A, B)}{\\text{Support}(A)}$$
3. **Lift**: Seberapa besar pembelian $A$ meningkatkan probabilitas pembelian $B$ dibanding peluang acak:
$$\\text{Lift} = \\frac{\\text{Confidence}(A \\rightarrow B)}{\\text{Support}(B)}$$
*Catatan*: Lift > 1 artinya ada asosiasi positif kuat. Lift = 1 berarti independen. Lift < 1 berarti saling meniadakan.`,
    practicalWalkthrough: {
      summary: 'Gunakan mlxtend untuk menjalankan Apriori dan menyaring aturan asosiasi dengan Lift > 1.5.',
      environment: 'Jupyter Notebook / Google Colab (pip install mlxtend)',
      codeSnippets: [
        {
          title: 'Apriori & Association Rule Mining',
          language: 'python',
          code: `import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

# Daftar transaksi belanjaan
dataset = [
    ['Roti', 'Susu'],
    ['Roti', 'Diapers', 'Bir', 'Telur'],
    ['Susu', 'Diapers', 'Bir', 'Cola'],
    ['Roti', 'Susu', 'Diapers', 'Bir'],
    ['Roti', 'Susu', 'Diapers', 'Cola']
]

# One-hot encoding transaksi
te = TransactionEncoder()
te_ary = te.fit(dataset).transform(dataset)
df = pd.DataFrame(te_ary, columns=te.columns_)

# Ekstrak frequent itemsets (min support 0.4)
frequent_itemsets = apriori(df, min_support=0.4, use_colnames=True)

# Generate rules (min confidence 0.7)
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.7)
rules_filtered = rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].sort_values(by='lift', ascending=False)
print(rules_filtered.to_string())`,
          explanation: 'Menemukan aturan belanja dengan nilai Lift tertinggi untuk optimasi bundling produk.',
        },
      ],
    },
    stepByStepInstructions: [
      'Instal library mlxtend.',
      'Siapkan data transaksi multi-item.',
      'Ubah format transaksi menjadi sparse boolean matrix.',
      'Jalankan fungsi apriori atau fpgrowth.',
      'Filter aturan yang memiliki confidence > 0.6 dan lift > 1.2.',
    ],
    requiredToolsAndDatasets: [
      { name: 'MLxtend Library', type: 'tool', url: 'http://rasbt.github.io/mlxtend/', description: 'Package data mining dan evaluasi machine learning' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Bundling Produk', description: 'Ekstrak minimal 3 aturan asosiasi dengan lift > 1.3 dan formulasikan paket promo diskon bundling.' },
      { title: 'Tantangan FP-Growth vs Apriori', description: 'Bandingkan waktu pemrosesan FP-Growth vs Apriori pada transaksi skala ribuan item.', isStretch: true },
    ],
    deliverables: [
      'Tabel hasil aturan asosiasi lengkap dengan nilai support, confidence, dan lift.',
      'Rencana strategi penempatan rak barang toko.',
    ],
    checklist: [
      { id: 'c1', label: 'Data transaksi diubah menjadi boolean format One-Hot', isRequired: true },
      { id: 'c2', label: 'Itemsets frekuen diekstrak dengan ambang batas support realistis', isRequired: true },
      { id: 'c3', label: 'Aturan asosiasi disaring berdasarkan metrik Lift > 1', isRequired: true },
    ],
    definitionOfDone: [
      'Aturan asosiasi tervalidasi mampu membedakan korelasi produk nyata dari kebetulan statistik.',
    ],
    reflectionQuestions: [
      'Mengapa aturan dengan confidence 90% bisa jadi tidak berguna jika nilai lift-nya di bawah 1.0?',
      'Bagaimana algoritma FP-Growth menghemat komputasi dibanding Apriori tradisional?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 35 untuk membangun sistem rekomendasi dasar (Content-Based vs Collaborative).',
  },
  {
    id: 'day-035',
    day: 35,
    phaseId: 3,
    title: 'Recommendation Basics',
    shortDescription: 'Fondasi Recommender System: Cosine Similarity, Content-Based Filtering, dan User-Item Collaborative Filtering.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami taksonomi sistem rekomendasi: Content-Based vs Collaborative Filtering.',
      'Menghitung kesamaan sudut menggunakan Cosine Similarity pada representasi vektor.',
      'Membangun recommender film/artikel berbasis kesamaan deskripsi fitur (Content-Based).',
      'Memahami fenomena Cold Start Problem bagi pengguna atau item yang baru mendaftar.',
    ],
    theoryContent: `### Bagaimana Netflix dan Spotify Tahu Selera Anda?
Dua Pilar Sistem Rekomendasi:
1. **Content-Based Filtering**: "Karena Anda menyukai Film Interstellar (Sci-Fi, Christopher Nolan, Space), Anda mungkin menyukai The Martian (Sci-Fi, Space)."
   - Menggunakan kemiripan fitur atribut konten via **Cosine Similarity**:
   $$\\cos(\\theta) = \\frac{u \\cdot v}{||u|| \\cdot ||v||}$$
2. **Collaborative Filtering**: "Pengguna A dan Pengguna B memiliki pola rating yang 90% mirip pada 10 lagu. Pengguna B menyukai Lagu X, maka Lagu X direkomendasikan ke Pengguna A."
   - Masalah: **Cold Start** (Item baru belum punya riwayat rating pengguna).`,
    practicalWalkthrough: {
      summary: 'Bangun Content-Based Movie Recommender sederhana berbasis Cosine Similarity dari ringkasan metadata.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Content-Based Movie Recommender',
          language: 'python',
          code: `import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

movies = pd.DataFrame({
    'title': ['The Matrix', 'Inception', 'Interstellar', 'The Notebook', 'Titanic'],
    'description': [
        'Cyberpunk sci-fi virtual reality keanu reeves action',
        'Dream world mind heist sci-fi christopher nolan action',
        'Space exploration wormhole sci-fi relativity nolan physics',
        'Romantic drama love story summer affair',
        'Shipwreck disaster romance epic love story'
    ]
})

# 1. Representasikan teks ke vektor TF-IDF
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(movies['description'])

# 2. Hitung Matriks Cosine Similarity antar film
cos_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def recommend(movie_title, top_n=2):
    idx = movies[movies['title'] == movie_title].index[0]
    sim_scores = list(enumerate(cos_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    return [movies['title'].iloc[i[0]] for i in sim_scores]

print("Rekomendasi mirip 'Interstellar':", recommend('Interstellar'))`,
          explanation: 'Menghitung kemiripan vektor teks deskripsi film untuk menghasilkan daftar rekomendasi teratas.',
        },
      ],
    },
    stepByStepInstructions: [
      'Siapkan dataset berisi judul dan deskripsi ringkas item (film, buku, atau kursus).',
      'Vektorisasi teks menggunakan TfidfVectorizer.',
      'Hitung matriks pairwise cosine similarity.',
      'Buat fungsi recommend() yang menerima nama item dan mengembalikan Top-3 item paling serupa.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Pairwise Metrics', type: 'tool', description: 'cosine_similarity, linear_kernel' },
      { name: 'MovieLens 100k Dataset', type: 'dataset', description: 'Dataset benchmark sistem rekomendasi' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Recommender', description: 'Bangun fungsi pemberi rekomendasi film dan buktikan genre film yang direkomendasikan selaras secara tematik.' },
      { title: 'Tantangan Collaborative Matrix', description: 'Susun User-Item Rating Matrix dan hitung kemiripan selera antar dua pengguna menggunakan korelasi Pearson.', isStretch: true },
    ],
    deliverables: [
      'Fungsi Python rekomendasi konten teruji.',
      'Daftar Top-3 rekomendasi untuk 2 judul film berbeda.',
    ],
    checklist: [
      { id: 'c1', label: 'TF-IDF vektorisasi diterapkan pada deskripsi item', isRequired: true },
      { id: 'c2', label: 'Cosine similarity dihitung antar pasangan item', isRequired: true },
      { id: 'c3', label: 'Fungsi rekomendasi berhasil memfilter judul item itu sendiri', isRequired: true },
    ],
    definitionOfDone: [
      'Sistem rekomendasi mampu menyajikan saran relevan berbasis kesamaan konten tekstual.',
    ],
    reflectionQuestions: [
      'Mengapa Cosine Similarity lebih disukai dibanding jarak Euclidean untuk membandingkan vektor teks TF-IDF?',
      'Bagaimana cara perusahaan besar mengatasi masalah Cold Start untuk pengguna baru?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 36 untuk mengeksplorasi manifold ruang laten via Feature Space Explorer (t-SNE & UMAP).',
  },
  {
    id: 'day-036',
    day: 36,
    phaseId: 3,
    title: 'Feature Space Explorer',
    shortDescription: 'Memvisualisasikan manifold data non-linear: Perbandingan mendalam t-SNE vs UMAP vs PCA.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami kelemahan PCA: hanya mampu menangkap proyeksi linier.',
      'Memahami mekanisme t-SNE (t-Distributed Stochastic Neighbor Embedding) dan distribusi Student-t.',
      'Mengenal UMAP (Uniform Manifold Approximation and Projection) untuk menjaga struktur lokal dan global.',
      'Mengatur hyperparameter penting: Perplexity pada t-SNE dan n_neighbors pada UMAP.',
    ],
    theoryContent: `### Menjaga Hubungan Tetangga di Ruang Non-Linear
PCA mempertahankan varians global tetapi seringkali membuat cluster non-linear bertumpuk menjadi satu gumpalan.
- **t-SNE**: Mengubah jarak Euclidean antar titik menjadi probabilitas kemiripan Gaussian di ruang tinggi, lalu mencocokkannya ke distribusi Student-t di ruang 2D. Sangat hebat mempertahankan **struktur lokal** (tetangga dekat).
  *Peringatan*: Jarak antar cluster yang jauh di t-SNE tidak bermakna global! Jangan gunakan t-SNE untuk feature engineering model, ini murni alat visualisasi.
- **UMAP**: Berdasarkan topologi riemannian. Jauh lebih cepat dari t-SNE dan lebih baik dalam mempertahankan **struktur global** data.`,
    practicalWalkthrough: {
      summary: 'Bandingkan proyeksi 2D dataset MNIST Digits (8x8 pixel) menggunakan PCA vs t-SNE.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'PCA vs t-SNE Manifold Comparison',
          language: 'python',
          code: `from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from sklearn.datasets import load_digits
import matplotlib.pyplot as plt

digits = load_digits()
X, y = digits.data, digits.target

# 1. PCA
X_pca = PCA(n_components=2).fit_transform(X)

# 2. t-SNE
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
scatter1 = ax1.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='tab10', alpha=0.6, s=15)
ax1.set_title("PCA (Linier: Angka Banyak Bertumpuk)")

scatter2 = ax2.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='tab10', alpha=0.6, s=15)
ax2.set_title("t-SNE (Non-Linier: 10 Angka Terpisah Jelas!)")
plt.colorbar(scatter2, ax=ax2, label="Digit 0-9")
plt.show()`,
          explanation: 'Memperlihatkan keajaiban t-SNE dalam mengurai cluster digit gambar yang bertumpuk pada PCA.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset Digits dari sklearn.datasets.',
      'Jalankan PCA 2D dan simpan koordinatnya.',
      'Jalankan TSNE dengan perplexity=30.',
      'Visualisasikan kedua hasil secara berdampingan dengan colormap kategori kelas.',
      'Amati bagaimana cluster tiap digit terpisah rapi pada t-SNE.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Manifold', type: 'tool', description: 'TSNE' },
      { name: 'Digits Dataset', type: 'dataset', description: 'Gambar 8x8 pixel angka tulisan tangan' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Eksplorasi Manifold', description: 'Bandingkan visualisasi PCA vs t-SNE pada data berdimensi tinggi dan simpulkan keunggulannya.' },
      { title: 'Tantangan Eksperimen Perplexity', description: 'Uji nilai perplexity pada t-SNE di rentang [5, 30, 100] dan perhatikan perubahan kerapatan cluster.', isStretch: true },
    ],
    deliverables: [
      'Gambar perbandingan visual PCA vs t-SNE.',
      'Paragraf penjelasan mengapa t-SNE mampu memisahkan kelompok digit non-linear.',
    ],
    checklist: [
      { id: 'c1', label: 'PCA dan t-SNE dijalankan pada dataset yang sama', isRequired: true },
      { id: 'c2', label: 'Perbedaan struktur lokal visual teridentifikasi', isRequired: true },
      { id: 'c3', label: 'Catatan batasan interpretasi jarak t-SNE didokumentasikan', isRequired: true },
    ],
    definitionOfDone: [
      'Mampu memilih alat visualisasi reduksi dimensi yang tepat sesuai tujuan analisis.',
    ],
    reflectionQuestions: [
      'Mengapa kita tidak boleh menggunakan t-SNE sebagai tahap preprocessing feature engineering untuk model klasifikasi?',
      'Apa arti parameter perplexity pada t-SNE?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 37 untuk melakukan audit pembasmian kebocoran data di Data Leakage Hunt.',
  },
  {
    id: 'day-037',
    day: 37,
    phaseId: 3,
    title: 'Data Leakage Hunt',
    shortDescription: 'Audit forensik kebocoran data: Target leakage, train-test contamination, temporal leakage, dan pengujian model pada masa depan.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Mengidentifikasi bentuk-bentuk Data Leakage terselubung yang merusak integritas model di dunia nyata.',
      'Mendeteksi Target Leakage: fitur yang hanya tersedia SETELAH kejadian terjadi.',
      'Mendeteksi Preprocessing Contamination: fit transformer sebelum split.',
      'Menerapkan checklist audit anti-leakage sebelum model diizinkan masuk ke tahap review produksi.',
    ],
    theoryContent: `### Kejahatan Terbesar dalam ML: Skor Tes Sempurna yang Palsu
Jika akurasi model Anda tiba-tiba 99.8% pada percobaan pertama, jangan senang dulu. **99.9% kemungkinan terjadi Data Leakage!**

Tiga Jenis Kebocoran Mematikan:
1. **Target Leakage**: Memasukkan fitur yang merupakan akibat dari target.
   *Contoh*: Memprediksi apakah pasien menderita pneumonia, tetapi menyertakan kolom \`antibiotik_diberikan\` (dokter hanya memberi obat setelah diagnosis tegak!).
2. **Preprocessing Leakage**: Menghitung mean, median, atau vocabulary TF-IDF sebelum train_test_split.
3. **Temporal Leakage**: Pada data transaksi waktu, menggunakan data hari Rabu untuk memprediksi data hari Selasa.`,
    practicalWalkthrough: {
      summary: 'Analisis skenario dataset dengan sengaja disisipi target leakage dan buktikan bagaimana akurasi palsu terjadi.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Target Leakage Simulation',
          language: 'python',
          code: `import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# Simulasi data deteksi churn
np.random.seed(42)
n = 1000
churn = np.random.choice([0, 1], size=n, p=[0.8, 0.2])

# Fitur normal
usage_hours = np.random.normal(20, 5, size=n)

# FITUR LEAKAGE: Kolom 'survei_alasan_berhenti' (hanya ada jika churn=1)
leakage_feature = churn * np.random.choice([1, 2], size=n, p=[0.7, 0.3])

df_leaky = pd.DataFrame({'usage': usage_hours, 'cancel_reason_code': leakage_feature, 'churn': churn})

# Latih model dengan data bocor
X_train, X_test, y_train, y_test = train_test_split(df_leaky[['usage', 'cancel_reason_code']], df_leaky['churn'], test_size=0.2)
clf = LogisticRegression().fit(X_train, y_train)

print(f"Akurasi Palsu (Ada Leakage): {clf.score(X_test, y_test):.4f}")
print("-> Model hanya melihat 'cancel_reason_code', tidak belajar apa-apa tentang pola churn nyata!")`,
          explanation: 'Membuktikan bagaimana satu fitur bocor merusak keseluruhan kemampuan prediksi model.',
        },
      ],
    },
    stepByStepInstructions: [
      'Pelajari skenario dataset yang disediakan.',
      'Lakukan audit kolom: tanyakan untuk setiap fitur: "Apakah data ini tersedia pada saat kita harus membuat prediksi di real-time?".',
      'Hapus fitur target leakage.',
      'Latih ulang model dan laporkan akurasi realistis yang sebenarnya.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Pandas & Scikit-learn', type: 'tool', description: 'Audit manipulasi dataset' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Audit Kebocoran', description: 'Temukan minimal 1 fitur bocor dalam skenario kasus dan buktikan dampaknya terhadap skor evaluasi.' },
      { title: 'Checklist Audit', description: 'Susun dokumen checklist 5 pertanyaan wajib untuk memverifikasi model bebas kebocoran sebelum deployment.', isStretch: true },
    ],
    deliverables: [
      'Laporan audit investigasi fitur bocor.',
      'Checklist SOP anti-data-leakage.',
    ],
    checklist: [
      { id: 'c1', label: 'Seluruh fitur diaudit ketersediaan waktunya (timeline validity)', isRequired: true },
      { id: 'c2', label: 'Transformasi data terbukti hanya dihitung pada fold training', isRequired: true },
      { id: 'c3', label: 'Akurasi realistis dilaporkan setelah fitur bocor dieliminasi', isRequired: true },
    ],
    definitionOfDone: [
      'Model terverifikasi 100% bebas dari kebocoran data dan target leakage.',
    ],
    reflectionQuestions: [
      'Mengapa akurasi 99.9% pada tahap eksperimen justru merupakan tanda bahaya bagi senior ML engineer?',
      'Bagaimana cara memastikan data deret waktu tidak bocor secara temporal?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 38 untuk mengunci reproduktifitas eksperimen di Reproducibility Lab.',
  },
  {
    id: 'day-038',
    day: 38,
    phaseId: 3,
    title: 'Reproducibility Lab',
    shortDescription: 'Mengunci keacakan: Determinisme random seeds (Numpy, Python, Scikit-learn), version pinning, dan pipeline reproducibility.',
    difficulty: 'Intermediate',
    estimatedDuration: '65 Menit',
    learningObjectives: [
      'Memahami krisis reproduktifitas dalam AI dan sains data modern.',
      'Mengunci seed keacakan global pada seluruh pustaka: random, numpy, os.environ.',
      'Membuat fungsi deterministik tunggal set_seed(42).',
      'Memverifikasi bahwa dua kali eksekusi notebook dari awal menghasilkan bobot dan metrik floating-point yang identik persis.',
    ],
    theoryContent: `### Jika Tidak Bisa Direproduksi, Itu Bukan Sains!
Berapa kali Anda menjalankan notebook yang sama dan mendapatkan hasil akurasi berbeda setiap kali klik Run?
Penyebab Keacakan:
1. \`train_test_split(..., random_state=None)\` mengacak split tiap kali jalan.
2. Inisialisasi bobot model dan algoritma stochastic (seperti bootstrap Random Forest atau inisialisasi centroid K-Means).
3. Hash keacakan string di Python interpreter (\`PYTHONHASHSEED\`).

Solusi Standar Emas:
Tulis satu fungsi utilitas \`seed_everything(seed=42)\` di cell paling pertama dari setiap notebook dan script proyek ML Anda.`,
    practicalWalkthrough: {
      summary: 'Tulis fungsi seed_everything komprehensif dan uji konsistensi output hash dan metrik model.',
      environment: 'Jupyter Notebook / Google Colab / Python Script',
      codeSnippets: [
        {
          title: 'Universal Seed Lock Utility',
          language: 'python',
          code: `import os
import random
import numpy as np

def seed_everything(seed=42):
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    print(f"🔒 Keacakan sistem berhasil dikunci pada SEED: {seed}")

# Eksekusi di awal sesi
seed_everything(42)

# Uji konsistensi
array_1 = np.random.rand(3)
seed_everything(42)
array_2 = np.random.rand(3)

assert np.allclose(array_1, array_2), "ERROR: Keacakan bocor!"
print("✅ Uji determinisme sukses: Output angka identik 100%!")`,
          explanation: 'Memastikan seluruh sumber keacakan terkontrol untuk menghasilkan output yang sepenuhnya konsisten.',
        },
      ],
    },
    stepByStepInstructions: [
      'Tulis fungsi seed_everything() di bagian paling atas script.',
      'Latih model Random Forest atau K-Means dua kali berturut-turut.',
      'Verifikasi menggunakan assert bahwa metrik evaluasi sampai 6 digit desimal sama persis.',
      'Catat versi spesifik library ke dalam requirements.txt (pip freeze).',
    ],
    requiredToolsAndDatasets: [
      { name: 'Python standard random & numpy', type: 'tool', description: 'Kontrol keacakan sistem' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Reproducibility', description: 'Buktikan bahwa script ML Anda menghasilkan output evaluasi identik saat dijalankan di dua sesi terminal berbeda.' },
      { title: 'Tantangan Multi-threading Seed', description: 'Audit apakah penambahan parameter n_jobs=-1 pada scikit-learn mengubah determinisme urutan komputasi.', isStretch: true },
    ],
    deliverables: [
      'Fungsi seed_everything yang siap pakai untuk proyek masa depan.',
      'Output verifikasi assert determinisme berhasil.',
    ],
    checklist: [
      { id: 'c1', label: 'Fungsi seed_everything mengunci random, numpy, dan hash OS', isRequired: true },
      { id: 'c2', label: 'Seluruh random_state di estimator scikit-learn terpasang', isRequired: true },
      { id: 'c3', label: 'Determinisme diverifikasi melalui dua kali run identik', isRequired: true },
    ],
    definitionOfDone: [
      'Seluruh pipeline eksperimen terjamin dapat direproduksi secara deterministik oleh pihak lain.',
    ],
    reflectionQuestions: [
      'Mengapa komputasi GPU / CUDA pada deep learning seringkali lebih sulit dibuat 100% deterministik dibanding CPU?',
      'Apa perbedaan antara reproducibility (dijalankan oleh tim yang sama) vs replicability (dijalankan oleh tim independen lain)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 39 untuk menyelesaikan Mini-Project 3: Unsupervised Discovery Report!',
  },
  {
    id: 'day-039',
    day: 39,
    phaseId: 3,
    title: 'Mini-project 3: Unsupervised Discovery Report',
    shortDescription: 'Proyek akhir Fase 3: Menemukan wawasan tersembunyi dari data tanpa label via clustering, reduksi PCA, dan deteksi outlier terpadu.',
    difficulty: 'Intermediate',
    estimatedDuration: '90 Menit',
    isProject: true,
    projectMilestoneId: 'proj-3',
    learningObjectives: [
      'Mengintegrasikan teknik unsupervised learning: evaluasi K optimal, segmentasi cluster, PCA visual, dan deteksi anomali.',
      'Menyajikan temuan bisnis dari data yang sama sekali tidak memiliki kolom target (*unlabelled data*).',
      'Mengidentifikasi segmen bernilai tinggi dan anomali risiko tinggi.',
      'Mendokumentasikan seluruh kode dan visualisasi ke dalam portofolio GitHub.',
    ],
    theoryContent: `### Mini-Project 3: Ekstraksi Nilai dari Rimba Data Tanpa Label
Mayoritas data di dunia nyata tidak memiliki label (labeling mahal dan lambat).
Kemampuan seorang Data Scientist untuk:
1. Membuka dataset asing tanpa label.
2. Mengelompokkan pelanggan/entitas ke dalam persona logis.
3. Menemukan 1% anomali paling mencurigakan.
4. Memvisualisasikan peta sebaran data dalam bidang 2D.
adalah keahlian bernilai tinggi yang langsung berdampak pada efisiensi operasional perusahaan.`,
    practicalWalkthrough: {
      summary: 'Selesaikan analisis unsupervised end-to-end pada dataset pelanggan / transaksi, susun laporan discovery report dan publikasikan repositori.',
      environment: 'Jupyter Notebook / Google Colab / GitHub Gist',
      codeSnippets: [
        {
          title: 'Struktur Laporan Mini-Project 3',
          language: 'markdown',
          code: `# MINI-PROJECT 3: UNSUPERVISED DISCOVERY REPORT
## 1. TUJUAN ANALISIS & FORMULASI MASALAH
Mengeksplorasi struktur alami transaksi pelanggan e-commerce tanpa label sebelumnya.

## 2. PREPROCESSING & LOGARITHMIC NORMALIZATION
- Penanganan skewness pada Recency & Monetary
- StandardScaler transformasi

## 3. PENENTUAN JUMLAH CLUSTER K SECARA ILMIAH
- Elbow Curve (Inersia) vs Silhouette Score
- Pemilihan K=4 optimal

## 4. PROFILING PERSONA CLUSTER & SNAKE PLOT
- Cluster 0: Pelanggan VIP Setia (Monetary tinggi, Recency rendah)
- Cluster 1: Pelanggan Churn Berisiko
- Cluster 2: Pemburu Diskon Musiman
- Cluster 3: Pengguna Baru Eksplorasi

## 5. AUDIT ANOMALI & VISUALISASI PCA 2D
- Deteksi 2% transaksi outlier dengan Isolation Forest
- Peta sebaran ruang komponen utama (PC1 & PC2)`,
          explanation: 'Format baku laporan investigasi unsupervised discovery yang siap dipresentasikan.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset tanpa label nyata (Customer Shopping Trends, Spotify Audio Features, atau Credit Card usage).',
      'Bersihkan data dan lakukan normalisasi/scaling.',
      'Jalankan Elbow method dan Silhouette score untuk menemukan K optimal.',
      'Beri label cluster dan rangkum karakteristik rata-rata tiap kelompok.',
      'Jalankan Isolation Forest untuk menemukan transaksi paling aneh.',
      'Visualisasikan keseluruhan cluster menggunakan proyeksi 2D PCA.',
      'Simpan link repositori ke halaman Portofolio aplikasi ini.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Dataset Tanpa Label Publik', type: 'dataset', description: 'Customer segmentation / audio features' },
      { name: 'Stack Lengkap Fase 3', type: 'tool', description: 'Scikit-learn (KMeans, DBSCAN, PCA, IsolationForest)' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Mini-Project 3', description: 'Publikasikan notebook unsupervised discovery lengkap dengan penentuan K optimal, profiling persona, dan deteksi anomali.' },
      { title: 'Tantangan Rekomendasi Terintegrasi', description: 'Tambahkan modul sistem rekomendasi item sederhana berbasis cosine similarity di dalam notebook.', isStretch: true },
    ],
    deliverables: [
      'Tautan repositori GitHub berisi notebook discovery lengkap.',
      'Tabel ringkasan profil tiap cluster dan daftar anomali terdeteksi.',
      'Catatan refleksi pembelajaran Fase 3.',
    ],
    checklist: [
      { id: 'c1', label: 'K optimal dipilih dengan justifikasi Elbow dan Silhouette', isRequired: true },
      { id: 'c2', label: 'Setiap cluster diberi profil dan nama persona yang logis', isRequired: true },
      { id: 'c3', label: 'Deteksi anomali dijalankan dan titik anomali dianalisis', isRequired: true },
      { id: 'c4', label: 'Tautan portofolio disimpan di tab Portofolio aplikasi ini', isRequired: true },
    ],
    definitionOfDone: [
      'Mini-Project 3 selesai dan diverifikasi.',
      'Fase 3 Unsupervised Learning resmi tuntas!',
    ],
    reflectionQuestions: [
      'Bagaimana cara memvalidasi apakah cluster yang terbentuk benar-benar berguna bagi tim bisnis tanpa adanya ground truth?',
      'Apa wawasan paling mengejutkan yang Anda temukan saat mengaudit titik-titik anomali?',
    ],
    suggestedNextStep: 'Selamat! Anda telah menuntaskan 39 hari pembelajaran Machine Learning klasik dan unsupervised. Besok kita memasuki era baru: Fase 4 Deep Learning with PyTorch!',
  },
];
