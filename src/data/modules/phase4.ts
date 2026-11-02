/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumModule } from '../../types/curriculum';

export const PHASE_4_MODULES: CurriculumModule[] = [
  {
    id: 'day-040',
    day: 40,
    phaseId: 4,
    title: 'PyTorch Training Setup',
    shortDescription: 'Memulai Deep Learning: Tensors, operasi aljabar linier pada GPU/CUDA vs MPS vs CPU, autograd engine, dan komputasi gradien.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami Tensor sebagai struktur data multi-dimensi fundamental deep learning.',
      'Mengonfigurasi pemilihan device agnostik (CUDA untuk Nvidia, MPS untuk Apple Silicon, CPU fallback).',
      'Memahami mekanisme autograd PyTorch (backward pass dan komputasi gradien dinamis).',
      'Menggunakan requires_grad=True dan operasi tensor dasar (matmul, reshape, transpose).',
    ],
    theoryContent: `### Memasuki Dunia Deep Learning: Mengapa PyTorch?
Deep learning membutuhkan triliunan operasi perkalian matriks (*matrix multiplication*). CPU biasa terlalu lambat; kita membutuhkan komputasi paralel masif di ribuan core GPU.

Dua Pilar PyTorch:
1. **Tensor**: Mirip \`numpy.ndarray\`, tetapi dapat dipindahkan ke memori GPU (\`.to(device)\`).
2. **Autograd**: Mesin diferensiasi otomatis. Setiap operasi matematika pada tensor dengan \`requires_grad=True\` dicatat dalam graf komputasi terarah (*Computational Graph*). Ketika \`loss.backward()\` dipanggil, PyTorch secara otomatis menghitung turunan parsial $\\frac{\\partial \\text{loss}}{\\partial w}$ via aturan rantai (*chain rule*) kalkulus!`,
    practicalWalkthrough: {
      summary: 'Inisialisasi device agnostik, lakukan perkalian matriks di GPU, dan hitung gradien menggunakan autograd.',
      environment: 'Google Colab (dengan runtime GPU T4) / Jupyter lokal',
      codeSnippets: [
        {
          title: 'Device Agnostic & Autograd Demo',
          language: 'python',
          code: `import torch

# 1. Konfigurasi Device Agnostik
device = torch.device('cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu')
print(f"🚀 Perangkat Komputasi Aktif: {device}")

# 2. Operasi Autograd Gradien
x = torch.tensor([2.0, 3.0], requires_grad=True, device=device)
# Persamaan y = 3*x^2 + 5*x
y = 3 * (x ** 2) + 5 * x
loss = y.sum()

# Backward pass (hitung dy/dx)
loss.backward()

# Secara analitik: dy/dx = 6*x + 5
# Untuk x=2 -> 6(2)+5 = 17. Untuk x=3 -> 6(3)+5 = 23
print("Gradien terhitung otomatis (x.grad):", x.grad)
assert torch.allclose(x.grad, 6 * x + 5), "Gradien tidak cocok!"`,
          explanation: 'Membuktikan autograd menghitung turunan kalkulus eksak tanpa perlu perhitungan manual.',
        },
      ],
    },
    stepByStepInstructions: [
      'Buka Google Colab dan pastikan Hardware Accelerator disetel ke "GPU T4".',
      'Verifikasi instalasi PyTorch dan ketersediaan CUDA dengan torch.cuda.is_available().',
      'Buat dua tensor acak berukuran (1000, 1000) dan bandingkan waktu perkalian torch.matmul di CPU vs GPU.',
      'Definisikan fungsi skalar sederhana dengan variabel requires_grad=True, jalankan .backward(), dan amati nilai .grad.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch (torch)', type: 'tool', url: 'https://pytorch.org/', description: 'Framework deep learning terkemuka' },
      { name: 'Google Colab GPU', type: 'tool', description: 'Akselerator komputasi gratis' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Setup PyTorch', description: 'Konfigurasi skrip device agnostik dan buktikan eksekusi matmul GPU minimal 5x lebih cepat dari CPU.' },
      { title: 'Tantangan Gradien Manual', description: 'Tulis fungsi kuadrat multivariat, hitung turunan parsialnya di atas kertas, dan buktikan x.grad bernilai sama persis.', isStretch: true },
    ],
    deliverables: [
      'Printout informasi GPU terdeteksi di terminal/notebook.',
      'Bukti verifikasi autograd dengan pernyataan assert.',
    ],
    checklist: [
      { id: 'c1', label: 'PyTorch terinstal dan device agnostik dikonfigurasi', isRequired: true },
      { id: 'c2', label: 'Tensor berhasil dipindahkan ke memory GPU / target device', isRequired: true },
      { id: 'c3', label: 'Mekanisme autograd diuji coba dengan operasi backward()', isRequired: true },
    ],
    definitionOfDone: [
      'Lingkungan PyTorch siap digunakan untuk membangun arsitektur jaringan syaraf tiruan penuh.',
    ],
    reflectionQuestions: [
      'Mengapa GPU jauh lebih efisien untuk operasi tensor dibanding CPU biasa?',
      'Kapan kita harus menggunakan konteks torch.no_grad() selama alur kerja PyTorch?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 41 untuk merakit arsitektur Multi-Layer Perceptron menggunakan torch.nn.Module.',
  },
  {
    id: 'day-041',
    day: 41,
    phaseId: 4,
    title: 'Build a Neural Network',
    shortDescription: 'Merakit Multi-Layer Perceptron (MLP) dengan torch.nn.Module: Linear layers, parameter registrasi, dan forward method.',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami anatomi kelas torch.nn.Module standar industri.',
      'Menyusun lapisan terhubung penuh (Fully Connected / nn.Linear).',
      'Mengimplementasikan alur maju (forward pass) data dari input hingga logits.',
      'Memeriksa dimensi tensor input, bobot tersembunyi, dan output shape secara teliti.',
    ],
    theoryContent: `### Anatomi Arsitektur Neural Network di PyTorch
Dalam PyTorch, semua model jaringan syaraf tiruan adalah turunan dari \`torch.nn.Module\`:
1. \`__init__()\`: Tempat mendefinisikan lapisan-lapisan (*layers*) yang memiliki bobot yang dapat dilatih (seperti \`nn.Linear\`).
2. \`forward(x)\`: Tempat mendefinisikan komputasi alur maju data melewati lapisan tersebut.

Konsep Logits:
Output mentah dari lapisan linier terakhir sebelum diterapkan fungsi softmax/sigmoid disebut **Logits**.
*Aturan Penting*: Jangan terapkan softmax di dalam forward pass jika Anda menggunakan \`nn.CrossEntropyLoss\`, karena PyTorch menggabungkan LogSoftmax dan NLLLoss secara numerik stabil!`,
    practicalWalkthrough: {
      summary: 'Buat kelas MLP 3-lapisan untuk klasifikasi multi-kelas dan lakukan forward pass uji dimensi tensor.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Custom PyTorch MLP Architecture',
          language: 'python',
          code: `import torch
import torch.nn as nn

class MultilayerPerceptron(nn.Module):
    def __init__(self, in_features, hidden_dim, num_classes):
        super().__init__()
        # Lapisan tersembunyi 1
        self.fc1 = nn.Linear(in_features, hidden_dim)
        self.relu1 = nn.ReLU()
        # Lapisan tersembunyi 2
        self.fc2 = nn.Linear(hidden_dim, hidden_dim // 2)
        self.relu2 = nn.ReLU()
        # Lapisan output (mengeluarkan Logits mentah)
        self.out = nn.Linear(hidden_dim // 2, num_classes)
        
    def forward(self, x):
        x = self.relu1(self.fc1(x))
        x = self.relu2(self.fc2(x))
        logits = self.out(x)
        return logits

# Inisialisasi model
model = MultilayerPerceptron(in_features=8, hidden_dim=32, num_classes=3)
print(model)

# Uji forward pass dengan dummy input batch size 4
dummy_input = torch.randn(4, 8)
dummy_output = model(dummy_input)
print("Output logits shape (harus [4, 3]):", dummy_output.shape)`,
          explanation: 'Membangun arsitektur jaringan modular yang dapat menerima batch tensor dan menghasilkan output logits.',
        },
      ],
    },
    stepByStepInstructions: [
      'Subclass nn.Module dan definisikan minimal 2 lapisan tersembunyi dengan fungsi aktivasi ReLU.',
      'Pastikan dimensi keluaran lapisan sebelumnya sama persis dengan dimensi masukan lapisan berikutnya.',
      'Hitung total parameter yang dapat dilatih menggunakan sum(p.numel() for p in model.parameters() if p.requires_grad).',
      'Uji model dengan batch input dummy untuk memastikan tidak ada kesalahan dimensi (RuntimeError Shape Mismatch).',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch nn Module', type: 'tool', description: 'nn.Linear, nn.Sequential, nn.ReLU' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Arsitektur MLP', description: 'Bangun jaringan MLP yang mampu menerima input 10 fitur dan menghasilkan 2 kelas output.' },
      { title: 'nn.Sequential Alternative', description: 'Tulis arsitektur yang sama persis menggunakan nn.Sequential dan bandingkan kemudahan pembacaan kodenya.', isStretch: true },
    ],
    deliverables: [
      'Kode kelas PyTorch nn.Module lengkap.',
      'Output printout arsitektur model dan jumlah total parameter terhitung.',
    ],
    checklist: [
      { id: 'c1', label: 'Kelas model mewarisi nn.Module dan memanggil super().__init__()', isRequired: true },
      { id: 'c2', label: 'Metode forward() didefinisikan dengan alur data yang valid', isRequired: true },
      { id: 'c3', label: 'Forward pass dummy batch berjalan tanpa shape mismatch error', isRequired: true },
    ],
    definitionOfDone: [
      'Model jaringan syaraf tiruan berhasil dirakit dan siap menerima data pelatihan.',
    ],
    reflectionQuestions: [
      'Apa yang terjadi jika kita tidak menyertakan fungsi aktivasi non-linier di antara lapisan-lapisan linear?',
      'Bagaimana cara menghitung total bobot dan bias pada lapisan nn.Linear(8, 32)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 42 untuk merakit loop pelatihan interaktif di Training Loop Lab.',
  },
  {
    id: 'day-042',
    day: 42,
    phaseId: 4,
    title: 'Training Loop Lab',
    shortDescription: 'Membuat alur pelatihan 5 langkah PyTorch dari nol: zero_grad, forward, loss, backward, step, serta DataLoader batching.',
    difficulty: 'Intermediate',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Memahami 5 langkah sakral training loop PyTorch yang wajib dihafal.',
      'Menggunakan TensorDataset dan DataLoader untuk batching dan shuffling otomatis.',
      'Membedakan mode evaluasi vs training: model.train() vs model.eval().',
      'Menghitung dan mencatat metrik loss training dan loss validasi per epoch.',
    ],
    theoryContent: `### Lima Langkah Sakral Pelatihan PyTorch
Di Scikit-Learn Anda cukup memanggil \`model.fit()\`. Di PyTorch, Anda memegang kendali penuh atas setiap detik pelatihan melalui 5 langkah berikut di dalam loop setiap batch:
1. \`optimizer.zero_grad()\`: Kosongkan gradien lama (gradien di PyTorch bersifat akumulatif secara default).
2. \`outputs = model(inputs)\`: Jalankan forward pass untuk mendapatkan prediksi.
3. \`loss = criterion(outputs, targets)\`: Hitung seberapa salah tebakan model.
4. \`loss.backward()\`: Lakukan backpropagation untuk menghitung gradien seluruh parameter.
5. \`optimizer.step()\`: Perbarui nilai bobot model berdasarkan gradien yang terhitung.

Lupa \`zero_grad()\` adalah bug pemula paling umum yang membuat gradien menumpuk tak terhingga!`,
    practicalWalkthrough: {
      summary: 'Tulis fungsi latih lengkap dengan DataLoader, lakukan training 20 epoch, dan plot kurva penurunan loss.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Complete PyTorch Training Loop',
          language: 'python',
          code: `import torch
from torch.utils.data import TensorDataset, DataLoader
import matplotlib.pyplot as plt

# Buat dataset sintetis
X = torch.randn(600, 10)
y = (X.sum(dim=1) > 0).long()
train_loader = DataLoader(TensorDataset(X, y), batch_size=32, shuffle=True)

model = nn.Sequential(nn.Linear(10, 16), nn.ReLU(), nn.Linear(16, 2))
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

history_loss = []
epochs = 20

model.train() # Aktifkan mode pelatihan
for epoch in range(epochs):
    running_loss = 0.0
    for batch_x, batch_y in train_loader:
        # 5 LANGKAH SAKRAL
        optimizer.zero_grad()
        outputs = model(batch_x)
        loss = criterion(outputs, batch_y)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * batch_x.size(0)
        
    epoch_loss = running_loss / len(train_loader.dataset)
    history_loss.append(epoch_loss)
    if (epoch + 1) % 5 == 0:
        print(f"Epoch [{epoch+1:02d}/{epochs}] | Loss: {epoch_loss:.4f}")`,
          explanation: 'Loop pelatihan murni PyTorch dengan pencatatan loss per epoch secara presisi.',
        },
      ],
    },
    stepByStepInstructions: [
      'Bungkus tensor data dan label ke dalam TensorDataset.',
      'Buat DataLoader dengan batch_size=32 dan shuffle=True.',
      'Definisikan optimizer (Adam atau SGD) dan loss function.',
      'Tulis loop epoch berisi loop batch dengan 5 langkah pelatihan di atas.',
      'Plot grafik penurunan loss terhadap epoch.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch DataLoader', type: 'tool', description: 'torch.utils.data.DataLoader' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Training Loop', description: 'Tulis training loop lengkap dan buktikan loss menurun secara konsisten dari epoch 1 ke epoch 20.' },
      { title: 'Tantangan Validation Phase', description: 'Tambahkan fase evaluasi validasi di dalam loop menggunakan torch.no_grad() dan model.eval().', isStretch: true },
    ],
    deliverables: [
      'Kode Python fungsi training loop.',
      'Grafik penurunan kurva loss per epoch.',
    ],
    checklist: [
      { id: 'c1', label: 'optimizer.zero_grad() dipanggil di awal setiap batch', isRequired: true },
      { id: 'c2', label: 'Data disalurkan menggunakan DataLoader ber-batch', isRequired: true },
      { id: 'c3', label: 'Loss berhasil menurun secara terukur lintas epoch', isRequired: true },
    ],
    definitionOfDone: [
      'Mampu menulis dan menjalankan loop pelatihan deep learning mandiri tanpa boilerplate tersembunyi.',
    ],
    reflectionQuestions: [
      'Apa akibat fatal yang terjadi jika optimizer.zero_grad() lupa dipanggil di dalam loop?',
      'Mengapa shuffle=True penting untuk DataLoader data latih tetapi harus False untuk data uji?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 43 untuk membedah berbagai fungsi objektif di Loss Function Experiment.',
  },
  {
    id: 'day-043',
    day: 43,
    phaseId: 4,
    title: 'Loss Function Experiment',
    shortDescription: 'Memilih fungsi tujuan yang tepat: MSELoss vs L1Loss (regresi), CrossEntropyLoss vs BCEWithLogitsLoss (klasifikasi).',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami peran matematis fungsi loss dalam mengarahkan penurunan gradien.',
      'Membedakan MSELoss (sensitif outlier kuadratik) vs L1Loss/HuberLoss (tahan outlier) untuk regresi.',
      'Memahami CrossEntropyLoss (multi-kelas) vs BCEWithLogitsLoss (biner / multi-label).',
      'Mengetahui mengapa BCEWithLogitsLoss lebih stabil secara numerik dibanding Sigmoid + BCELoss terpisah (Log-Sum-Exp trick).',
    ],
    theoryContent: `### Fungsi Loss: Kompas Penunjuk Arah Gradien
Fungsi loss adalah ukuran numerik seberapa buruk tebakan model. Tanpa loss yang tepat, model akan mengoptimasi tujuan yang salah.

Pedoman Pemilihan:
1. **Regresi**:
   - \`nn.MSELoss()\`: $L = (y - \\hat{y})^2$. Menghukum error besar dengan sangat keras.
   - \`nn.L1Loss()\`: $L = |y - \\hat{y}|$. Menghasilkan estimasi median yang kebal outlier.
   - \`nn.HuberLoss()\`: Kombinasi halus: kuadratik pada error kecil, linier pada error besar.
2. **Klasifikasi**:
   - \`nn.CrossEntropyLoss()\`: Untuk 1 pilihan dari $C$ kelas (eksklusif). Menerima logits!
   - \`nn.BCEWithLogitsLoss()\`: Untuk klasifikasi biner atau multi-label (satu gambar bisa berisi kucing DAN anjing).`,
    practicalWalkthrough: {
      summary: 'Uji respons MSELoss vs L1Loss terhadap data yang disusupi outlier besar, dan amati kestabilan bobot model.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Loss Behavior under Outliers',
          language: 'python',
          code: `import torch
import torch.nn as nn

y_true = torch.tensor([10.0, 12.0, 11.0, 500.0]) # 500 adalah data anomali ekstrim
y_pred = torch.tensor([10.5, 11.8, 11.2, 12.0], requires_grad=True)

mse_fn = nn.MSELoss()
l1_fn = nn.L1Loss()
huber_fn = nn.HuberLoss(delta=1.0)

print(f"MSE Loss   : {mse_fn(y_pred, y_true).item():.2f}")
print(f"L1 Loss    : {l1_fn(y_pred, y_true).item():.2f}")
print(f"Huber Loss : {huber_fn(y_pred, y_true).item():.2f}")`,
          explanation: 'Memperlihatkan MSE meledak hingga puluhan ribu akibat satu outlier, sementara L1 dan Huber tetap terkendali.',
        },
      ],
    },
    stepByStepInstructions: [
      'Bandingkan nilai loss untuk 3 skenario prediksi: prediksi sempurna, error merata, dan 1 error outlier raksasa.',
      'Latih model regresi sederhana dengan MSELoss vs HuberLoss pada data yang memiliki noise tebal.',
      'Gunakan BCEWithLogitsLoss pada masalah klasifikasi biner dan verifikasi output logits.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Loss Functions', type: 'tool', description: 'nn.CrossEntropyLoss, nn.BCEWithLogitsLoss, nn.HuberLoss' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Eksperimen Loss', description: 'Buktikan bahwa model yang dilatih dengan HuberLoss menghasilkan deviasi garis regresi yang lebih stabil saat ada data pencilan.' },
      { title: 'Tantangan Multi-label Classification', description: 'Implementasikan klasifikasi multi-label 4 tag menggunakan BCEWithLogitsLoss.', isStretch: true },
    ],
    deliverables: [
      'Tabel perbandingan nilai loss MSE vs L1 vs Huber pada data bersampel outlier.',
      'Kode demonstrasi BCEWithLogitsLoss yang berjalan mulus.',
    ],
    checklist: [
      { id: 'c1', label: 'Karakteristik MSE vs L1 vs Huber diuji secara kuantitatif', isRequired: true },
      { id: 'c2', label: 'Logits mentah diteruskan ke CrossEntropyLoss tanpa fungsi softmax tambahan', isRequired: true },
      { id: 'c3', label: 'Fungsi loss yang tepat dipilih sesuai jenis masalah bisnis', isRequired: true },
    ],
    definitionOfDone: [
      'Mampu memilih dan mengonfigurasi loss function yang tepat secara matematis dan numerik.',
    ],
    reflectionQuestions: [
      'Mengapa menyertakan nn.Softmax() sebelum nn.CrossEntropyLoss() adalah kesalahan ganda di PyTorch?',
      'Kapan HuberLoss lebih disukai dibanding MSELoss murni?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 44 untuk mengadu performa berbagai optimizer di Optimizer Challenge.',
  },
  {
    id: 'day-044',
    day: 44,
    phaseId: 4,
    title: 'Optimizer Challenge',
    shortDescription: 'Membedah algoritma optimasi: SGD murni, SGD dengan Momentum, RMSprop, dan keunggulan default Adam / AdamW.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami cara Stochastic Gradient Descent (SGD) memperbarui bobot model.',
      'Memahami konsep Momentum untuk menembus lembah datar (*ravines*) dan keluar dari saddle points.',
      'Memahami adaptive learning rate pada RMSprop dan Adam (Adaptive Moment Estimation).',
      'Mengapa AdamW (Decoupled Weight Decay) adalah standar industri modern untuk arsitektur deep network dan transformer.',
    ],
    theoryContent: `### Bagaimana Optimizer Menemukan Titik Terendah Lembah?
Gradient Descent adalah pendaki gunung yang turun di tengah kabut tebal hanya dengan meraba kemiringan tanah di bawah kakinya:
1. **Vanilla SGD**: Sering terjebak atau berosilasi liar di lembah curam.
2. **SGD + Momentum**: Seperti bola bowling yang menggelinding turun. Memiliki inersia kecepatan masa lalu sehingga mampu melewati gundukan kecil.
3. **Adam**: Menggabungkan Momentum (momen pertama / rata-rata gerak gradien) dan RMSprop (momen kedua / skala magnitudo gradien kuadrat). Memberikan kecepatan belajar adaptif unik untuk setiap parameter!
4. **AdamW**: Memperbaiki implementasi L2 weight decay pada Adam yang sebelumnya keliru secara matematis.`,
    practicalWalkthrough: {
      summary: 'Latih model yang sama pada 3 optimizer berbeda (SGD, SGD+Momentum, AdamW) dan bandingkan kecepatan konvergensinya.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Optimizer Race Comparison',
          language: 'python',
          code: `import torch
import torch.optim as optim

# Perbandingan 3 konfigurasi optimizer
opt_sgd = optim.SGD(model.parameters(), lr=0.01)
opt_momentum = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
opt_adamw = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)

print("Optimizer siap diadu kecepatannya!")`,
          explanation: 'AdamW biasanya konvergen jauh lebih cepat dan stabil dibanding SGD polos tanpa momentum.',
        },
      ],
    },
    stepByStepInstructions: [
      'Siapkan model non-linear dan dataset latihan dengan seed yang sama.',
      'Latih model selama 25 epoch secara terpisah menggunakan: (1) SGD polos, (2) SGD dengan momentum=0.9, dan (3) AdamW.',
      'Catat kurva loss per epoch untuk masing-masing optimizer.',
      'Plot grafik komparasi konvergensi pada satu bidang gambar.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Optim', type: 'tool', description: 'torch.optim.SGD, Adam, AdamW, RMSprop' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Optimizer', description: 'Tunjukkan secara grafis bahwa AdamW mencapai ambang batas loss tertentu dalam epoch lebih sedikit dibanding SGD biasa.' },
      { title: 'Tantangan Learning Rate Warmup', description: 'Implementasikan torch.optim.lr_scheduler.CosineAnnealingLR untuk menurunkan learning rate secara bertahap.', isStretch: true },
    ],
    deliverables: [
      'Grafik perbandingan konvergensi loss: SGD vs Momentum vs AdamW.',
      'Catatan waktu dan jumlah epoch yang dibutuhkan untuk mencapai konvergensi.',
    ],
    checklist: [
      { id: 'c1', label: 'Ketiga optimizer diuji pada inisialisasi bobot awal yang identik', isRequired: true },
      { id: 'c2', label: 'Kurva perbandingan konvergensi diplot berdampingan', isRequired: true },
      { id: 'c3', label: 'Peran momentum dan adaptasi laju belajar dipahami', isRequired: true },
    ],
    definitionOfDone: [
      'Memahami mekanisme kerja dan alasan pemilihan AdamW sebagai optimizer default proyek deep learning.',
    ],
    reflectionQuestions: [
      'Mengapa AdamW lebih disukai daripada Adam standar pada arsitektur modern?',
      'Kapan SGD dengan momentum terkadang menghasilkan akurasi uji akhir yang sedikit lebih tinggi dibanding Adam?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 45 untuk mempelajari fungsi aktivasi non-linier di Activation Function Lab.',
  },
  {
    id: 'day-045',
    day: 45,
    phaseId: 4,
    title: 'Activation Function Lab',
    shortDescription: 'Membedah non-linearitas: Masalah Vanishing Gradient Sigmoid/Tanh, evolusi ReLU, LeakyReLU, GELU, dan SiLU.',
    difficulty: 'Intermediate',
    estimatedDuration: '70 Menit',
    learningObjectives: [
      'Memahami mengapa aktivasi non-linier mutlak diperlukan (teorema Universal Approximation).',
      'Mendiagnosis masalah Vanishing Gradient pada Sigmoid dan Tanh di jaringan dalam.',
      'Memahami fenomena "Dying ReLU" saat gradien menjadi nol permanen.',
      'Mengenal fungsi aktivasi modern yang digunakan di Transformer dan LLM (GELU dan SiLU/Swish).',
    ],
    theoryContent: `### Memecahkan Kutukan Vanishing Gradient
Jika seluruh aktivasi di jaringan adalah linier ($f(x) = ax$), maka 100 lapisan neural network dapat disederhanakan menjadi 1 persamaan linier tunggal! Kita butuh non-linearitas.

Evolusi Aktivasi:
1. **Sigmoid / Tanh**: Nilai turunan mengecil di ekor ($< 0.25$). Pada jaringan 10 lapisan, gradien di lapisan awal lenyap menjadi nol ($0.25^{10} \\approx 10^{-6}$).
2. **ReLU** ($f(x) = \\max(0, x)$): Menyelamatkan deep learning! Turunannya selalu 1 untuk $x > 0$. Bebas vanishing gradient.
   *Masalah*: **Dying ReLU** (jika neuron terdorong ke nilai negatif, gradiennya 0 selamanya).
3. **GELU (Gaussian Error Linear Unit)**: Standar BERT, GPT, dan Vision Transformer. Menghaluskan transisi di sekitar nol berbasis probabilitas Gaussian.`,
    practicalWalkthrough: {
      summary: 'Plot kurva fungsi dan nilai turunan gradien dari Sigmoid, ReLU, LeakyReLU, dan GELU.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Activation Functions & Derivatives Visualizer',
          language: 'python',
          code: `import torch
import torch.nn as nn
import matplotlib.pyplot as plt

x = torch.linspace(-5, 5, 200, requires_grad=True)

activations = {
    'Sigmoid': torch.sigmoid,
    'Tanh': torch.tanh,
    'ReLU': torch.relu,
    'GELU': nn.GELU()
}

fig, axes = plt.subplots(1, len(activations), figsize=(14, 3.5))
for ax, (name, fn) in zip(axes, activations.items()):
    y = fn(x)
    # Hitung gradien turunan
    y.backward(torch.ones_like(x), retain_graph=True)
    grad = x.grad.clone()
    x.grad.zero_()
    
    ax.plot(x.detach(), y.detach(), label='f(x)', color='blue')
    ax.plot(x.detach(), grad, label="f'(x)", color='red', linestyle='--')
    ax.set_title(name)
    ax.grid(True)
    ax.legend()
plt.tight_layout()
plt.show()`,
          explanation: 'Memperlihatkan dengan jelas turunan Sigmoid yang mengecil di ujung vs ReLU/GELU yang tetap aktif.',
        },
      ],
    },
    stepByStepInstructions: [
      'Jalankan script visualisasi perbandingan fungsi aktivasi.',
      'Amati nilai maksimum turunan f\'(x) untuk Sigmoid (puncak hanya 0.25).',
      'Latih model 8-lapisan menggunakan Sigmoid vs model 8-lapisan menggunakan ReLU/GELU.',
      'Buktikan bahwa model Sigmoid gagal belajar (loss macet) akibat vanishing gradient.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Non-linear Activations', type: 'tool', description: 'nn.ReLU, nn.GELU, nn.SiLU' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Aktivasi', description: 'Buktikan secara empiris bahwa jaringan syaraf tiruan 8-lapisan gagal konvergen dengan aktivasi Sigmoid tetapi berhasil mulus dengan GELU.' },
      { title: 'Tantangan Dying ReLU Audit', description: 'Hitung persentase neuron yang mati (output selalu 0) pada lapisan tersembunyi model setelah beberapa epoch.', isStretch: true },
    ],
    deliverables: [
      'Grafik fungsi dan gradien turunan untuk 4 jenis aktivasi.',
      'Catatan hasil perbandingan training deep network dengan Sigmoid vs GELU.',
    ],
    checklist: [
      { id: 'c1', label: 'Kurva aktivasi dan turunannya berhasil diplot dan dianalisis', isRequired: true },
      { id: 'c2', label: 'Masalah vanishing gradient dibuktikan pada jaringan bertingkat dalam', isRequired: true },
      { id: 'c3', label: 'Fungsi aktivasi modern (GELU) diimplementasikan', isRequired: true },
    ],
    definitionOfDone: [
      'Memahami kapan harus memilih ReLU, LeakyReLU, atau GELU untuk arsitektur deep network.',
    ],
    reflectionQuestions: [
      'Mengapa fungsi aktivasi non-linier menjadi kunci kemampuan neural network memodelkan hubungan matematis kompleks apa pun?',
      'Bagaimana GELU menyelesaikan masalah Dying ReLU yang dimiliki ReLU standar?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 46 untuk sengaja membuat jaringan overfit sebagai teknik kalibrasi kapasitas di Overfitting Deep Networks.',
  },
  {
    id: 'day-046',
    day: 46,
    phaseId: 4,
    title: 'Overfitting Deep Networks',
    shortDescription: 'Teknik Sanity Check Andrej Karpathy: Sengaja membuat model overfit pada satu batch kecil (overfit a single batch).',
    difficulty: 'Intermediate',
    estimatedDuration: '70 Menit',
    learningObjectives: [
      'Menerapkan aturan emas Andrej Karpathy: Sebelum melatih di dataset besar, pastikan model bisa overfit 1 batch kecil hingga loss 0.0.',
      'Memvalidasi bahwa graf komputasi, fungsi loss, dan backward pass bebas dari bug logika.',
      'Mengukur kapasitas hafalan jaringan syaraf tiruan (memorization capability).',
      'Mendeteksi silent bugs dalam arsitektur sebelum membuang jam komputasi GPU yang mahal.',
    ],
    theoryContent: `### Aturan Emas Deep Learning: Overfit a Single Batch!
Banyak engineer menghabiskan 10 jam melatih model di GPU, hanya untuk menyadari di akhir bahwa akurasinya tidak bergerak karena bug sepele (misal lupa memanggil \`backward()\` atau shape label salah).

Resep Karpathy:
1. Ambil HANYA 1 batch data kecil (misal 16 sampel).
2. Latih model secara berulang pada 16 sampel tersebut selama 100-200 iterasi.
3. **Hasil yang Wajib Terjadi**: Loss HARUS turun mendekati 0.0000 dan akurasi harus 100%!
Jika model neural network berkapasitas tinggi tidak mampu menghafal 16 sampel kecil, berarti ada **bug fatal** di kode Anda (arsitektur, loss, optimizer, atau data pipeline).`,
    practicalWalkthrough: {
      summary: 'Ekstrak satu batch 16 sampel, latih model hingga loss < 0.01 dan akurasi 100% sebagai verifikasi kelayakan model.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Single Batch Overfitting Sanity Check',
          language: 'python',
          code: `import torch
import torch.nn as nn

# Ambil HANYA 1 batch kecil (16 sampel)
single_x, single_y = next(iter(train_loader))
single_x, single_y = single_x[:16], single_y[:16]

model = nn.Sequential(nn.Linear(10, 64), nn.ReLU(), nn.Linear(64, 2))
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

print("🧪 Menjalankan Karpathy Sanity Check...")
for step in range(150):
    optimizer.zero_grad()
    outputs = model(single_x)
    loss = criterion(outputs, single_y)
    loss.backward()
    optimizer.step()
    
    if (step + 1) % 30 == 0:
        preds = outputs.argmax(dim=1)
        acc = (preds == single_y).float().mean()
        print(f"Step {step+1:03d} | Loss: {loss.item():.6f} | Akurasi: {acc*100:.1f}%")

assert loss.item() < 0.05, "Peringatan: Model gagal menghafal batch kecil! Periksa bug!"
print("✅ SANITY CHECK LULUS: Pipeline bebas bug logika!")`,
          explanation: 'Memastikan model memiliki kapasitas representasi yang cukup dan backward pass bekerja sempurna.',
        },
      ],
    },
    stepByStepInstructions: [
      'Ambil satu batch pertama dari DataLoader.',
      'Nonaktifkan shuffling dan isolasi batch tersebut.',
      'Jalankan loop pelatihan intensif 100-200 iterasi pada batch tunggal itu saja.',
      'Verifikasi bahwa loss berhasil menyentuh angka mendekati nol dan akurasi mencapai 100%.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Core', type: 'tool', description: 'Pemeriksaan integritas alur training' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Sanity Check', description: 'Terapkan teknik overfit single batch pada arsitektur Anda dan buktikan loss turun di bawah 0.05.' },
      { title: 'Simulasi Silent Bug', description: 'Komentari baris optimizer.zero_grad() dan tunjukkan bagaimana sanity check langsung mendeteksi kegagalan konvergensi.', isStretch: true },
    ],
    deliverables: [
      'Log hasil sanity check yang menunjukkan akurasi mencapai 100% pada batch tunggal.',
      'Refleksi mengenai pentingnya checklist pengujian model sebelum training skala besar.',
    ],
    checklist: [
      { id: 'c1', label: 'Batch tunggal diisolasi tanpa kebocoran data lain', isRequired: true },
      { id: 'c2', label: 'Loss terbukti turun mendekati nol (loss < 0.05)', isRequired: true },
      { id: 'c3', label: 'Akurasi pada batch kecil menyentuh 100%', isRequired: true },
    ],
    definitionOfDone: [
      'Arsitektur dan kode pelatihan terverifikasi 100% bebas dari bug struktural sebelum melangkah ke regularisasi.',
    ],
    reflectionQuestions: [
      'Mengapa model neural network yang gagal menghafal 16 sampel data latih tidak akan pernah bisa bekerja di dataset penuh?',
      'Apa saja contoh silent bugs yang tidak memunculkan pesan error tetapi merusak proses belajar model?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 47 untuk menjinakkan kapasitas hafalan model melalui Regularization Lab (Dropout & Weight Decay).',
  },
  {
    id: 'day-047',
    day: 47,
    phaseId: 4,
    title: 'Regularization Lab',
    shortDescription: 'Menjinakkan deep network: Dropout layers, L2 weight decay, dan Batch Normalization (BatchNorm1d).',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami mekanisme Dropout: mematikan neuron secara acak saat training untuk mencegah co-adaptation.',
      'Memahami perbedaan perilaku Dropout pada saat model.train() vs model.eval() (scaling bobot).',
      'Menerapkan Weight Decay (penalti L2 bobot) di optimizer AdamW.',
      'Memahami prinsip Batch Normalization (BatchNorm1d) untuk menstabilkan internal covariate shift.',
    ],
    theoryContent: `### Memaksa Jaringan Menjadi Tangguh (Regularisasi)
Neural network modern memiliki jutaan parameter sehingga sangat mudah menghafal data (*memorization*). Kita harus mempersulit proses belajarnya agar ia terpaksa mencari pola umum:
1. **Dropout**: Pada setiap langkah pelatihan, matikan $p$ persen neuron secara acak (misal \`p=0.3\`). Neuron tidak boleh bergantung pada tetangganya (*co-adaptation*) dan harus belajar fitur yang mandiri.
2. **Weight Decay**: Menambahkan $\\frac{1}{2} \\lambda ||W||^2$ pada loss untuk mencegah nilai bobot membengkak ekstrem.
3. **Batch Normalization**: Menormalisasi output lapisan per mini-batch (mean=0, var=1). Mempercepat konvergensi dan bertindak sebagai regularizer ringan.`,
    practicalWalkthrough: {
      summary: 'Sisipkan Dropout(p=0.3) dan BatchNorm1d ke dalam MLP dan amati perbaikan generalisasi pada data validasi.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Regularized Neural Network with Dropout & BatchNorm',
          language: 'python',
          code: `import torch.nn as nn

class RegularizedMLP(nn.Module):
    def __init__(self, in_features, num_classes):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(in_features, 64),
            nn.BatchNorm1d(64), # Menstabilkan distribusi aktivasi
            nn.ReLU(),
            nn.Dropout(p=0.3),  # Matikan 30% neuron acak saat training
            
            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            
            nn.Linear(32, num_classes)
        )
        
    def forward(self, x):
        return self.network(x)

# Model siap dilatih dengan weight_decay di optimizer
model_reg = RegularizedMLP(in_features=10, num_classes=2)
optimizer = torch.optim.AdamW(model_reg.parameters(), lr=0.005, weight_decay=1e-3)`,
          explanation: 'Kombinasi BatchNorm dan Dropout menghasilkan model yang stabil dan tahan terhadap overfit.',
        },
      ],
    },
    stepByStepInstructions: [
      'Bangun model tanpa regularisasi dan catat gap skor train vs validation (overfitting).',
      'Tambahkan nn.BatchNorm1d setelah lapisan linier dan sebelum fungsi aktivasi ReLU.',
      'Tambahkan nn.Dropout(0.3) setelah fungsi aktivasi.',
      'Pasang parameter weight_decay=1e-3 pada optimizer.',
      'Buktikan bahwa skor validasi meningkat dan gap overfitting menyempit.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Layers', type: 'tool', description: 'nn.Dropout, nn.BatchNorm1d' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Regularisasi', description: 'Tunjukkan secara grafis bahwa penambahan Dropout dan Weight Decay menurunkan generalization gap pada kurva validasi.' },
      { title: 'Tantangan Audit Eval Mode', description: 'Cetak output model pada input yang sama dua kali dalam mode model.train() (output berbeda karena dropout acak) vs model.eval() (output identik deterministik).', isStretch: true },
    ],
    deliverables: [
      'Grafik perbandingan Learning Curve: Tanpa Regularisasi vs Dengan Dropout + BatchNorm.',
      'Catatan hasil pengujian perbedaan mode train() vs eval().',
    ],
    checklist: [
      { id: 'c1', label: 'Dropout dan BatchNorm1d disisipkan pada posisi arsitektur yang benar', isRequired: true },
      { id: 'c2', label: 'Weight decay dikonfigurasi di optimizer', isRequired: true },
      { id: 'c3', label: 'model.eval() selalu dipanggil saat pengujian data validasi', isRequired: true },
    ],
    definitionOfDone: [
      'Model ter-regularisasi dengan baik dan menunjukkan kemampuan generalisasi yang lebih unggul.',
    ],
    reflectionQuestions: [
      'Mengapa memanggil model.eval() sebelum evaluasi data validasi/uji mutlak wajib jika model memiliki lapisan Dropout atau BatchNorm?',
      'Bagaimana Dropout secara matematis mirip dengan melatih ribuan sub-jaringan ensemble secara bersamaan?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 48 untuk mengotomatisasi penghentian pelatihan melalui Early Stopping kustom.',
  },
  {
    id: 'day-048',
    day: 48,
    phaseId: 4,
    title: 'Early Stopping',
    shortDescription: 'Membuat mekanisme Early Stopping kustom: Monitoring validation loss, patience counter, delta threshold, dan penyimpanan bobot terbaik.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami konsep Early Stopping: menghentikan training tepat saat validation loss mulai berbalik naik.',
      'Membangun kelas utilitas EarlyStopping Python mandiri yang dapat digunakan kembali di proyek apa pun.',
      'Mengatur parameter patience (toleransi jumlah epoch tanpa perbaikan) dan min_delta.',
      'Menyimpan checkpoint model dengan torch.save(model.state_dict(), "best_model.pt") dan memuatnya kembali.',
    ],
    theoryContent: `### Berhenti Sebelum Terlambat: Early Stopping
Melatih model selama 200 epoch secara membabi buta adalah pemborosan waktu. Pada epoch ke-45, model mungkin mencapai performa puncak di data validasi, lalu dari epoch 46 ke atas model mulai overfit menghafal noise data latih.

Mekanisme EarlyStopping:
- Monitor \`val_loss\`.
- Jika \`val_loss\` mencapai rekor terendah baru: simpan bobot model (\`state_dict\`) ke disk dan reset counter \`patience = 0\`.
- Jika dalam $N$ epoch berturut-turut (\`patience\`) tidak ada rekor baru yang melampaui \`min_delta\`: hentikan loop (\`break\`) dan muat kembali bobot terbaik yang tersimpan!`,
    practicalWalkthrough: {
      summary: 'Tulis kelas EarlyStopping mandiri dan integrasikan ke dalam loop training 50 epoch.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Custom PyTorch EarlyStopping Class',
          language: 'python',
          code: `import torch

class EarlyStopping:
    def __init__(self, patience=5, min_delta=1e-4, filepath='best_checkpoint.pt'):
        self.patience = patience
        self.min_delta = min_delta
        self.filepath = filepath
        self.counter = 0
        self.best_loss = float('inf')
        self.early_stop = False
        
    def __call__(self, val_loss, model):
        if val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.counter = 0
            torch.save(model.state_dict(), self.filepath)
            print(f"⭐ Rekor baru val_loss: {val_loss:.4f}! Checkpoint disimpan.")
        else:
            self.counter += 1
            print(f"⏳ Patience counter: {self.counter}/{self.patience}")
            if self.counter >= self.patience:
                self.early_stop = True
                print("🛑 Early Stopping dipicu! Menghentikan pelatihan.")`,
          explanation: 'Kelas modular yang otomatis mengunci model terbaik sebelum performa validasi rusak.',
        },
      ],
    },
    stepByStepInstructions: [
      'Tulis kelas EarlyStopping dengan parameter patience=5.',
      'Integrasikan pemanggilan objek early_stopping(val_loss, model) di akhir setiap epoch.',
      'Hentikan loop ketika early_stopping.early_stop bernilai True.',
      'Muat kembali bobot terbaik menggunakan model.load_state_dict(torch.load("best_checkpoint.pt")).',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Checkpointing', type: 'tool', description: 'torch.save, torch.load, model.state_dict' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Early Stopping', description: 'Integrasikan EarlyStopping ke loop pelatihan dan buktikan training berhenti otomatis saat val_loss stagnan.' },
      { title: 'Tantangan Resume Training', description: 'Simpan kamus checkpoint lengkap berisi state_dict model, optimizer, dan nomor epoch terakhir, lalu lakukan resume training.', isStretch: true },
    ],
    deliverables: [
      'Kode kelas EarlyStopping teruji.',
      'File artefak model terbaik "best_checkpoint.pt".',
    ],
    checklist: [
      { id: 'c1', label: 'Validation loss dipantau di setiap akhir epoch', isRequired: true },
      { id: 'c2', label: 'Bobot model terbaik disimpan hanya saat rekor baru tercapai', isRequired: true },
      { id: 'c3', label: 'Proses training berhenti otomatis saat batas patience terpenuhi', isRequired: true },
    ],
    definitionOfDone: [
      'Sistem pelatihan mandiri mampu menyelamatkan model terbaik tanpa campur tangan manual.',
    ],
    reflectionQuestions: [
      'Mengapa kita menyimpan model.state_dict() alih-alih menyimpan seluruh objek model secara langsung?',
      'Apa kompromi antara nilai patience yang terlalu kecil (misal 1) vs terlalu besar (misal 50)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 49 untuk mencatat riwayat eksperimen secara sistematis di Experiment Tracking.',
  },
  {
    id: 'day-049',
    day: 49,
    phaseId: 4,
    title: 'Experiment Tracking',
    shortDescription: 'Manajemen eksperimen ML: Pencatatan metrik, hyperparameter, dan kurva visualisasi menggunakan TensorBoard / MLflow lokal.',
    difficulty: 'Intermediate',
    estimatedDuration: '75 Menit',
    learningObjectives: [
      'Memahami bahaya mencatat eksperimen manual di spreadsheet: rawan lupa dan tidak dapat direproduksi.',
      'Menggunakan SummaryWriter dari torch.utils.tensorboard untuk mencatat skalar dan histogram bobot.',
      'Membandingkan run eksperimen dengan learning rate dan arsitektur berbeda di dashboard TensorBoard.',
      'Mencatat artefak model dan ringkasan metrik dalam format JSON terstruktur.',
    ],
    theoryContent: `### Mengapa Proyek AI Membutuhkan Experiment Tracking?
Ketika Anda melatih 20 variasi model dengan kombinasi learning rate, ukuran batch, dan dropout yang berbeda-beda, mengingat model mana yang menghasilkan skor 92.4% menjadi mimpi buruk jika hanya mengandalkan ingatan atau coretan terminal.

Alat Experiment Tracking:
- **TensorBoard / MLflow**: Otomatis mencatat kurva loss setiap langkah, distribusi aktivasi bobot (*histogram*), dan metrik evaluasi akhir.
- Memungkinkan Anda membandingkan grafik 5 model secara berdampingan (*overlay*) dalam satu tampilan interaktif untuk melihat model mana yang paling stabil.`,
    practicalWalkthrough: {
      summary: 'Gunakan TensorBoard SummaryWriter untuk mencatat train loss dan validation loss di setiap epoch, lalu buka dashboard visualisasinya.',
      environment: 'Jupyter Notebook / Google Colab (tensorboard)',
      codeSnippets: [
        {
          title: 'TensorBoard Tracking in PyTorch',
          language: 'python',
          code: `from torch.utils.tensorboard import SummaryWriter
import os

# Inisialisasi writer dengan folder log spesifik run
writer = SummaryWriter(log_dir='runs/experiment_mlp_lr001')

for epoch in range(20):
    # Simulasi metrik per epoch
    train_loss = 0.5 * (0.9 ** epoch)
    val_loss = 0.55 * (0.91 ** epoch)
    
    # Catat metrik skalar ke TensorBoard
    writer.add_scalar('Loss/Train', train_loss, epoch)
    writer.add_scalar('Loss/Validation', val_loss, epoch)

writer.close()
print("📁 Log eksperimen tersimpan di folder 'runs/'!")
# Untuk membuka dashboard di notebook:
# %load_ext tensorboard
# %tensorboard --logdir runs`,
          explanation: 'Mencatat riwayat metrik secara permanen untuk divisualisasikan dalam dasbor interaktif.',
        },
      ],
    },
    stepByStepInstructions: [
      'Inisialisasi SummaryWriter dengan nama direktori eksperimen yang jelas (misal runs/adam_lr0.001).',
      'Tambahkan pemanggilan writer.add_scalar() di dalam loop training Anda.',
      'Jalankan minimal 2 eksperimen dengan konfigurasi hyperparameter berbeda.',
      'Buka antarmuka TensorBoard di browser atau notebook untuk membandingkan kedua kurva secara langsung.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch TensorBoard', type: 'tool', description: 'torch.utils.tensorboard.SummaryWriter' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Tracking', description: 'Catat hasil minimal 2 variasi eksperimen ke TensorBoard dan bandingkan kurva konvergensinya.' },
      { title: 'Histogram Bobot', description: 'Gunakan writer.add_histogram() untuk mencatat distribusi gradien bobot lapisan pertama setiap 5 epoch.', isStretch: true },
    ],
    deliverables: [
      'Screenshot dashboard TensorBoard yang membandingkan kurva loss dua eksperimen berbeda.',
      'Folder log runs/ yang berisi rekaman eksperimen.',
    ],
    checklist: [
      { id: 'c1', label: 'SummaryWriter mencatat train loss dan validation loss', isRequired: true },
      { id: 'c2', label: 'Minimal 2 eksperimen terpisah berhasil direkam', isRequired: true },
      { id: 'c3', label: 'Dashboard TensorBoard berhasil diakses dan dianalisis', isRequired: true },
    ],
    definitionOfDone: [
      'Seluruh alur eksperimen terekam secara sistematis dan siap diaudit.',
    ],
    reflectionQuestions: [
      'Mengapa nama folder log eksperimen sebaiknya menyertakan timestamp atau nilai hyperparameter?',
      'Bagaimana histogram gradien di TensorBoard membantu mendeteksi vanishing atau exploding gradients?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 50 untuk memasuki dunia Computer Vision: Membangun Convolutional Neural Network (CNN) from Scratch!',
  },
  {
    id: 'day-050',
    day: 50,
    phaseId: 4,
    title: 'CNN from Scratch',
    shortDescription: 'Arsitektur Computer Vision: Konvolusi 2D (nn.Conv2d), Kernel/Filter, Stride, Padding, dan Max Pooling (nn.MaxPool2d).',
    difficulty: 'Intermediate',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Memahami mengapa Fully Connected (MLP) gagal pada data citra (parameter meledak dan kehilangan spatial hierarchy).',
      'Memahami operasi konvolusi 2D: perkalian elemen filter/kernel yang bergeser di atas piksel citra.',
      'Memahami konsep Stride (langkah pergeseran) dan Padding ("valid" vs "same").',
      'Menghitung rumus dimensi keluaran konvolusi dan memahami peran MaxPool2d dalam mereduksi resolusi spasial.',
    ],
    theoryContent: `### Mengapa Citra Membutuhkan Jaringan Konvolusi (CNN)?
Jika citra berukuran $256 \\times 256$ piksel dengan 3 kanal warna (RGB) dimasukkan ke MLP dengan 1000 neuron tersembunyi, satu lapisan pertama saja membutuhkan:
$$256 \\times 256 \\times 3 \\times 1000 \\approx 196.000.000 \\text{ parameter!}$$
Memori akan langsung jebol, dan MLP tidak memiliki **Spatial Invariance** (kucing di pojok kiri atas dianggap pola berbeda dengan kucing di pojok kanan bawah).

Dua Sifat Kunci CNN:
1. **Local Receptive Fields**: Filter konvolusi (misal $3 \\times 3$) hanya melihat area lokal kecil.
2. **Weight Sharing**: Satu filter yang sama digeser ke seluruh piksel citra untuk mendeteksi tepi, tekstur, atau sudut di posisi mana pun.

Rumus Dimensi Output:
$$O = \\left\\lfloor \\frac{W - K + 2P}{S} \\right\\rfloor + 1$$
($W$: Ukuran input, $K$: Ukuran kernel, $P$: Padding, $S$: Stride).`,
    practicalWalkthrough: {
      summary: 'Susun arsitektur CNN klasik LeNet/VGG-style sederhana menggunakan Conv2d, BatchNorm2d, ReLU, dan MaxPool2d.',
      environment: 'Jupyter Notebook / Google Colab',
      codeSnippets: [
        {
          title: 'Custom CNN Architecture from Scratch',
          language: 'python',
          code: `import torch
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        # Blok Ekstraksi Fitur Spasial
        self.features = nn.Sequential(
            # Input: [Batch, 3, 32, 32]
            nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2), # Output: [Batch, 16, 16, 16]
            
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2) # Output: [Batch, 32, 8, 8]
        )
        
        # Lapisan Klasifikasi (Flatten)
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32 * 8 * 8, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes)
        )
        
    def forward(self, x):
        x = self.features(x)
        logits = self.classifier(x)
        return logits

model_cnn = SimpleCNN(num_classes=10)
dummy_img = torch.randn(2, 3, 32, 32)
print("Output logits shape (harus [2, 10]):", model_cnn(dummy_img).shape)`,
          explanation: 'Membangun pipa ekstraksi fitur spasial hierarkis yang mengompresi dimensi piksel menjadi representasi semantik.',
        },
      ],
    },
    stepByStepInstructions: [
      'Gunakan rumus dimensi output untuk menghitung ukuran tensor di setiap tahap Conv2d dan MaxPool2d.',
      'Bangun blok fitur konvolusi 2-tingkat dengan kernel_size=3 dan padding=1.',
      'Gunakan nn.Flatten() untuk meratakan representasi 3D spasial menjadi vektor 1D sebelum masuk ke classifier.',
      'Uji model dengan tensor citra dummy berukuran [4, 3, 32, 32].',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Vision Layers', type: 'tool', description: 'nn.Conv2d, nn.MaxPool2d, nn.BatchNorm2d' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Arsitektur CNN', description: 'Bangun model CNN dari nol yang menerima input citra 3-kanal dan hitung jumlah total parameternya.' },
      { title: 'Visualisasi Filter Pertama', description: 'Ekstrak bobot model.features[0].weight dan visualisasikan 16 kernel konvolusi pertama sebagai peta visual.', isStretch: true },
    ],
    deliverables: [
      'Kode kelas CNN dari nol.',
      'Tabel jejak dimensi tensor dari input hingga output logits.',
    ],
    checklist: [
      { id: 'c1', label: 'Rumus dimensi konvolusi dihitung dengan tepat', isRequired: true },
      { id: 'c2', label: 'nn.Conv2d, BatchNorm2d, dan MaxPool2d tersusun sistematis', isRequired: true },
      { id: 'c3', label: 'Flatten dan Linear classifier menerima dimensi input yang cocok', isRequired: true },
    ],
    definitionOfDone: [
      'Model CNN mandiri berhasil dirakit dan lolos forward pass citra tanpa shape mismatch.',
    ],
    reflectionQuestions: [
      'Apa fungsi padding=1 saat menggunakan kernel 3x3 dengan stride=1?',
      'Mengapa MaxPool2d lebih sering digunakan dibanding AveragePooling pada convolutional layer klasik?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 51 untuk melatih CNN pada dataset citra nyata di Image Classification.',
  },
  {
    id: 'day-051',
    day: 51,
    phaseId: 4,
    title: 'Image Classification',
    shortDescription: 'Melatih CNN pada dataset CIFAR-10 / FashionMNIST: Data Augmentation dengan torchvision.transforms dan confusion matrix citra.',
    difficulty: 'Intermediate',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Menggunakan torchvision.datasets untuk memuat dataset benchmark (CIFAR-10).',
      'Menerapkan Data Augmentation untuk mencegah overfit: RandomCrop, RandomHorizontalFlip, dan Normalisasi mean-std citra.',
      'Melatih model CNN pada GPU hingga mencapai akurasi uji di atas 70%.',
      'Mengevaluasi kesalahan klasifikasi dengan memvisualisasikan citra-citra yang gagal diprediksi.',
    ],
    theoryContent: `### Seni Mengembangkan Data Citra: Data Augmentation
Jaringan CNN sangat haus data. Jika kita hanya melatih pada citra kucing yang selalu menghadap ke kiri, model tidak akan mengenali kucing yang menghadap ke kanan!

Augmentasi Citra dengan Torchvision:
- \`RandomHorizontalFlip(p=0.5)\`: Membalik citra horizontal secara acak.
- \`RandomCrop(32, padding=4)\`: Menggeser sedikit posisi objek.
- \`Normalize(mean, std)\`: Menormalisasi nilai piksel kanal warna R, G, B agar berpusat di nol.
Teknik ini melipatgandakan variasi data latih secara sintetis tanpa biaya anotasi tambahan!`,
    practicalWalkthrough: {
      summary: 'Bangun pipeline torchvision transforms, muat CIFAR-10, dan latih SimpleCNN selama 10 epoch di GPU.',
      environment: 'Google Colab (GPU Runtime wajib) / Jupyter',
      codeSnippets: [
        {
          title: 'CIFAR-10 Data Augmentation & Training',
          language: 'python',
          code: `import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader

# 1. Pipeline Augmentasi Data Latih
transform_train = transforms.Compose([
    transforms.RandomCrop(32, padding=4),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010))
])

# Data uji HANYA dinormalisasi (tanpa augmentasi acak!)
transform_test = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010))
])

trainset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=transform_train)
trainloader = DataLoader(trainset, batch_size=64, shuffle=True, num_workers=2)

testset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=transform_test)
testloader = DataLoader(testset, batch_size=64, shuffle=False, num_workers=2)

print(f"Dataset CIFAR-10 termuat: {len(trainset)} data latih, {len(testset)} data uji.")`,
          explanation: 'Mempersiapkan data citra teraugmentasi dengan normalisasi standar ImageNet/CIFAR.',
        },
      ],
    },
    stepByStepInstructions: [
      'Unduh dataset CIFAR-10 atau FashionMNIST melalui torchvision.',
      'Pasang pipeline augmentasi data latih dan pipeline uji terpisah.',
      'Pindahkan model SimpleCNN dari Hari 50 ke GPU (model.to(device)).',
      'Latih model selama 10 epoch dengan AdamW optimizer.',
      'Hitung akurasi final pada 10.000 citra data uji.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Torchvision Datasets & Transforms', type: 'tool', description: 'transforms.Compose, datasets.CIFAR10' },
      { name: 'CIFAR-10 Dataset', type: 'dataset', description: '60.000 citra 32x32 dari 10 kategori objek' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Klasifikasi Citra', description: 'Capai akurasi uji minimal 70% pada CIFAR-10 menggunakan CNN kustom Anda.' },
      { title: 'Galeri Prediksi Gagal', description: 'Plot grid 2x4 yang menampilkan 8 citra yang salah diprediksi lengkap dengan label asli vs label tebakan model.', isStretch: true },
    ],
    deliverables: [
      'Grafik kurva akurasi train vs test selama 10 epoch.',
      'Visualisasi sampel citra yang salah diklasifikasikan.',
    ],
    checklist: [
      { id: 'c1', label: 'Data augmentation diterapkan hanya pada data latih', isRequired: true },
      { id: 'c2', label: 'Model dilatih di lingkungan akselerator GPU', isRequired: true },
      { id: 'c3', label: 'Akurasi uji di atas 70% berhasil dicapai pada CIFAR-10', isRequired: true },
    ],
    definitionOfDone: [
      'Pipeline klasifikasi citra end-to-end berfungsi mulus dari augmentasi hingga inferensi.',
    ],
    reflectionQuestions: [
      'Mengapa augmentasi seperti RandomCrop tidak boleh diterapkan pada data evaluasi/uji?',
      'Kategori kelas objek apa yang paling sering tertukar pada CIFAR-10 (misal kucing vs anjing)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 52 untuk memanfaatkan model raksasa pra-latih melalui Transfer Learning.',
  },
  {
    id: 'day-052',
    day: 52,
    phaseId: 4,
    title: 'Transfer Learning',
    shortDescription: 'Berdiri di atas pundak raksasa: Menggunakan pretrained backbone ResNet-18/MobileNetV2 dan membekukan bobot (Feature Extraction).',
    difficulty: 'Intermediate',
    estimatedDuration: '80 Menit',
    learningObjectives: [
      'Memahami filosofi Transfer Learning: mentransfer fitur visual umum dari ImageNet (1.4 juta gambar).',
      'Memuat model pra-latih dari torchvision.models (ResNet-18 atau MobileNetV3).',
      'Membekukan bobot backbone (param.requires_grad = False).',
      'Mengganti kepala klasifikasi terakhir (model.fc) agar sesuai dengan jumlah kelas tugas kustom kita.',
    ],
    theoryContent: `### Jangan Melatih dari Nol Jika Raksasa Sudah Melakukannya!
Melatih model vision dari nol membutuhkan jutaan gambar dan puluhan hari komputasi superkomputer.
**Transfer Learning** memungkinkan kita memanfaatkan jaringan yang telah dilatih di ImageNet:
- Lapisan-lapisan awal telah mahir mendeteksi garis, tekstur, sudut, dan bentuk mata uang/wajah secara universal.
- Kita hanya perlu **membekukan (*freeze*)** lapisan awal tersebut dan hanya mengganti lapisan terakhir (\`model.fc\`) untuk memprediksi kelas spesifik kita.

Hasilnya: Akurasi di atas 90% dapat dicapai hanya dengan beberapa ratus gambar dan waktu latihan beberapa menit!`,
    practicalWalkthrough: {
      summary: 'Muat ResNet-18 pretrained ImageNet, bekukan seluruh lapisan backbone, ganti kepala klasifikasinya, dan latih hanya lapisan akhir.',
      environment: 'Google Colab (GPU) / Jupyter',
      codeSnippets: [
        {
          title: 'ResNet-18 Feature Extraction Transfer Learning',
          language: 'python',
          code: `import torchvision.models as models
import torch.nn as nn

# 1. Muat ResNet18 dengan bobot pra-latih ImageNet standar terbaru
weights = models.ResNet18_Weights.DEFAULT
model_resnet = models.resnet18(weights=weights)

# 2. Bekukan seluruh parameter backbone agar tidak ikut ter-update
for param in model_resnet.parameters():
    param.requires_grad = False

# 3. Ganti lapisan Fully Connected terakhir untuk tugas kustom (misal 5 kelas)
num_ftrs = model_resnet.fc.in_features
model_resnet.fc = nn.Sequential(
    nn.Linear(num_ftrs, 128),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(128, 5) # 5 kelas target kustom
)

# Hanya parameter model.fc yang requires_grad=True!
trainable_params = sum(p.numel() for p in model_resnet.parameters() if p.requires_grad)
total_params = sum(p.numel() for p in model_resnet.parameters())
print(f"Total parameter: {total_params:,} | Parameter yang dilatih: {trainable_params:,} (Hanya ~0.6%!)")`,
          explanation: 'Hanya melatih kepala classifier baru menghemat 99% waktu komputasi pelatihan.',
        },
      ],
    },
    stepByStepInstructions: [
      'Import torchvision.models dan muat ResNet18_Weights.DEFAULT.',
      'Lakukan iterasi pada model.parameters() dan setel requires_grad=False.',
      'Ganti model.fc dengan modul nn.Linear baru sesuai target kelas Anda.',
      'Pastikan optimizer HANYA menerima parameter yang tidak dibekukan (filter(lambda p: p.requires_grad, model.parameters())).',
      'Latih selama 5 epoch dan amati bagaimana akurasi langsung melonjak sejak epoch pertama.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Torchvision Models', type: 'tool', description: 'models.resnet18, models.mobilenet_v2' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Feature Extraction', description: 'Latih kepala ResNet-18 pada dataset kustom dan capai akurasi lebih tinggi daripada model scratch Hari 51 dalam separuh waktu.' },
      { title: 'MobileNet Benchmark', description: 'Bandingkan ukuran memori dan kecepatan inferensi MobileNetV3 vs ResNet-18.', isStretch: true },
    ],
    deliverables: [
      'Log pelatihan yang menunjukkan akurasi tinggi tercapai sejak epoch awal.',
      'Perbandingan rasio jumlah parameter terlatih vs parameter beku.',
    ],
    checklist: [
      { id: 'c1', label: 'Bobot pretrained ImageNet berhasil diunduh dan dipasang', isRequired: true },
      { id: 'c2', label: 'Lapisan backbone dibekukan (requires_grad = False)', isRequired: true },
      { id: 'c3', label: 'Lapisan fc diganti dengan jumlah kelas yang sesuai', isRequired: true },
    ],
    definitionOfDone: [
      'Transfer learning berhasil diterapkan secara efisien tanpa merusak bobot representasi pra-latih.',
    ],
    reflectionQuestions: [
      'Mengapa kita harus membekukan lapisan backbone saat pertama kali melatih kepala classifier baru?',
      'Kapan transfer learning dari ImageNet mungkin TIDAK efektif (misal citra mikroskopis sel atau citra satelit)?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 53 untuk membuka sebagian lapisan beku di Fine-Tuning Experiment.',
  },
  {
    id: 'day-053',
    day: 53,
    phaseId: 4,
    title: 'Fine-Tuning Experiment',
    shortDescription: 'Fine-Tuning bertingkat: Membuka lapisan atas backbone (unfreezing), differential learning rates, dan menghindari catastrophic forgetting.',
    difficulty: 'Advanced',
    estimatedDuration: '85 Menit',
    learningObjectives: [
      'Membedakan Feature Extraction (bobot beku) vs Fine-Tuning (bobot disesuaikan halus).',
      'Membuka kunci parameter pada blok konvolusi tingkat tinggi (layer4 pada ResNet).',
      'Menerapkan Differential Learning Rates (learning rate sangat kecil untuk backbone, lebih besar untuk kepala).',
      'Mencegah fenomena Catastrophic Forgetting yang merusak fitur visual ImageNet.',
    ],
    theoryContent: `### Menyelaraskan Model Raksasa dengan Masalah Anda (Fine-Tuning)
Setelah kepala classifier baru terbiasa dengan data kita (melalui feature extraction selama beberapa epoch), kita dapat melakukan **Fine-Tuning**:
1. Buka beberapa lapisan konvolusi teratas dari backbone (\`layer4\` pada ResNet).
2. Lapisan teratas ini mempelajari fitur tingkat tinggi (seperti bentuk mata atau moncong spesifik) yang dapat diadaptasikan ke domain target kita.

Aturan Kunci:
- **Gunakan Learning Rate Sangat Kecil** untuk backbone (misal \`1e-5\`). Jika learning rate terlalu besar, gradien yang keras akan langsung menghapus (*wipe out*) pengetahuan visual kaya yang telah dipelajari selama bertahun-tahun di ImageNet (*Catastrophic Forgetting*)!`,
    practicalWalkthrough: {
      summary: 'Buka layer4 ResNet-18, atur differential learning rates di optimizer, dan jalankan 5 epoch fine-tuning.',
      environment: 'Google Colab (GPU) / Jupyter',
      codeSnippets: [
        {
          title: 'Differential Learning Rates for Fine-Tuning',
          language: 'python',
          code: `import torch.optim as optim

# 1. Buka pembekuan HANYA pada blok konvolusi terakhir (layer4)
for name, param in model_resnet.named_parameters():
    if "layer4" in name or "fc" in name:
        param.requires_grad = True
    else:
        param.requires_grad = False

# 2. Tetapkan Differential Learning Rates
# Backbone mendapat LR 1e-5, Kepala Klasifikasi mendapat LR 1e-3
optimizer = optim.AdamW([
    {'params': model_resnet.layer4.parameters(), 'lr': 1e-5},
    {'params': model_resnet.fc.parameters(), 'lr': 1e-3}
], weight_decay=1e-2)

print("Konfigurasi Fine-Tuning Siap: Backbone dilatih dengan laju sangat halus (1e-5).")`,
          explanation: 'Memisahkan kelompok parameter di optimizer untuk menjaga stabilitas fitur umum sembari mengadaptasi fitur domain.',
        },
      ],
    },
    stepByStepInstructions: [
      'Mulai dari model ResNet yang telah melalui tahap Feature Extraction Hari 52.',
      'Buka kunci layer4 dengan menyetel param.requires_grad = True.',
      'Definisikan kelompok parameter di optimizer dengan dua laju belajar berbeda (100x lebih kecil untuk backbone).',
      'Latih model selama 5 epoch dan amati lonjakan akurasi final.',
    ],
    requiredToolsAndDatasets: [
      { name: 'PyTorch Parameter Groups', type: 'tool', description: 'torch.optim multi-group parameters' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Fine-Tuning', description: 'Tunjukkan peningkatan akurasi uji sebesar 2-5% setelah menerapkan fine-tuning dibanding feature extraction murni.' },
      { title: 'Simulasi Catastrophic Forgetting', description: 'Coba lakukan unfreezing seluruh backbone dengan learning rate tinggi (0.01) dan amati bagaimana performa model justru anjlok.', isStretch: true },
    ],
    deliverables: [
      'Grafik perbandingan akurasi: Scratch vs Feature Extraction vs Fine-Tuning.',
      'Daftar layer yang dibuka beserta nilai learning rate masing-masing.',
    ],
    checklist: [
      { id: 'c1', label: 'Hanya layer atas backbone yang dibuka untuk unfreezing', isRequired: true },
      { id: 'c2', label: 'Differential learning rate diterapkan (LR backbone jauh lebih kecil)', isRequired: true },
      { id: 'c3', label: 'Peningkatan performa berhasil dibuktikan secara empiris', isRequired: true },
    ],
    definitionOfDone: [
      'Model deep learning mencapai performa kelas produksi melalui teknik fine-tuning terkontrol.',
    ],
    reflectionQuestions: [
      'Mengapa kita tidak langsung melakukan fine-tuning sejak epoch pertama sebelum kepala classifier terlatih?',
      'Apa yang dimaksud dengan konsep Catastrophic Forgetting dalam transfer learning?',
    ],
    suggestedNextStep: 'Lanjut ke Hari 54 untuk membangun dan mempublikasikan Mini-Project 4: Image Classifier!',
  },
  {
    id: 'day-054',
    day: 54,
    phaseId: 4,
    title: 'Mini-project 4: Image Classifier',
    shortDescription: 'Proyek akhir Fase 4: Membangun sistem klasifikasi citra end-to-end berbasis transfer learning, evaluasi visual, dan ekspor model TorchScript / ONNX.',
    difficulty: 'Intermediate',
    estimatedDuration: '90 Menit',
    isProject: true,
    projectMilestoneId: 'proj-4',
    learningObjectives: [
      'Mengintegrasikan seluruh materi deep learning: augmentasi citra, transfer learning, fine-tuning, dan early stopping ke dalam satu proyek utuh.',
      'Membangun fungsi inferensi gambar tunggal yang dapat menerima file URL/lokal dan mengembalikan Top-3 prediksi probabilitas.',
      'Mengekspor model PyTorch ke format TorchScript (.pt) untuk inferensi cepat tanpa dependensi definisi kelas Python.',
      'Mendokumentasikan hasil proyek dan repositori di tab Portofolio.',
    ],
    theoryContent: `### Mini-Project 4: Menghasilkan Model Vision Siap Produksi
Sebuah proyek Computer Vision tidak berhenti di file notebook yang berhasil di-run:
1. **Inference Function**: Harus memiliki fungsi mandiri \`predict_image(image_path)\` yang melakukan preprocessing identik dan mengeluarkan label bahasa manusia.
2. **Model Serialization**: Menyimpan dengan **TorchScript** (\`torch.jit.trace\` atau \`torch.jit.script\`) memungkinkan model dieksekusi di server C++, Go, atau mobile app tanpa membutuhkan runtime Python!`,
    practicalWalkthrough: {
      summary: 'Kompilasi proyek klasifikasi citra, uji fungsi inferensi satu gambar, ekspor ke TorchScript, dan unggah ke repositori portofolio.',
      environment: 'Google Colab / Jupyter / GitHub Gist',
      codeSnippets: [
        {
          title: 'TorchScript Export & Single Image Inference',
          language: 'python',
          code: `import torch
from PIL import Image

# 1. Ekspor ke TorchScript via Tracing
model_resnet.eval()
example_input = torch.randn(1, 3, 224, 224).to(device)
traced_model = torch.jit.trace(model_resnet, example_input)
traced_model.save("classifier_torchscript.pt")
print("📦 Model berhasil diekspor ke TorchScript!")

# 2. Fungsi Inferensi Citra Tunggal
def predict_image(image_path, model, class_names):
    img = Image.open(image_path).convert('RGB')
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    tensor = preprocess(img).unsqueeze(0).to(device)
    
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)[0]
        
    top3_prob, top3_idx = torch.topk(probs, 3)
    return [(class_names[idx], round(prob.item() * 100, 2)) for idx, prob in zip(top3_idx, top3_prob)]`,
          explanation: 'Model yang diekspor ke TorchScript dapat langsung diintegrasikan ke backend web atau aplikasi seluler.',
        },
      ],
    },
    stepByStepInstructions: [
      'Pilih dataset citra nyata (misal: Klasifikasi Spesies Bunga Oxford, Citra Rontgen Paru-Paru, atau Klasifikasi Makanan).',
      'Terapkan transfer learning dengan ResNet atau EfficientNet.',
      'Gunakan augmentasi data latih dan evaluasi pada validation set.',
      'Tulis fungsi inferensi predict_image() yang menerima input file gambar bebas.',
      'Ekspor model ke file "classifier_torchscript.pt".',
      'Unggah kode dan dokumentasi README ke GitHub dan catat tautannya di tab Portofolio.',
    ],
    requiredToolsAndDatasets: [
      { name: 'Dataset Citra Spesifik Domain', type: 'dataset', description: 'Oxford Flowers / Kaggle Pneumonia / Food-101' },
      { name: 'Pillow (PIL)', type: 'tool', description: 'Pustaka manipulasi citra Python' },
    ],
    tasksAndChallenges: [
      { title: 'Tugas Mini-Project 4', description: 'Selesaikan pipeline vision lengkap dengan akurasi uji > 85%, fungsi inferensi gambar tunggal, dan artefak TorchScript.' },
      { title: 'Tantangan Grad-CAM Visualizer', description: 'Gunakan teknik Grad-CAM untuk memvisualisasikan heatmap area gambar mana yang menjadi fokus perhatian konvolusi model.', isStretch: true },
    ],
    deliverables: [
      'Tautan repositori GitHub berisi kode lengkap dan petunjuk inferensi.',
      'File artefak model "classifier_torchscript.pt".',
      'Laporan evaluasi metrik Top-1 dan Top-3 accuracy.',
    ],
    checklist: [
      { id: 'c1', label: 'Pipeline augmentasi dan transfer learning terintegrasi penuh', isRequired: true },
      { id: 'c2', label: 'Fungsi inferensi mandiri predict_image berhasil mengembalikan Top-3 label', isRequired: true },
      { id: 'c3', label: 'Model diekspor ke format TorchScript / ONNX', isRequired: true },
      { id: 'c4', label: 'Dokumentasi dan link repo tersimpan di tab Portofolio', isRequired: true },
    ],
    definitionOfDone: [
      'Mini-Project 4 selesai dan diverifikasi.',
      'Fase 4 Deep Learning with PyTorch tuntas 100%!',
    ],
    reflectionQuestions: [
      'Mengapa format TorchScript lebih disukai di lingkungan produksi dibanding file .pt standar PyTorch biasa?',
      'Bagaimana perasaan Anda berhasil membangun neural network dari aljabar dasar hingga transfer learning computer vision modern?',
    ],
    suggestedNextStep: 'Selamat atas pencapaian luar biasa menaklukkan PyTorch dan Computer Vision! Besok kita masuk ke Fase 5: NLP & Transformers (Text, Attention, BERT, & IndoNLU)!',
  },
];
