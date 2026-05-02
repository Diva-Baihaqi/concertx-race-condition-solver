let chartInstance = null;
let s1Data = null;
let s2Data = null;

function animateValue(obj, start, end, duration, formatPrefix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        let current = Math.floor(progress * (end - start) + start);
        obj.innerHTML = formatPrefix + current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = formatPrefix + end;
        }
    };
    window.requestAnimationFrame(step);
}

function updateChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    const d1 = s1Data ? s1Data.durasi : 0;
    const d2 = s2Data ? s2Data.durasi : 0;

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tanpa Lock (Race Condition)', 'Dengan Lock (Mutex)'],
            datasets: [{
                label: 'Waktu Eksekusi (ms)',
                data: [d1, d2],
                backgroundColor: [
                    'rgba(224, 82, 82, 0.7)',
                    'rgba(95, 160, 78, 0.7)'
                ],
                borderColor: [
                    'rgba(224, 82, 82, 1)',
                    'rgba(95, 160, 78, 1)'
                ],
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

// Initial empty chart
updateChart();

function setLoading(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    const text = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.loader');
    
    if (isLoading) {
        btn.disabled = true;
        text.style.opacity = '0';
        loader.classList.remove('hidden');
    } else {
        btn.disabled = false;
        text.style.opacity = '1';
        loader.classList.add('hidden');
    }
}

async function runStage1() {
    setLoading('btn-s1', true);
    
    const elSisa = document.getElementById('s1-sisa');
    const elTerjual = document.getElementById('s1-terjual');
    const elWaktu = document.getElementById('s1-waktu');
    
    elSisa.className = 'value';
    elTerjual.className = 'value';
    
    try {
        const response = await fetch('/api/run/stage1');
        const data = await response.json();
        
        s1Data = data;
        
        animateValue(elSisa, 100, data.sisa_tiket, 1000);
        animateValue(elTerjual, 0, data.tiket_terjual, 1000);
        animateValue(elWaktu, 0, data.durasi, 1000);
        
        setTimeout(() => {
            if (data.sisa_tiket < 0) elSisa.classList.add('overbooked');
            if (data.tiket_terjual > 100) elTerjual.classList.add('overbooked');
        }, 1100);
        
        updateChart();
    } catch (error) {
        alert("Gagal menjalankan simulasi: " + error);
    } finally {
        setLoading('btn-s1', false);
    }
}

async function runStage2() {
    setLoading('btn-s2', true);
    
    const elSisa = document.getElementById('s2-sisa');
    const elTerjual = document.getElementById('s2-terjual');
    const elWaktu = document.getElementById('s2-waktu');
    
    elSisa.className = 'value';
    elTerjual.className = 'value';
    
    try {
        const response = await fetch('/api/run/stage2');
        const data = await response.json();
        
        s2Data = data;
        
        animateValue(elSisa, 100, data.sisa_tiket, 1000);
        animateValue(elTerjual, 0, data.tiket_terjual, 1000);
        animateValue(elWaktu, 0, data.durasi, 1000);
        
        setTimeout(() => {
            if (data.sisa_tiket === 0) elSisa.classList.add('perfect');
            if (data.tiket_terjual === 100) elTerjual.classList.add('perfect');
        }, 1100);
        
        updateChart();
    } catch (error) {
        alert("Gagal menjalankan simulasi: " + error);
    } finally {
        setLoading('btn-s2', false);
    }
}
