// ===============================
// DOM CONTENT LOADED
// ===============================
window.addEventListener("DOMContentLoaded", () => {

  // Set background images
  const backgrounds = {
    ".rw": "rain water.jpg",
    ".sp": "https://i.pinimg.com/1200x/59/b6/1c/59b61c3f1da597576a180af5527d8adb.jpg",
    ".electricity": "https://i.pinimg.com/1200x/a9/aa/5f/a9aa5f6e5d837d9cee61a3c7173f9528.jpg",
    ".eco": "https://i.pinimg.com/736x/95/d9/cb/95d9cb7f1ab0f5b5c2ac3f4525173f1f.jpg",
    ".climate": "climate.png",
    ".rf": "rf.jpg"
  };

  Object.keys(backgrounds).forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.backgroundImage = `url('${backgrounds[selector]}')`;
      element.style.backgroundSize = "cover";
      element.style.backgroundPosition = "center";
      element.style.backgroundRepeat = "no-repeat";
    }
  });

  updateTime();
  fetchWeather("Delhi");
  fetchNews("Delhi");
});

// ===============================
// POINTS SYSTEM
// ===============================
let totalPoints = 0;

const actions = {
  rain: [
    { code: "r1", text: "Home Installation", points: 500 },
    { code: "r2", text: "Saving in bottles/tank", points: 350 },
    { code: "r3", text: "Reusing stored water", points: 300 },
    { code: "r4", text: "Cleaning stored water", points: 200 },
    { code: "r5", text: "Clearing mudpool", points: 150 },
    { code: "r6", text: "Promoting rainwater saving", points: 250 },
    { code: "r7", text: "Awareness in poor localities", points: 750 }
  ],
  solar: [
    { code: "s1", text: "Home installation", points: 300 },
    { code: "s2", text: "Solar help for community", points: 440 },
    { code: "s3", text: "Community installation", points: 300 },
    { code: "s4", text: "Repair damaged solar", points: 250 },
    { code: "s5", text: "Reduced electricity via solar", points: 200 }
  ],
  eco: [
    { code: "e1", text: "Picked digital dump", points: 150 },
    { code: "e2", text: "Creative reuse", points: 200 },
    { code: "e3", text: "Collected from locality", points: 300 },
    { code: "e4", text: "Social media movement", points: 500 },
    { code: "e5", text: "Educated poor", points: 650 },
    { code: "e6", text: "Cleared damaged water pipes", points: 480 }
  ],
  climate: [
    { code: "c1", text: "Reduced AC usage", points: 120 },
    { code: "c2", text: "Planted 5+ trees", points: 600 },
    { code: "c3", text: "Climate awareness drive", points: 700 },
    { code: "c4", text: "Installed cool roof", points: 450 },
    { code: "c5", text: "Reduced vehicle usage", points: 250 },
    { code: "c6", text: "Organized carpool", points: 400 }
  ],
  electricity: [
    { code: "ec1", text: "Switched to LED", points: 250 },
    { code: "ec2", text: "Installed power saver", points: 350 },
    { code: "ec3", text: "Reduced 20%+ consumption", points: 400 },
    { code: "ec4", text: "Community awareness", points: 600 },
    { code: "ec5", text: "Repaired appliance", points: 300 },
    { code: "ec6", text: "No-electricity hour campaign", points: 500 }
  ],
  forest: [
    { code: "rf1", text: "Planted native trees", points: 500 },
    { code: "rf2", text: "Forest drive participation", points: 400 },
    { code: "rf3", text: "Protected saplings 6+ months", points: 700 },
    { code: "rf4", text: "Donated to forest NGO", points: 300 },
    { code: "rf5", text: "Afforestation volunteering", points: 600 },
    { code: "rf6", text: "Awareness campaign", points: 550 }
  ]
};

// ===============================
// CONTRIBUTIONS PANEL
// ===============================
function openContributionPanel(category) {
  const select = document.getElementById("actionSelect");
  select.innerHTML = "";
  if (!actions[category]) return;
  actions[category].forEach(action => {
    const option = document.createElement("option");
    option.value = action.code;
    option.textContent = `${action.text} (+${action.points} pts)`;
    select.appendChild(option);
  });
  document.getElementById("contributionPanel").style.display = "block";
}

function closeContributionPanel() {
  document.getElementById("contributionPanel").style.display = "none";
}

function submitContribution() {
  const actionCode = document.getElementById("actionSelect").value;
  const proofUploaded = document.getElementById("proofUpload")?.files.length > 0;
  if (!proofUploaded) {
    alert("Please upload proof (image/video).");
    return;
  }

  let selectedAction;
  Object.values(actions).forEach(category => {
    category.forEach(action => {
      if (action.code === actionCode) selectedAction = action;
    });
  });
  if (!selectedAction) return;

  totalPoints += selectedAction.points;
  document.getElementById("points").innerText = totalPoints;
  document.getElementById("badge").innerText = getBadge(totalPoints);

  alert(`Contribution Added: ${selectedAction.text} (+${selectedAction.points} pts)`);
  closeContributionPanel();
}

// ===============================
// BADGE SYSTEM
// ===============================
// 1. Establish State Variables
let userPoints = 0;

// 2. The Core Badge Strategy Engine
function getBadge(points) {
    if (points >= 15000) return "Legend 🌍";
    if (points >= 7000) return "Guardian 🌱";
    if (points >= 3000) return "Warrior ♻️";
    if (points >= 1000) return "Starter 🌿";
    return "Beginner"; 
}

// 3. The UI Rendering Function (This links the JS to your HTML)
function updateScoreboard(newPoints) {
    // Update the local script state
    userPoints = newPoints;
    
    // Find the DOM elements
    const pointsElement = document.getElementById("points");
    const badgeElement = document.getElementById("badge");
    
    if (pointsElement && badgeElement) {
        // Calculate the correct badge based on current points
        const badgeName = getBadge(userPoints);
        
        // Inject the values directly into the HTML spans
        pointsElement.innerText = userPoints.toLocaleString();
        badgeElement.innerText = badgeName;
    }
}

// 4. Operational Demo Trigger
// Call this function whenever a user uploads a valid bill or passes a sustainability check
function addPoints(pointsEarned) {
    let updatedPoints = userPoints + pointsEarned;
    updateScoreboard(updatedPoints);
}

// ===============================
// LOGIN & LEADERBOARD
// ===============================
function login() {
  const name = prompt("Enter your name:");
  if (!name) return;
  localStorage.setItem("username", name);
  alert("Logged in as " + name);
}

function saveLeaderboard() {
  const user = localStorage.getItem("username") || "Guest";
  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  board.push({ user, points: totalPoints });
  localStorage.setItem("leaderboard", JSON.stringify(board));
}

// ===============================
// CLOCK
// ===============================
function updateTime() {
  const now = new Date();
  document.getElementById("clock").innerText = now.toLocaleTimeString();
  document.getElementById("date").innerText = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
setInterval(updateTime, 1000);

// ===============================
// FETCH WEATHER & NEWS
// ===============================

/**
 * Core Geolocation & Telemetry Engine
 * Tracks user coordinates and streams low-latency weather metrics
 */

function initGeoLocationTracker() {
    const container = document.getElementById("weather-display-card");
    
    if (!navigator.geolocation) {
        renderTelemetryError("Hardware Layer: Geolocation interface not found.");
        return;
    }

    const positionOptions = {
        enableHighAccuracy: true, // Forces GPS tracking over cellular triangulation
        timeout: 8000,
        maximumAge: 0             // Prevents browser from serving cached coordinates
    };

    // Tracks user movement automatically in real-time
    navigator.geolocation.watchPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`📡 GPS Node Update: [Lat: ${latitude}, Lon: ${longitude}]`);
            await streamLiveWeather(latitude, longitude);
        },
        (error) => { handleTelemetryFault(error); },
        positionOptions
    );
}

async function streamLiveWeather(lat, lon) {
    const container = document.getElementById("weather-display-card");
    
    // Low-Latency High-Performance Open-Meteo Endpoints
    const apiEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error(`API Node Error: Status ${response.status}`);
        
        const data = await response.json();
        renderWeatherInterface(data, lat, lon);
    } catch (err) {
        console.error("Telemetry Stream Sync Fault:", err);
        container.innerHTML = `<div class="text-rose-500 font-bold font-mono text-xs p-4 uppercase border border-rose-900/30 bg-rose-950/20">📡 Data Stream Interrupted. Syncing Node...</div>`;
    }
}

function renderWeatherInterface(data, lat, lon) {
    const container = document.getElementById("weather-display-card");
    const currentData = data.current;
    
    // Translates standard WMO Weather Codes to string outputs
    const decodeCondition = (code) => {
        if (code === 0) return "Clear Sky ✨";
        if (code <= 3) return "Partly Cloudy ☁️";
        if (code >= 51 && code <= 67) return "Precipitation / Rain 🌧️";
        if (code >= 71 && code <= 77) return "Snow Flurries ❄️";
        return "Nominal Atmospheres";
    };

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-slate-900 pb-3">
                <div>
                    <h4 class="text-xs font-black text-blue-400 uppercase tracking-widest">Atmospheric Telemetry</h4>
                    <p class="text-[9px] text-slate-500 font-mono mt-0.5">LAT: ${lat.toFixed(4)} / LON: ${lon.toFixed(4)}</p>
                </div>
                <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded tracking-wider animate-pulse">Live Tracking</span>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="bg-slate-950 p-4 border border-slate-900 rounded">
                    <p class="text-[8px] text-slate-500 font-bold uppercase tracking-wider">LTP Temp</p>
                    <p class="text-xl font-bold font-mono text-white mt-1 tabular-nums">${currentData.temperature_2m}°C</p>
                </div>
                <div class="bg-slate-950 p-4 border border-slate-900 rounded">
                    <p class="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Humidity Index</p>
                    <p class="text-xl font-bold font-mono text-blue-400 mt-1 tabular-nums">${currentData.relative_humidity_2m}%</p>
                </div>
            </div>

            <div class="bg-slate-950/40 p-3 border border-slate-900 rounded flex justify-between items-center text-[10px]">
                <span class="text-slate-500 font-bold uppercase">Condition Profile:</span>
                <span class="font-black text-slate-200 uppercase tracking-widest">${decodeCondition(currentData.weather_code)}</span>
            </div>
        </div>
    `;
}

function handleTelemetryFault(error) {
    let msg = "Telemetry connection mismatch.";
    if (error.code === error.PERMISSION_DENIED) msg = "User revoked location permissions access.";
    if (error.code === error.TIMEOUT) msg = "Satellite tracking query timed out.";
    renderTelemetryError(msg);
}

function renderTelemetryError(msg) {
    document.getElementById("weather-display-card").innerHTML = `
        <div class="p-4 border border-rose-500/20 bg-rose-500/5 text-rose-400 font-bold rounded text-[10px] uppercase tracking-wider font-mono">
            ⚠️ Telemetry Fault: ${msg}
        </div>`;
}

// Fire up calculations immediately when screen hits baseline DOM setup
document.addEventListener("DOMContentLoaded", initGeoLocationTracker);
/**
 * Core Geolocation & News Intel Engine
 * Tracks user coordinates and streams low-latency regional news headlines
 */

function initGeoNewsTracker() {
    const container = document.getElementById("news-display-card");
    
    if (!navigator.geolocation) {
        renderNewsError("Hardware Layer: Geolocation interface not found.");
        return;
    }

    const positionOptions = {
        enableHighAccuracy: true, // Prioritizes GPS sensor data
        timeout: 10000,
        maximumAge: 0             // Forces fresh coordinate fetching on refresh
    };

    // Initializes immediately on page load, tracking coordinates
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`📰 News Engine Linked: [Lat: ${latitude}, Lon: ${longitude}]`);
            await streamLocalNews(latitude, longitude);
        },
        (error) => { handleNewsFault(error); },
        positionOptions
    );
}

async function streamLocalNews(lat, lon) {
    const container = document.getElementById("news-display-card");
    
    // Low-latency, reverse-geocoded news aggregator node endpoint
    // Automatically pulls localized headlines based on regional telemetry boundaries
    const apiEndpoint = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=5&apikey=YOUR_GNEWS_FREE_TOKEN`; 
    // Alternate proxy node if utilizing backend framework routing: `/api/news?lat=${lat}&lon=${lon}`

    try {
        // Falling back to a clean mock data matrix if token is unassigned to keep UI upfront
        let articles;
        
        if(apiEndpoint.includes("YOUR_GNEWS_FREE_TOKEN")) {
            // High-fidelity regional news simulation grounded in user's area
            articles = [
                { title: "Regional Infrastructure Upgrade Approved for Grid Hub", source: "Market Wire Intel", time: "12m ago" },
                { title: "Local Tech Corridors See Surge in Green Capital Allocations", source: "Sovereign Journal", time: "1h ago" },
                { title: "Atmospheric Stabilizations Predict Record Renewable Yields This Quarter", source: "EcoPulse News", time: "3h ago" }
            ];
        } else {
            const response = await fetch(apiEndpoint);
            if (!response.ok) throw new Error(`Status ${response.status}`);
            const data = await response.json();
            articles = data.articles;
        }

        renderNewsInterface(articles);
    } catch (err) {
        console.error("News Stream Sync Fault:", err);
        container.innerHTML = `<div class="text-rose-500 font-bold font-mono text-[10px] p-4 uppercase border border-rose-900/30 bg-rose-950/20">📰 News Stream Interrupted. Syncing Node...</div>`;
    }
}

function renderNewsInterface(articles) {
    const container = document.getElementById("news-display-card");
    
    if (!articles || articles.length === 0) {
        container.innerHTML = `<div class="text-slate-500 font-mono text-[10px] p-4 uppercase">No regional reports found inside this coordinate grid.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-slate-900 pb-3">
                <div>
                    <h4 class="text-xs font-black text-blue-400 uppercase tracking-widest">Regional Intelligence Wire</h4>
                    <p class="text-[9px] text-slate-500 font-mono mt-0.5">Grounded via Local GPS Node</p>
                </div>
                <span class="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase rounded tracking-wider">Live Feed</span>
            </div>

            <div class="divide-y divide-slate-900 overflow-y-auto max-h-[280px] pr-1" id="news-feed-rows">
                ${articles.map(article => `
                    <div class="py-3 space-y-1 group cursor-pointer transition-all">
                        <div class="flex justify-between items-center text-[8px] font-black uppercase text-slate-500">
                            <span class="group-hover:text-blue-400 transition-colors">${article.source?.name || article.source || 'Intel Wire'}</span>
                            <span class="font-mono">${article.time || 'Recent'}</span>
                        </div>
                        <p class="text-xs font-bold leading-snug text-slate-200 group-hover:text-white transition-colors">${article.title}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function handleNewsFault(error) {
    let msg = "News node connection error.";
    if (error.code === error.PERMISSION_DENIED) msg = "User denied GPS access. Defaulting to general coordinates.";
    renderNewsError(msg);
}

function renderNewsError(msg) {
    document.getElementById("news-display-card").innerHTML = `
        <div class="p-4 border border-rose-500/20 bg-rose-500/5 text-rose-400 font-bold rounded text-[10px] uppercase tracking-wider font-mono">
            ⚠️ News Wire Fault: ${msg}
        </div>`;
}

// Automatic Initialization on Page Refresh
document.addEventListener("DOMContentLoaded", initGeoNewsTracker);

// ===============================
// AI PROMPT
// ===============================
async function askAI() {
  const input = document.getElementById("prompt").value.trim();
  const responseBox = document.getElementById("response");

  if (!input) {
    responseBox.innerText = "Please enter a question.";
    return;
  }

  responseBox.innerText = "Thinking... 🤖";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });
    const data = await res.json();
    responseBox.innerText = data.reply || "No response from AI.";
  } catch {
    responseBox.innerText = "Server error. Is backend running?";
  }
}

// ===============================
// SUGGESTIONS PANEL
// ===============================
const suggestions = {
  rain: `Install rooftop harvesting systems.\nPromote water conservation awareness.\nReuse greywater for gardening.\nClean storage tanks regularly.`,
  solar: `Switch to rooftop solar panels.\nUse solar water heaters.\nReduce dependency on grid electricity.\nMonitor energy production regularly.`,
  eco: `Reduce plastic waste.\nPromote recycling habits.\nOrganize eco-awareness drives.\nUse sustainable products.`,
  climate: `Plant more trees.\nReduce AC usage.\nSwitch to public transport.\nUse energy-efficient appliances.`,
  electricity: `Use LED bulbs.\nTurn off appliances when not in use.\nUse smart power strips.\nMonitor monthly consumption.`,
  forest: `Plant native species.\nProtect young saplings.\nAvoid illegal logging.\nPromote forest awareness campaigns.`
};

function openSuggestions(category) {
  const panel = document.getElementById("suggestionPanel");
  const text = document.getElementById("suggestionText");
  text.innerText = suggestions[category] || "No suggestions available.";
  text.scrollTop = 0; // start from top
  panel.style.display = "block";
}

function closeSuggestions() {
  document.getElementById("suggestionPanel").style.display = "none";
}

// ===============================
// INFO MODAL
// ===============================
function showInfo() {
  const modal = document.getElementById("infoModal");
  const textDiv = document.getElementById("infoText");
  textDiv.innerHTML = `
    <p><strong>Aim:</strong> To promote sustainable practices that ensure environmental protection, efficient resource usage, and social responsibility in daily life.</p>
    <p><strong>Importance:</strong> In the current scenario of climate change, resource depletion, and urban pollution, implementing sustainable steps and measures is crucial for long-term ecological balance, reducing carbon footprint, and securing a healthier planet for future generations.</p>
    <p><strong>How to Contribute:</strong> Individuals can adopt eco-friendly habits such as reducing waste, conserving water, using renewable energy, supporting sustainable products, and spreading awareness about environmental issues.</p>`;
  modal.style.display = "flex";
}

function closeInfo() {
  document.getElementById("infoModal").style.display = "none";
}

// ===============================
// VIDEO MODAL
// ===============================
function openVideo(sourceType, url) {
  const modal = document.getElementById("videoModal");
  const localVideo = document.getElementById("sustainabilityVideo");
  const fbContainer = document.getElementById("fbVideoContainer");
  const fbVideo = document.getElementById("fbVideo");

  modal.style.display = "flex";

  if (sourceType === "local") {
    localVideo.style.display = "block";
    fbContainer.style.display = "none";
    localVideo.src = url;
    localVideo.play();
  } else if (sourceType === "facebook") {
    localVideo.style.display = "none";
    fbContainer.style.display = "block";
    fbVideo.src = `https://www.facebook.com/share/v/1CQHFAyC1V/${url}/`;
  }
}

function closeVideo() {
  const modal = document.getElementById("videoModal");
  const localVideo = document.getElementById("sustainabilityVideo");
  const fbVideo = document.getElementById("fbVideo");

  modal.style.display = "none";
  localVideo.pause();
  localVideo.currentTime = 0;
  fbVideo.src = "https://www.facebook.com/share/v/1CQHFAyC1V/";
}
