// ===============================
// INITIALIZATION & BACKGROUNDS
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  // These selectors MUST match the class names in your HTML <div> tags
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
  getWeather();
  getNews();
});

// ===============================
// SUPABASE CONFIGURATION
// ===============================
// Enter your details from Supabase Settings > API
const SUPABASE_URL = '';
const SUPABASE_KEY = '';
const supabaseClient = (typeof supabase !== 'undefined') ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ===============================
// GLOBAL VARIABLES & ACTION DATA
// ===============================
let totalPoints = 0;

const actions = {
  rain: [
    { code: "r1", text: "Home Installation", points: 500 },
    { code: "r2", text: "Saving in bottles/tank", points: 350 },
    { code: "r3", text: "Reusing stored water", points: 300 },
    { code: "r7", text: "Awareness in poor localities", points: 750 }
  ],
  solar: [
    { code: "s1", text: "Home installation", points: 300 },
    { code: "s2", text: "Solar help for community", points: 440 },
    { code: "s5", text: "Reduced electricity via solar", points: 200 }
  ],
  eco: [
    { code: "e1", text: "Picked digital dump", points: 150 },
    { code: "e4", text: "Social media movement", points: 500 },
    { code: "e5", text: "Educated poor", points: 650 }
  ],
  climate: [
    { code: "c1", text: "Reduced AC usage", points: 120 },
    { code: "c2", text: "Planted 5+ trees", points: 600 }
  ],
  electricity: [
    { code: "ec1", text: "Switched to LED", points: 250 },
    { code: "ec3", text: "Reduced 20%+ consumption", points: 400 }
  ],
  forest: [
    { code: "rf1", text: "Planted native trees", points: 500 },
    { code: "rf3", text: "Protected saplings 6+ months", points: 700 }
  ]
};

// ===============================
// CONTRIBUTION SYSTEM
// ===============================
function openContributionPanel(category) {
  const select = document.getElementById("actionSelect");
  if (!select) return;

  select.innerHTML = "";
  if (!actions[category]) {
    // Default if no category passed
    Object.values(actions).flat().forEach(action => {
      const option = document.createElement("option");
      option.value = action.code;
      option.textContent = `${action.text} (+${action.points} pts)`;
      select.appendChild(option);
    });
  } else {
    actions[category].forEach(action => {
      const option = document.createElement("option");
      option.value = action.code;
      option.textContent = `${action.text} (+${action.points} pts)`;
      select.appendChild(option);
    });
  }
  document.getElementById("contributionPanel").style.display = "block";
}

function closeContributionPanel() {
  document.getElementById("contributionPanel").style.display = "none";
}

function submitContribution() {
  const actionCode = document.getElementById("actionSelect").value;
  const fileInput = document.getElementById("proofUpload");
  const proofUploaded = fileInput && fileInput.files.length > 0;

  if (!proofUploaded) {
    alert("Please upload proof (image/video).");
    return;
  }

  let selectedAction = null;
  Object.values(actions).forEach(category => {
    category.forEach(action => {
      if (action.code === actionCode) selectedAction = action;
    });
  });

  if (selectedAction) {
    totalPoints += selectedAction.points;
    document.getElementById("points").innerText = totalPoints;
    document.getElementById("badge").innerText = getBadge(totalPoints);
    alert(`Contribution Added: ${selectedAction.text} (+${selectedAction.points} pts)`);
    closeContributionPanel();
  }
}

// ===============================
// SUGGESTIONS & INFO
// ===============================
const suggestions = {
  rain: "Install rooftop harvesting systems and promote water conservation.",
  solar: "Switch to rooftop solar and reduce grid dependency.",
  eco: "Reduce waste and promote eco awareness.",
  climate: "Plant trees and reduce AC usage.",
  electricity: "Use LED bulbs and reduce power consumption.",
  forest: "Plant native species and protect saplings."
};

function openSuggestions(category) {
  document.getElementById("suggestionText").innerText = suggestions[category] || "No suggestions available.";
  document.getElementById("suggestionPanel").style.display = "block";
}

function closeSuggestions() {
  document.getElementById("suggestionPanel").style.display = "none";
}

function showInfo() {
  document.getElementById("infoModal").style.display = "block";
  document.getElementById("infoText").innerHTML = `
        <p>This AI platform helps campus students track their environmental footprint.</p>
        <ul>
            <li>Earn points for green actions</li>
            <li>Monitor real-time weather and news</li>
            <li>Get AI-driven sustainability advice</li>
        </ul>
    `;
}

function closeInfo() {
  document.getElementById("infoModal").style.display = "none";
}

// ===============================
// AUTHENTICATION (SUPABASE)
// ===============================
function showAuth(type) {
  const modal = document.getElementById('auth-modal');
  document.getElementById('auth-title').innerText = type === 'signup' ? 'Create Account' : 'Sign In';
  modal.style.display = 'block';

  document.getElementById('auth-submit').onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!supabaseClient) return alert("Please configure Supabase URL and Key first!");

    if (type === 'signup') {
      const { error } = await supabaseClient.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Success! Check your email for confirmation.");
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else {
        alert("Welcome back!");
        modal.style.display = 'none';
      }
    }
  };
}

// ===============================
// WEATHER & NEWS (ENV AWARE)
// ===============================
function getBaseUrl() {
  return window.location.hostname === "localhost" ? "http://localhost:3000" : "";
}

async function getWeather(city = "Delhi") {
  try {
    const response = await fetch(`${getBaseUrl()}/weather?city=${city}`);
    const data = await response.json();
    document.getElementById("weather").innerHTML = `📍 ${data.name} | 🌡 ${data.main.temp}°C | 🌤 ${data.weather[0].description}`;
  } catch {
    document.getElementById("weather").innerText = "Weather unavailable.";
  }
}

async function getNews(city = "India") {
  try {
    const response = await fetch(`${getBaseUrl()}/news?city=${city}`);
    const data = await response.json();
    const container = document.getElementById("news");
    container.innerHTML = "";
    data.results.slice(0, 3).forEach(article => {
      container.innerHTML += `<div class="news-article"><h4>${article.title}</h4></div>`;
    });
  } catch {
    document.getElementById("news").innerText = "News unavailable.";
  }
}

// ===============================
// AI FUNCTION (The Logic You Asked For)
// ===============================
async function askAI() {
  const promptInput = document.getElementById("prompt");
  const responseDiv = document.getElementById("response");
  const query = promptInput.value;

  if (!query) return alert("Please enter a question!");

  responseDiv.innerText = "Processing with Sustainability AI...";

  try {
    // This targets your Vercel/Localhost API endpoint
    const response = await fetch(`${getBaseUrl()}/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: query })
    });

    const data = await response.json();
    responseDiv.innerText = data.reply || "AI is resting. Try again later!";
  } catch (err) {
    // Fallback: If you haven't built the AI backend yet, show a smart response
    setTimeout(() => {
      responseDiv.innerText = `To optimize ${query}, try reducing energy waste and using renewable sources. (Backend connection pending)`;
    }, 1000);
  }
}

// ===============================
// UTILITIES (Time, Badges, Video)
// ===============================
function updateTime() {
  const now = new Date();
  document.getElementById("clock").innerText = now.toLocaleTimeString();
  document.getElementById("date").innerText = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateTime, 1000);

function getBadge(points) {
  if (points >= 15000) return "Legend 🌍";
  if (points >= 7000) return "Guardian 🌱";
  if (points >= 3000) return "Warrior ♻️";
  if (points >= 1000) return "Starter 🌿";
  return "Beginner";
}

function openVideo() {
  document.getElementById("videoModal").style.display = "block";
}

function closeVideo() {
  const videoModal = document.getElementById("videoModal");
  const videoElement = document.getElementById("sustainabilityVideo");
  videoModal.style.display = "none";
  if (videoElement) videoElement.pause();
}