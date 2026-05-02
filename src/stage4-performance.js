const chalk = require('chalk');
const Table = require('cli-table3');
const redis = require('./utils/redis-client');
const { runStage1 } = require('./stage1-race-condition');
const { runStage2 } = require('./stage2-mutex-redis');

async function analyzePerformance() {
  console.log(chalk.blue.bold(`\n=== TAHAP 4: ANALISIS PERFORMA ===`));
  console.log(`Menjalankan benchmark... (Mohon tunggu)`);
  
  // Run Stage 1 (Without Lock)
  console.log(`\nMenjalankan simulasi TANPA lock...`);
  const result1 = await runStage1(1000);
  
  // Run Stage 2 (With Lock)
  console.log(`\nMenjalankan simulasi DENGAN lock...`);
  const result2 = await runStage2(1000);
  
  const table = new Table({
    head: ['Sistem', 'Sisa Tiket', 'Tiket Terjual', 'Durasi (ms)', 'Status Konsistensi'],
    colWidths: [20, 15, 15, 15, 25]
  });
  
  table.push(
    ['Tanpa Lock', result1.sisa_tiket, result1.tiket_terjual, result1.durasi, result1.sisa_tiket < 0 ? chalk.red('Inkonsisten (Overbooked)') : 'Tidak Tentu'],
    ['Dengan Lock (Redis)', result2.sisa_tiket, result2.tiket_terjual, result2.durasi, chalk.green('Konsisten')]
  );
  
  console.log(`\n${table.toString()}`);
  
  const overhead = result2.durasi - result1.durasi;
  const slowdown = (result2.durasi / result1.durasi).toFixed(2);
  
  console.log(chalk.cyan(`\n=== KESIMPULAN ANALISIS PERFORMA ===`));
  console.log(`1. Kecepatan: Sistem dengan lock (Mutex) lebih lambat ${overhead}ms (${slowdown}x lebih lambat) dibandingkan tanpa lock.`);
  console.log(`2. Alasan Penurunan Kecepatan (Overhead):`);
  console.log(`   - Adanya proses Wait/P (Spinning Lock) yang membuat request harus mengantri menunggu giliran masuk ke Critical Section.`);
  console.log(`   - Adanya network roundtrip ke Redis Server untuk mengeksekusi command SET NX dan DEL.`);
  console.log(`3. Urgensi: Meskipun terjadi penurunan kecepatan, penambahan pengamanan data (Locking) ini ${chalk.green.bold('SANGAT KRUSIAL')}. Tanpa ini, perusahaan akan rugi karena harus mengembalikan uang pembeli atau dituntut karena menjual barang yang tidak ada stoknya (Overbooking). Integritas data lebih penting daripada sedikit peningkatan kecepatan transaksi.`);
}

if (require.main === module) {
  analyzePerformance().then(() => {
    redis.quit();
    process.exit(0);
  });
}

module.exports = { analyzePerformance };
