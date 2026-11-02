/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumModule } from '../../types/curriculum';

export const PHASE_2_MODULES: CurriculumModule[] = [
  {
    id: 'day-013',
    day: 13,
    phaseId: 2,
    title: 'Decision Tree Lab',
    shortDescription: 'Membedah kriteria split Gini Impurity vs Entropy, visualisasi diagram pohon keputusan, dan teknik pruning (ccp_alpha).',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami mekanisme rekursif binary splitting pada Decision Tree.',
      'Membandingkan kriteria split: Gini Impurity vs Information Gain (Entropy).',
      'Mengatasi kecenderungan pohon menghafal data via pre-pruning (max_depth, min_samples_split).',
      'Menerapkan cost-complexity pruning (ccp_alpha) untuk post-pruning optimal.',
    ],
    theoryContent: `### Anatomi Pohon Keputusan (Decision Tree)
Decision Tree bekerja dengan cara mencari fitur dan titik ambang batas (*split point*) yang menghasilkan penurunan impuritas terbesar:
- **Gini Impurity**: $Gini = 1 - \\sum p_i^2$ (komputasi lebih cepat, standar Scikit-Learn).
- **Entropy**: $Entropy = -\\sum p_i \\log_2(p_i)$ (lebih sensitif pada distribusi kelas).

Kelemahan Terbesar:
Pohon tanpa batas kedalaman (*unconstrained tree*) akan terus membelah hingga setiap daun murni (Gini=0). Hasilnya adalah overfitting parah dengan varians sangat tinggi.`,
    practicalWalkthrough: {
      summary: 'Latih DecisionTreeClassifier, plot struktur diagram pohonnya, dan bandingkan efek ccp_alpha pada skor validasi.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Decision Tree with Pruning',
          language: 'python',
          code: `from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, random_state=42)

# Pohon ter-pruning dengan batasan kedalaman
tree = DecisionTreeClassifier(max_depth=3, min_samples_leaf=5, random_state=42)
tree.fit(X_train, y_train)

print(f"Train Accuracy: {tree.score(X_train, y_train):.3f}")
print(f"Test Accuracy : {tree.score(X_test, y_test):.3f}")

# Visualisasikan diagram pohon
plt.figure(figsize=(14, 8))
plot_tree(tree, feature_names=data.feature_names, class_names=data.target_names, filled=True, rounded=True)
plt.title("Visualisasi Struktur Decision Tree")
plt.show()`,
          explanation: 'Membatasi max_depth menghasilkan pohon yang mudah diinterpretasikan oleh stakeholder non-teknis.',
        },
      ],
    },
    stepByStepInstructions: [
      'Muat dataset klasifikasi (Breast Cancer atau Iris).',
      'Latih pohon tanpa batas (tanpa parameter batasan) dan amati skor train (pasti 1.0) vs skor test.',
      'Terapkan parameter pre-pruning: max_depth=3 dan min_samples_split=10.',
      'Gunakan plot_tree atau export_text untuk membaca aturan inferensi logis model.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Tree', type: 'tool', description: 'DecisionTreeClassifier, plot_tree, export_text' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Interpretasi Pohon', description: 'Identifikasi fitur di simpul akar (root node) dan jelaskan mengapa fitur tersebut dipilih pertama kali oleh algoritma.' },
      { title: 'Cost Complexity Pruning', description: 'Gunakan path cost_complexity_pruning_path untuk menemukan ccp_alpha dengan validasi skor terbaik.', isStretch: true },
    ],
    deliverables: [
      'Gambar diagram diagram pohon keputusan.',
      'Perbandingan skor train vs test sebelum dan sesudah pruning.',
    ],
    checklist: [
      { id: 'c1', label: 'Decision tree berhasil dilatih dan divisualisasikan', isRequired: true },
      { id: 'c2', label: 'Pre-pruning diterapkan untuk mencegah kedalaman berlebih', isRequired: true },
      { id: 'c3', label: 'Fitur root node diinterpretasikan maknanya', isRequired: true },
    ],
    definitionOfDone: [
      'Model terbukti tidak overfit ekstrem dengan selisih akurasi train-test di bawah 10%.',
    ],
    reflectionQuestions: [
      'Mengapa sedikit perubahan pada dataset latih bisa merombak total seluruh struktur cabang Decision Tree?',
      'Kapan pohon keputusan lebih diutamakan daripada deep learning?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 14 untuk menggabungkan ratusan pohon ke dalam Random Forest.',
  },
  {
    id: 'day-014',
    day: 14,
    phaseId: 2,
    title: 'Random Forest Lab',
    shortDescription: 'Konsep Ensemble Bagging, Bootstrap Aggregation, Out-Of-Bag (OOB) score, dan Feature Importances.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami filosofi ensemble: menggabungkan banyak weak learner menjadi strong learner.',
      'Membedakan teknik Bagging (Bootstrap Aggregation) dengan Random Subspace (fitur acak).',
      'Menggunakan Out-Of-Bag (OOB) Score sebagai pengganti cross-validation gratis.',
      'Mengekstrak dan memplot Feature Importance berbasis MDI (Mean Decrease Impurity).',
    ],
    theoryContent: `### Kekuatan Kebijaksanaan Massa (Ensemble of Trees)
Satu Decision Tree memiliki varians tinggi. **Random Forest** menurunkan varians secara drastis melalui dua mekanisme acak:
1. **Bootstrap Sampling**: Setiap pohon dilatih pada subset acak baris data dengan pengembalian (*with replacement*).
2. **Random Feature Subspace**: Pada setiap percabangan split, hanya $\\sqrt{P}$ fitur acak yang dipertimbangkan.

Hasilnya: Pohon-pohon di dalam hutan tidak saling berkorelasi (*decorrelated trees*), sehingga ketika hasil prediksinya dirata-ratakan, error varians menurun mendekati nol!`,
    practicalWalkthrough: {
      summary: 'Latih RandomForestClassifier dengan oob_score=True dan bandingkan skor OOB dengan skor test set.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Random Forest with OOB & Feature Importances',
          language: 'python',
          code: `from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import matplotlib.pyplot as plt

rf = RandomForestClassifier(
    n_estimators=150,
    max_depth=8,
    oob_score=True,
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)

print(f"OOB Score     : {rf.oob_score_:.4f}")
print(f"Test Accuracy : {rf.score(X_test, y_test):.4f}")

# Feature Importances MDI
importances = pd.Series(rf.feature_importances_, index=data.feature_names)
importances.nlargest(10).plot(kind='barh', color='#8b5cf6')
plt.title("Top 10 Feature Importances (Random Forest)")
plt.xlabel("MDI Importance")
plt.gca().invert_yaxis()
plt.show()`,
          explanation: 'Mendapatkan estimasi reliabel secara instan tanpa perlu split validasi terpisah berkat OOB score.',
        },
      ],
    },
    stepByStepInstructions: [
      'Muat dataset klasifikasi atau regresi tabular.',
      'Latih RandomForestClassifier dengan n_estimators bervariasi (50, 100, 200).',
      'Aktifkan parameter oob_score=True dan verifikasi korelasinya dengan test score.',
      'Plot 10 fitur paling penting yang diidentifikasi oleh Random Forest.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Ensemble', type: 'tool', description: 'RandomForestClassifier / Regressor' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Random Forest', description: 'Buktikan bahwa Random Forest mengungguli single Decision Tree dari Hari 13 pada dataset yang sama.' },
      { title: 'Tantangan OOB vs CV', description: 'Bandingkan nilai OOB Score dengan 5-Fold Cross Validation score dan hitung perbandingan efisiensi waktu komputasinya.', isStretch: true },
    ],
    deliverables: [
      'Grafik bar horizontal Top 10 Feature Importances.',
      'Catatan perbandingan metrik Single Tree vs Random Forest.',
    ],
    checklist: [
      { id: 'c1', label: 'Random Forest dilatih dengan konfigurasi n_jobs=-1 untuk paralelisme', isRequired: true },
      { id: 'c2', label: 'OOB score berhasil dihitung dan dibandingkan dengan test accuracy', isRequired: true },
      { id: 'c3', label: 'Diagram feature importances diinterpretasikan dengan logis', isRequired: true },
    ],
    definitionOfDone: [
      'Random Forest berhasil menghasilkan akurasi lebih tinggi dan varians lebih rendah dari single tree.',
    ],
    reflectionQuestions: [
      'Mengapa Random Forest jauh lebih kebal terhadap overfitting dibanding Decision Tree tunggal?',
      'Apa kelemahan Feature Importance berbasis Mean Decrease Impurity (MDI) pada fitur dengan kardinalitas tinggi?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 15 untuk menguji algoritma berbasis jarak non-parametrik: K-Nearest Neighbors (KNN).',
  },
  {
    id: 'day-015',
    day: 15,
    phaseId: 2,
    title: 'KNN Experiment',
    shortDescription: 'K-Nearest Neighbors: Kutukan dimensi (Curse of Dimensionality), pemilihan metrik jarak (Euclidean vs Manhattan), dan optimasi nilai K.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami mekanisme lazy learning berbasis instance-based prediction.',
      'Menganalisis dampak Curse of Dimensionality saat jumlah fitur bertambah.',
      'Menemukan nilai K optimal (bias-variance tradeoff pada K kecil vs K besar).',
      'Membuktikan fatalnya lupa melakukan feature scaling pada algoritma berbasis jarak.',
    ],
    theoryContent: `### Jangan Sampai Terkutuk Dimensi (Curse of Dimensionality)
KNN tidak mempelajari bobot persamaan selama masa training; algoritma ini hanya menyimpan seluruh data ke memori (*lazy learner*). Saat inferensi, KNN menghitung jarak titik uji ke semua titik data:
$$d(x, y) = \\sqrt{\\sum_{i=1}^p (x_i - y_i)^2}$$

Tantangan Kunci:
1. **Sensitivitas Skala**: Fitur dengan rentang 0-100,000 (gaji) akan mendominasi total jarak dibanding fitur 0-1 (umur diskalakan). Scaling adalah **wajib mutlak**.
2. **Kecil vs Besar**: $K=1$ menyebabkan overfitting ekstrim (meniru noise tetangga terdekat). $K$ terlalu besar menyebabkan underfitting (tebakan mendekati kelas mayoritas).`,
    practicalWalkthrough: {
      summary: 'Eksperimen kurva akurasi KNN pada rentang K=1 sampai K=30, dan buktikan kerusakan performa tanpa StandardScaler.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'KNN Distance & K-Tuning Lab',
          language: 'python',
          code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import matplotlib.pyplot as plt

k_range = range(1, 31, 2)
test_scores_scaled = []
test_scores_unscaled = []

for k in k_range:
    # 1. Dengan scaling
    pipe = Pipeline([('scaler', StandardScaler()), ('knn', KNeighborsClassifier(n_neighbors=k))])
    pipe.fit(X_train, y_train)
    test_scores_scaled.append(pipe.score(X_test, y_test))
    
    # 2. Tanpa scaling
    raw_knn = KNeighborsClassifier(n_neighbors=k).fit(X_train, y_train)
    test_scores_unscaled.append(raw_knn.score(X_test, y_test))

plt.figure(figsize=(9, 5))
plt.plot(k_range, test_scores_scaled, 'o-', color='purple', label='Dengan Scaling (StandardScaler)')
plt.plot(k_range, test_scores_unscaled, 'x--', color='gray', label='Tanpa Scaling (Mentah)')
plt.title("Pengaruh Scaling & Nilai K pada Akurasi KNN")
plt.xlabel("Nilai K (Jumlah Tetangga)")
plt.ylabel("Akurasi Uji")
plt.legend()
plt.grid(True)
plt.show()`,
          explanation: 'Grafik memperlihatkan dengan nyata jurang performa jika fitur tidak distandarisasi.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset dengan minimal 6 fitur numerik berskala berbeda.',
      'Uji performa KNN pada nilai K dari 1 hingga 30.',
      'Ganti metrik jarak dari Euclidean (p=2) menjadi Manhattan (p=1) dan amati pengaruhnya.',
      'Pilih nilai K terbaik yang memberikan akurasi stabil tanpa lonjakan varians.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Neighbors', type: 'tool', description: 'KNeighborsClassifier, KNeighborsRegressor' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas KNN', description: 'Temukan nilai K optimal pada dataset Anda dan buktikan pentingnya scaling secara empiris.' },
      { title: 'Tantangan Inferensi Latency', description: 'Ukur waktu inferensi KNN saat ukuran data uji dinaikkan dari 100 sampel menjadi 10.000 sampel.', isStretch: true },
    ],
    deliverables: [
      'Plot kurva akurasi K vs akurasi uji (dengan vs tanpa scaling).',
      'Catatan nilai K terbaik dan metrik jarak yang dipilih.',
    ],
    checklist: [
      { id: 'c1', label: 'Scaling diterapkan ke dalam pipeline KNN', isRequired: true },
      { id: 'c2', label: 'Eksperimen rentang K ganjil (1..31) berhasil divisualisasikan', isRequired: true },
      { id: 'c3', label: 'K optimal dipilih berdasarkan bukti kurva validasi', isRequired: true },
    ],
    definitionOfDone: [
      'Model KNN mencapai performa optimal dengan nilai K yang terjustifikasi data.',
    ],
    reflectionQuestions: [
      'Mengapa kita selalu memilih nilai K ganjil untuk masalah klasifikasi biner?',
      'Mengapa KNN tidak cocok untuk dataset raksasa dengan jutaan baris data?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 16 untuk mempelajari Support Vector Machine (SVM) dan trik kernel.',
  },
  {
    id: 'day-016',
    day: 16,
    phaseId: 2,
    title: 'SVM Experiment',
    shortDescription: 'Support Vector Machines: Maximum margin hyperplane, support vectors, dan Kernel Trick (RBF vs Linear).',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami konsep margin maksimum dan identifikasi support vector titik kritis.',
      'Mengatur parameter penalti C (soft margin vs hard margin).',
      'Menerapkan Kernel Trick (Radial Basis Function / RBF) untuk memisahkan data non-linear.',
      'Memahami peranan hyperparameter gamma pada fleksibilitas batas keputusan.',
    ],
    theoryContent: `### Memaksimalkan Ruang Aman dengan SVM
SVM berusaha mencari hyperplane yang memiliki jarak terjauh (*maximum margin*) ke titik data terdekat dari kedua kelas. Titik terdekat inilah yang disebut **Support Vectors**.

Kernel Trick:
Jika data tidak dapat dipisahkan secara linier di ruang 2D, kita tidak perlu menghitung koordinat dimensi tinggi secara manual. Fungsi Kernel (seperti RBF / Gaussian) menghitung *dot product* di ruang dimensi tinggi secara implisit:
$$K(x, x') = \\exp(-\\gamma ||x - x'||^2)$$

Hyperparameter Inti:
- **C**: Nilai C tinggi = margin sempit, penalti salah klasifikasi berat (rawan overfit). Nilai C rendah = margin lebar, toleran terhadap error.
- **gamma**: Nilai gamma tinggi = setiap titik memiliki radius pengaruh sempit (batas keputusan bergelombang rumit).`,
    practicalWalkthrough: {
      summary: 'Latih SVC dengan kernel Linier vs RBF, identifikasi jumlah support vectors, dan evaluasi performa.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'SVM Kernel Comparison',
          language: 'python',
          code: `from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report

for kernel_type in ['linear', 'rbf']:
    svm_pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('svc', SVC(kernel=kernel_type, C=1.0, gamma='scale', random_state=42))
    ])
    svm_pipe.fit(X_train, y_train)
    acc = svm_pipe.score(X_test, y_test)
    num_sv = svm_pipe.named_steps['svc'].support_vectors_.shape[0]
    print(f"Kernel: {kernel_type:6s} | Akurasi: {acc:.4f} | Jumlah Support Vectors: {num_sv}")`,
          explanation: 'Membandingkan kapasitas representasi kernel linear vs RBF dalam menangani pola non-linear.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset klasifikasi non-linear (misal make_moons atau breast cancer).',
      'Bungkus SVM selalu dalam pipeline dengan StandardScaler.',
      'Bandingkan kernel="linear", kernel="poly", dan kernel="rbf".',
      'Hitung berapa persen dari total data latihan yang menjadi support vectors.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn SVM', type: 'tool', description: 'SVC, SVR, LinearSVC' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Kernel RBF', description: 'Latih model SVC(kernel="rbf") dan capai akurasi uji di atas 90% pada dataset pilihan Anda.' },
      { title: 'Tantangan Grid Gamma-C', description: 'Uji 4 kombinasi ekstrim: (C=0.01, gamma=0.01) vs (C=100, gamma=10) dan visualisasikan batas keputusannya.', isStretch: true },
    ],
    deliverables: [
      'Laporan klasifikasi performa kernel linier vs RBF.',
      'Catatan jumlah support vector yang terbentuk.',
    ],
    checklist: [
      { id: 'c1', label: 'StandardScaler dipasang di depan model SVM', isRequired: true },
      { id: 'c2', label: 'Eksperimen kernel linear vs RBF berhasil dieksekusi', isRequired: true },
      { id: 'c3', label: 'Efek parameter C dan gamma dipahami dan dicatat', isRequired: true },
    ],
    definitionOfDone: [
      'Model SVM terkonfigurasi dengan kernel dan parameter C yang tepat sesuai bentuk data.',
    ],
    reflectionQuestions: [
      'Mengapa titik-titik yang bukan merupakan support vector sama sekali tidak memengaruhi letak hyperplane SVM?',
      'Kapan LinearSVC jauh lebih cepat digunakan dibanding SVC(kernel="linear")?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 17 untuk memahami pengklasifikasi probabilistik berbasis teorema Bayes: Naive Bayes.',
  },
  {
    id: 'day-017',
    day: 17,
    phaseId: 2,
    title: 'Naive Bayes Lab',
    shortDescription: 'Teorema Bayes, asumsi independensi fitur bersyarat, GaussianNB, MultinomialNB untuk teks, dan Laplace smoothing.',
    difficulty: 'Intermediate',
    estimatedDuration: '65 Menit',
    learningObjectives: [
      'Memahami Teorema Bayes: Prior, Likelihood, Posterior, dan Evidence.',
      'Memahami mengapa dinamakan "Naive": asumsi independensi bersyarat antar fitur.',
      'Menggunakan GaussianNB untuk fitur kontinu dan MultinomialNB untuk fitur frekuensi/teks.',
      'Menerapkan Laplace Smoothing (alpha=1.0) untuk menghindari masalah probabilitas nol (Zero Frequency Problem).',
    ],
    theoryContent: `### Teorema Bayes dan Mengapa "Kepolosan" (Naivety) Berhasil
Teorema Bayes menyatakan:
$$P(y|x_1, \\dots, x_n) = \\frac{P(y) \\prod_{i=1}^n P(x_i|y)}{P(x_1, \\dots, x_n)}$$

Asumsi Naive:
Model berasumsi bahwa setiap fitur $x_i$ tidak saling memengaruhi satu sama lain jika kelas $y$ diketahui. Dalam kenyataan teks, kata "Machine" dan "Learning" sering muncul bersamaan (tidak independen). Meskipun asumsinya salah, Naive Bayes sangat tangguh, membutuhkan data sangat sedikit, dan super cepat untuk klasifikasi teks/spam.`,
    practicalWalkthrough: {
      summary: 'Latih MultinomialNB pada dataset klasifikasi teks spam sederhana atau GaussianNB pada data tabular.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Spam Detection with MultinomialNB',
          language: 'python',
          code: `from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

emails = [
    "Menangkan hadiah uang tunai klik di sini sekarang!",
    "Jadwal meeting sprint besok pagi jam sembilan",
    "Promo diskon pulsa murah tanpa syarat transfer",
    "Laporan keuangan kuartal ketiga terlampir",
    "Selamat kamu dapat undian gratis mobil baru",
    "Revisi proposal machine learning sudah saya kirim"
]
labels = [1, 0, 1, 0, 1, 0] # 1: Spam, 0: Ham

nb_pipeline = Pipeline([
    ('vectorizer', CountVectorizer()),
    ('nb', MultinomialNB(alpha=1.0)) # Laplace smoothing
])
nb_pipeline.fit(emails, labels)

# Uji kalimat baru
test_emails = ["Klik link ini untuk klaim hadiah gratis", "Meeting laporan proyek"]
print("Prediksi:", nb_pipeline.predict(test_emails))
print("Probabilitas Spam:", nb_pipeline.predict_proba(test_emails)[:, 1])`,
          explanation: 'MultinomialNB menghitung frekuensi kemunculan token kata untuk memperkirakan kemungkinan pesan tergolong spam.',
        },
      ],
    },
    stepByStepInstructions: [
      'Siapkan dataset teks sederhana atau gunakan dataset spam SMS publik.',
      'Gunakan CountVectorizer untuk mengubah kalimat menjadi matriks frekuensi token.',
      'Latih MultinomialNB dengan parameter smoothing default (alpha=1.0).',
      'Coba masukkan kalimat uji dengan kata-kata baru yang belum pernah muncul di data latih.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Naive Bayes', type: 'tool', description: 'MultinomialNB, GaussianNB' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Naive Bayes', description: 'Bangun pengklasifikasi teks sederhana dan periksa probabilitas output menggunakan predict_proba.' },
      { title: 'Tantangan Zero Frequency', description: 'Setel alpha=0 (tanpa smoothing) dan tunjukkan bagaimana kemunculan kata asing menyebabkan kalkulasi probabilitas gagal/nol.', isStretch: true },
    ],
    deliverables: [
      'Kode pipeline klasifikasi teks dengan evaluasi prediksi.',
      'Penjelasan peran Laplace smoothing dalam mencegah probabilitas nol.',
    ],
    checklist: [
      { id: 'c1', label: 'MultinomialNB berhasil dilatih bersama CountVectorizer', isRequired: true },
      { id: 'c2', label: 'Probabilitas diuji pada kalimat baru', isRequired: true },
      { id: 'c3', label: 'Peran Laplace smoothing dipahami dengan baik', isRequired: true },
    ],
    definitionOfDone: [
      'Pipeline Naive Bayes mampu mengklasifikasikan dokumen baru secara akurat dan cepat.',
    ],
    reflectionQuestions: [
      'Mengapa Naive Bayes sering dijadikan model baseline pertama yang tangguh dalam proyek NLP?',
      'Kapan GaussianNB lebih cocok digunakan daripada MultinomialNB?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 18 untuk memasuki dunia ensemble modern: Gradient Boosting.',
  },
  {
    id: 'day-018',
    day: 18,
    phaseId: 2,
    title: 'Gradient Boosting Lab',
    shortDescription: 'Memahami filosofi Boosting: Mempelajari pseudo-residual secara sekuensial, learning rate shrinkage, dan sub-sampling.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Membedakan prinsip kerja Bagging (paralel) vs Boosting (sekuensial).',
      'Memahami cara Gradient Boosting melatih pohon baru untuk memprediksi residual (sisa error) pohon sebelumnya.',
      'Mengatur trade-off antara learning_rate dan n_estimators.',
      'Menerapkan GradientBoostingClassifier dan HistGradientBoostingClassifier dari Scikit-Learn.',
    ],
    theoryContent: `### Filosofi Boosting: Belajar dari Kesalahan Masa Lalu
Berbeda dengan Random Forest yang melatih pohon secara independen di jalur paralel, **Gradient Boosting** bekerja secara sekuensial:
1. Pohon pertama membuat tebakan kasar.
2. Hitung selisih antara nilai nyata dan tebakan (disebut *Residual*).
3. Pohon kedua dilatih khusus untuk **memprediksi residual** tersebut.
4. Gabungkan prediksi dengan bobot kecil (*learning rate* $\\eta$):
$$\\hat{y}_{baru} = \\hat{y}_{lama} + \\eta \\cdot h_m(x)$$

Dengan learning rate kecil (misal 0.05), model belajar secara perlahan dan presisi tinggi tanpa langsung melompat drastis.`,
    practicalWalkthrough: {
      summary: 'Latih GradientBoostingClassifier dan HistGradientBoostingClassifier, lalu amati penurunan loss seiring bertambahnya pohon.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Gradient Boosting Staged Predict',
          language: 'python',
          code: `from sklearn.ensemble import GradientBoostingClassifier
import matplotlib.pyplot as plt
from sklearn.metrics import log_loss

gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.08, max_depth=3, random_state=42)
gb.fit(X_train, y_train)

# Pantau penurunan log-loss pada tiap tahapan (staged_predict_proba)
val_losses = [log_loss(y_test, prob) for prob in gb.staged_predict_proba(X_test)]
train_losses = [log_loss(y_train, prob) for prob in gb.staged_predict_proba(X_train)]

plt.figure(figsize=(8, 5))
plt.plot(train_losses, label='Train Log-Loss', color='blue')
plt.plot(val_losses, label='Validation Log-Loss', color='red')
plt.title("Perjalanan Loss pada Gradient Boosting")
plt.xlabel("Jumlah Pohon (Estimator)")
plt.ylabel("Log-Loss")
plt.legend()
plt.grid(True)
plt.show()`,
          explanation: 'Grafik staged loss memperlihatkan titik optimal sebelum model mulai overfit.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset tabular kompleks.',
      'Latih GradientBoostingClassifier dengan n_estimators=100 dan learning_rate=0.1.',
      'Gunakan loop staged_predict_proba untuk memantau loss data validasi di setiap iterasi pohon.',
      'Coba bandingkan kecepatannya dengan HistGradientBoostingClassifier (terinspirasi dari LightGBM).',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Ensemble', type: 'tool', description: 'GradientBoostingClassifier, HistGradientBoostingClassifier' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Gradient Boosting', description: 'Buktikan bahwa learning rate yang lebih kecil (0.02) dengan n_estimators lebih banyak (250) menghasilkan generalisasi test set yang lebih stabil.' },
      { title: 'Tantangan HistGradientBoosting', description: 'Benchmark waktu pelatihan HistGradientBoosting vs GradientBoosting standar pada dataset berukuran 100.000 baris.', isStretch: true },
    ],
    deliverables: [
      'Grafik penurunan train vs validation staged log-loss.',
      'Catatan trade-off antara learning rate dan jumlah estimator.',
    ],
    checklist: [
      { id: 'c1', label: 'Gradient Boosting dilatih secara sekuensial', isRequired: true },
      { id: 'c2', label: 'Staged loss dianalisis untuk mendeteksi titik awal overfit', isRequired: true },
      { id: 'c3', label: 'Perbedaan filosofi Bagging vs Boosting dicatat', isRequired: true },
    ],
    definitionOfDone: [
      'Mampu menjelaskan mekanisme prediksi residual dan dampak learning rate terhadap stabilitas model.',
    ],
    reflectionQuestions: [
      'Mengapa pohon individu di dalam Gradient Boosting biasanya dangkal (max_depth 3-5), sedangkan di Random Forest bisa dalam?',
      'Apa yang terjadi jika learning rate disetel terlalu besar (misal 1.0)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 19 untuk menguasai raja kompetisi tabular: XGBoost Challenge.',
  },
  {
    id: 'day-019',
    day: 19,
    phaseId: 2,
    title: 'XGBoost Challenge',
    shortDescription: 'Extreme Gradient Boosting: Arsitektur pohon tingkat lanjut, penanganan otomatis missing values, dan regularisasi pohon bawaan.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami keunggulan XGBoost: second-order gradients (Hessian), split-finding algorithm, dan regularisasi gamma & lambda.',
      'Menginstal dan mengintegrasikan xgboost ke dalam alur kerja Python.',
      'Menggunakan parameter spesifik: colsample_bytree, subsample, max_depth, reg_alpha, reg_lambda.',
      'Mengaktifkan early stopping rounds untuk menghentikan training otomatis saat val loss stagnan.',
    ],
    theoryContent: `### Mengapa XGBoost Mendominasi Dunia Kompetisi Tabular?
XGBoost (*eXtreme Gradient Boosting*) membawa optimasi algoritma dan komputasi ekstrem:
1. **Taylor Expansion Orde Dua**: Menggunakan turunan pertama (*gradient*) dan turunan kedua (*hessian*) untuk pembaruan bobot yang jauh lebih akurat.
2. **Built-in Regularization**: Menyertakan penalti kompleksitas daun ($\\gamma T$) dan penalti bobot L2 ($\\lambda$) langsung di fungsi objektif.
3. **Sparsity-aware Split Finding**: Otomatis menemukan jalur split optimal untuk data yang memiliki missing value tanpa perlu imputasi manual!`,
    practicalWalkthrough: {
      summary: 'Latih XGBClassifier dengan early stopping dan evaluasi metrik ROC-AUC pada data uji.',
      environment: 'Jupyter Notebook / Google Colab (pip install xgboost)',
      codeSnippets: [
        {
          title: 'XGBoost with Early Stopping',
          language: 'python',
          code: `import xgboost as xgb
from sklearn.metrics import roc_auc_score

# Inisialisasi model dengan API Scikit-learn kompatibel
model_xgb = xgb.XGBClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=5,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_lambda=1.5,
    early_stopping_rounds=20,
    eval_metric='logloss',
    random_state=42
)

# Fit dengan evaluation set untuk early stopping
model_xgb.fit(
    X_train, y_train,
    eval_set=[(X_train, y_train), (X_test, y_test)],
    verbose=50
)

print(f"Pohon terbaik berhenti di iterasi: {model_xgb.best_iteration}")
y_pred_proba = model_xgb.predict_proba(X_test)[:, 1]
print(f"Test ROC-AUC: {roc_auc_score(y_test, y_pred_proba):.4f}")`,
          explanation: 'Early stopping rounds memastikan pelatihan berhenti otomatis begitu skor validasi tidak lagi membaik.',
        },
      ],
    },
    stepByStepInstructions: [
      'Instal library xgboost jika belum ada: pip install xgboost.',
      'Bagi data menjadi train, validation, dan test set.',
      'Konfigurasikan XGBClassifier dengan subsample dan colsample_bytree sebesar 0.8 untuk mereduksi overfit.',
      'Pasang parameter early_stopping_rounds=20.',
      'Amati pada iterasi ke berapa proses training berhenti.',
    ],
    requiredToolsAndDatasets: [
      { name: 'XGBoost Library', type: 'tool', url: 'https://xgboost.readthedocs.io/', description: 'Library gradient boosting performa tinggi' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas XGBoost', description: 'Latih XGBoost pada dataset tabular Anda dan catat peningkatan skor dibanding model baseline sebelumnya.' },
      { title: 'Tantangan Missing Value Alami', description: 'Masukkan sengaja nilai np.nan ke beberapa fitur dan buktikan XGBoost mampu melakukan inferensi tanpa error imputasi.', isStretch: true },
    ],
    deliverables: [
      'Log output training yang memperlihatkan kurva penurunan loss per 50 iterasi.',
      'Nilai ROC-AUC akhir dan nomor iterasi terbaik.',
    ],
    checklist: [
      { id: 'c1', label: 'XGBoost berhasil diinstal dan diimpor tanpa error dependensi', isRequired: true },
      { id: 'c2', label: 'Early stopping dikonfigurasi dengan evaluation set yang benar', isRequired: true },
      { id: 'c3', label: 'Performa model XGBoost dievaluasi dengan ROC-AUC atau F1', isRequired: true },
    ],
    definitionOfDone: [
      'Model XGBoost terlatih optimal dengan pencegahan overfit melalui early stopping.',
    ],
    reflectionQuestions: [
      'Apa keunggulan second-order approximation (Hessian) dibanding first-order gradient saja?',
      'Bagaimana XGBoost menangani baris data yang memiliki nilai missing secara internal?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 20 untuk melakukan pencarian hyperparameter sistematis via Optuna & RandomSearch.',
  },
  {
    id: 'day-020',
    day: 20,
    phaseId: 2,
    title: 'Hyperparameter Tuning',
    shortDescription: 'Evolusi tuning: Grid Search (brute-force) vs Randomized Search vs Bayesian Optimization menggunakan Optuna.',
    difficulty: 'Intermediate',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Memahami kekurangan GridSearch: pemborosan komputasi pada dimensi parameter tinggi.',
      'Menerapkan RandomizedSearchCV untuk eksplorasi ruang parameter yang lebih efisien.',
      'Memahami prinsip Bayesian Optimization: memodelkan fungsi probabilitas performa (Surrogate Model).',
      'Menggunakan Optuna untuk melakukan tuning hyperparameter secara cerdas dengan pruning trial buruk.',
    ],
    theoryContent: `### Jangan Buang Waktu Menghitung Titik Grid yang Sia-sia!
- **GridSearch**: Menguji seluruh kombinasi matriks. Jika ada 5 parameter dengan masing-masing 5 nilai, ada $5^5 = 3125$ kombinasi model $\\times$ 5 folds = 15.625 kali pelatihan! Seringkali hanya 1 atau 2 parameter yang benar-benar berpengaruh signifikan.
- **RandomizedSearch**: Memilih kombinasi acak. Berdasarkan teorema Bergstra & Bengio, 60 iterasi acak memiliki 95% peluang menemukan nilai dalam rentang 5% terbaik!
- **Bayesian Optimization (Optuna)**: Menggunakan riwayat hasil masa lalu untuk memandu tebakan berikutnya ke area parameter yang paling menjanjikan (*Tree-structured Parzen Estimator / TPE*).`,
    practicalWalkthrough: {
      summary: 'Gunakan Optuna untuk mengoptimalkan hyperparameter XGBoost atau Random Forest dalam 30 trials.',
      environment: 'Jupyter Notebook / Google Colab (pip install optuna)',
      codeSnippets: [
        {
          title: 'Bayesian Optimization with Optuna',
          language: 'python',
          code: `import optuna
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

def objective(trial):
    # Definisikan ruang pencarian parameter
    n_estimators = trial.suggest_int('n_estimators', 50, 300, step=50)
    max_depth = trial.suggest_int('max_depth', 3, 15)
    min_samples_split = trial.suggest_int('min_samples_split', 2, 20)
    
    clf = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        random_state=42,
        n_jobs=-1
    )
    # Target optimasi: rata-rata F1 makro
    scores = cross_val_score(clf, X_train, y_train, cv=3, scoring='f1_macro')
    return scores.mean()

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=25)

print("Parameter Terbaik:", study.best_params)
print("F1 Terbaik       :", study.best_value)`,
          explanation: 'Optuna secara otomatis mengeksplorasi kombinasi parameter terbaik dengan efisiensi komputasi tinggi.',
        },
      ],
    },
    stepByStepInstructions: [
      'Instal pustaka optuna via pip.',
      'Tulis fungsi objective yang menerima objek trial dan mengembalikan metrik evaluasi cross-validation.',
      'Jalankan study.optimize dengan n_trials minimal 25.',
      'Tampilkan visualisasi optuna.visualization.plot_param_importances(study) jika menggunakan jupyter.',
      'Latih model final menggunakan dictionary study.best_params.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Optuna', type: 'tool', url: 'https://optuna.org/', description: 'Framework optimasi hyperparameter generasi baru' },
      { name: 'Scikit-learn Model Selection', type: 'tool', description: 'RandomizedSearchCV' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Tuning Optuna', description: 'Jalankan 25 iterasi Optuna untuk menemukan kombinasi parameter terbaik dan bandingkan dengan model default.' },
      { title: 'Tantangan Early Pruning', description: 'Terapkan MedianPruner pada Optuna untuk menghentikan trial yang terbukti buruk di fold awal secara otomatis.', isStretch: true },
    ],
    deliverables: [
      'Daftar best_params dari hasil optimasi.',
      'Perbandingan skor metrik sebelum tuning vs sesudah tuning.',
    ],
    checklist: [
      { id: 'c1', label: 'Fungsi objektif tuning didefinisikan dengan benar', isRequired: true },
      { id: 'c2', label: 'Cross-validation digunakan di dalam loop tuning untuk mencegah overfit ke test set', isRequired: true },
      { id: 'c3', label: 'Model final dilatih menggunakan parameter terbaik', isRequired: true },
    ],
    definitionOfDone: [
      'Hyperparameter tuning menghasilkan perbaikan performa terukur tanpa kebocoran data uji.',
    ],
    reflectionQuestions: [
      'Mengapa menyetel hyperparameter berdasarkan skor test set merupakan pelanggaran fatal metodologi ML?',
      'Bagaimana algoritma TPE pada Optuna memilih titik tebakan berikutnya?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 21 untuk memangkas fitur-fitur redundan melalui Feature Selection.',
  },
  {
    id: 'day-021',
    day: 21,
    phaseId: 2,
    title: 'Feature Selection',
    shortDescription: 'Memangkas noise: VarianceThreshold, korelasi multikolinearitas (VIF), SelectKBest, dan Recursive Feature Elimination (RFE).',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami prinsip parsimoni (Occam Razor): model dengan fitur lebih sedikit lebih stabil dan mudah dipelihara.',
      'Menghapus fitur dengan varians mendekati nol (VarianceThreshold).',
      'Menerapkan seleksi berbasis statistik: SelectKBest dengan f_classif / mutual_info_classif.',
      'Menggunakan Recursive Feature Elimination (RFECV) dengan cross-validation otomatis.',
    ],
    theoryContent: `### Lebih Banyak Fitur Bukan Berarti Lebih Pintar!
Menambahkan 100 fitur acak seringkali menurunkan performa model karena memicu *Curse of Dimensionality* dan mengundang noise.

Tiga Taksonomi Seleksi Fitur:
1. **Filter Methods**: Menghitung korelasi statistik murni antara fitur dan target secara independen (misal Mutual Information). Sangat cepat.
2. **Wrapper Methods**: Menggunakan model ML sebenarnya untuk menguji subset fitur (misal RFE). Sangat akurat namun komputasi berat.
3. **Embedded Methods**: Seleksi terjadi secara alami selama masa training (misal penalti L1 Lasso atau Feature Importance Pohon).`,
    practicalWalkthrough: {
      summary: 'Terapkan RFECV pada dataset dengan banyak fitur dan temukan jumlah fitur minimal yang memberikan performa puncak.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'RFECV Feature Pruning',
          language: 'python',
          code: `from sklearn.feature_selection import RFECV
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold
import matplotlib.pyplot as plt

rf = RandomForestClassifier(n_estimators=50, random_state=42)
cv = StratifiedKFold(5)

# Recursive Feature Elimination with Cross-Validation
rfecv = RFECV(estimator=rf, step=1, cv=cv, scoring='f1_macro', min_features_to_select=3)
rfecv.fit(X_train, y_train)

print(f"Jumlah Fitur Optimal: {rfecv.n_features_}")
selected_features = [f for f, s in zip(feature_names, rfecv.support_) if s]
print("Fitur Terpilih:", selected_features)

# Plot jumlah fitur vs skor CV
plt.figure(figsize=(8, 4))
plt.plot(range(3, len(feature_names) + 1), rfecv.cv_results_['mean_test_score'])
plt.xlabel("Jumlah Fitur Terpilih")
plt.ylabel("Cross-Validation F1")
plt.title("Optimasi Jumlah Fitur (RFECV)")
plt.grid(True)
plt.show()`,
          explanation: 'Grafik menunjukkan titik saturasi di mana penambahan fitur lebih lanjut tidak lagi menaikkan skor.',
        },
      ],
    },
    stepByStepInstructions: [
      'Ambil dataset dengan minimal 15 fitur (atau buat fitur polinomial tambahan).',
      'Terapkan VarianceThreshold untuk mengeliminasi kolom yang nilainya hampir konstan.',
      'Jalankan RFECV atau SelectKBest(mutual_info_classif, k=8).',
      'Latih model dengan seluruh fitur vs hanya fitur terpilih dan bandingkan akurasi serta kecepatan inferensi.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Feature Selection', type: 'tool', description: 'RFECV, SelectKBest, mutual_info_classif' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Seleksi Fitur', description: 'Pangkas minimal 30% fitur tanpa menurunkan performa evaluasi uji model.' },
      { title: 'Mutual Information vs F-test', description: 'Bandingkan fitur yang dipilih oleh f_classif (hubungan linier) vs mutual_info_classif (hubungan non-linier).', isStretch: true },
    ],
    deliverables: [
      'Grafik kurva performa CV terhadap jumlah fitur.',
      'Daftar nama fitur yang dipertahankan dan fitur yang dibuang beserta alasannya.',
    ],
    checklist: [
      { id: 'c1', label: 'Seleksi fitur dilakukan di dalam fold training (anti-leakage)', isRequired: true },
      { id: 'c2', label: 'Jumlah fitur berhasil dipangkas dengan dampak performa minimal', isRequired: true },
      { id: 'c3', label: 'Perbandingan kecepatan dan akurasi dicatat', isRequired: true },
    ],
    definitionOfDone: [
      'Model menjadi lebih ramping, lebih cepat diproses, dan mempertahankan akurasi target.',
    ],
    reflectionQuestions: [
      'Mengapa menghitung seleksi fitur pada seluruh dataset sebelum train-test split menyebabkan data leakage?',
      'Apa risiko membuang dua fitur yang saling berkorelasi tinggi secara sembarangan?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 22 untuk menaklukkan musuh bebuyutan machine learning: Imbalanced Data Lab.',
  },
  {
    id: 'day-022',
    day: 22,
    phaseId: 2,
    title: 'Imbalanced Data Lab',
    shortDescription: 'Menangani ketidakseimbangan kelas ekstrem: Random Undersampling, SMOTE, class_weight="balanced", dan focal loss concept.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami bahaya ketidakseimbangan kelas (rasio 95:5 atau 99:1) pada fraud, medis, dan churn.',
      'Menerapkan class_weight="balanced" sebagai solusi non-sampling yang elegan.',
      'Menggunakan SMOTE (Synthetic Minority Over-sampling Technique) dan variasinya (Borderline-SMOTE).',
      'Menjamin SMOTE HANYA diterapkan pada data latih di dalam imblearn.pipeline.Pipeline.',
    ],
    theoryContent: `### Menangani Data Berat Sebelah
Jika data fraud hanya ada 0.5%, model malas akan selalu memprediksi "Normal" dan mendapatkan akurasi 99.5%.

Strategi Mengatasi Imbalance:
1. **Penyesuaian Bobot Loss (Class Weights)**: Memberi denda 100x lipat jika model salah mengklasifikasikan kelas minoritas:
   \`LogisticRegression(class_weight='balanced')\` atau \`scale_pos_weight\` di XGBoost.
2. **Resampling (SMOTE)**: Menghasilkan sampel sintetis di sepanjang garis penghubung k-tetangga terdekat kelas minoritas.
3. **Peringatan Keras**: JANGAN PERNAH melakukan SMOTE sebelum train-test split! Jika sampel sintetis masuk ke test set, hasil evaluasi Anda adalah kebohongan publik (*synthetic leakage*).`,
    practicalWalkthrough: {
      summary: 'Gunakan imbalanced-learn pipeline dengan SMOTE dan bandingkan dengan class_weight="balanced".',
      environment: 'Jupyter Notebook / Google Colab (pip install imbalanced-learn)',
      codeSnippets: [
        {
          title: 'Leak-Free SMOTE Pipeline',
          language: 'python',
          code: `from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler

# Gunakan Pipeline dari imblearn (BUKAN sklearn biasa) agar SMOTE hanya jalan saat .fit()
pipeline_smote = ImbPipeline([
    ('scaler', StandardScaler()),
    ('smote', SMOTE(random_state=42)),
    ('classifier', LogisticRegression(random_state=42))
])

pipeline_smote.fit(X_train, y_train)
y_pred = pipeline_smote.predict(X_test)

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\\nClassification Report:")
print(classification_report(y_test, y_pred))`,
          explanation: 'imblearn.pipeline menjamin SMOTE hanya meregenerasi data sintetis pada saat training, tidak menyentuh test set.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset klasifikasi dengan rasio minoritas di bawah 15% (atau buat sintetis dengan make_classification).',
      'Latih model baseline tanpa penanganan imbalance dan amati nilai Recall kelas minoritas (biasanya sangat rendah).',
      'Bandingkan dua solusi: (1) class_weight="balanced" vs (2) SMOTE resampled pipeline.',
      'Evaluasi menggunakan metrik PR-AUC, F1-macro, dan Confusion Matrix.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Imbalanced-Learn (imblearn)', type: 'tool', url: 'https://imbalanced-learn.org/', description: 'Library spesialisasi imbalance' },
      { name: 'Credit Card Fraud Detection Dataset', type: 'dataset', description: 'Dataset transaksi tipikal imbalance' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Imbalance', description: 'Tingkatkan Recall kelas minoritas dari model Anda minimal 30% tanpa membuat Precision anjlok di bawah 0.4.' },
      { title: 'Tantangan SMOTE vs RandomUndersampling', description: 'Bandingkan waktu komputasi dan performa SMOTE vs RandomUnderSampler pada dataset besar.', isStretch: true },
    ],
    deliverables: [
      'Tabel perbandingan Confusion Matrix sebelum vs sesudah SMOTE.',
      'Laporan metrik Precision, Recall, dan F1 untuk kelas minoritas.',
    ],
    checklist: [
      { id: 'c1', label: 'Imbalance diatasi tanpa memanipulasi data uji (zero test contamination)', isRequired: true },
      { id: 'c2', label: 'Class_weight="balanced" dan SMOTE telah diuji coba', isRequired: true },
      { id: 'c3', label: 'Recall kelas minoritas mengalami peningkatan terukur', isRequired: true },
    ],
    definitionOfDone: [
      'Model terbukti mampu mendeteksi keberadaan kelas minoritas secara konsisten.',
    ],
    reflectionQuestions: [
      'Mengapa akurasi adalah metrik paling berbahaya dan tidak berguna pada dataset imbalance?',
      'Kapan penyesuaian bobot (cost-sensitive learning) lebih disukai dibanding membangkitkan data sintetis dengan SMOTE?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 23 untuk mengkalibrasi titik ambang batas keputusan di Threshold Tuning.',
  },
  {
    id: 'day-023',
    day: 23,
    phaseId: 2,
    title: 'Threshold Tuning',
    shortDescription: 'Melangkah keluar dari threshold default 0.5: Cost-benefit matrix, profit curves, dan kalibrasi probabilitas Brier Score.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami mengapa threshold 0.5 hanyalah konvensi arbitrer yang jarang optimal di dunia nyata.',
      'Menyusun Cost-Benefit Matrix berdasarkan nilai finansial nyata bisnis.',
      'Membuat kurva Expected Value / Profit Curve untuk menentukan threshold optimal secara matematis.',
      'Memeriksa kalibrasi probabilitas menggunakan CalibrationDisplay dan Brier score.',
    ],
    theoryContent: `### Menghubungkan Prediksi ML dengan Keputusan Bisnis Nyata
Setiap keputusan klasifikasi memiliki konsekuensi biaya:
- **True Positive (TP)**: Mendeteksi fraud senilai Rp 10.000.000 (Hemat Rp 10.000.000 - biaya investigasi Rp 50.000).
- **False Positive (FP)**: Memblokir transaksi nasabah setia (Biaya komplain/kehilangan pelanggan = -Rp 200.000).
- **False Negative (FN)**: Kebobolan fraud (Rugi = -Rp 10.000.000).

Fungsi Expected Profit:
$$\\text{Profit}(th) = N_{TP}(th) \\times V_{TP} + N_{FP}(th) \\times V_{FP} + N_{FN}(th) \\times V_{FN}$$
Threshold optimal adalah nilai probabilitas yang memaksimalkan total profit bersih, bukan sekadar memuaskan akurasi.`,
    practicalWalkthrough: {
      summary: 'Buat simulasi matriks biaya dan cari threshold yang menghasilkan expected profit tertinggi.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Profit Curve & Optimal Threshold Search',
          language: 'python',
          code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix

y_probs = model.predict_proba(X_test)[:, 1]

# Asumsi matriks nilai bisnis (dalam Ribu Rupiah)
val_TP = 500   # Menyelamatkan nasabah churn bernilai Rp 500rb
cost_FP = -50  # Biaya promo retensi Rp 50rb ke yang tidak berniat churn
cost_FN = -500 # Kehilangan nasabah bernilai Rp 500rb

thresholds = np.linspace(0.05, 0.95, 50)
profits = []

for th in thresholds:
    preds = (y_probs >= th).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, preds).ravel()
    total_profit = (tp * val_TP) + (fp * cost_FP) + (fn * cost_FN)
    profits.append(total_profit)

best_idx = np.argmax(profits)
best_th = thresholds[best_idx]
print(f"Threshold Finansial Optimal: {best_th:.2f} | Estimasi Profit Maksimal: Rp {profits[best_idx]:,} rb")

plt.figure(figsize=(8, 4))
plt.plot(thresholds, profits, color='green', lw=2)
plt.axvline(best_th, color='red', linestyle='--', label=f'Optimal ({best_th:.2f})')
plt.title("Expected Profit Curve")
plt.xlabel("Decision Threshold")
plt.ylabel("Total Profit Bersih")
plt.legend()
plt.grid(True)
plt.show()`,
          explanation: 'Mengubah probabilitas model menjadi keputusan bisnis yang menghasilkan nilai uang terukur.',
        },
      ],
    },
    stepByStepInstructions: [
      'Ekstrak probabilitas prediksi dari model terbaik Anda menggunakan predict_proba.',
      'Definisikan nilai biaya/keuntungan untuk TP, FP, TN, dan FN.',
      'Lakukan sweep threshold dari 0.05 hingga 0.95.',
      'Plot kurva profit dan tandai garis threshold optimum.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Calibration', type: 'tool', description: 'CalibrationDisplay, brier_score_loss' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Thresholding', description: 'Temukan threshold optimal berdasarkan matriks biaya bisnis yang diberikan dan bandingkan profitnya dengan threshold default 0.5.' },
      { title: 'Tantangan Kalibrasi', description: 'Gunakan CalibratedClassifierCV(method="isotonic") untuk memperbaiki kalibrasi probabilitas model.', isStretch: true },
    ],
    deliverables: [
      'Grafik Profit Curve lengkap dengan titik puncak optimal.',
      'Perhitungan keuntungan finansial selisih threshold optimal vs 0.5.',
    ],
    checklist: [
      { id: 'c1', label: 'Matriks biaya bisnis (TP, FP, FN, TN) dirumuskan secara eksplisit', isRequired: true },
      { id: 'c2', label: 'Kurva profit dihitung dan divisualisasikan', isRequired: true },
      { id: 'c3', label: 'Threshold baru divalidasi pada data evaluasi terpisah', isRequired: true },
    ],
    definitionOfDone: [
      'Mampu menentukan ambang batas keputusan berdasarkan kalkulasi dampak risiko bisnis nyata.',
    ],
    reflectionQuestions: [
      'Mengapa model dengan AUC tinggi tetap bisa merugikan perusahaan jika threshold-nya salah ditentukan?',
      'Apa arti probabilitas yang tidak terkalibrasi (uncalibrated probability)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 24 untuk membuka kotak hitam model melalui Explainable ML (SHAP & Permutation Importance).',
  },
  {
    id: 'day-024',
    day: 24,
    phaseId: 2,
    title: 'Explainable ML',
    shortDescription: 'Membuka Black Box: Permutation Importance, Partial Dependence Plots (PDP), dan SHAP (SHapley Additive exPlanations).',
    difficulty: 'Intermediate',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Memahami pentingnya XAI (Explainable AI) untuk regulasi etika, kepatuhan finansial, dan audit model.',
      'Menggunakan permutation_importance untuk mengukur dampak pengacakan fitur secara independen.',
      'Membuat Partial Dependence Plots (PDP) untuk melihat kurva respon target terhadap perubahan fitur.',
      'Menerapkan SHAP values berbasis teori permainan kooperatif Shapley untuk penjelasan lokal dan global.',
    ],
    theoryContent: `### Membongkar Kotak Hitam: Mengapa Model Mengambil Keputusan Ini?
Di era regulasi GDPR dan perbankan, alasan *"komputer mengatakan demikian"* tidak dapat diterima saat menolak pengajuan pinjaman seseorang.

Metode Interpretasi:
1. **Permutation Importance**: Mengacak nilai kolom $j$ di data uji. Jika performa model anjlok drastis, berarti kolom $j$ sangat penting.
2. **SHAP (Shapley Values)**: Menghitung kontribusi marjinal setiap fitur terhadap deviasi prediksi individu dari rata-rata populasi:
$$f(x) = E[f(x)] + \\sum_{i=1}^M \\phi_i$$
SHAP konsisten secara matematis dan mampu menjelaskan satu baris prediksi spesifik (*local explanation*) maupun keseluruhan dataset (*global summary*).`,
    practicalWalkthrough: {
      summary: 'Gunakan SHAP TreeExplainer pada model XGBoost atau Random Forest untuk menghasilkan summary plot dan waterfall plot.',
      environment: 'Jupyter Notebook / Google Colab (pip install shap)',
      codeSnippets: [
        {
          title: 'SHAP Waterfall & Beeswarm Plot',
          language: 'python',
          code: `import shap
import matplotlib.pyplot as plt

# Buat TreeExplainer khusus model pohon
explainer = shap.TreeExplainer(model_xgb)
shap_values = explainer(X_test)

# 1. Global Beeswarm Plot (Menunjukkan arah pengaruh fitur)
plt.figure()
shap.plots.beeswarm(shap_values, max_display=10, show=False)
plt.title("SHAP Global Summary")
plt.tight_layout()
plt.show()

# 2. Local Waterfall Plot untuk sampel pasien/nasabah ke-0
plt.figure()
shap.plots.waterfall(shap_values[0], show=False)
plt.title("Penjelasan Keputusan Individu (Sample #0)")
plt.tight_layout()
plt.show()`,
          explanation: 'Waterfall plot memperlihatkan fitur apa saja yang mendorong prediksi naik atau turun untuk satu individu spesifik.',
        },
      ],
    },
    stepByStepInstructions: [
      'Instal library shap via pip.',
      'Gunakan model Random Forest atau XGBoost yang sudah dilatih.',
      'Bangun TreeExplainer dan hitung SHAP values untuk data uji.',
      'Generate Beeswarm Plot dan Waterfall Plot untuk minimal 2 prediksi ekstrim.',
      'Tulis penjelasan bahasa manusia untuk hasil waterfall plot tersebut.',
    ],
    requiredToolsAndDatasets: [
      { name: 'SHAP Library', type: 'tool', url: 'https://shap.readthedocs.io/', description: 'Library interpretasi model machine learning' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Interpretasi SHAP', description: 'Pilih satu sampel yang salah diprediksi (False Positive) dan analisis fitur apa yang membuat model terkecoh menggunakan SHAP.' },
      { title: 'Permutation vs SHAP', description: 'Bandingkan urutan ranking fitur teratas versi permutation_importance dengan ranking rata-rata absolut SHAP.', isStretch: true },
    ],
    deliverables: [
      'Gambar Beeswarm Summary Plot.',
      'Gambar Waterfall Plot untuk satu baris data dengan interpretasi naratif.',
    ],
    checklist: [
      { id: 'c1', label: 'SHAP explainer berhasil menghitung kontribusi nilai', isRequired: true },
      { id: 'c2', label: 'Beeswarm plot menunjukkan besaran dan arah dampak fitur', isRequired: true },
      { id: 'c3', label: 'Penjelasan lokal (waterfall plot) berhasil dinarasikan', isRequired: true },
    ],
    definitionOfDone: [
      'Model machine learning dapat dijelaskan mekanismenya baik secara makro maupun mikro.',
    ],
    reflectionQuestions: [
      'Bagaimana cara membaca warna titik merah dan biru pada SHAP beeswarm plot?',
      'Mengapa SHAP values lebih disukai dibanding feature importances bawaan pohon yang sering bias?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 25 untuk menginvestigasi sampel-sampel error secara forensik di Error Analysis.',
  },
  {
    id: 'day-025',
    day: 25,
    phaseId: 2,
    title: 'Error Analysis',
    shortDescription: 'Forensik kegagalan model: Mengelompokkan jenis error, mendeteksi label noise, dan mencari pola sistematis pada False Positives & Negatives.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami filosofi Data-Centric AI (Andrew Ng): Memperbaiki data seringkali lebih efektif daripada mengotak-atik model.',
      'Mengisolasi sampel-sampel di mana model membuat kesalahan paling fatal (high loss / confident errors).',
      'Mengidentifikasi label noise (kesalahan input anotator manusia) pada dataset.',
      'Menyusun taksonomi kesalahan (*Error Taxonomy*) untuk rencana perbaikan terarah.',
    ],
    theoryContent: `### Forensik Data: Jangan Terus-menerus Mengganti Model!
Daripada membabi buta mencoba 10 algoritma baru, lihatlah baris data di mana model Anda **gagal telak**.
Jenis Kesalahan Umum:
1. **Label Noise**: Label data asli memang salah diberi anotasi oleh manusia.
2. **Ambiguous Inputs**: Fitur yang ada tidak cukup untuk membedakan kelas (butuh fitur baru).
3. **Sub-populasi Minor**: Model gagal secara konsisten pada kelompok pengguna tertentu (misal pengguna sistem operasi lama).
4. **Confident Errors**: Model memprediksi dengan keyakinan 99% bahwa pasien sehat, padahal kenyataannya sakit berat. Ini adalah red flag bahaya!`,
    practicalWalkthrough: {
      summary: 'Ekstrak 10 sampel dengan loss tertinggi dan analisis pola kesamaan antar sampel gagal tersebut.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Error Forensic Script',
          language: 'python',
          code: `import pandas as pd
import numpy as np

# Hitung margin error atau log loss per sampel
y_pred_proba = model.predict_proba(X_test)[:, 1]
errors_df = X_test.copy()
errors_df['true_label'] = y_test.values
errors_df['predicted_prob'] = y_pred_proba
errors_df['predicted_label'] = (y_pred_proba >= 0.5).astype(int)

# Hitung tingkat keparahan error (loss individual)
errors_df['error_magnitude'] = np.abs(errors_df['true_label'] - errors_df['predicted_prob'])

# Filter kasus terburuk (Confident Errors)
worst_errors = errors_df.sort_values(by='error_magnitude', ascending=False).head(10)
print("10 Sampel Kesalahan Paling Fatal:")
print(worst_errors[['true_label', 'predicted_prob', 'error_magnitude']])`,
          explanation: 'Mengidentifikasi baris data spesifik di mana model sangat percaya diri tetapi tebakannya terbalik.',
        },
      ],
    },
    stepByStepInstructions: [
      'Ambil data uji yang telah diprediksi oleh model terbaik Anda.',
      'Pisahkan semua baris di mana prediksi tidak cocok dengan label sebenarnya.',
      'Urutkan berdasarkan nilai selisih probabilitas terbesar.',
      'Analisis statistik deskriptif dari kelompok error tersebut: apakah mereka memiliki kemiripan nilai fitur tertentu?',
      'Dokumentasikan minimal 2 hipotesis penyebab error.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Pandas & Numpy', type: 'tool', description: 'Manipulasi filtering error' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Forensik', description: 'Buat tabel taksonomi error yang mengkategorikan minimal 5 kasus kegagalan model teratas.' },
      { title: 'Data Cleaning Action', description: 'Identifikasi apakah ada minimal satu baris data di data uji yang labelnya terbukti salah anotasi (label noise).', isStretch: true },
    ],
    deliverables: [
      'Tabel 10 baris confident error terparah.',
      'Laporan taksonomi error 3 kategori beserta usulan solusinya.',
    ],
    checklist: [
      { id: 'c1', label: 'Sampel False Positive dan False Negative berhasil diekstrak', isRequired: true },
      { id: 'c2', label: 'Error diurutkan berdasarkan magnitude keyakinan prediksi', isRequired: true },
      { id: 'c3', label: 'Pola kegagalan sistematis berhasil diidentifikasi', isRequired: true },
    ],
    definitionOfDone: [
      'Memiliki pemahaman mendalam tentang titik kelemahan model dan rencana perbaikan data.',
    ],
    reflectionQuestions: [
      'Mengapa model seringkali mengalami kesalahan pada sampel yang berada dekat perbatasan decision boundary?',
      'Bagaimana pendekatan data-centric berbeda dari pendekatan model-centric dalam praktiknya?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 26 untuk melakukan komparasi model benchmark secara terstruktur.',
  },
  {
    id: 'day-026',
    day: 26,
    phaseId: 2,
    title: 'Model Benchmark',
    shortDescription: 'Membuat arena komparasi: Logistic Regression vs Random Forest vs XGBoost vs LightGBM lintas metrik dan latensi.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Menyusun papan peringkat (Leaderboard) model machine learning multi-kriteria.',
      'Mengukur tidak hanya metrik akurasi/F1, tetapi juga waktu pelatihan (training time) dan waktu inferensi (latency).',
      'Menilai ukuran file model tersimpan (memory footprint).',
      'Memilih model terbaik berdasarkan Trade-off Matrix (Akurasi vs Kecepatan vs Kemudahan Deploy).',
    ],
    theoryContent: `### Memilih Juara untuk Production Bukan Cuma Soal Akurasi
Model dengan F1-score 94.2% yang membutuhkan 500ms per prediksi di server seringkali kalah dari model F1-score 93.8% yang hanya butuh 2ms per prediksi jika sistem harus melayani 10.000 request per detik!

Dimensi Evaluasi Benchmark:
1. **Kualitas Prediksi**: ROC-AUC, F1-macro, PR-AUC.
2. **Kecepatan Inferensi (P95 Latency)**: Berapa milidetik untuk memprediksi 1 baris data?
3. **Waktu Training & Retraining**: Berapa menit jika model harus di-retrain tiap malam?
4. **Ukuran Memori**: Berapa megabyte model artifact di disk/RAM?`,
    practicalWalkthrough: {
      summary: 'Buat script benchmark otomatis yang melatih 4 model berbeda dan menghasilkan tabel leaderboard komparatif.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Automated Model Benchmark Suite',
          language: 'python',
          code: `import time
import pandas as pd
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

candidates = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'XGBoost': XGBClassifier(n_estimators=100, learning_rate=0.05, random_state=42)
}

results = []
for name, clf in candidates.items():
    # 1. Ukur Waktu Training
    t0 = time.perf_counter()
    clf.fit(X_train, y_train)
    train_time = time.perf_counter() - t0
    
    # 2. Ukur Kecepatan Inferensi
    t0 = time.perf_counter()
    y_pred = clf.predict(X_test)
    inference_time_ms = (time.perf_counter() - t0) * 1000 / len(X_test)
    
    # 3. Metrik
    y_prob = clf.predict_proba(X_test)[:, 1] if hasattr(clf, "predict_proba") else y_pred
    f1 = f1_score(y_test, y_pred, average='macro')
    auc = roc_auc_score(y_test, y_prob)
    
    results.append({
        'Model': name,
        'F1-Macro': round(f1, 4),
        'ROC-AUC': round(auc, 4),
        'Train Time (s)': round(train_time, 3),
        'Latency per Sample (ms)': round(inference_time_ms, 3)
    })

leaderboard = pd.DataFrame(results).sort_values(by='ROC-AUC', ascending=False)
print(leaderboard.to_string(index=False))`,
          explanation: 'Leaderboard komprehensif yang menampilkan keunggulan dan trade-off tiap arsitektur model.',
        },
      ],
    },
    stepByStepInstructions: [
      'Pilih minimal 3 arsitektur model berbeda (Linier, Pohon Bagging, Pohon Boosting).',
      'Jalankan loop benchmark untuk mengukur waktu training dan waktu inferensi.',
      'Kumpulkan hasil metrik ke dalam DataFrame.',
      'Buat grafik perbandingan Trade-off (Akurasi vs Latency scatter plot).',
    ],
    requiredToolsAndDatasets: [
      { name: 'Python time module & Pandas', type: 'tool', description: 'Benchmarking dan tabulasi' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Leaderboard', description: 'Buat tabel leaderboard rapi dari minimal 3 model berbeda pada dataset pilihan Anda.' },
      { title: 'Scatter Trade-off Plot', description: 'Buat visualisasi scatter plot dengan sumbu X = Latensi inferensi dan sumbu Y = Skor F1.', isStretch: true },
    ],
    deliverables: [
      'Tabel Leaderboard perbandingan model lengkap.',
      'Justifikasi tertulis mengenai model mana yang dipilih sebagai pemenang.',
    ],
    checklist: [
      { id: 'c1', label: 'Minimal 3 model berbeda diuji pada kondisi data uji yang identik', isRequired: true },
      { id: 'c2', label: 'Waktu training dan latensi inferensi diukur secara objektif', isRequired: true },
      { id: 'c3', label: 'Pemenang dipilih berdasarkan kombinasi akurasi dan efisiensi', isRequired: true },
    ],
    definitionOfDone: [
      'Tersedia laporan benchmark komparatif yang siap disajikan untuk Mini-Project 2.',
    ],
    reflectionQuestions: [
      'Kapan Anda akan memilih model linier sederhana meskipun XGBoost memiliki akurasi 1% lebih tinggi?',
      'Mengapa mengukur latensi inferensi per sampel penting untuk sistem real-time API?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 27 untuk menyusun Mini-Project 2: Model Comparison Report lengkap!',
  },
  {
    id: 'day-027',
    day: 27,
    phaseId: 2,
    title: 'Mini-project 2: Model Comparison Report',
    shortDescription: 'Proyek akhir Fase 2: Menyusun laporan teknis komparasi model, SHAP interpretability, dan rekomendasi model produksi.',
    difficulty: 'Intermediate',
    estimatedDuration: '90 Menit',
    isProject: true,
    projectMilestoneId: 'proj-2',
    learningObjectives: [
      'Mengintegrasikan model pohon, boosting, hyperparameter tuning, dan analisis XAI ke dalam laporan komparatif terpadu.',
      'Menyajikan visualisasi ROC-AUC, PR-curves, SHAP values, dan leaderboard dalam satu kesatuan dokumen.',
      'Memberikan rekomendasi kesiapan produksi (*Production Readiness Assessment*).',
      'Mendokumentasikan seluruh artefak kode di GitHub dan portofolio.',
    ],
    theoryContent: `### Mini-Project 2: Standar Laporan Konsultan ML Profesional
Dalam pekerjaan profesional, stakeholder tidak akan membaca 500 baris kode Anda. Mereka ingin melihat:
1. **Executive Summary**: Model mana yang menang dan berapa peningkatan nilainya?
2. **Methodology Matrix**: Bagaimana data di-split, dibersihkan, dan divalidasi?
3. **Risk Analysis**: Kapan model ini berpotensi gagal (Error analysis)?
4. **Transparency**: Mengapa model membuat keputusan demikian (SHAP)?`,
    practicalWalkthrough: {
      summary: 'Susun laporan teknis model comparison, sertakan visualisasi grafik komparasi, simpan artefak model terbaik dan publikasikan ke repositori.',
      environment: 'Jupyter Notebook / Markdown / GitHub Gist',
      codeSnippets: [
        {
          title: 'Struktur Laporan Mini-Project 2',
          language: 'markdown',
          code: `# LAPORAN KOMPARASI MODEL ML & XAI AUDIT
## 1. RINGKASAN EKSEKUTIF & REKOMENDASI UTAMA
- Model Terpilih: XGBoost (Tuned via Optuna)
- Peningkatan ROC-AUC: +14.2% dibanding Baseline
- Latensi Rata-rata: 1.8ms / inferensi

## 2. METODOLOGI & PERLINDUNGAN DARI LEAKAGE
- 5-Fold Stratified Cross Validation
- Scikit-Learn Pipeline + RobustScaler

## 3. PAPAN PERINGKAT MODEL (LEADERBOARD)
[Tabel Leaderboard dari Hari 26]

## 4. ANALISIS INTERPRETABILITAS XAI (SHAP)
[Grafik Beeswarm & Penjelasan Dampak Fitur]

## 5. TAKSONOMI KESALAHAN & MITIGASI RISIKO
[Daftar Temuan Forensik Error]`,
          explanation: 'Struktur baku laporan audit model machine learning yang siap dikonsumsi manajemen dan tim engineering.',
        },
      ],
    },
    stepByStepInstructions: [
      'Pilih satu dataset tabular tantangan (misal: Kaggle Bank Churn, Heart Disease, atau Diamond Price).',
      'Bandingkan minimal 4 model: Baseline Dummy, Logistic/Linear, Random Forest, dan XGBoost/LightGBM.',
      'Lakukan tuning parameter pada model terbaik menggunakan Optuna.',
      'Sertakan grafik SHAP Beeswarm dan analisis confusion matrix / threshold profit.',
      'Simpan model terbaik dalam format artefak joblib.',
      'Unggah notebook/laporan ke repositori GitHub dan input link-nya ke tab Portofolio.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Dataset Tabular Menantang', type: 'dataset', description: 'Dataset multi-fitur dari Kaggle / UCI ML' },
      { name: 'Stack Lengkap Fase 2', type: 'tool', description: 'Scikit-learn, XGBoost, Optuna, SHAP' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Mini-Project 2', description: 'Tuntaskan laporan komparasi model dan publikasikan repositori lengkap dengan grafik SHAP dan leaderboard.' },
      { title: 'Tantangan Model Card', description: 'Tulis file "MODEL_CARD.md" mengikuti format HuggingFace/Google Model Card yang merinci batasan etika dan bias model.', isStretch: true },
    ],
    deliverables: [
      'Tautan repositori GitHub berisi notebook komparasi dan laporan README.',
      'Metrik performa model pemenang (F1, AUC, Latensi).',
      'File model artefak tersimpan.',
    ],
    checklist: [
      { id: 'c1', label: 'Minimal 4 model dikomparasikan secara adil pada split data yang sama', isRequired: true },
      { id: 'c2', label: 'Tuning hyperparameter terbukti meningkatkan metrik model terbaik', isRequired: true },
      { id: 'c3', label: 'Analisis interpretasi SHAP disertakan dalam laporan', isRequired: true },
      { id: 'c4', label: 'Hasil terdokumentasi di tab Portofolio aplikasi ini', isRequired: true },
    ],
    definitionOfDone: [
      'Mini-Project 2 resmi selesai dan diverifikasi.',
      'Fase 2 tuntas 100%!',
    ],
    reflectionQuestions: [
      'Apa wawasan paling berharga yang Anda dapatkan saat membandingkan model kompleks vs model sederhana?',
      'Bagaimana pemahaman tentang SHAP mengubah cara pandang Anda terhadap model machine learning?',
    ],
    suggestedNextStep: 'Selamat atas keberhasilan menuntaskan Fase 2! Besok kita masuk ke Fase 3: Unsupervised Learning (Clustering, PCA, & Rekomendasi).',
  },
];
