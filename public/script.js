window.addEventListener("DOMContentLoaded", () => {

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
// GLOBAL VARIABLES
// ===============================
let totalPoints = 0;


// ===============================
// ACTIONS WITH PROPER POINTS
// ===============================
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
// OPEN CONTRIBUTION PANEL
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


// ===============================
// SUBMIT CONTRIBUTION
// ===============================
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
      if (action.code === actionCode) {
        selectedAction = action;
      }
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
function getBadge(points) {
  if (points >= 15000) return "Legend 🌍";
  if (points >= 7000) return "Guardian 🌱";
  if (points >= 3000) return "Warrior ♻️";
  if (points >= 1000) return "Starter 🌿";
  return "Beginner";
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

  document.getElementById("clock").innerText =
    now.toLocaleTimeString();

  document.getElementById("date").innerText =
    now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
}

setInterval(updateTime, 1000);


// ===============================
// WEATHER
// ===============================
async function getWeather(city = "Delhi") {
  try {
    const response = await fetch(`http://localhost:3000/weather?city=${city}`);
    const data = await response.json();

    document.getElementById("weather").innerHTML = `
      📍 ${data.name} <br>
      🌡 ${data.main.temp}°C <br>
      🌤 ${data.weather[0].description}
    `;
  } catch {
    document.getElementById("weather").innerText = "Weather unavailable.";
  }
}


// ===============================
// NEWS
// ===============================
async function getNews(city = "DELHI") {
  try {
    const response = await fetch(`http://localhost:3000/news?city=${city}`);
    const data = await response.json();

    const container = document.getElementById("news");
    container.innerHTML = "";

    if (!data.results) {
      container.innerText = "No news found.";
      return;
    }

    data.results.slice(0, 5).forEach(article => {
      container.innerHTML += `
        <div class="news-article">
          <h3>${article.title}</h3>
          <p>${article.description || ""}</p>
          <a href="${article.link}" target="_blank">Read More</a>
        </div>
      `;
    });

  } catch {
    document.getElementById("news").innerText = "News unavailable.";
  }
}


// ===============================
// SUGGESTIONS
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
  const panel = document.getElementById("suggestionPanel");
  const text = document.getElementById("suggestionText");

  text.innerText = suggestions[category] || "No suggestions available.";
  panel.style.display = "block";
}

function closeSuggestions() {
  document.getElementById("suggestionPanel").style.display = "none";
}


// Replace these with your actual Supabase details
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const supabase = lib.createClient(SUPABASE_URL, SUPABASE_KEY);

const modal = document.getElementById('auth-modal');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authSubmit = document.getElementById('auth-submit');
const authTitle = document.getElementById('auth-title');

function showAuth(type) {
  modal.style.display = 'block';
  authTitle.innerText = type === 'signup' ? 'Create Account' : 'Sign In';

  authSubmit.onclick = async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (type === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Check your email for the confirmation link!");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else {
        alert("Logged in successfully!");
        localStorage.setItem("supabase_token", data.session.access_token);
        modal.style.display = 'none';
      }
    }
  };
}

SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZXNzb2pxcmp3Ymh5dmptd3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTUzMTEsImV4cCI6MjA5MDA3MTMxMX0.NAsKwR3Yl_NdJHCqdx1uMRpOVCiW7Ci8rwqHNLelO1k
