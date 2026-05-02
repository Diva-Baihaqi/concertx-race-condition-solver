const chalk = require('chalk');
const redis = require('./utils/redis-client');
const { runStage2 } = require('./stage2-mutex-redis');

async function verifyConsistency() {
  console.log(chalk.magenta.bold(`\n=== TAHAP 3: VERIFIKASI KONSISTENSI DATA ===`));
  
  const hasil = await runStage2(1000);
  
  console.log(chalk.cyan(`\n=== HASIL VERIFIKASI ===`));
  
  let valid = true;
  
  if (hasil.sisa_tiket === 0) {
    console.log(chalk.green(`✅ sisa_tiket tepat 0 (Tidak negatif)`));
  } else {
    console.log(chalk.red(`❌ sisa_tiket tidak 0 (Nilai: ${hasil.sisa_tiket})`));
    valid = false;
  }
  
  if (hasil.tiket_terjual === 100) {
    console.log(chalk.green(`✅ jumlah tiket terjual tepat 100 (Sesuai stok)`));
  } else {
    console.log(chalk.red(`❌ jumlah tiket terjual tidak 100 (Nilai: ${hasil.tiket_terjual})`));
    valid = false;
  }
  
  console.log(chalk.yellow(`\nBagian Critical Section yang diamankan:`));
  console.log(`
    // --- START CRITICAL SECTION ---
    
    // 1. Membaca sisa_tiket saat ini
    const tiket_saat_ini = sisa_tiket;
    
    // 2. Jika sisa > 0, proses pembelian
    if (tiket_saat_ini > 0) {
      sisa_tiket = tiket_saat_ini - 1;
      tiket_terjual++;
      pengguna_berhasil.push(userId);
    }
    
    // --- END CRITICAL SECTION ---
  `);
  
  console.log(chalk.magenta(`Kesimpulan Verifikasi: ${valid ? chalk.green.bold('LULUS (KONSISTEN)') : chalk.red.bold('GAGAL (TIDAK KONSISTEN)')}`));
  return valid;
}

if (require.main === module) {
  verifyConsistency().then(() => {
    redis.quit();
    process.exit(0);
  });
}

module.exports = { verifyConsistency };
