// ==============================
// HISTORY PAGE
// ==============================

const BASE =
"https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/data/";

const params = new URLSearchParams(window.location.search);
const type = params.get("type") || "petrol";

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

document.getElementById("pageTitle").textContent =
type.charAt(0).toUpperCase() +
type.slice(1) +
" History";

document.getElementById("backBtn").onclick =
()=>history.back();

window.addEventListener("DOMContentLoaded",loadHistory);

async function loadHistory(){

    try{

        const response = await fetch(historyURL,{
            cache:"no-store"
        });

        const data = await response.json();

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

                case "autogas":
                    value = item.autogas?.Panjim ?? 0;
                    break;

                case "cng":
                    value = item.cng?.Panjim ?? 0;
                    break;

                case "lpg":
                    value = item.panjim ??
                            item.average ?? 0;
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

        drawChart(labels,values);
        fillStats(values,labels);
        fillTable(labels,values);

    }catch(err){

        console.error(err);

    }

}

// ==============================
// SVG GRAPH
// ==============================

function drawChart(labels,values){
        const grid = document.getElementById("gridLines");
    const area = document.getElementById("areaPath");
    const line = document.getElementById("linePath");
    const points = document.getElementById("pointGroup");
    const xLabels = document.getElementById("xLabels");
    const yLabels = document.getElementById("yLabels");

    grid.innerHTML = "";
    points.innerHTML = "";
    xLabels.innerHTML = "";
    yLabels.innerHTML = "";

    const WIDTH = 360;
    const HEIGHT = 220;

    const LEFT = 45;
    const RIGHT = 20;
    const TOP = 20;
    const BOTTOM = 35;

    const graphWidth = WIDTH - LEFT - RIGHT;
    const graphHeight = HEIGHT - TOP - BOTTOM;

    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = (max - min) || 1;

    for(let i=0;i<=4;i++){

        const y = TOP + graphHeight*i/4;

        grid.innerHTML += `
        <line
            x1="${LEFT}"
            y1="${y}"
            x2="${WIDTH-RIGHT}"
            y2="${y}">
        </line>`;

        const price =
        (max - range*i/4).toFixed(2);

        yLabels.innerHTML += `
        <text
            x="5"
            y="${y+4}">
            ₹${price}
        </text>`;
    }

    let linePath = "";
    let areaPath = "";

    values.forEach((value,index)=>{

        const x =
        LEFT +
        graphWidth *
        (labels.length==1 ? 0 : index/(labels.length-1));

        const y =
        TOP +
        graphHeight -
        ((value-min)/range)*graphHeight;

        if(index===0){

            linePath += `M ${x} ${y}`;

            areaPath += `M ${x} ${HEIGHT-BOTTOM}`;
            areaPath += ` L ${x} ${y}`;

        }else{

            linePath += ` L ${x} ${y}`;
            areaPath += ` L ${x} ${y}`;

        }

        points.innerHTML += `
        <circle
            cx="${x}"
            cy="${y}"
            r="4">
        </circle>`;

        xLabels.innerHTML += `
        <text
            x="${x}"
            y="${HEIGHT-8}"
            text-anchor="middle">
            ${labels[index].substring(5)}
        </text>`;

    });

    areaPath += ` L ${LEFT+graphWidth} ${HEIGHT-BOTTOM}`;
    areaPath += " Z";

    line.setAttribute("d",linePath);
    area.setAttribute("d",areaPath);

}

// ==============================
// STATISTICS
// ==============================

function fillStats(values, labels){

    if(values.length===0) return;

    const today = values[values.length-1];
    const yesterday =
        values.length>1
        ? values[values.length-2]
        : today;

    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    const average =
        values.reduce((a,b)=>a+b,0)/values.length;

    const diff = today - yesterday;

    const percent =
        yesterday
        ? (diff/yesterday)*100
        : 0;

    document.getElementById("todayPrice").textContent =
        "₹"+today.toFixed(2);

    document.getElementById("todayPriceStat").textContent =
        "₹"+today.toFixed(2);

    document.getElementById("yesterdayPrice").textContent =
        "₹"+yesterday.toFixed(2);

    document.getElementById("highestPrice").textContent =
        "₹"+highest.toFixed(2);

    document.getElementById("lowestPrice").textContent =
        "₹"+lowest.toFixed(2);

    document.getElementById("averagePrice").textContent =
        "₹"+average.toFixed(2);

    document.getElementById("updatedDate").textContent =
        "Updated: " + labels[labels.length-1];

    const trendIcon =
        document.getElementById("trendIcon");

    const trendTitle =
        document.getElementById("trendTitle");

    const trendValue =
        document.getElementById("trendValue");

    if(diff>0){

        trendIcon.textContent = "🟢";

        trendTitle.textContent =
            "Price Increased";

        trendTitle.className =
            "trend-up";

        trendValue.className =
            "trend-up";

    }
    else if(diff<0){

        trendIcon.textContent = "🔴";

        trendTitle.textContent =
            "Price Decreased";

        trendTitle.className =
            "trend-down";

        trendValue.className =
            "trend-down";

    }
    else{

        trendIcon.textContent = "🔵";

        trendTitle.textContent =
            "No Change";

        trendTitle.className =
            "trend-same";

        trendValue.className =
            "trend-same";

    }

    trendValue.textContent =
        `${diff>=0?"+":""}₹${diff.toFixed(2)} (${percent.toFixed(2)}%)`;

}

// ==============================
// HISTORY TABLE
// ==============================

function fillTable(labels, values){

    const tbody =
    document.getElementById("historyTable");

    tbody.innerHTML = "";

    for(let i=values.length-1;i>=0;i--){

        const row =
        document.createElement("tr");

        const date =
        document.createElement("td");

        const price =
        document.createElement("td");

        date.textContent = labels[i];

        price.textContent =
        "₹"+values[i].toFixed(2);

        row.appendChild(date);
        row.appendChild(price);

        tbody.appendChild(row);

    }

}
