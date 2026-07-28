// ==============================
// HISTORY PAGE
// ==============================

const BASE =
"https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/data/";

const params = new URLSearchParams(window.location.search);
const type = params.get("type") || "petrol";

// Select correct history file
let historyURL;

switch(type){

    case "gold":
    case "silver":
        historyURL = BASE + "gold_silver-history.json";
        break;

    case "lpg":
        historyURL = BASE + "lpg-history.json";
        break;

    default:
        historyURL = BASE + "fuel-history.json";
}

const title = document.getElementById("pageTitle");
title.innerHTML =
type.charAt(0).toUpperCase() + type.slice(1) + " History";

document.getElementById("backBtn").onclick = () => history.back();

let chart;

loadHistory();

async function loadHistory(){

    const res = await fetch(historyURL);
    const data = await res.json();

    const labels = [];
    const values = [];

    data.forEach(item=>{

        labels.push(item.updated);

        let value = 0;

        switch(type){

            case "petrol":
                value = item.petrol?.Panjim ?? 0;
                break;

            case "diesel":
                value = item.diesel?.Panjim ?? 0;
                break;

            case "cng":
                value = item.cng?.Panjim ?? 0;
                break;

            case "autogas":
                value = item.autogas?.Panjim ?? 0;
                break;

            case "lpg":
                value = item.panjim ?? item.average ?? 0;
                break;

            case "gold":
                value = item.gold_24k ?? 0;
                break;

            case "silver":
                value = item.silver ?? 0;
                break;
        }

        values.push(Number(value));

    });

    drawChart(labels, values);
    fillStats(values);
    fillTable(labels, values);
}

function drawChart(labels, values){

    if(chart) chart.destroy();

    chart = new Chart(document.getElementById("historyChart"),{

        type:"line",

        data:{
            labels:labels,
            datasets:[{
                label:type,
                data:values,
                borderWidth:3,
                tension:.35,
                fill:false
            }]
        },

        options:{
            responsive:true,
            maintainAspectRatio:false
        }

    });

}

// ==============================
// STATISTICS
// ==============================

function fillStats(values){

    if(values.length===0) return;

    const today = values[values.length-1];
    const yesterday = values.length>1 ? values[values.length-2] : today;
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    const average = values.reduce((a,b)=>a+b,0)/values.length;

    document.getElementById("todayPrice").textContent = "₹"+today.toFixed(2);
    document.getElementById("yesterdayPrice").textContent = "₹"+yesterday.toFixed(2);
    document.getElementById("highestPrice").textContent = "₹"+highest.toFixed(2);
    document.getElementById("lowestPrice").textContent = "₹"+lowest.toFixed(2);
    document.getElementById("averagePrice").textContent = "₹"+average.toFixed(2);

}

// ==============================
// HISTORY TABLE
// ==============================

function fillTable(labels, values){

    const tbody = document.getElementById("historyTable");
    tbody.innerHTML = "";

    for(let i=values.length-1;i>=0;i--){

        tbody.innerHTML += `
<tr>
<td>${labels[i]}</td>
<td>₹${values[i].toFixed(2)}</td>
</tr>`;

    }

}
