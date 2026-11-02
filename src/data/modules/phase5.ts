/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumModule } from '../../types/curriculum';

export const PHASE_5_MODULES: CurriculumModule[] = [
  {
    id: 'day-055',
    day: 55,
    phaseId: 5,
    title: 'Text Data Cleaning',
    shortDescription: 'Preprocessing teks mentah: Regex, case folding, normalisasi slang/singkatan media sosial, dan penanganan tanda baca & emoji.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami sifat unik data teks mentah (tidak terstruktur, bising, slang, dan typo).',
      'Menggunakan Regular Expression (regex) untuk membersihkan URL, mention (@username), hashtag, dan karakter non-ASCII.',
      'Membangun kamus normalisasi kata singkatan bahasa gaul Indonesia (misal: "yg" -> "yang", "bgt" -> "banget", "gak" -> "tidak").',
      'Mengetahui kapan harus mempertahankan vs membuang tanda seru dan emoji (krusial untuk analisis sentimen!).',
    ],
    theoryContent: `### Menjinakkan Kekacauan Teks Manusia
Komputer tidak memahami kata; komputer hanya memproses angka biner. Sebelum kata dapat diubah menjadi vektor, kita harus membersihkan derau (*noise*).

Perhatian Khusus Bahasa Indonesia:
Bahasa Indonesia di media sosial (X/Twitter, TikTok, Instagram) sangat kaya singkatan, kata serapan, reduplikasi (*anak-anak* $\\rightarrow$ *anak2*), dan partikel (*dong*, *sih*, *lah*).
- **Hati-hati dengan Stopwords**: Menghapus kata "tidak" atau "bukan" akan membalik makna sentimen ("tidak bagus" $\\rightarrow$ "bagus")!
- **Hati-hati dengan Emoji**: Emoji 😊 dan 😡 memuat 80% sinyal emosi dalam kalimat singkat. Jangan langsung dibuang!`,
    practicalWalkthrough: {
      summary: 'Buat pipeline pembersihan teks bahasa Indonesia modular dengan regex dan kamus normalisasi slang.',
      environment: 'Jupyter Notebook / Google Colab / Python Script',
      codeSnippets: [
        {
          title: 'Indonesian Text Cleaning Pipeline',
          language: 'python',
          code: `import re

# Kamus normalisasi slang Indonesia sederhana
slang_dict = {
    'yg': 'yang', 'bgt': 'banget', 'gak': 'tidak', 'nggak': 'tidak',
    'bisa': 'bisa', 'tp': 'tapi', 'dgn': 'dengan', 'sdh': 'sudah',
    'klo': 'kalau', 'bener': 'benar', 'mantap': 'bagus', 'baper': 'sensitif'
}

def clean_indonesian_text(text):
    # 1. Lowercase
    text = text.lower()
    # 2. Hapus URL web
    text = re.sub(r'https?://\\S+|www\\.\\S+', '', text)
    # 3. Hapus mention @user dan hashtag #
    text = re.sub(r'[@#]\\w+', '', text)
    # 4. Hapus karakter berulang (misal: "bangeeeet" -> "banget")
    text = re.sub(r'(.)\\1{2,}', r'\\1', text)
    # 5. Normalisasi kata slang berdasarkan kamus
    words = text.split()
    normalized_words = [slang_dict.get(w, w) for w in words]
    return " ".join(normalized_words).strip()

raw = "Produk ini bangeeeet jeleknya min @toko_online!! Jgn beli disitu www.scam.com gak bener bgt"
print("Sebelum:", raw)
print("Sesudah:", clean_indonesian_text(raw))`,
          explanation: 'Membersihkan derau media sosial dan mengubah singkatan menjadi bentuk baku terstandarisasi.',
        },
      ],
    },
    stepByStepInstructions: [
      'Siapkan dataset ulasan produk atau cuitan media sosial mentah.',
      'Tulis fungsi pembersihan berbasis regex bertingkat.',
      'Perluas kamus slang_dict dengan minimal 30 kata singkatan umum bahasa Indonesia.',
      'Terapkan fungsi pembersihan pada seluruh kolom teks DataFrame menggunakan df["clean_text"] = df["text"].apply(clean_text).',
    ],
    requiredToolsAndDatasets: [
      { name: 'Python re module', type: 'tool', description: 'Ekspresi reguler untuk pembersihan teks' },
      { name: 'Kamus Slang IndoNLU / Colloquial Indonesian', type: 'dataset', description: 'Kamus padanan bahasa gaul Indonesia' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Preprocessing', description: 'Bangun fungsi pembersih teks yang mampu menangani URL, mention, elongasi huruf berulang, dan 20 slang umum.' },
      { title: 'Tantangan Emoji Translator', description: 'Gunakan library emoji untuk menerjemahkan simbol emotikon menjadi kata teks (misal: 😊 -> " senang ").', isStretch: true },
    ],
    deliverables: [
      'Fungsi pembersih teks bahasa Indonesia teruji.',
      'Tabel perbandingan 10 baris teks sebelum vs sesudah pembersihan.',
    ],
    checklist: [
      { id: 'c1', label: 'Ekspresi regex menghapus URL dan mention dengan bersih', isRequired: true },
      { id: 'c2', label: 'Karakter elongasi huruf berulang berhasil dinormalisasi', isRequired: true },
      { id: 'c3', label: 'Kamus kata slang berhasil menstandarisasi singkatan', isRequired: true },
    ],
    definitionOfDone: [
      'Teks mentah bertransformasi menjadi korpus bersih yang siap divektorisasi.',
    ],
    reflectionQuestions: [
      'Kapan teknik Stemming (misal menggunakan Sastrawi) justru dapat merusak makna kata dalam analisis sentimen?',
      'Mengapa stopword removal harus dilakukan dengan sangat hati-hati pada bahasa Indonesia?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 56 untuk membangun model baseline teks pertama dengan TF-IDF Baseline.',
  },
  {
    id: 'day-056',
    day: 56,
    phaseId: 5,
    title: 'TF-IDF Baseline',
    shortDescription: 'Term Frequency-Inverse Document Frequency: N-grams (unigram & bigram), sublinear tf, dan klasifikasi teks baseline.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami formulasi matematika TF-IDF: menimbang bobot kata unik vs kata umum.',
      'Mengonfigurasi TfidfVectorizer dengan ngram_range=(1, 2) untuk menangkap frasa penting (misal: "tidak bagus").',
      'Menggunakan min_df dan max_df untuk menyaring kata-kata langka typo dan kata-kata terlalu pasaran.',
      'Membangun model baseline NLP cepat menggunakan LogisticRegression atau LinearSVC.',
    ],
    theoryContent: `### Menimbang Bobot Kata: Bukan Sekadar Menghitung Jumlah
Kata "saya" atau "dan" mungkin muncul 100 kali dalam sebuah teks, tetapi kata itu tidak memberikan informasi tentang topik artikel.

Formulasi TF-IDF:
$$\\text{TF-IDF}(t, d, D) = \\text{TF}(t, d) \\times \\log\\left(\\frac{1 + |D|}{1 + |\\{d \\in D : t \\in d\\}|}\\right) + 1$$
- **TF (Term Frequency)**: Seberapa sering kata $t$ muncul di dokumen ini.
- **IDF (Inverse Document Frequency)**: Memberikan hukuman berat pada kata yang muncul di hampir semua dokumen, dan memberikan hadiah nilai tinggi pada kata langka yang spesifik.
- **N-Grams**: Menggabungkan pasangan kata berurutan (\`ngram_range=(1, 2)\`) memungkinkan model memahami frasa negasi seperti "tidak ramah" sebagai satu fitur utuh.`,
    practicalWalkthrough: {
      summary: 'Latih pipeline TfidfVectorizer + LogisticRegression pada data klasifikasi teks dan identifikasi kata dengan bobot koefisien tertinggi.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'TF-IDF Pipeline & Top Predictive Words',
          language: 'python',
          code: `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import pandas as pd

# Pipeline NLP Klasik
text_pipe = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=2, max_df=0.8, sublinear_tf=True)),
    ('clf', LogisticRegression(C=1.0, random_state=42))
])

text_pipe.fit(X_train_text, y_train)
print(f"Test F1-Macro: {text_pipe.score(X_test_text, y_test):.4f}")

# Ekstrak kata-kata paling positif dan negatif dari koefisien model
feature_names = text_pipe.named_steps['tfidf'].get_feature_names_out()
coefs = text_pipe.named_steps['clf'].coef_[0]
coef_df = pd.Series(coefs, index=feature_names)

print("\\nTop 5 Kata Paling Positif:\\n", coef_df.nlargest(5))
print("\\nTop 5 Kata Paling Negatif:\\n", coef_df.nsmallest(5))`,
          explanation: 'TF-IDF dipadukan dengan regresi linier memberikan model baseline yang sangat cepat dan transparan.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan dataset ulasan teks bersih dari Hari 55.',
      'Konfigurasikan TfidfVectorizer dengan ngram_range=(1, 2) dan sublinear_tf=True.',
      'Latih pipeline dengan LogisticRegression atau LinearSVC.',
      'Periksa kata-kata yang memiliki bobot koefisien positif dan negatif tertinggi untuk memastikan kewajaran nalar model.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Scikit-learn Feature Extraction Text', type: 'tool', description: 'TfidfVectorizer' },
      { name: 'Indo4B / IndoNLU SMS & Sentiment Data', type: 'dataset', description: 'Dataset ulasan teks bahasa Indonesia' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas TF-IDF Baseline', description: 'Bangun baseline model teks dan catat metrik F1-score sebagai patokan dasar yang harus dikalahkan oleh deep learning nantinya.' },
      { title: 'Tantangan N-Gram Ablation', description: 'Bandingkan skor performa model saat hanya menggunakan unigram (1, 1) vs unigram+bigram (1, 2).', isStretch: true },
    ],
    deliverables: [
      'Skor F1 baseline NLP terukur pada test set.',
      'Tabel daftar 5 kata paling prediktif untuk masing-masing kelas sentimen.',
    ],
    checklist: [
      { id: 'c1', label: 'TfidfVectorizer di-fit hanya pada data latihan (anti-vocabulary leakage)', isRequired: true },
      { id: 'c2', label: 'Pengaturan bigram (ngram_range=(1, 2)) diaktifkan', isRequired: true },
      { id: 'c3', label: 'Kata dengan koefisien ekstrem diekstrak dan dianalisis logis', isRequired: true },
    ],
    definitionOfDone: [
      'Baseline NLP yang cepat, murah, dan kompetitif berhasil ditetapkan.',
    ],
    reflectionQuestions: [
      'Mengapa TF-IDF tetap sering digunakan di industri sebagai baseline pertama sebelum menyentuh model Transformer yang mahal?',
      'Apa kelemahan utama representasi TF-IDF terkait kesamaan makna kata (sinonim)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 57 untuk memecahkan masalah sinonim melalui Embedding Explorer (Word2Vec & Dense Vectors).',
  },
  {
    id: 'day-057',
    day: 57,
    phaseId: 5,
    title: 'Embedding Explorer',
    shortDescription: 'Memahami ruang semantik: Word2Vec (Skip-gram vs CBOW), Word Embeddings pra-latih, dan aritmatika analogi vektor kata.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami kelemahan One-Hot & TF-IDF: representasi sparse ortogonal tanpa pemahaman kemiripan makna.',
      'Memahami hipotesis distribusi (Firth, 1957): "You shall know a word by the company it keeps".',
      'Memahami arsitektur Word2Vec: Continuous Bag of Words (CBOW) vs Skip-gram with Negative Sampling.',
      'Mengeksplorasi analogi semantik vektor: Vektor(Raja) - Vektor(Pria) + Vektor(Wanita) $\\approx$ Vektor(Ratu).',
    ],
    theoryContent: `### Mengubah Makna Kata Menjadi Geometri Vektor (Embeddings)
Dalam TF-IDF, kata *"senang"* dan *"gembira"* dianggap dua dimensi yang saling tegak lurus ($90^\\circ$), seolah tidak ada hubungan makna sama sekali.

Prinsip Dense Word Embeddings:
Setiap kata dipetakan ke dalam vektor padat berdimensi kontinu (misal 100 atau 300 dimensi).
- Kata-kata dengan konteks mirip akan berkumpul di koordinat yang berdekatan dalam ruang multi-dimensi.
- Hubungan semantik berubah menjadi operasi aljabar linier:
$$\\vec{v}_{Jakarta} - \\vec{v}_{Indonesia} + \\vec{v}_{Jepang} \\approx \\vec{v}_{Tokyo}$$
Model mempelajari hubungan ibu kota, gender, dan bentuk kata kerja murni dari pola statistik kemunculan teks!`,
    practicalWalkthrough: {
      summary: 'Gunakan gensim untuk memuat vektor embedding pra-latih atau melatih Word2Vec sederhana, lalu uji fungsi most_similar dan analogi kata.',
      environment: 'Jupyter Notebook / Google Colab (pip install gensim)',
      codeSnippets: [
        {
          title: 'Word2Vec Semantic Vector Operations',
          language: 'python',
          code: `from gensim.models import Word2Vec

# Korpus kalimat tokenized sederhana
sentences = [
    ['kucing', 'adalah', 'hewan', 'peliharaan', 'lucu'],
    ['anjing', 'adalah', 'hewan', 'setia', 'dan', 'lucu'],
    ['jakarta', 'ibu', 'kota', 'indonesia'],
    ['tokyo', 'ibu', 'kota', 'jepang'],
    ['raja', 'memimpin', 'kerajaan', 'pria'],
    ['ratu', 'memimpin', 'kerajaan', 'wanita']
]

# Latih Word2Vec (vektor 50 dimensi)
model_w2v = Word2Vec(sentences, vector_size=50, window=3, min_count=1, sg=1, seed=42)

# Cari kata paling mirip semantik
print("Kata paling mirip 'kucing':", model_w2v.wv.most_similar('kucing', topn=2))

# Analogi Kata: raja - pria + wanita = ratu
result = model_w2v.wv.most_similar(positive=['raja', 'wanita'], negative=['pria'], topn=1)
print("Analogi (Raja - Pria + Wanita):", result)`,
          explanation: 'Membuktikan kemampuan vektor kontinu dalam menangkap relasi semantik antar kata.',
        },
      ],
    },
    stepByStepInstructions: [
      'Instal library gensim jika belum tersedia.',
      'Siapkan korpus tokenized teks atau muat model pra-latih (FastText atau Word2Vec bahasa Indonesia).',
      'Gunakan .most_similar() untuk menemukan 5 kata yang paling identik secara semantik dengan kata target.',
      'Uji minimal 2 operasi analogi vektor kata positif dan negatif.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Gensim Library', type: 'tool', url: 'https://radimrehurek.com/gensim/', description: 'Framework pemodelan ruang vektor topik dan kata' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Eksplorasi Embedding', description: 'Temukan 3 pasang kata yang memiliki kemiripan kosinus tinggi (> 0.7) pada ruang embedding.' },
      { title: 'Visualisasi 2D Proyeksi Kata', description: 'Gunakan PCA/t-SNE untuk memproyeksikan 20 kata pilihan ke bidang 2D dan perhatikan pengelompokan semantiknya.', isStretch: true },
    ],
    deliverables: [
      'Output kode operasi kemiripan kata dan analogi aljabar vektor.',
      'Visualisasi 2D plot kata-kata dalam ruang semantik.',
    ],
    checklist: [
      { id: 'c1', label: 'Vektor kata dense berhasil dihasilkan atau dimuat', isRequired: true },
      { id: 'c2', label: 'Operasi most_similar membuktikan kedekatan semantik', isRequired: true },
      { id: 'c3', label: 'Analogi aljabar kata berhasil dieksplorasi', isRequired: true },
    ],
    definitionOfDone: [
      'Memahami transformasi teks menjadi ruang vektor geometri semantik berkelanjutan.',
    ],
    reflectionQuestions: [
      'Apa kelemahan fatal Word2Vec statis ketika menghadapi kata dengan banyak arti (Polisemi, misal kata "bisa" = racun vs dapat)?',
      'Bagaimana FastText mengatasi kata yang tidak ada di kamus (Out-of-Vocabulary / OOV) menggunakan subword n-grams?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 58 untuk menerapkan model sekuensial pada Sentiment Analysis.',
  },
  {
    id: 'day-058',
    day: 58,
    phaseId: 5,
    title: 'Sentiment Analysis',
    shortDescription: 'Membangun klasifikasi sentimen sekuensial dengan PyTorch: nn.Embedding, arsitektur Bi-LSTM, dan pooling representasi kalimat.',
    difficulty: 'Intermediate',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Memahami pemrosesan sekuensial: urutan kata memegang peranan penting dalam menentukan sentimen.',
      'Menggunakan lapisan nn.Embedding di PyTorch sebagai kamus lookup vektor kata.',
      'Memahami arsitektur Recurrent Neural Network (LSTM / GRU) untuk mengingat konteks masa lalu.',
      'Menggunakan Bidirectional LSTM (Bi-LSTM) untuk membaca kalimat dari depan ke belakang dan belakang ke depan.',
    ],
    theoryContent: `### Membaca Urutan Kalimat dengan Bi-LSTM
TF-IDF mengacak urutan kata (*bag of words*). Namun kalimat:
*"Film ini awalnya jelek, tapi setelah pertengahan menjadi sangat luar biasa bagus!"*
memiliki arti positif total, meskipun kata-kata negatif muncul di awal.

Arsitektur Bi-LSTM (Bidirectional Long Short-Term Memory):
1. **Embedding Layer**: Mengubah ID token kata menjadi tensor vektor $\\mathbb{R}^{d}$.
2. **Forward LSTM**: Membaca konteks dari kiri ke kanan.
3. **Backward LSTM**: Membaca konteks dari kanan ke kiri.
4. Gabungan hidden state akhir dari kedua arah merangkum intisari makna seluruh kalimat sebelum diklasifikasikan oleh linear layer.`,
    practicalWalkthrough: {
      summary: 'Susun model PyTorch Bi-LSTM untuk klasifikasi sentimen ulasan biner (Positif vs Negatif).',
      environment: 'Jupyter Notebook / Google Colab (PyTorch)',
      codeSnippets: [
        {
          title: 'PyTorch Bi-LSTM Sentiment Classifier',
          language: 'python',
          code: `import torch
import torch.nn as nn

class BiLSTMSentiment(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes=2):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            embed_dim, hidden_dim,
            num_layers=1,
            batch_first=True,
            bidirectional=True
        )
        self.fc = nn.Linear(hidden_dim * 2, num_classes) # * 2 karena bidirectional
        self.dropout = nn.Dropout(0.3)
        
    def forward(self, x):
        # x shape: [batch_size, seq_len]
        embedded = self.dropout(self.embedding(x))
        out, (hn, cn) = self.lstm(embedded)
        # Ambil hidden state terakhir dari forward dan backward
        cat_hidden = torch.cat((hn[-2, :, :], hn[-1, :, :]), dim=1)
        logits = self.fc(self.dropout(cat_hidden))
        return logits

model_lstm = BiLSTMSentiment(vocab_size=5000, embed_dim=64, hidden_dim=64)
dummy_seq = torch.randint(0, 5000, (4, 30)) # 4 kalimat, 30 token
print("Output logits shape:", model_lstm(dummy_seq).shape)`,
          explanation: 'Memproses urutan sekuensial kata dua arah untuk menangkap konteks temporal sebelum klasifikasi.',
        },
      ],
    },
    stepByStepInstructions: [
      'Bangun vocabulary token dan petakan kalimat menjadi urutan integer dengan padding.',
      'Susun kelas BiLSTMSentiment dengan lapisan nn.Embedding dan nn.LSTM bidirectional.',
      'Latih model pada dataset ulasan film IMDb atau ulasan e-commerce Indonesia.',
      'Bandingkan performanya dengan baseline TF-IDF dari Hari 56.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Recurrent Layers', type: 'tool', description: 'nn.Embedding, nn.LSTM, nn.GRU' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Sentimen Bi-LSTM', description: 'Latih model Bi-LSTM pada dataset ulasan dan capai akurasi uji di atas 82%.' },
      { title: 'Tantangan Packing Sequences', description: 'Gunakan torch.nn.utils.rnn.pack_padded_sequence untuk menghemat komputasi pada token padding.', isStretch: true },
    ],
    deliverables: [
      'Kode kelas Bi-LSTM teruji.',
      'Grafik perbandingan akurasi epoch pada data latihan vs validasi.',
    ],
    checklist: [
      { id: 'c1', label: 'Padding_idx=0 dikonfigurasi pada nn.Embedding', isRequired: true },
      { id: 'c2', label: 'Bi-LSTM membaca teks dalam mode bidirectional', isRequired: true },
      { id: 'c3', label: 'Model dievaluasi pada ulasan sentimen baru', isRequired: true },
    ],
    definitionOfDone: [
      'Model sekuensial mampu menangkap ketergantungan urutan kata untuk prediksi sentimen.',
    ],
    reflectionQuestions: [
      'Mengapa LSTM jauh lebih baik daripada Vanilla RNN dalam menangani dependensi jangka panjang (*long-term dependencies*)?',
      'Apa kelemahan mendasar arsitektur LSTM sekuensial yang nantinya memicu lahirnya arsitektur Transformer?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 59 untuk menganalisis titik kelemahan model bahasa di Error Analysis for NLP.',
  },
  {
    id: 'day-059',
    day: 59,
    phaseId: 5,
    title: 'Error Analysis for NLP',
    shortDescription: 'Forensik kesalahan teks: Sarkasme, negasi ganda, kalimat terpotong, dan bias kata kunci permukaan (spurious correlations).',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Mengidentifikasi mengapa model NLP gagal: sarkasme, idiom bahasa, dan negasi majemuk.',
      'Mendeteksi fenomena Spurious Correlation: model hanya mencari 1 kata kunci (misal kata "rusak" otomatis dianggap negatif, padahal kalimatnya: "mesin ini tidak mudah rusak").',
      'Menganalisis Out-of-Vocabulary (OOV) rate pada data uji.',
      'Menyusun strategi data augmentation teks untuk menambal kelemahan model.',
    ],
    theoryContent: `### Jebakan Ilusi Pemahaman Bahasa Model AI
Banyak model NLP sebenarnya tidak "memahami" bahasa manusia; mereka hanya mencari korelasi statistik permukaan (*shortcut learning*).

Kategori Kegagalan NLP Klasik:
1. **Sarkasme / Satir**: *"Wah bagus sekali ya layanannya, sampai barang saya hancur berkeping-keping 👏👏"* $\\rightarrow$ Model melihat kata "bagus" dan mengklasifikasikannya sebagai POSITIF!
2. **Korelasi Palsu (Spurious Correlations)**: Model menyimpulkan bahwa setiap ulasan yang menyebut nama kompetitor selalu negatif.
3. **Double Negatives**: *"Saya tidak bilang makanan ini tidak enak."* $\\rightarrow$ Mengacaukan model berbasis bag-of-words.`,
    practicalWalkthrough: {
      summary: 'Ekstrak kalimat-kalimat ulasan yang salah diprediksi dengan keyakinan tinggi (confident false predictions) dan kelompokkan polanya.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'NLP Error Breakdown Script',
          language: 'python',
          code: `import pandas as pd

# Bandingkan teks asli, prediksi, dan label ground truth
results_df = pd.DataFrame({
    'text': X_test_raw,
    'true_label': y_test,
    'pred_label': preds,
    'confidence': probs.max(axis=1)
})

# Filter kasus kegagalan terburuk
failures = results_df[results_df['true_label'] != results_df['pred_label']]
confident_failures = failures.sort_values(by='confidence', ascending=False).head(10)

print(f"Total Sampel Gagal: {len(failures)} dari {len(results_df)} ({len(failures)/len(results_df)*100:.1f}%)")
print("\\n5 Sampel Salah Tebak Paling Percaya Diri:")
for _, row in confident_failures.head(5).iterrows():
    print(f"[Asli: {row['true_label']} | Tebakan: {row['pred_label']} (P={row['confidence']:.2f})]")
    print(f"Teks: {row['text']}\\n")`,
          explanation: 'Membaca langsung teks mentah yang mengecoh model untuk menyusun perbaikan data.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan model sentimen dari Hari 58.',
      'Jalankan prediksi pada test set dan saring sampel yang salah klasifikasi.',
      'Urutkan berdasarkan probabilitas keyakinan model.',
      'Kategorikan 10 kasus kegagalan teratas ke dalam taksonomi: Sarkasme, Negasi Majemuk, Slang Tak Dikenal, atau Label Noise.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Pandas', type: 'tool', description: 'Filtering teks' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Audit NLP', description: 'Susun laporan 3 penyebab kegagalan utama model NLP Anda lengkap dengan kutipan contoh kalimat nyata.' },
      { title: 'Stress Test Kalimat Buatan', description: 'Buat 5 kalimat uji yang sengaja dirancang untuk mengecoh model (berisi sarkasme atau negasi berulang) dan catat hasilnya.', isStretch: true },
    ],
    deliverables: [
      'Tabel 10 kalimat teks kesalahan paling percaya diri.',
      'Laporan taksonomi kegagalan pemahaman bahasa model.',
    ],
    checklist: [
      { id: 'c1', label: 'Teks yang gagal diprediksi diisolasi bersama nilai keyakinannya', isRequired: true },
      { id: 'c2', label: 'Pola kegagalan (sarkasme/negasi/slang) teridentifikasi', isRequired: true },
      { id: 'c3', label: 'Rencana perbaikan data atau arsitektur dirumuskan', isRequired: true },
    ],
    definitionOfDone: [
      'Titik buta (blind spots) model NLP terdokumentasi dengan transparan.',
    ],
    reflectionQuestions: [
      'Mengapa sarkasme menjadi salah satu tantangan tersulit yang belum sepenuhnya terpecahkan dalam NLP?',
      'Bagaimana arsitektur berbasis Attention (Transformer) membantu mengatasi kelemahan konteks jarak jauh?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 60 untuk memahami fondasi Transformer modern di Tokenization Lab (BPE & WordPiece).',
  },
  {
    id: 'day-060',
    day: 60,
    phaseId: 5,
    title: 'Tokenization Lab',
    shortDescription: 'Membedah subword tokenization: Byte-Pair Encoding (BPE), WordPiece, SentencePiece, dan token khusus [CLS], [SEP], [PAD].',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami mengapa tokenisasi kata penuh (Word-level) dan huruf (Char-level) memiliki kelemahan ekstrim.',
      'Memahami algoritma Subword Tokenization: menyeimbangkan ukuran vocabulary dan representasi morfologi.',
      'Menggunakan tokenizers modern dari Hugging Face (AutoTokenizer).',
      'Memahami fungsi token khusus: [CLS] / <s> (representasi klasifikasi) dan [SEP] / </s> (pemisah kalimat).',
    ],
    theoryContent: `### Mengapa Dunia Modern Beralih ke Subword Tokenization?
1. **Word-level**: Vocabulary membengkak jutaan kata, dan kata baru/typo ("muraaaah") langsung menjadi token asing (*[UNK] / Out of Vocabulary*).
2. **Char-level**: Tidak ada OOV, tetapi urutan sekuensial menjadi 5x lebih panjang dan komputer kehilangan unit makna kata.

Solusi Emas: **Subword Tokenization (BPE / WordPiece)**!
Kata langka atau berimbuhan dipecah menjadi potongan subword yang bermakna:
- *"mempercantik"* $\\rightarrow$ \`['memper', '##cantik']\`
- *"unbelievable"* $\\rightarrow$ \`['un', '##believ', '##able']\`
Dengan cara ini, vocabulary tetap ringkas (~30.000 token) namun mampu merepresentasikan kata apa pun di dunia tanpa pernah mengalami OOV!`,
    practicalWalkthrough: {
      summary: 'Gunakan Hugging Face AutoTokenizer untuk membedah kalimat bahasa Indonesia menjadi input_ids, attention_mask, dan token strings.',
      environment: 'Jupyter Notebook / Google Colab (pip install transformers)',
      codeSnippets: [
        {
          title: 'Hugging Face Subword Tokenizer Exploration',
          language: 'python',
          code: `from transformers import AutoTokenizer

# Muat tokenizer IndoBERT
tokenizer = AutoTokenizer.from_pretrained("indobenchmark/indobert-base-p1")

text = "Pelayanan toko ini sangat mengecewakan bgt min!"
encoded = tokenizer(text, padding=True, truncation=True, return_tensors="pt")

print("Tokens string :", tokenizer.convert_ids_to_tokens(encoded['input_ids'][0]))
print("Input IDs     :", encoded['input_ids'][0])
print("Attention Mask:", encoded['attention_mask'][0])

# Dekode kembali ke teks asli
print("Decoded text  :", tokenizer.decode(encoded['input_ids'][0]))`,
          explanation: 'Memperlihatkan token khusus [CLS] di awal, [SEP] di akhir, serta pemecahan subword prefix ##.',
        },
      ],
    },
    stepByStepInstructions: [
      'Instal library transformers via pip.',
      'Muat tokenizer pra-latih (misal bert-base-uncased atau indobert-base-p1).',
      'Uji tokenisasi pada kalimat gaul, kata berimbuhan majemuk, dan kata buatan typo.',
      'Amati bagaimana tokenizer memecah kata yang tidak dikenal menjadi subwords berawalan ##.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Hugging Face Transformers', type: 'tool', url: 'https://huggingface.co/docs/transformers', description: 'Ekosistem standar industri untuk NLP dan LLM' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Subword Tokenizer', description: 'Tokenisasi 3 kalimat bahasa Indonesia kompleks dan analisis bagaimana kata berimbuhan dipecah oleh IndoBERT.' },
      { title: 'Tantangan Padding & Truncation', description: 'Bungkus list kalimat dengan panjang berbeda menggunakan max_length=16, padding="max_length", truncation=True dan amati hasil tensornya.', isStretch: true },
    ],
    deliverables: [
      'Printout daftar subword tokens dan input_ids untuk 3 kalimat uji.',
      'Penjelasan arti dari attention_mask pada token padding.',
    ],
    checklist: [
      { id: 'c1', label: 'Hugging Face AutoTokenizer berhasil diimpor dan diunduh', isRequired: true },
      { id: 'c2', label: 'Struktur input_ids dan attention_mask dipahami', isRequired: true },
      { id: 'c3', label: 'Perilaku pemecahan subword ## diverifikasi pada kata kompleks', isRequired: true },
    ],
    definitionOfDone: [
      'Mampu mempersiapkan teks menjadi tensor token yang siap disalurkan ke model Transformer.',
    ],
    reflectionQuestions: [
      'Mengapa token khusus [CLS] selalu diletakkan di indeks paling pertama kalimat?',
      'Apa yang terjadi jika kita lupa menyertakan attention_mask saat melakukan inferensi ber-batch dengan padding?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 61 untuk mempelajari jantung revolusi AI modern: Attention Mechanism!',
  },
  {
    id: 'day-061',
    day: 61,
    phaseId: 5,
    title: 'Attention Mechanism',
    shortDescription: 'Membedah revolusi "Attention Is All You Need": Query, Key, Value, Scaled Dot-Product Attention, dan matriks bobot atensi.',
    difficulty: 'Advanced',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Memahami mengapa RNN sekuensial ditinggalkan: bottleneck komputasi dan ketidakmampuan paralelisasi.',
      'Membedah analogi Retrieval: Query (apa yang dicari), Key (indeks label konten), dan Value (isi informasi).',
      'Mengimplementasikan Scaled Dot-Product Attention secara murni dengan tensor PyTorch.',
      'Memvisualisasikan matriks bobot atensi (Attention Map) untuk melihat koneksi kata antar token.',
    ],
    theoryContent: `### Revolusi AI: "Attention Is All You Need" (Vaswani et al., 2017)
Dalam RNN, informasi dari kata ke-1 harus berjalan melewati 99 langkah sekuensial untuk mencapai kata ke-100 (leher botol informasi).
**Self-Attention** memungkinkan setiap kata melihat langsung ke seluruh kata lain dalam kalimat dalam satu langkah komputasi paralel masif!

Rumus Sakral Scaled Dot-Product Attention:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$$
1. **$Q K^T$**: Menghitung skor keselarasan (*dot product*) seberapa relevan setiap token terhadap token lainnya.
2. **Dibagi $\\sqrt{d_k}$**: Mencegah nilai dot product membengkak ekstrem yang dapat membuat gradien softmax saturasi mendekati nol.
3. **Softmax**: Mengubah skor relevansi menjadi distribusi probabilitas berbobot total 1.0.
4. **Kalikan $V$**: Mengambil jumlah berbobot dari representasi isi informasi kata!`,
    practicalWalkthrough: {
      summary: 'Tulis fungsi Scaled Dot-Product Attention murni di PyTorch dan visualisasikan peta matriks atensinya.',
      environment: 'Jupyter Notebook / Google Colab (PyTorch)',
      codeSnippets: [
        {
          title: 'Pure Scaled Dot-Product Attention in PyTorch',
          language: 'python',
          code: `import torch
import torch.nn.functional as F
import matplotlib.pyplot as plt

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.size(-1)
    # 1. Matmul Q dan K transposed: [seq_len, seq_len]
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    # 2. Softmax untuk mendapatkan bobot atensi
    attention_weights = F.softmax(scores, dim=-1)
    # 3. Kalikan bobot dengan V
    output = torch.matmul(attention_weights, V)
    return output, attention_weights

# Contoh 4 token, embedding dimensi 8
tokens = ["Bank", "itu", "ada", "sungai"]
seq_len, d_k = len(tokens), 8
torch.manual_seed(42)
Q = torch.randn(seq_len, d_k)
K = torch.randn(seq_len, d_k)
V = torch.randn(seq_len, d_k)

output, attn_weights = scaled_dot_product_attention(Q, K, V)

# Visualisasikan matriks atensi
plt.figure(figsize=(5, 4))
plt.imshow(attn_weights.detach().numpy(), cmap='Blues')
plt.xticks(range(seq_len), tokens)
plt.yticks(range(seq_len), tokens)
plt.title("Attention Heatmap Matrix")
plt.colorbar()
plt.show()`,
          explanation: 'Implementasi murni persamaan atensi fundamental yang menjadi motor penggerak seluruh LLM modern.',
        },
      ],
    },
    stepByStepInstructions: [
      'Tulis fungsi scaled_dot_product_attention dari nol menggunakan operasi matriks tensor PyTorch.',
      'Verifikasi bahwa baris dari matriks atensi berjumlah tepat 1.0 setelah softmax.',
      'Plot heatmap matriks atensi menggunakan matplotlib imshow.',
      'Jelaskan mengapa faktor penskalaan $\\sqrt{d_k}$ mutlak diperlukan saat dimensi embedding besar.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Core Math', type: 'tool', description: 'torch.matmul, F.softmax' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Mekanisme Atensi', description: 'Implementasikan fungsi Scaled Dot-Product Attention dan buktikan output tensor cocok dengan nn.MultiheadAttention bawaan PyTorch.' },
      { title: 'Causal Masking Challenge', description: 'Tambahkan masking segitiga atas (upper triangular mask dengan nilai -inf) untuk simulasi autoregressive attention (seperti GPT).', isStretch: true },
    ],
    deliverables: [
      'Fungsi Python Scaled Dot-Product Attention murni.',
      'Heatmap visualisasi bobot matriks atensi.',
    ],
    checklist: [
      { id: 'c1', label: 'Operasi QK^T / sqrt(d_k) diimplementasikan tanpa error dimensi', isRequired: true },
      { id: 'c2', label: 'Softmax menghasilkan distribusi probabilitas terstandarisasi', isRequired: true },
      { id: 'c3', label: 'Matriks atensi berhasil divisualisasikan dalam bentuk heatmap', isRequired: true },
    ],
    definitionOfDone: [
      'Memahami mekanisme matematis fundamental di balik revolusi Attention Is All You Need.',
    ],
    reflectionQuestions: [
      'Mengapa algoritma Attention dapat diparalelkan di ribuan core GPU sementara RNN tidak bisa?',
      'Apa yang terjadi pada gradien softmax jika nilai dot product QK^T dibiarkan sangat besar tanpa dibagi sqrt(d_k)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 62 untuk melihat bagaimana multi-head attention dan feed-forward disatukan di Transformer Playground.',
  },
  {
    id: 'day-062',
    day: 62,
    phaseId: 5,
    title: 'Transformer Playground',
    shortDescription: 'Arsitektur Transformer lengkap: Multi-Head Attention, Positional Encoding, Residual Connections, dan LayerNorm.',
    difficulty: 'Advanced',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Memahami mengapa Transformer membutuhkan Multi-Head Attention: mengamati hubungan dari beberapa sudut pandang secara bersamaan.',
      'Memahami mengapa Positional Encoding mutlak diperlukan (karena atensi tidak memiliki konsep urutan alami).',
      'Memahami peran Residual Add & LayerNorm (Pre-LN vs Post-LN) untuk stabilitas aliran gradien.',
      'Membedakan 3 varian arsitektur: Encoder-only (BERT), Decoder-only (GPT), dan Encoder-Decoder (T5).',
    ],
    theoryContent: `### Menyatukan Seluruh Komponen: Blok Transformer
Satu blok Transformer Encoder terdiri dari dua sub-lapisan utama yang dibungkus oleh koneksi residual:
1. **Multi-Head Attention (MHA)**: Memecah vektor menjadi beberapa kepala (*heads*, misal 8 atau 12 kepala). Satu kepala fokus pada subjek kalimat, kepala lain fokus pada kata kerja, dan kepala lain fokus pada kata ganti.
2. **Positional Encoding**: Menambahkan gelombang sinus dan kosinus frekuensi berbeda ke embedding awal agar model tahu posisi kata ke-1 vs kata ke-5.
3. **Layer Normalization (LayerNorm)**: Menormalisasi fitur per token secara independen (berbeda dari BatchNorm yang bergantung pada mini-batch).
4. **Feed-Forward Network (FFN)**: Dua lapisan linier dengan aktivasi GELU untuk memproses representasi fitur lebih dalam.`,
    practicalWalkthrough: {
      summary: 'Gunakan torch.nn.TransformerEncoderLayer untuk merakit satu blok Transformer Encoder utuh dan lakukan forward pass.',
      environment: 'Jupyter Notebook / Google Colab (PyTorch)',
      codeSnippets: [
        {
          title: 'PyTorch Transformer Encoder Block',
          language: 'python',
          code: `import torch
import torch.nn as nn

# Definisikan satu blok Transformer Encoder standar
d_model = 64
nhead = 4
dim_feedforward = 256

encoder_layer = nn.TransformerEncoderLayer(
    d_model=d_model,
    nhead=nhead,
    dim_feedforward=dim_feedforward,
    dropout=0.1,
    activation='gelu',
    batch_first=True
)

transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=2)

# Uji forward pass: [Batch=2, Seq_len=10, D_model=64]
dummy_seq = torch.randn(2, 10, d_model)
output = transformer_encoder(dummy_seq)
print("Input shape :", dummy_seq.shape)
print("Output shape:", output.shape)
assert dummy_seq.shape == output.shape, "Shape Transformer harus invarian!"`,
          explanation: 'Blok Transformer Encoder mempertahankan dimensi tensor sembari memperkaya representasi kontekstual tiap token.',
        },
      ],
    },
    stepByStepInstructions: [
      'Rakit Transformer Encoder menggunakan nn.TransformerEncoderLayer.',
      'Pelajari parameter d_model, nhead, dan dim_feedforward.',
      'Pastikan batch_first=True digunakan agar format tensor konsisten [batch, seq, feature].',
      'Lakukan pengujian forward pass dan amati bagaimana bentuk dimensi tensor tetap dipertahankan.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Transformer Modules', type: 'tool', description: 'nn.TransformerEncoder, nn.TransformerEncoderLayer' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Blok Transformer', description: 'Rakit model Transformer 2-lapisan dan jelaskan fungsi dari koneksi residual Add & Norm.' },
      { title: 'Positional Encoding Generator', description: 'Tulis fungsi matematis penghasil gelombang sinus-kosinus Positional Encoding dari nol.', isStretch: true },
    ],
    deliverables: [
      'Kode rakitan blok Transformer Encoder.',
      'Penjelasan tertulis perbedaan mendasar Encoder-only (BERT) vs Decoder-only (GPT).',
    ],
    checklist: [
      { id: 'c1', label: 'TransformerEncoderLayer dikonfigurasi dengan nhead dan d_model yang kompatibel', isRequired: true },
      { id: 'c2', label: 'Format batch_first=True diterapkan', isRequired: true },
      { id: 'c3', label: 'Koneksi residual dan LayerNorm dipahami perannya', isRequired: true },
    ],
    definitionOfDone: [
      'Memahami arsitektur internal yang menyusun model fondasi modern.',
    ],
    reflectionQuestions: [
      'Mengapa LayerNorm lebih cocok digunakan untuk data teks/sekuensial dibanding BatchNorm?',
      'Mengapa Decoder Transformer (seperti GPT) membutuhkan Causal Masking sedangkan Encoder (seperti BERT) tidak?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 63 untuk memanfaatkan ribuan model Transformer siap pakai via Hugging Face Pipeline.',
  },
  {
    id: 'day-063',
    day: 63,
    phaseId: 5,
    title: 'Hugging Face Pipeline',
    shortDescription: 'Ekosistem Hugging Face: Memanfaatkan pipeline() instan untuk sentimen, zero-shot classification, NER, dan summarization.',
    difficulty: 'Intermediate',
    estimatedDuration: '70 Menit',
    learningObjectives: [
      'Memahami ekosistem Hugging Face Hub sebagai pasar terbuka model AI dunia.',
      'Menggunakan fungsi pipeline() tingkat tinggi untuk menyelesaikan tugas NLP dalam 3 baris kode.',
      'Menerapkan Zero-Shot Classification: mengklasifikasikan teks ke dalam kategori baru tanpa pernah melatih model!',
      'Mengekstrak entitas penting (Named Entity Recognition / NER) seperti orang, lokasi, dan organisasi.',
    ],
    theoryContent: `### Keajaiban Zero-Shot & Abstraksi Hugging Face
Di masa lalu, mengklasifikasikan teks membutuhkan ribuan sampel berlabel dan pelatihan berjam-jam.
Dengan **Hugging Face Pipeline**:
- Model pra-latih NLI (*Natural Language Inference*) dapat melakukan **Zero-Shot Classification**: Anda cukup memberikan kalimat dan daftar label sembarang (misal: \`["politik", "kuliner", "teknologi"]\`), dan model akan menghitung kesesuaian premis secara otomatis tanpa perlu training ulang!
- Abstraksi \`pipeline(task, model)\` mengurus tokenisasi, inferensi tensor di GPU, softmax, hingga decoding teks manusia secara otomatis.`,
    practicalWalkthrough: {
      summary: 'Jalankan sentimen analisis dan zero-shot classification bahasa Indonesia menggunakan Hugging Face pipeline.',
      environment: 'Google Colab / Jupyter lokal (pip install transformers torch)',
      codeSnippets: [
        {
          title: 'Hugging Face Instant Pipelines',
          language: 'python',
          code: `from transformers import pipeline

# 1. Pipeline Analisis Sentimen Instan
sentiment_pipe = pipeline("sentiment-analysis", model="indobenchmark/indobert-base-p1")
res1 = sentiment_pipe("Aplikasi ini sangat membantu pekerjaan harian saya!")
print("Sentimen:", res1)

# 2. Zero-Shot Classification (Klasifikasi tanpa data latih!)
zero_shot = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
kalimat = "Pemerintah meresmikan jalur kereta cepat baru antara dua kota metropolitan."
labels = ["transportasi publik", "sepak bola", "resep masakan"]

res2 = zero_shot(kalimat, candidate_labels=labels)
print(f"\\nKategori Prediksi: {res2['labels'][0]} (Keyakinan: {res2['scores'][0]*100:.1f}%)")`,
          explanation: 'Menyelesaikan masalah klasifikasi kompleks dalam hitungan detik menggunakan model fondasi siap pakai.',
        },
      ],
    },
    stepByStepInstructions: [
      'Instal library transformers dan torch.',
      'Jalankan pipeline("sentiment-analysis") pada beberapa kalimat ulasan produk.',
      'Jalankan pipeline("zero-shot-classification") dengan 4 kandidat label buatan Anda.',
      'Coba pipeline("ner") untuk mendeteksi entitas nama tokoh atau nama kota.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Hugging Face Hub & Pipelines', type: 'tool', url: 'https://huggingface.co/models', description: 'Pusat repositori model AI open-source' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Pipeline HF', description: 'Gunakan pipeline zero-shot classification untuk mengelompokkan 5 berita acak ke dalam 3 topik berbeda dengan akurasi 100%.' },
      { title: 'NER Extraction', description: 'Ekstrak entitas nama orang (PER) dan lokasi (LOC) dari paragraf berita bahasa Indonesia menggunakan pipeline NER.', isStretch: true },
    ],
    deliverables: [
      'Output eksekusi pipeline sentimen dan zero-shot classification.',
      'Catatan hasil evaluasi kecepatan dan ketepatan prediksi zero-shot.',
    ],
    checklist: [
      { id: 'c1', label: 'Hugging Face pipeline berhasil mengunduh model dari Hub', isRequired: true },
      { id: 'c2', label: 'Zero-shot classification berhasil memetakan teks ke kandidat label', isRequired: true },
      { id: 'c3', label: 'Inferensi dijalankan pada GPU / CPU tanpa error', isRequired: true },
    ],
    definitionOfDone: [
      'Mampu memanfaatkan model AI open-source siap pakai secara cepat untuk solusi bisnis nyata.',
    ],
    reflectionQuestions: [
      'Bagaimana Zero-Shot Classification bekerja secara matematis menggunakan Natural Language Inference (NLI)?',
      'Kapan menggunakan model pipeline siap pakai lebih bijak dibanding melakukan fine-tuning sendiri?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 64 untuk melakukan fine-tuning arsitektur BERT kustom menggunakan Hugging Face Trainer API.',
  },
  {
    id: 'day-064',
    day: 64,
    phaseId: 5,
    title: 'Fine-Tune a Transformer',
    shortDescription: 'Fine-tuning BERT menggunakan Hugging Face Trainer API: TrainingArguments, compute_metrics, dataset formatting, dan evaluasi F1.',
    difficulty: 'Advanced',
    estimatedDuration: '90 Menit',
    learningObjectives: [
      'Memahami alur kerja Fine-Tuning Transformer: AutoModelForSequenceClassification + AutoTokenizer.',
      'Menggunakan Hugging Face TrainingArguments (learning_rate=2e-5, per_device_train_batch_size, warmup_ratio).',
      'Menulis fungsi evaluasi kustom compute_metrics untuk menghitung akurasi dan F1-score secara otomatis.',
      'Menyimpan model fine-tuned ke folder lokal dengan model.save_pretrained().',
    ],
    theoryContent: `### Menyesuaikan Model Bahasa Pra-latih (BERT Fine-Tuning)
Model seperti BERT telah membaca miliaran kata di Wikipedia. Model sudah mengerti tata bahasa, tetapi belum tahu kategori spesifik yang Anda butuhkan (misal: klasifikasi tiket keluhan nasabah bank menjadi 5 divisi).

Resep Standar Fine-Tuning BERT:
- **AutoModelForSequenceClassification**: Mengambil backbone encoder BERT dan memasang kepala pooling linier baru di atas token \`[CLS]\`.
- **Learning Rate Kecil**: Wajib di rentang \`2e-5\` sampai \`5e-5\`. (Jika menggunakan 0.01 seperti MLP biasa, representasi bahasa akan langsung rusak!).
- **Jumlah Epoch Singkat**: Cukup 2 hingga 4 epoch! Pelatihan terlalu lama akan menyebabkan overfitting parah (*over-fitting on small domain*).`,
    practicalWalkthrough: {
      summary: 'Konfigurasikan Hugging Face Trainer untuk melatih model klasifikasi teks selama 3 epoch dan pantau evaluasi F1.',
      environment: 'Google Colab (GPU T4 wajib) / Kaggle Notebook',
      codeSnippets: [
        {
          title: 'Hugging Face Trainer Fine-Tuning Workflow',
          language: 'python',
          code: `from transformers import AutoModelForSequenceClassification, TrainingArguments, Trainer
import evaluate
import numpy as np

# 1. Muat Model dengan Kepala Klasifikasi Biner
model = AutoModelForSequenceClassification.from_pretrained("indobenchmark/indobert-base-p1", num_labels=2)

# 2. Definisikan Metrik Evaluasi
f1_metric = evaluate.load("f1")
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    return f1_metric.compute(predictions=preds, references=labels, average="macro")

# 3. Konfigurasi TrainingArguments
training_args = TrainingArguments(
    output_dir="./results_bert",
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5, # Kunci utama: LR sangat kecil!
    per_device_train_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    load_best_model_at_end=True,
    metric_for_best_model="f1"
)

# 4. Trainer
# trainer = Trainer(model=model, args=training_args, train_dataset=tokenized_train, eval_dataset=tokenized_val, compute_metrics=compute_metrics)
# trainer.train()
print("Konfigurasi Fine-Tuning BERT siap dijalankan!")`,
          explanation: 'Trainer API mengotomatisasi seluruh alur pelatihan, evaluasi epoch, logging, dan checkpointing terbaik.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan Google Colab dengan runtime GPU.',
      'Muat dataset klasifikasi teks bahasa Indonesia (misal IndoNLU SmSA).',
      'Format data ke Dataset dictionary menggunakan pustaka datasets.',
      'Tokenisasi seluruh dataset dengan tokenizer batch map.',
      'Jalankan trainer.train() selama 3 epoch dan catat metrik F1-score akhir.',
      'Simpan model dengan trainer.save_model("./my_best_indobert").',
    ],
    requiredToolsAndDatasets: [
      { name: 'Hugging Face Trainer & Evaluate', type: 'tool', description: 'Trainer, TrainingArguments, evaluate' },
      { name: 'IndoNLU SmSA Dataset', type: 'dataset', description: 'Dataset analisis sentimen bahasa Indonesia benchmark' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Fine-Tuning BERT', description: 'Latih model BERT selama 3 epoch dan buktikan F1-score melampaui 88% pada test set.' },
      { title: 'Tantangan Learning Rate Sweep', description: 'Bandingkan stabilitas loss saat learning rate disetel 2e-5 (stabil) vs 1e-3 (langsung meledak/gagal).', isStretch: true },
    ],
    deliverables: [
      'Folder model hasil fine-tuning tersimpan lokal.',
      'Log metrik evaluasi F1 dan akurasi per epoch.',
    ],
    checklist: [
      { id: 'c1', label: 'Learning rate disetel dalam rentang aman Transformer (2e-5 - 3e-5)', isRequired: true },
      { id: 'c2', label: 'compute_metrics menghitung F1-macro secara dinamis', isRequired: true },
      { id: 'c3', label: 'Model terbaik otomatis disimpan berdasarkan skor validasi puncak', isRequired: true },
    ],
    definitionOfDone: [
      'Model Transformer berhasil diadaptasikan secara presisi untuk domain klasifikasi spesifik.',
    ],
    reflectionQuestions: [
      'Mengapa model Transformer seperti BERT sangat rentan mengalami degradasi performa jika dilatih dengan learning rate di atas 1e-4?',
      'Apa keunggulan Hugging Face Trainer dibanding menulis loop pelatihan PyTorch manual untuk model pra-latih?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 65 untuk menaklukkan tantangan khas lokal di Indonesian NLP Challenge.',
  },
  {
    id: 'day-065',
    day: 65,
    phaseId: 5,
    title: 'Indonesian NLP Challenge',
    shortDescription: 'Menaklukkan nuansa lokal: Bahasa gaul, code-switching (campur bahasa Indo-Inggris), dialek daerah, dan benchmark IndoBERT vs Indo4B.',
    difficulty: 'Advanced',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami tantangan unik NLP Bahasa Indonesia: infleksi afiks kompleks, kata serapan, dan fenomena code-switching (bahasa campur Jaksel / Indo-Inggris).',
      'Mengevaluasi performa IndoBERT (IndoBenchmark) vs RoBERTa multilingual (XLM-RoBERTa) pada korpus lokal.',
      'Menangani variasi penulisan informal (misal: "bgt", "bangeet", "bgt2", "bingits").',
      'Membangun strategi augmentasi teks berbasis sinonim bahasa Indonesia (back-translation atau synonym replacement).',
    ],
    theoryContent: `### Menaklukkan Rimba Bahasa Indonesia Sehari-hari
Bahasa Indonesia formal (KBBI) sangat berbeda dari bahasa yang digunakan 280 juta penduduk di media sosial dan percakapan nyata:
1. **Code-Switching**: *"Jujurly gue prefer meeting-nya di-reschedule aja, which is lebih make sense."* Model mono-bahasa formal akan bingung menghadapi kalimat campuran ini.
2. **Kekayaan Imbuhan (Morfologi)**: Satu kata dasar *"ajar"* bisa menjadi *belajar, mengajar, terpelajar, diajarkan, pembelajaran, pengajaran*.
3. **Model Khusus**: Model seperti **IndoBERT** dilatih pada ratusan juta kata korpus lokal (Indo4B) sehingga memahami kosakata gaul jauh lebih baik dibanding model global generik.`,
    practicalWalkthrough: {
      summary: 'Uji ketahanan IndoBERT vs XLM-RoBERTa pada 10 kalimat ekstrem berisi bahasa gaul, singkatan, dan campur bahasa Inggris.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Indonesian Code-Switching & Slang Benchmark',
          language: 'python',
          code: `from transformers import pipeline

# Inisialisasi pipeline model khusus Indonesia
indobert_pipe = pipeline("sentiment-analysis", model="indobenchmark/indobert-base-p1")

test_phrases = [
    "Jujurly ini worth it bgt sih, packaging-nya so aesthetic!",
    "Parah bgt sellernya slow response, gak recommended samsek.",
    "Barang udah nyampe, tpi pas unboxing ternyata zonk.",
    "Beli pas diskon 12.12 mantul abis, no debat!"
]

for phrase in test_phrases:
    res = indobert_pipe(phrase)[0]
    print(f"Kalimat: '{phrase}'")
    print(f"-> Prediksi: {res['label']} ({res['score']*100:.1f}%)\\n")`,
          explanation: 'Menguji ketajaman pemahaman model bahasa terhadap dinamika slang kontemporer.',
        },
      ],
    },
    stepByStepInstructions: [
      'Siapkan 15 contoh kalimat informal nyata dari media sosial Indonesia.',
      'Jalankan pengujian sentimen menggunakan IndoBERT.',
      'Identifikasi kata slang mana yang berhasil dipahami dan mana yang gagal.',
      'Rancang modul penyesuaian kamus normalisasi untuk kata-kata yang gagal diprediksi.',
    ],
    requiredToolsAndDatasets: [
      { name: 'IndoBenchmark IndoBERT', type: 'tool', url: 'https://github.com/indobenchmark/indonlu', description: 'Suite benchmark bahasa Indonesia pertama' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas NLP Lokal', description: 'Capai akurasi minimal 85% pada dataset uji teks bahasa informal Indonesia.' },
      { title: 'Tantangan Dialek Daerah', description: 'Uji kalimat yang mengandung partikel daerah (misal bahasa Sunda: "mah", "teh", atau Jawa: "yo", "rek") dan catat respons model.', isStretch: true },
    ],
    deliverables: [
      'Laporan perbandingan akurasi pada kalimat formal vs kalimat informal campur.',
      'Daftar 10 temuan linguistik unik model IndoBERT.',
    ],
    checklist: [
      { id: 'c1', label: 'Model dievaluasi pada data bahasa informal kontemporer', isRequired: true },
      { id: 'c2', label: 'Ketahanan model terhadap code-switching diuji', isRequired: true },
      { id: 'c3', label: 'Perbedaan performa model lokal vs global dicatat', isRequired: true },
    ],
    definitionOfDone: [
      'Memahami karakteristik dan solusi praktis untuk mengolah data teks bahasa Indonesia nyata.',
    ],
    reflectionQuestions: [
      'Mengapa model pra-latih monolingual (seperti IndoBERT) seringkali mengungguli model multilingual raksasa (seperti mBERT) pada tugas bahasa Indonesia?',
      'Bagaimana cara terbaik menangani kata-kata slang baru yang muncul setiap tahun di internet?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 66 untuk mengatasi data teks yang sangat tidak seimbang di Imbalanced NLP.',
  },
  {
    id: 'day-066',
    day: 66,
    phaseId: 5,
    title: 'Imbalanced NLP',
    shortDescription: 'Menangani ketidakseimbangan kelas pada teks: Focal Loss, Class-weighted CrossEntropyLoss, dan threshold calibration pada Transformer.',
    difficulty: 'Advanced',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami tantangan ketidakseimbangan kelas pada NLP (misal: hate speech atau ancaman fraud hanya 2% dari seluruh pesan).',
      'Mengapa over-sampling teks sintetis (seperti SMOTE pada embedding) seringkali menghasilkan representasi bahasa yang rancu.',
      'Menerapkan Class-weighted CrossEntropyLoss di dalam kustomisasi loss Hugging Face Trainer.',
      'Memahami formulasi Focal Loss untuk memfokuskan pembelajaran pada kalimat sulit (*hard examples*).',
    ],
    theoryContent: `### Menemukan Jarum dalam Jerami Teks (Imbalanced NLP)
Pada moderasi konten media sosial, 98% komentar adalah normal, dan hanya 2% yang mengandung ujaran kebencian (*hate speech*).
Jika model Transformer hanya dilatih dengan loss biasa, model akan cepat puas dengan menebak "Normal" untuk segalanya.

Solusi Terbaik:
1. **Class-Weighted Loss**: Menghitung bobot kelas terbalik ($w_c = \\frac{N}{C \\times N_c}$) dan meneruskannya ke \`nn.CrossEntropyLoss(weight=weights)\`.
2. **Focal Loss (Lin et al.)**:
$$FL(p_t) = -\\alpha_t (1 - p_t)^\\gamma \\log(p_t)$$
Faktor modulasi $(1 - p_t)^\\gamma$ secara otomatis menurunkan bobot kalimat mudah yang sudah dipahami model, sehingga gradien didominasi oleh kalimat ambigu yang sulit!`,
    practicalWalkthrough: {
      summary: 'Kustomisasi subclass Trainer Hugging Face untuk menerapkan loss berbobot kelas pada dataset sentimen timpang.',
      environment: 'Jupyter Notebook / Google Colab (PyTorch + Transformers)',
      codeSnippets: [
        {
          title: 'Custom Weighted Loss Trainer',
          language: 'python',
          code: `import torch
import torch.nn as nn
from transformers import Trainer

class WeightedLossTrainer(Trainer):
    def __init__(self, class_weights=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.class_weights = class_weights
        
    def compute_loss(self, model, inputs, return_outputs=False, num_items_in_batch=None):
        labels = inputs.get("labels")
        outputs = model(**inputs)
        logits = outputs.get("logits")
        
        # CrossEntropyLoss dengan bobot kelas khusus
        if self.class_weights is not None:
            weight_tensor = torch.tensor(self.class_weights, device=model.device).float()
            loss_fn = nn.CrossEntropyLoss(weight=weight_tensor)
        else:
            loss_fn = nn.CrossEntropyLoss()
            
        loss = loss_fn(logits.view(-1, self.model.config.num_labels), labels.view(-1))
        return (loss, outputs) if return_outputs else loss`,
          explanation: 'Mengubah fungsi objektif pelatihan agar memberikan hukuman berat saat salah mendeteksi kelas minoritas.',
        },
      ],
    },
    stepByStepInstructions: [
      'Siapkan dataset teks dengan rasio kelas minoritas di bawah 10%.',
      'Hitung bobot kelas menggunakan compute_class_weight dari Scikit-Learn.',
      'Subclass Trainer dan timpa (override) fungsi compute_loss().',
      'Latih model dan amati bagaimana Recall kelas minoritas meningkat drastis.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Weighted Loss', type: 'tool', description: 'nn.CrossEntropyLoss(weight=...)' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Imbalanced NLP', description: 'Terapkan custom weighted loss dan buktikan peningkatan F1-macro minimal 15% pada kelas minoritas.' },
      { title: 'Focal Loss Implementation', description: 'Gantikan CrossEntropyLoss dengan Focal Loss kustom (gamma=2.0) dan bandingkan kurva konvergensinya.', isStretch: true },
    ],
    deliverables: [
      'Kode kelas WeightedLossTrainer.',
      'Laporan metrik Precision, Recall, dan F1 untuk kelas minoritas sebelum vs sesudah pembobotan.',
    ],
    checklist: [
      { id: 'c1', label: 'Bobot kelas dihitung secara proporsional dari frekuensi data latih', isRequired: true },
      { id: 'c2', label: 'compute_loss berhasil dioverride pada Hugging Face Trainer', isRequired: true },
      { id: 'c3', label: 'Recall kelas langka mengalami peningkatan terukur', isRequired: true },
    ],
    definitionOfDone: [
      'Model bahasa mampu mendeteksi kasus langka berisiko tinggi tanpa mengorbankan stabilitas sistem.',
    ],
    reflectionQuestions: [
      'Mengapa teknik SMOTE pada representasi teks sering menghasilkan kalimat sintetis yang tidak bermakna di ruang bahasa?',
      'Bagaimana parameter gamma pada Focal Loss membedakan antara contoh mudah vs contoh sulit?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 67 untuk mengadu arsitektur NLP klasik vs Transformer di Model Comparison.',
  },
  {
    id: 'day-067',
    day: 67,
    phaseId: 5,
    title: 'Model Comparison',
    shortDescription: 'Pertarungan akbar NLP: TF-IDF + Logistic Regression vs Bi-LSTM vs IndoBERT. Membedah trade-off akurasi, latensi, dan ukuran model.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Membandingkan 3 era NLP pada satu dataset uji yang identik: BoW klasik, RNN sekuensial, dan Transformer modern.',
      'Mengukur trade-off segitiga emas: F1-Score vs Latensi Inferensi (ms) vs Ukuran Memori File (MB).',
      'Menganalisis skenario bisnis: kapan model TF-IDF 5MB lebih masuk akal dibanding model IndoBERT 450MB.',
      'Menyusun tabel perbandingan komprehensif untuk justifikasi pemilihan arsitektur.',
    ],
    theoryContent: `### Memilih Senjata yang Tepat untuk Medan Tempur NLP
Apakah Anda selalu membutuhkan model Transformer 110 juta parameter untuk memfilter email spam?
Jawabannya adalah **TIDAK**.

Perbandingan Tiga Generasi NLP:
1. **TF-IDF + Ridge/LinearSVC**:
   - Kecepatan: < 0.2 ms per kalimat!
   - Ukuran: ~3 MB.
   - Akurasi: ~82%.
2. **Bi-LSTM (PyTorch)**:
   - Kecepatan: ~5 ms per kalimat.
   - Ukuran: ~15 MB.
   - Akurasi: ~86%.
3. **IndoBERT (Transformer)**:
   - Kecepatan: ~45 ms per kalimat (butuh GPU/akselerator untuk melayani ribuan QPS).
   - Ukuran: ~440 MB.
   - Akurasi: ~93%.
Jika sistem Anda harus memproses 50.000 ulasan per detik di perangkat edge IoT, TF-IDF adalah pemenangnya!`,
    practicalWalkthrough: {
      summary: 'Lakukan benchmarking otomatis pada ketiga model teks dan buat tabel perbandingan metrik & kecepatan inferensi.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'NLP Tri-Era Benchmark Script',
          language: 'python',
          code: `import time
import pandas as pd

models = {
    'TF-IDF + LogReg': (model_tfidf, 'cpu'),
    'Bi-LSTM': (model_bilstm, device),
    'IndoBERT': (model_indobert, device)
}

benchmarks = []
sample_text = ["Pengiriman barang sangat cepat dan kurir ramah sekali!"] * 100

for name, (m, dev) in models.items():
    # Ukur latensi inferensi batch
    t0 = time.perf_counter()
    # [Eksekusi inferensi per model]
    elapsed = (time.perf_counter() - t0) * 1000 / len(sample_text)
    
    benchmarks.append({
        'Arsitektur': name,
        'Latency (ms/teks)': round(elapsed, 2),
        'Perangkat': str(dev)
    })

print(pd.DataFrame(benchmarks).to_string(index=False))`,
          explanation: 'Memetakan kecepatan inferensi secara transparan untuk pertimbangan kelayakan arsitektur sistem.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan ketiga model yang telah Anda bangun dari Hari 56, Hari 58, dan Hari 64.',
      'Uji ketiganya pada 500 sampel data uji yang sama persis.',
      'Ukur F1-macro, waktu inferensi per sampel, dan catat ukuran file artefak model di disk.',
      'Susun hasil evaluasi ke dalam tabel matriks perbandingan.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Python time & os.path.getsize', type: 'tool', description: 'Benchmarking efisiensi sistem' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Perbandingan Tiga Model', description: 'Buat tabel komparasi lengkap TF-IDF vs Bi-LSTM vs IndoBERT lintas 4 dimensi (F1, AUC, Latensi, Ukuran File).' },
      { title: 'Cost-Benefit Calculation', description: 'Hitung estimasi biaya bulanan server cloud untuk menjalankan IndoBERT di GPU vs TF-IDF di CPU hemat energi.', isStretch: true },
    ],
    deliverables: [
      'Tabel Leaderboard perbandingan 3 generasi model NLP.',
      'Rekomendasi tertulis skenario arsitektur mana yang paling tepat untuk skala startup vs korporat.',
    ],
    checklist: [
      { id: 'c1', label: 'Ketiga model diuji pada data test set yang identik', isRequired: true },
      { id: 'c2', label: 'Latensi diukur dalam milidetik per sampel kalimat', isRequired: true },
      { id: 'c3', label: 'Ukuran file model artefak dicatat secara nyata', isRequired: true },
    ],
    definitionOfDone: [
      'Mampu memberikan rekomendasi pemilihan arsitektur NLP berbasis data empiris yang objektif.',
    ],
    reflectionQuestions: [
      'Kapan peningkatan akurasi 3% pada Transformer tidak sebanding dengan lonjakan biaya komputasinya?',
      'Bagaimana cara memadukan TF-IDF sebagai filter tahap awal (triage) sebelum diteruskan ke model Transformer?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 68 untuk mempercepat inferensi Transformer melalui Inference Optimization (Kuantisasi & ONNX).',
  },
  {
    id: 'day-068',
    day: 68,
    phaseId: 5,
    title: 'Inference Optimization',
    shortDescription: 'Membuat Transformer gesit: Kuantisasi bobot (INT8 / Dynamic Quantization), ekspor ONNX Runtime, dan pemangkasan latensi 3x lipat.',
    difficulty: 'Advanced',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami mengapa model deep learning lambat: bobot presisi 32-bit floating point (FP32) boros bandwidth memori.',
      'Menerapkan Dynamic Quantization (FP32 $\\rightarrow$ INT8) di PyTorch untuk mengecilkan ukuran model hingga 75%.',
      'Mengekspor model Hugging Face ke format open-standard ONNX (Open Neural Network Exchange).',
      'Menjalankan inferensi dengan ONNX Runtime untuk akselerasi eksekusi di CPU tanpa GPU.',
    ],
    theoryContent: `### Menurunkan Berat Badan Transformer: Kuantisasi & ONNX
Model IndoBERT berukuran ~440 MB karena setiap bobot disimpan dalam format 32-bit float.
1. **Dynamic Quantization**:
   Mengonversi bobot matriks linier dari Float32 (4 byte) menjadi Integer8 (1 byte):
   - Ukuran file menyusut drastis dari 440 MB menjadi ~110 MB!
   - Pengurangan beban memori bandwidth membuat komputasi CPU 2x hingga 3x lebih cepat dengan penurunan akurasi yang hampir tidak terasa (< 0.5%).
2. **ONNX Runtime**: Mesin eksekusi inferensi lintas platform dari Microsoft yang melakukan fusi operator (*operator fusion*) dan optimasi graf perangkat keras.`,
    practicalWalkthrough: {
      summary: 'Terapkan torch.quantization.quantize_dynamic pada model Transformer dan ukur perbandingan kecepatan serta ukuran memorinya.',
      environment: 'Jupyter Notebook / Google Colab (pip install onnx onnxruntime)',
      codeSnippets: [
        {
          title: 'PyTorch INT8 Dynamic Quantization',
          language: 'python',
          code: `import torch
import os

# 1. Terapkan Kuantisasi Dinamis INT8 pada lapisan Linear
quantized_model = torch.quantization.quantize_dynamic(
    model,
    {torch.nn.Linear}, # Kuantisasi lapisan linier
    dtype=torch.qint8
)

# Simpan dan bandingkan ukuran file di disk
torch.save(model.state_dict(), "model_fp32.pt")
torch.save(quantized_model.state_dict(), "model_int8.pt")

size_fp32 = os.path.getsize("model_fp32.pt") / (1024 * 1024)
size_int8 = os.path.getsize("model_int8.pt") / (1024 * 1024)

print(f"Ukuran Model Asli (FP32) : {size_fp32:.1f} MB")
print(f"Ukuran Model Kuantisasi (INT8): {size_int8:.1f} MB (Hemat {(1 - size_int8/size_fp32)*100:.1f}%)")`,
          explanation: 'Mengecilkan bobot model hingga 4x lebih hemat memori dengan akurasi yang tetap terjaga.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan model IndoBERT hasil fine-tuning Hari 64.',
      'Terapkan quantize_dynamic dengan target dtype=torch.qint8.',
      'Simpan kedua model ke disk dan ukur ukuran filenya.',
      'Bandingkan waktu inferensi 100 kalimat pada CPU antara model FP32 vs model INT8.',
      'Pastikan metrik F1-score model INT8 tidak turun lebih dari 1% dibanding aslinya.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Quantization', type: 'tool', description: 'torch.quantization.quantize_dynamic' },
      { name: 'ONNX Runtime', type: 'tool', url: 'https://onnxruntime.ai/', description: 'Akselerator inferensi multi-platform' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Kuantisasi', description: 'Buktikan bahwa kuantisasi INT8 memangkas ukuran model minimal 60% dan mempercepat inferensi di CPU.' },
      { title: 'Ekspor ONNX Challenge', description: 'Ekspor model Transformer menggunakan torch.onnx.export dan jalankan inferensi via onnxruntime.InferenceSession.', isStretch: true },
    ],
    deliverables: [
      'File artefak model terkuantisasi "model_int8.pt".',
      'Tabel perbandingan ukuran memori dan latensi sebelum vs sesudah kuantisasi.',
    ],
    checklist: [
      { id: 'c1', label: 'Kuantisasi INT8 berhasil diterapkan pada lapisan Linear', isRequired: true },
      { id: 'c2', label: 'Ukuran file model menyusut secara signifikan', isRequired: true },
      { id: 'c3', label: 'Penurunan akurasi terverifikasi kurang dari 1%', isRequired: true },
    ],
    definitionOfDone: [
      'Model Transformer berhasil dioptimalkan untuk inferensi produksi berkecepatan tinggi.',
    ],
    reflectionQuestions: [
      'Mengapa kuantisasi bobot dari FP32 ke INT8 jarang merusak performa model Transformer secara drastis?',
      'Apa perbedaan antara Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 69 untuk mempublikasikan Mini-Project 5: Indonesian Text Classification!',
  },
  {
    id: 'day-069',
    day: 69,
    phaseId: 5,
    title: 'Mini-project 5: Indonesian Text Classification',
    shortDescription: 'Proyek akhir Fase 5: Membangun API / fungsi inferensi klasifikasi teks bahasa Indonesia siap pakai berbasis model Transformer teroptimasi.',
    difficulty: 'Intermediate',
    estimatedDuration: '90 Menit',
    isProject: true,
    projectMilestoneId: 'proj-5',
    learningObjectives: [
      'Mengintegrasikan seluruh materi NLP: preprocessing bahasa lokal, fine-tuning IndoBERT, error analysis, dan optimasi kuantisasi.',
      'Membangun fungsi inferensi teks tunggal dan batch yang tahan terhadap typo dan bahasa gaul.',
      'Menyediakan dokumentasi cara pakai, contoh input-output, dan batas keandalan model.',
      'Mendokumentasikan seluruh repositori di GitHub dan tab Portofolio.',
    ],
    theoryContent: `### Mini-Project 5: Portofolio NLP Berdaya Guna Nyata
Di pasar kerja global maupun Asia Tenggara, keahlian membangun sistem NLP untuk **bahasa berkarakteristik khusus** (seperti Bahasa Indonesia yang non-formal) sangat dicari.
Standar Keberhasilan Proyek:
1. **Model Berkualitas Tinggi**: F1-macro > 88% pada dataset benchmark.
2. **Robust Inference**: Fungsi inferensi yang tidak crash ketika menerima input aneh (kalimat kosong, hanya emoji, atau teks 1000 kata).
3. **Optimized Artifact**: Model terkuantisasi yang ringan dijalankan di laptop standar tanpa memerlukan GPU mahal.`,
    practicalWalkthrough: {
      summary: 'Kompilasi modul klasifikasi teks bahasa Indonesia end-to-end, uji coba fungsi predict_sentiment(), dan publikasikan ke portofolio.',
      environment: 'Google Colab / Jupyter / GitHub Gist',
      codeSnippets: [
        {
          title: 'Production Indonesian NLP Classifier Class',
          language: 'python',
          code: `import torch
from transformers import AutoTokenizer

class IndonesianSentimentEngine:
    def __init__(self, model_path, tokenizer_name="indobenchmark/indobert-base-p1"):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
        # Muat model terkuantisasi atau FP32
        self.model = torch.load(model_path, map_location=self.device)
        self.model.eval()
        self.labels_map = {0: 'Negatif', 1: 'Netral', 2: 'Positif'}
        
    def predict(self, text):
        if not text or not text.strip():
            return {'label': 'Netral', 'confidence': 0.0, 'note': 'Empty text'}
            
        inputs = self.tokenizer(text, truncation=True, max_length=128, return_tensors='pt').to(self.device)
        with torch.no_grad():
            logits = self.model(**inputs).logits
            probs = torch.softmax(logits, dim=-1)[0]
            pred_idx = torch.argmax(probs).item()
            
        return {
            'text': text,
            'sentiment': self.labels_map.get(pred_idx, str(pred_idx)),
            'confidence': round(probs[pred_idx].item() * 100, 2)
        }

# engine = IndonesianSentimentEngine("model_int8.pt")
# print(engine.predict("Barang bagus dan pelayanan admin ramah bgt!"))`,
          explanation: 'Kelas inferensi yang aman dari kegagalan input dan siap diintegrasikan ke backend web.',
        },
      ],
    },
    stepByStepInstructions: [
      'Pilih dataset teks bahasa Indonesia menantang (Ulasan Toko Online, Opini Finansial, atau Cuitan Twitter).',
      'Latih model Transformer menggunakan Hugging Face Trainer API.',
      'Lakukan analisis error dan evaluasi F1-macro.',
      'Terapkan kuantisasi bobot model.',
      'Bungkus fungsi inferensi ke dalam kelas Python yang bersih.',
      'Unggah kode dan dokumentasi README ke GitHub, lalu simpan tautannya di tab Portofolio.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Dataset Teks Bahasa Indonesia Publik', type: 'dataset', description: 'IndoNLU / Kaggle Indo sentiment' },
      { name: 'Stack Lengkap Fase 5', type: 'tool', description: 'Transformers, PyTorch, Evaluate' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Mini-Project 5', description: 'Selesaikan proyek klasifikasi teks bahasa Indonesia lengkap dengan F1 > 88% dan fungsi inferensi mandiri.' },
      { title: 'Tantangan Batch API', description: 'Tambahkan metode predict_batch(list_of_texts) yang mampu memproses 100 kalimat secara simultan dengan efisiensi memori.', isStretch: true },
    ],
    deliverables: [
      'Tautan repositori GitHub berisi kode lengkap dan dokumentasi.',
      'Laporan metrik F1-score dan confusion matrix.',
      'File artefak model inferensi.',
    ],
    checklist: [
      { id: 'c1', label: 'Model Transformer bahasa Indonesia dilatih dan dievaluasi', isRequired: true },
      { id: 'c2', label: 'Fungsi inferensi mandiri tahan terhadap input kosong atau anomali', isRequired: true },
      { id: 'c3', label: 'Optimasi model (kuantisasi atau pruning) diterapkan', isRequired: true },
      { id: 'c4', label: 'Tautan proyek dan metrik dicatat di tab Portofolio', isRequired: true },
    ],
    definitionOfDone: [
      'Mini-Project 5 resmi selesai dan diverifikasi.',
      'Fase 5 NLP & Transformers tuntas 100%!',
    ],
    reflectionQuestions: [
      'Apa pelajaran terbesar yang Anda petik saat menangani bahasa informal lokal dibanding data teks bahasa Inggris yang rapi?',
      'Bagaimana pemahaman tentang arsitektur Transformer mempersiapkan Anda melangkah ke dunia Generative AI dan LLM?',
    ],
    suggestedNextStep: 'Selamat atas pencapaian spektakuler menuntaskan dunia NLP! Besok kita masuk ke Fase 6: Generative AI & LLM Engineering (Prompting, RAG, & Vector DB)!',
  },
];
