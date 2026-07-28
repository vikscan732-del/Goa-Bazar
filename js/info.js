// ==============================
// GOA BAZAR INFO
// ==============================

// CHANGE THIS TO YOUR BACKEND REPOSITORY

const BASE = "https://raw.githubusercontent.com/vikscan732-del/Goan-farmer-help/main/data/";

const weatherURL = BASE + "weather.json";
const fuelURL = BASE + "fuel.json";
const lpgURL = BASE + "lpg.json";
const goldURL = BASE + "gold_silver.json";

const weatherBox = document.getElementById("weatherCards");
const lastUpdated = document.getElementById("lastUpdated");

document.getElementById("refreshBtn").onclick = loadAll;

loadAll();

async function loadAll(){

    try{

        await Promise.all([
            loadWeather(),
            loadFuel(),
            loadLPG(),
            loadGold()
        ]);

    }catch(err){

        console.error(err);

        lastUpdated.innerHTML = "Unable to load data";

    }

}

// ===============================
// WEATHER
// ===============================

function getIcon(code){

    if(code===0) return "☀️";
    if(code===1 || code===2) return "🌤️";
    if(code===3) return "☁️";
    if(code===45 || code===48) return "🌫️";
    if(code>=51 && code<=67) return "🌦️";
    if(code>=71 && code<=77) return "❄️";
    if(code>=80 && code<=82) return "🌧️";
    if(code>=95) return "⛈️";

    return "🌤️";

}

function dayName(date){

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            weekday:"long"
        }
    );

}

async function loadWeather(){

    const res = await fetch(weatherURL);

    const data = await res.json();

    lastUpdated.innerHTML =
    "Updated : " + data.updated;

    weatherBox.innerHTML = "";

    data.forecast.forEach(day=>{

        weatherBox.innerHTML += `

<div class="weatherCard">

<div style="font-size:42px">
${getIcon(day.weather_code)}
</div>

<h3>${dayName(day.date)}</h3>

<h2>${day.max}°C</h2>

<p>Min ${day.min}°C</p>

<small>${day.weather}</small>

</div>

`;

    });

}

// ===============================
// FUEL
// ===============================

async function loadFuel(){

    const res = await fetch(fuelURL);
    const data = await res.json();

    document.getElementById("petrolPanjim").textContent =
        "₹" + data.petrol.Panjim;

    document.getElementById("petrolMargao").textContent =
        "₹" + data.petrol.Margao;

    document.getElementById("dieselPanjim").textContent =
        "₹" + data.diesel.Panjim;

    document.getElementById("dieselMargao").textContent =
        "₹" + data.diesel.Margao;

    document.getElementById("cngPrice").textContent =
        "₹" + data.cng.Panjim;

    document.getElementById("autogasPrice").textContent =
        "₹" + data.autogas.Panjim;

}

// ===============================
// LPG
// ===============================

async function loadLPG(){

    const res = await fetch(lpgURL);
    const data = await res.json();

    document.getElementById("lpgPrice").textContent =
        "₹" + (data.price || data.panjim);

}

// ===============================
// GOLD & SILVER
// ===============================

async function loadGold(){

    const res = await fetch(goldURL);
    const data = await res.json();

    document.getElementById("gold24").textContent =
        "₹" + data.gold_24k;

    document.getElementById("gold22").textContent =
        "₹" + data.gold_22k;

    document.getElementById("gold21").textContent =
        "₹" + data.gold_21k;

    document.getElementById("gold20").textContent =
        "₹" + data.gold_20k;

    document.getElementById("gold18").textContent =
        "₹" + data.gold_18k;

    document.getElementById("silverPrice").textContent =
        "₹" + data.silver;

}

// ===============================
// CARD CLICK EVENTS
// ===============================

document.getElementById("petrolCard").onclick = () => {
    location.href = "history.html?type=petrol";
};

document.getElementById("dieselCard").onclick = () => {
    location.href = "history.html?type=diesel";
};

document.getElementById("cngCard").onclick = () => {
    location.href = "history.html?type=cng";
};

document.getElementById("autogasCard").onclick = () => {
    location.href = "history.html?type=autogas";
};

document.getElementById("lpgCard").onclick = () => {
    location.href = "history.html?type=lpg";
};

document.getElementById("goldCard").onclick = () => {
    location.href = "history.html?type=gold";
};

document.getElementById("silverCard").onclick = () => {
    location.href = "history.html?type=silver";
};

// ===============================
// AUTO REFRESH
// ===============================

setInterval(loadAll, 300000);
