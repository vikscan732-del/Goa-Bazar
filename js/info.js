// ==============================
// GOA BAZAR INFO (WITH HISTORY FILTER)
// ==============================

// ── DATA URL ──
const DATA_URL = "https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/data/history.json";

// ── FALLBACK DATA ──
const FALLBACK = {
    "Petrol": [{ date: "2026-08-05", price: 103.24 }],
    "Petrol Margao": [{ date: "2026-08-05", price: 103.35 }],
    "Diesel": [{ date: "2026-08-05", price: 90.45 }],
    "Diesel Margao": [{ date: "2026-08-05", price: 90.55 }],
    "CNG": [{ date: "2026-08-05", price: 74.50 }],
    "Auto Gas": [{ date: "2026-08-05", price: 52.00 }],
    "LPG": [{ date: "2026-08-05", price: 903.00 }],
    "Gold 24K": [{ date: "2026-08-05", price: 73150 }],
    "Gold 22K": [{ date: "2026-08-05", price: 67100 }],
    "Gold 21K": [{ date: "2026-08-05", price: 64050 }],
    "Gold 20K": [{ date: "2026-08-05", price: 61000 }],
    "Gold 18K": [{ date: "2026-08-05", price: 54200 }],
    "Silver": [{ date: "2026-08-05", price: 87500 }]
};

// ── WEATHER (static fallback) ──
const WEATHER = [
    { day: "Today", date: "10 May", icon: "⛅", temp: "32°C", desc: "Partly Cloudy" },
    { day: "Sun", date: "11 May", icon: "🌦️", temp: "31°C", desc: "Light Rain" },
    { day: "Mon", date: "12 May", icon: "🌧️", temp: "30°C", desc: "Rain" },
    { day: "Tue", date: "13 May", icon: "⛅", temp: "31°C", desc: "Partly Cloudy" },
    { day: "Wed", date: "14 May", icon: "☀️", temp: "32°C", desc: "Sunny" }
];

const weatherBox = document.getElementById("weatherCards");
const lastUpdated = document.getElementById("lastUpdated");

// ── History state ──
let fullHistoryData = {};
let currentHistoryKey = null;
let currentRange = 7;

document.getElementById("refreshBtn").onclick = loadAll;
loadAll();

// ── MAIN LOAD ──
async function loadAll() {
    try {
        const res = await fetch(DATA_URL + '?t=' + Date.now());
        if (!res.ok) throw new Error('HTTP error');
        const data = await res.json();
        fullHistoryData = data;

        // ── Timestamp ──
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        lastUpdated.innerHTML = '🕐 Last Updated: ' + dateStr + ', ' + timeStr;

        // ── Weather ──
        weatherBox.innerHTML = '';
        WEATHER.forEach(w => {
            weatherBox.innerHTML += `
                <div class="weatherCard">
                    <div style="font-size:42px">${w.icon}</div>
                    <h3>${w.day}</h3>
                    <h2>${w.temp}</h2>
                    <small>${w.desc}</small>
                </div>
            `;
        });

        // ── Helper to get latest price ──
        function getPrice(key) {
            const items = data[key] || FALLBACK[key] || [];
            if (items.length === 0) return null;
            return items[items.length - 1].price;
        }

        function getYesterdayPrice(key) {
            const items = data[key] || FALLBACK[key] || [];
            if (items.length < 2) return items.length === 1 ? items[0].price : null;
            return items[items.length - 2].price;
        }

        function formatPrice(price, yesterday) {
            if (price === null || price === undefined) return '₹--';
            let diff = 0;
            let diffText = '';
            if (yesterday !== null && yesterday !== undefined) {
                diff = price - yesterday;
                const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '➜';
                const sign = diff > 0 ? '+' : '';
                const color = diff > 0 ? 'green' : diff < 0 ? 'red' : 'gray';
                diffText = `<br><span style="color:${color};font-size:0.7rem;font-weight:600;">
                    ${arrow} ${sign}₹${Math.abs(diff).toFixed(2)}
                </span>`;
            }
            return `₹${price.toFixed(2)}${diffText}`;
        }

        function formatGold(val) {
            if (val === null || val === undefined) return '₹--';
            return '₹' + Number(val).toLocaleString('en-IN');
        }

        // ── Petrol ──
        const pPanjim = getPrice('Petrol');
        const pPanjimY = getYesterdayPrice('Petrol');
        document.getElementById('petrolPanjim').innerHTML = formatPrice(pPanjim, pPanjimY);

        const pMargao = getPrice('Petrol Margao') || getPrice('Petrol');
        const pMargaoY = getYesterdayPrice('Petrol Margao') || getYesterdayPrice('Petrol');
        document.getElementById('petrolMargao').innerHTML = formatPrice(pMargao, pMargaoY);

        // ── Diesel ──
        const dPanjim = getPrice('Diesel');
        const dPanjimY = getYesterdayPrice('Diesel');
        document.getElementById('dieselPanjim').innerHTML = formatPrice(dPanjim, dPanjimY);

        const dMargao = getPrice('Diesel Margao') || getPrice('Diesel');
        const dMargaoY = getYesterdayPrice('Diesel Margao') || getYesterdayPrice('Diesel');
        document.getElementById('dieselMargao').innerHTML = formatPrice(dMargao, dMargaoY);

        // ── CNG ──
        const cng = getPrice('CNG');
        const cngY = getYesterdayPrice('CNG');
        document.getElementById('cngPrice').innerHTML = formatPrice(cng, cngY);

        // ── Auto Gas ──
        const auto = getPrice('Auto Gas');
        const autoY = getYesterdayPrice('Auto Gas');
        document.getElementById('autogasPrice').innerHTML = formatPrice(auto, autoY);

        // ── LPG ──
        const lpg = getPrice('LPG');
        document.getElementById('lpgPrice').innerHTML = lpg ? '₹' + lpg.toFixed(2) : '₹--';

        // ── Gold ──
        const goldKeys = ['Gold 24K', 'Gold 22K', 'Gold 21K', 'Gold 20K', 'Gold 18K'];
        const goldIds = ['gold24', 'gold22', 'gold21', 'gold20', 'gold18'];
        goldKeys.forEach((key, i) => {
            const val = getPrice(key);
            document.getElementById(goldIds[i]).textContent = formatGold(val);
        });

        // ── Silver ──
        const silver = getPrice('Silver');
        document.getElementById('silverPrice').innerHTML = silver ? '₹' + Number(silver).toLocaleString('en-IN') : '₹--';

        // ── Set default history view (Petrol) ──
        currentHistoryKey = 'Petrol';
        renderHistoryForInfo('Petrol');

    } catch (err) {
        console.error(err);
        lastUpdated.innerHTML = "⚠️ Unable to load data";
    }
}

// ── Filter data by days ──
function filterData(history, days) {
    if (days === 'all' || days === 0) return history;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return history.filter(item => {
        const parts = item.date.split('-');
        const itemDate = new Date(parts[0], parts[1] - 1, parts[2]);
        return itemDate >= cutoff;
    });
}

// ── Format date ──
function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

// ── Draw Chart for Info Page ──
function drawInfoChart(canvasId, labels, prices, color = '#2e7d32') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.parentElement.getBoundingClientRect();
    const width = canvas.parentElement.clientWidth - 24;
    const height = 200;
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const w = canvas.width;
    const h = canvas.height;
    const pad = { top: 30, bottom: 40, left: 40, right: 20 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    if (!labels || labels.length < 2) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📊 Not enough data', w / 2, h / 2);
        return;
    }

    const minPrice = Math.min(...prices) * 0.95;
    const maxPrice = Math.max(...prices) * 1.05;
    const range = maxPrice - minPrice || 1;

    const getX = (i) => pad.left + (i / (labels.length - 1)) * chartW;
    const getY = (price) => pad.top + chartH - ((price - minPrice) / range) * chartH;

    // Grid lines
    ctx.strokeStyle = '#e9edf2';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i <= 4; i++) {
        const y = pad.top + (i / 4) * chartH;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
        const priceVal = maxPrice - (i / 4) * range;
        ctx.fillStyle = '#64748b';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('₹' + priceVal.toFixed(0), pad.left - 8, y);
    }
    ctx.setLineDash([]);

    // Area fill
    ctx.beginPath();
    for (let i = 0; i < prices.length; i++) {
        const x = getX(i);
        const y = getY(prices[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    const lastX = getX(prices.length - 1);
    const firstX = getX(0);
    ctx.lineTo(lastX, pad.top + chartH);
    ctx.lineTo(firstX, pad.top + chartH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, color + '05');
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (let i = 0; i < prices.length; i++) {
        const x = getX(i);
        const y = getY(prices[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Points & labels
    for (let i = 0; i < prices.length; i++) {
        const x = getX(i);
        const y = getY(prices[i]);

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (i % Math.ceil(labels.length / 8) === 0 || i === labels.length - 1) {
            ctx.fillStyle = '#0f2b1f';
            ctx.font = 'bold 18px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText('₹' + prices[i].toFixed(0), x, y - 10);
        }

        if (i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1) {
            ctx.fillStyle = '#64748b';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            const dateStr = labels[i];
            const displayDate = dateStr.length > 10 ? dateStr.slice(0, 10) : dateStr;
            ctx.fillText(displayDate, x, pad.top + chartH + 6);
        }
    }
}

// ── Render history for info page ──
function renderHistoryForInfo(key) {
    const history = fullHistoryData[key] || [];
    if (!history || history.length === 0) {
        document.getElementById('infoHistoryTable').innerHTML = 
            '<tr><td colspan="2" style="text-align:center;color:#7a8f9f;padding:20px;">No data for ' + key + '</td></tr>';
        return;
    }

    history.sort((a, b) => new Date(a.date) - new Date(b.date));
    const filtered = filterData(history, currentRange);
    
    if (filtered.length === 0) {
        document.getElementById('infoHistoryTable').innerHTML = 
            '<tr><td colspan="2" style="text-align:center;color:#7a8f9f;padding:20px;">No data in this range</td></tr>';
        return;
    }

    const dates = filtered.map(item => item.date);
    const prices = filtered.map(item => item.price);
    const latestPrice = prices[prices.length - 1];
    const latestDate = dates[dates.length - 1];
    const yesterdayPrice = prices.length > 1 ? prices[prices.length - 2] : latestPrice;
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Update stats
    document.getElementById('infoTodayPrice').textContent = '₹' + latestPrice.toFixed(2);
    document.getElementById('infoYesterdayPrice').textContent = '₹' + yesterdayPrice.toFixed(2);
    document.getElementById('infoHighestPrice').textContent = '₹' + highestPrice.toFixed(2);
    document.getElementById('infoLowestPrice').textContent = '₹' + lowestPrice.toFixed(2);
    document.getElementById('infoAveragePrice').textContent = '₹' + averagePrice.toFixed(2);

    // Update table
    const tbody = document.getElementById('infoHistoryTable');
    tbody.innerHTML = '';
    const reversed = [...filtered].reverse();
    reversed.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${formatDate(item.date)}</td><td>₹${item.price.toFixed(2)}</td>`;
        tbody.appendChild(tr);
    });

    // Draw chart
    drawInfoChart('infoPriceChart', dates, prices);
}

// ── Filter button handlers ──
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const range = this.dataset.range;
        currentRange = range === 'all' ? 0 : parseInt(range);
        if (currentHistoryKey) {
            renderHistoryForInfo(currentHistoryKey);
        }
    });
});

// ── CARD CLICK EVENTS (update history on click) ──
document.getElementById("petrolCard").onclick = () => {
    currentHistoryKey = 'Petrol';
    renderHistoryForInfo('Petrol');
    location.href = "history.html?vegetable=Petrol";
};

document.getElementById("dieselCard").onclick = () => {
    currentHistoryKey = 'Diesel';
    renderHistoryForInfo('Diesel');
    location.href = "history.html?vegetable=Diesel";
};

document.getElementById("cngCard").onclick = () => {
    currentHistoryKey = 'CNG';
    renderHistoryForInfo('CNG');
    location.href = "history.html?vegetable=CNG";
};

document.getElementById("autogasCard").onclick = () => {
    currentHistoryKey = 'Auto Gas';
    renderHistoryForInfo('Auto Gas');
    location.href = "history.html?vegetable=Auto Gas";
};

document.getElementById("lpgCard").onclick = () => {
    currentHistoryKey = 'LPG';
    renderHistoryForInfo('LPG');
    location.href = "history.html?vegetable=LPG";
};

document.getElementById("goldCard").onclick = () => {
    currentHistoryKey = 'Gold 24K';
    renderHistoryForInfo('Gold 24K');
    location.href = "history.html?vegetable=Gold 24K";
};

document.getElementById("silverCard").onclick = () => {
    currentHistoryKey = 'Silver';
    renderHistoryForInfo('Silver');
    location.href = "history.html?vegetable=Silver";
};

// ── AUTO REFRESH (5 minutes) ──
setInterval(loadAll, 300000);
