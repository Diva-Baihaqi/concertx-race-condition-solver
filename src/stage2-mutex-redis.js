const chalk = require('chalk');
const redis = require('./utils/redis-client');

let sisa_tiket = 100;
let tiket_terjual = 0;
let pengguna_berhasil = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function acquireLock(lockKey, timeout) {
  // SET NX (Not eXists) - hanya set jika key belum ada, PX untuk expiry millisecond
  // Ini adalah Distributed Mutex berbasis Redis
  const result = await redis.set(lockKey, 'locked', 'PX', timeout, 'NX');
  return result === 'OK';
}

async function releaseLock(lockKey) {
  await redis.del(lockKey);
}

async function beliTiketDenganLock(userId) {
  const lockKey = 'tiket_lock';
  const lockTimeout = 5000; // 5 detik max lock
  let hasLock = false;
  
  try {
    // 1. WAIT/P: Coba dapatkan lock (Spinning Lock / Retry)
    while (!hasLock) {
      hasLock = await acquireLock(lockKey, lockTimeout);
      if (!hasLock) {
        await delay(10); // Tunggu sebentar sebelum coba lagi
      }
    }
    
    // --- START CRITICAL SECTION ---
    
    const tiket_saat_ini = sisa_tiket;
    await delay(Math.random() * 50); // Simulasi read delay
    
    if (tiket_saat_ini > 0) {
      await delay(Math.random() * 50); // Simulasi process delay
      
      sisa_tiket = tiket_saat_ini - 1;
      tiket_terjual++;
      pengguna_berhasil.push(userId);
    }
    
    // --- END CRITICAL SECTION ---
  } catch (error) {
    console.error(`Error pada User ${userId}:`, error);
  } finally {
    // 2. SIGNAL/V: Selalu pastikan lock dilepas walaupun terjadi error
    if (hasLock) {
      await releaseLock(lockKey);
    }
  }
}

async function runStage2(jumlahRequest = 1000) {
  console.log(chalk.blue.bold(`\n=== TAHAP 2: SIMULASI MUTEX DENGAN REDIS (SET NX) ===`));
  console.log(`Initial Stok Tiket: 100`);
  console.log(`Jumlah Request Masuk: ${jumlahRequest}`);
  
  // Reset state
  sisa_tiket = 100;
  tiket_terjual = 0;
  pengguna_berhasil = [];
  
  // Pastikan lock bersih sebelum mulai
  await redis.del('tiket_lock');

  const start_time = Date.now();
  
  const requests = [];
  for (let i = 1; i <= jumlahRequest; i++) {
    requests.push(beliTiketDenganLock(`User_${i}`));
  }
  
  await Promise.all(requests);
  
  const end_time = Date.now();
  const durasi = end_time - start_time;
  
  console.log(chalk.green(`\n--- HASIL AKHIR TAHAP 2 ---`));
  console.log(`Sisa Tiket: ${sisa_tiket === 0 ? chalk.green.bold(sisa_tiket) : sisa_tiket}`);
  console.log(`Tiket Terjual: ${tiket_terjual === 100 ? chalk.green.bold(tiket_terjual) : tiket_terjual}`);
  console.log(`Durasi Eksekusi: ${durasi} ms`);
  
  return { sisa_tiket, tiket_terjual, durasi };
}

// Jika dijalankan langsung dari command line
if (require.main === module) {
  runStage2(1000).then(() => {
    redis.quit();
    process.exit(0);
  });
}

module.exports = { runStage2 };
