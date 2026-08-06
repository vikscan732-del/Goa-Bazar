// ==============================
// GOA BAZAR INFO (UPDATED)
// ==============================

// ── USE COMBINED history.json ──
const DATA_URL = "https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/data/history.json";

// ── FALLBACK DATA (used if fetch fails) ──
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

document.getElementById("refreshBtn").onclick = loadAll;
loadAll();

// ── MAIN LOAD ──
async function loadAll() {
    try {
        const res = await fetch(DATA_URL + '?t=' + Date.now());
        if (!res.ok) throw new Error('HTTP error');
        const data = await res.json();

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
        lastUpdated.innerHTML = 'Updated: ' + dateStr + ', ' + timeStr;

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
                diffText = `<br><span class="${diff > 0 ? 'up' : diff < 0 ? 'down' : 'same'}">
                    ${arrow} ${sign}₹${Math.abs(diff).toFixed(2)}
                </span>`;
            }
            return `₹${price.toFixed(2)}${diffText}`;
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
        document.getElementById('lpgPrice').textContent = lpg ? '₹' + lpg.toFixed(2) : '₹--';

        // ── Gold ──
        const goldKeys = ['Gold 24K', 'Gold 22K', 'Gold 21K', 'Gold 20K', 'Gold 18K'];
        const goldIds = ['gold24', 'gold22', 'gold21', 'gold20', 'gold18'];
        goldKeys.forEach((key, i) => {
            const val = getPrice(key);
            document.getElementById(goldIds[i]).textContent = val ? '₹' + Number(val).toLocaleString('en-IN') : '₹--';
        });

        // ── Silver ──
        const silver = getPrice('Silver');
        document.getElementById('silverPrice').textContent = silver ? '₹' + Number(silver).toLocaleString('en-IN') : '₹--';

    } catch (err) {
        console.error(err);
        lastUpdated.innerHTML = "Unable to load data";
    }
}

// ── CARD CLICK EVENTS ──
// These pass the correct key to history.html

document.getElementById("petrolCard").onclick = () => {
    location.href = "history.html?vegetable=Petrol";
};

document.getElementById("dieselCard").onclick = () => {
    location.href = "history.html?vegetable=Diesel";
};

document.getElementById("cngCard").onclick = () => {
    location.href = "history.html?vegetable=CNG";
};

document.getElementById("autogasCard").onclick = () => {
    location.href = "history.html?vegetable=Auto Gas";
};

document.getElementById("lpgCard").onclick = () => {
    location.href = "history.html?vegetable=LPG";
};

document.getElementById("goldCard").onclick = () => {
    location.href = "history.html?vegetable=Gold 24K";
};

document.getElementById("silverCard").onclick = () => {
    location.href = "history.html?vegetable=Silver";
};

// ── AUTO REFRESH (5 minutes) ──
setInterval(loadAll, 300000);
