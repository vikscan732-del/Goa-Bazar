// ── Configuration ──
const DATA_URL = "https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/history.json";

// ── Get vegetable name from URL ──
function getVegetableFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('vegetable') || params.get('name') || null;
}

// ── Format date (YYYY-MM-DD -> DD/MM/YYYY) ──
function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

// ── Main load function ──
async function loadHistory() {
    const vegName = getVegetableFromURL();

    if (!vegName) {
        document.getElementById('pageTitle').textContent = 'No Vegetable Selected';
        document.getElementById('todayPrice').textContent = '—';
        document.getElementById('updatedDate').textContent = 'Please go back and select a vegetable.';
        document.querySelector('.summary-right').style.display = 'none';
        document.querySelector('.chartCard').style.display = 'none';
        document.querySelector('.statsGrid').style.display = 'none';
        document.querySelector('.historyTable').style.display = 'none';
        document.querySelectorAll('.sectionTitle').forEach(el => el.style.display = 'none');
        return;
    }

    document.getElementById('pageTitle').textContent = vegName + ' History';

    try {
        const res = await fetch(DATA_URL + '?t=' + Date.now());
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        const data = await res.json();

        console.log('Fetched data:', data);
        console.log('Looking for vegetable:', vegName);

        const history = data[vegName] || [];
        if (!history || history.length === 0) {
            throw new Error('No data for ' + vegName);
        }

        history.sort((a, b) => new Date(a.date) - new Date(b.date));

        const dates = history.map(item => item.date);
        const prices = history.map(item => item.price);
        const latestPrice = prices[prices.length - 1];
        const latestDate = dates[dates.length - 1];
        const yesterdayPrice = prices.length > 1 ? prices[prices.length - 2] : latestPrice;
        const highestPrice = Math.max(...prices);
        const lowestPrice = Math.min(...prices);
        const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

        let trendIcon = '➡️', trendTitle = 'No Change', trendValue = '₹0.00';
        const diff = latestPrice - yesterdayPrice;
        if (diff > 0) {
            trendIcon = '🟢';
            trendTitle = 'Up';
            trendValue = '₹' + diff.toFixed(2);
        } else if (diff < 0) {
            trendIcon = '🔴';
            trendTitle = 'Down';
            trendValue = '₹' + Math.abs(diff).toFixed(2);
        }

        document.getElementById('todayPrice').textContent = '₹' + latestPrice.toFixed(2);
        document.getElementById('updatedDate').textContent = 'Updated: ' + formatDate(latestDate);
        document.getElementById('trendIcon').textContent = trendIcon;
        document.getElementById('trendTitle').textContent = trendTitle;
        document.getElementById('trendValue').textContent = trendValue;

        document.getElementById('todayPriceStat').textContent = '₹' + latestPrice.toFixed(2);
        document.getElementById('yesterdayPrice').textContent = '₹' + yesterdayPrice.toFixed(2);
        document.getElementById('highestPrice').textContent = '₹' + highestPrice.toFixed(2);
        document.getElementById('lowestPrice').textContent = '₹' + lowestPrice.toFixed(2);
        document.getElementById('averagePrice').textContent = '₹' + averagePrice.toFixed(2);

        const tbody = document.getElementById('historyTable');
        tbody.innerHTML = '';
        const reversed = [...history].reverse();
        reversed.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${formatDate(item.date)}</td><td>₹${item.price.toFixed(2)}</td>`;
            tbody.appendChild(tr);
        });

        drawChart(dates, prices);

    } catch (err) {
        console.error('Error loading history:', err);
        document.getElementById('todayPrice').textContent = 'Error';
        document.getElementById('updatedDate').textContent = 'Could not load data for ' + vegName;
        document.querySelector('.summary-right').style.display = 'none';
        document.querySelector('.chartCard').style.display = 'none';
        document.querySelector('.statsGrid').style.display = 'none';
        document.querySelector('.historyTable').style.display = 'none';
        document.querySelectorAll('.sectionTitle').forEach(el => el.style.display = 'none');
    }
}

function drawChart(dates, prices) {
    const svg = document.getElementById('trendChart');
    if (!svg) return;

    const viewBoxWidth = 360, viewBoxHeight = 220;
    const padding = { top: 20, bottom: 30, left: 40, right: 15 };
    const chartWidth = viewBoxWidth - padding.left - padding.right;
    const chartHeight = viewBoxHeight - padding.top - padding.bottom;

    const minPrice = Math.min(...prices) * 0.95;
    const maxPrice = Math.max(...prices) * 1.05;
    const range = maxPrice - minPrice || 1;

    const getX = (i) => padding.left + (i / (prices.length - 1)) * chartWidth;
    const getY = (price) => padding.top + chartHeight - ((price - minPrice) / range) * chartHeight;

    const gridGroup = document.getElementById('gridLines');
    gridGroup.innerHTML = '';
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartHeight;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', padding.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', viewBoxWidth - padding.right);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#e9edf2');
        line.setAttribute('stroke-width', '0.5');
        line.setAttribute('stroke-dasharray', '3,3');
        gridGroup.appendChild(line);
    }

    const yLabelsGroup = document.getElementById('yLabels');
    yLabelsGroup.innerHTML = '';
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartHeight;
        const priceVal = maxPrice - (i / 4) * range;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', padding.left - 6);
        text.setAttribute('y', y + 4);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#6b7a8a');
        text.textContent = '₹' + priceVal.toFixed(0);
        yLabelsGroup.appendChild(text);
    }

    const xLabelsGroup = document.getElementById('xLabels');
    xLabelsGroup.innerHTML = '';
    const step = Math.max(1, Math.floor(dates.length / 6));
    for (let i = 0; i < dates.length; i += step) {
        const x = getX(i);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', viewBoxHeight - 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '9');
        text.setAttribute('fill', '#6b7a8a');
        text.textContent = formatDate(dates[i]);
        xLabelsGroup.appendChild(text);
    }
    const lastX = getX(dates.length - 1);
    const lastText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lastText.setAttribute('x', lastX);
    lastText.setAttribute('y', viewBoxHeight - 4);
    lastText.setAttribute('text-anchor', 'middle');
    lastText.setAttribute('font-size', '9');
    lastText.setAttribute('fill', '#6b7a8a');
    lastText.textContent = formatDate(dates[dates.length - 1]);
    xLabelsGroup.appendChild(lastText);

    let pathD = '';
    let areaD = '';
    for (let i = 0; i < prices.length; i++) {
        const x = getX(i);
        const y = getY(prices[i]);
        if (i === 0) {
            pathD += `M ${x} ${y}`;
            areaD += `M ${x} ${y}`;
        } else {
            pathD += ` L ${x} ${y}`;
            areaD += ` L ${x} ${y}`;
        }
    }
    const lastXArea = getX(prices.length - 1);
    const firstXArea = getX(0);
    areaD += ` L ${lastXArea} ${padding.top + chartHeight}`;
    areaD += ` L ${firstXArea} ${padding.top + chartHeight} Z`;

    document.getElementById('linePath').setAttribute('d', pathD);
    document.getElementById('areaPath').setAttribute('d', areaD);

    const pointGroup = document.getElementById('pointGroup');
    pointGroup.innerHTML = '';
    for (let i = 0; i < prices.length; i++) {
        const x = getX(i);
        const y = getY(prices[i]);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '3.5');
        circle.setAttribute('fill', '#198d24');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '1.5');
        pointGroup.appendChild(circle);
    }
}

document.getElementById('backBtn').addEventListener('click', () => {
    window.history.back();
});

document.addEventListener('DOMContentLoaded', loadHistory);
