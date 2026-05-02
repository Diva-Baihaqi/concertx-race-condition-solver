Daftar File & Screenshot untuk Diunggah ke Google NotebookLM
=============================================================

Agar NotebookLM bisa membuatkan slide PPT yang kaya data, akurat, dan sangat teknikal sesuai project Anda, siapkan dan unggah daftar file dan screenshot berikut:

1. FILE TEKS & SOURCE CODE (Wajib)
----------------------------------
Unggah file-file berikut langsung ke NotebookLM (bisa di-drag & drop):
[ ] laporan/laporan-teknis.md (Dokumen utama penjelasan alur logika)
[ ] doc/tugas.md (Instruksi awal tugas agar NotebookLM tahu konteks dan rubrik penilaian)
[ ] src/stage2-mutex-redis.js (Penting agar NotebookLM bisa menganalisis baris kode Critical Section)
[ ] src/stage4-performance.js (Berisi logika benchmarking perbandingan waktu eksekusi)

2. SCREENSHOT BUKTI & VISUALISASI (Sangat Disarankan)
-----------------------------------------------------
Ambil gambar (screenshot) dari bagian-bagian berikut dan simpan sebagai PNG/JPG, lalu unggah:

[ ] Screenshot 1: "Dashboard_Selesai_Simulasi.png"
    - Cara ambil: Buka browser ke http://localhost:3000. Klik tombol merah (Tahap 1), tunggu selesai. Klik tombol hijau (Tahap 2), tunggu selesai.
    - Mengapa penting? Ini menunjukkan kepada NotebookLM desain UI Glassmorphism Anda dan hasil angka riil yang divisualisasikan oleh Chart.js (Grafik Performa di bagian bawah).

[ ] Screenshot 2: "Terminal_Stage4_Table.png"
    - Cara ambil: Buka command prompt/terminal baru di dalam folder project, jalankan perintah `node src/stage4-performance.js`. Ambil screenshot tabel komparasi yang muncul di CLI terminal.
    - Mengapa penting? Ini bukti otentik pengujian performa via CLI. NotebookLM akan mengekstrak metrik waktunya untuk ditaruh di slide PPT.

[ ] Screenshot 3: "Terminal_Stage1_Overbooked.png"
    - Cara ambil: Jalankan `node src/stage1-race-condition.js` di terminal. Screenshot teks berwarna merah yang bertuliskan "(OVERBOOKED!)".
    - Mengapa penting? Sebagai bukti empiris kegagalan sistem tanpa lock.

[ ] Screenshot 4: "Laragon_Redis_Active.png"
    - Cara ambil: Buka panel utama Laragon (seperti file doc/laragon.png), pastikan Redis (port 6379) berstatus "started".
    - Mengapa penting? Menambah konteks arsitektur lokal yang Anda gunakan di presentasi. NotebookLM akan menulis "Di-deploy secara lokal menggunakan lingkungan Laragon..."

---
TIPS TAMBAHAN:
Setelah semua diunggah, copy prompt yang ada di file `doc/notebooklm.txt` lalu paste ke kolom chat NotebookLM. Sistem akan meramu semuanya menjadi naskah PPT yang sangat profesional!
