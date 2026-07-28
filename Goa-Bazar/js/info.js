// =============================
// GOA BAZAR INFO PAGE
// =============================

// CHANGE THIS TO YOUR RAW GITHUB URL

const BASE =
"https://raw.githubusercontent.com/YOUR_USERNAME/Goa-farmer-help/main/data/";

const weatherURL = BASE + "weather.json";
const fuelURL = BASE + "fuel.json";
const lpgURL = BASE + "lpg.json";
const goldURL = BASE + "gold_silver.json";

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

    }

    catch(e){

        console.log(e);

        document.getElementById("lastUpdated").innerHTML="Unable to load data.";

    }

}

// ================= WEATHER =================

function getWeatherIcon(code){

    if(code===0)
        return "☀️";

    if(code===1 || code===2)
        return "🌤️";

    if(code===3)
        return "☁️";

    if(code===45 || code===48)
        return "🌫️";

    if(code>=51 && code<=67)
        return "🌦️";

    if(code>=71 && code<=77)
        return "❄️";

    if(code>=80 && code<=82)
        return "🌧️";

    if(code>=95)
        return "⛈️";

    return "🌤️";
}

function dayName(date){

    const days=[
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    return days[new Date(date).getDay()];
}

async function loadWeather(){

    const res=await fetch(weatherURL);

    const data=await res.json();

    document.getElementById("lastUpdated").innerHTML=
    "Updated : "+data.updated;

    const box=document.getElementById("weatherCards");

    box.innerHTML="";

    data.forecast.forEach(day=>{

        box.innerHTML+=`

        <div class="weatherCard">

            <div style="font-size:42px">
                ${getWeatherIcon(day.weather_code)}
            </div>

            <h3>${dayName(day.date)}</h3>

            <h2>${day.max}°C</h2>

            <p>Min ${day.min}°C</p>

            <small>${day.weather}</small>

        </div>

        `;

    });

}

// ================= FUEL =================

async function loadFuel(){

    const res=await fetch(fuelURL);

    const data=await res.json();

    document.getElementById("petrolPanjim").innerHTML=
    "₹"+data.petrol.Panjim;

    document.getElementById("petrolMargao").innerHTML=
    "₹"+data.petrol.Margao;

    document.getElementById("dieselPanjim").innerHTML=
    "₹"+data.diesel.Panjim;

    document.getElementById("dieselMargao").innerHTML=
    "₹"+data.diesel.Margao;

    document.getElementById("cngPrice").innerHTML=
    "₹"+data.cng.Panjim;

    document.getElementById("autogasPrice").innerHTML=
    "₹"+data.autogas.Panjim;

}

// ================= LPG =================

async function loadLPG(){

    const res=await fetch(lpgURL);

    const data=await res.json();

    document.getElementById("lpgPrice").innerHTML=
    "₹"+data.panjim;

}

// ================= GOLD =================

async function loadGold(){

    const res=await fetch(goldURL);

    const data=await res.json();

    document.getElementById("gold24").innerHTML=
    "₹"+data.gold_24k;

    document.getElementById("gold22").innerHTML=
    "₹"+data.gold_22k;

    document.getElementById("gold21").innerHTML=
    "₹"+data.gold_21k;

    document.getElementById("gold20").innerHTML=
    "₹"+data.gold_20k;

    document.getElementById("gold18").innerHTML=
    "₹"+data.gold_18k;

    document.getElementById("silverPrice").innerHTML=
    "₹"+data.silver;

}
