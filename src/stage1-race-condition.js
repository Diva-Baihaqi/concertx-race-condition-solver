const chalk = require('chalk');

// Simulasi Database (Variabel Global)
let sisa_tiket = 100;
let tiket_terjual = 0;
let pengguna_berhasil = [];

// Fungsi simulasi query database yang memakan waktu (delay)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function beliTiket(userId) {
  // 1. Baca sisa tiket (Simulasi read dari DB)
  const tiket_saat_ini = sisa_tiket;
  
  // Simulasi network delay / processing time
  await delay(Math.random() * 50); 
  
  // 2. Cek apakah tiket masih ada
  if (tiket_saat_ini > 0) {
    // 3. Proses pembayaran (delay lagi)
    await delay(Math.random() * 50);
    
    // 4. Update tiket (Simulasi write ke DB)
    sisa_tiket = tiket_saat_ini - 1;
    tiket_terjual++;
    pengguna_berhasil.push(userId);
    
    return true;
  } else {
    return false;
  }
}

async function runStage1(jumlahRequest = 1000) {
  console.log(chalk.blue.bold(`\n=== TAHAP 1: SIMULASI RACE CONDITION (TANPA LOCK) ===`));
  console.log(`Initial Stok Tiket: ${sisa_tiket}`);
  console.log(`Jumlah Request Masuk: ${jumlahRequest}`);
  
  // Reset state
  sisa_tiket = 100;
  tiket_terjual = 0;
  pengguna_berhasil = [];

  const start_time = Date.now();
  
  // Buat array of promises untuk mensimulasikan concurrent requests
  const requests = [];
  for (let i = 1; i <= jumlahRequest; i++) {
    requests.push(beliTiket(`User_${i}`));
  }
  
  // Eksekusi semua request secara bersamaan (konkuren)
  await Promise.all(requests);
  
  const end_time = Date.now();
  const durasi = end_time - start_time;
  
  console.log(chalk.yellow(`\n--- HASIL AKHIR TAHAP 1 ---`));
  console.log(`Sisa Tiket: ${sisa_tiket <= 0 ? chalk.red.bold(sisa_tiket) : sisa_tiket} ${sisa_tiket < 0 ? chalk.red('(OVERBOOKED!)') : ''}`);
  console.log(`Tiket Terjual: ${tiket_terjual > 100 ? chalk.red.bold(tiket_terjual) : tiket_terjual}`);
  console.log(`Durasi Eksekusi: ${durasi} ms`);
  
  return { sisa_tiket, tiket_terjual, durasi };
}

// Jika dijalankan langsung dari command line
if (require.main === module) {
  runStage1(1000).then(() => process.exit(0));
}

module.exports = { runStage1 };
