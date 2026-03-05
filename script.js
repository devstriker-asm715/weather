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
async function fetchWeather(city = "Delhi") {
  try {
    const res = await fetch(`/api/weather?city=${city}`);
    const data = await res.json();
    document.getElementById("weather").innerHTML = `
      📍 ${data.name} <br>
      🌡 ${data.main.temp}°C <br>
      🌤 ${data.weather[0].description}
    `;
  } catch {
    document.getElementById("weather").innerText = "Weather unavailable.";
  }
}

async function fetchNews(city = "Delhi") {
  try {
    const res = await fetch(`/api/news?city=${city}`);
    const data = await res.json();
    const newsContainer = document.getElementById("news");
    newsContainer.innerHTML = "";
    if (!data.results) {
      newsContainer.innerHTML = "No news found.";
      return;
    }
    data.results.slice(0, 5).forEach(article => {
      newsContainer.innerHTML += `
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