// ===============================
// INITIALIZATION & BACKGROUNDS
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  // These selectors MUST match the class names in your HTML <div> tags
  const backgrounds = {
    ".rw": "rain water.jpg",
    ".sp": "solar.jpg",
    ".electricity": "elec.jpg",
    ".eco": "eco.jpg",
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
  const modal = document.getElementById("contributionPanel");
  const select = document.getElementById("actionSelect");
  const brief = document.getElementById("mission-brief");

  if (!modal || !select) return;

  // Smoothly scroll the narrative back to the top if it exists
  if (brief) {
    brief.scrollTop = 0;
  }

  select.innerHTML = "";

  if (actions[category]) {
    actions[category].forEach(action => {
      const option = document.createElement("option");
      option.value = action.code;
      option.textContent = `${action.text} (+${action.points} pts)`;
      select.appendChild(option);
    });
  } else {
    // Fallback: show all actions if no category is picked or "all" is passed
    Object.values(actions).flat().forEach(action => {
      const option = document.createElement("option");
      option.value = action.code;
      option.textContent = `${action.text} (+${action.points} pts)`;
      select.appendChild(option);
    });
  }

  modal.style.display = "block";
}

function closeContributionPanel() {
  const modal = document.getElementById("contributionPanel");
  if (modal) modal.style.display = "none";
}

async function submitContribution() {
  const actionSelect = document.getElementById("actionSelect");
  const fileInput = document.getElementById("proofUpload");
  const user = (await supabaseClient.auth.getUser()).data.user;

  if (!user) {
    alert("Please Sign In to earn points!");
    return;
  }

  if (!fileInput || fileInput.files.length === 0) {
    alert("Please upload proof (image/video).");
    return;
  }

  const actionCode = actionSelect.value;
  let selectedAction = null;

  // Find the action data
  Object.values(actions).forEach(category => {
    category.forEach(action => {
      if (action.code === actionCode) selectedAction = action;
    });
  });

  if (selectedAction) {
    // 1. Update Local Variable
    totalPoints += selectedAction.points;

    // 2. Sync with Supabase Database
    const { error } = await supabaseClient
      .from('profiles')
      .upsert({
        id: user.id,
        points: totalPoints,
        email: user.email,
        badge: getBadge(totalPoints)
      });

    if (error) {
      console.error("Database Sync Error:", error.message);
      alert("Points earned locally, but failed to sync to cloud.");
    } else {
      // 3. Update UI
      document.getElementById("points").innerText = totalPoints;
      document.getElementById("badge").innerText = getBadge(totalPoints);

      alert(`Mission Accomplished! +${selectedAction.points} points saved to your profile.`);
      closeContributionPanel();
    }
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
  const panel = document.getElementById("suggestionPanel");
  const text = document.getElementById("suggestionText");

  if (!panel || !text) return;

  // This finds the list of actions for the clicked category
  const categoryActions = actions[category];

  if (categoryActions) {
    // This turns the array into a nice readable list
    let listHTML = `<p style="margin-bottom: 10px;"><strong>Ways to earn points in this category:</strong></p><ul>`;

    categoryActions.forEach(action => {
      listHTML += `<li style="margin-bottom: 8px;">${action.text} - <span style="color: var(--primary-neon);">+${action.points} pts</span></li>`;
    });

    listHTML += `</ul>`;
    text.innerHTML = listHTML;
  } else {
    // Fallback to the text descriptions if no actions match
    text.innerText = suggestions[category] || "No specific actions found for this category.";
  }

  panel.style.display = "block";
}

function closeSuggestions() {
  const panel = document.getElementById("suggestionPanel");
  if (panel) panel.style.display = "none";
}



// ===============================
// SUPABASE CONFIGURATION
// ===============================
// Enter your details from Supabase Settings > API
const SUPABASE_URL = 'sb_publishable_TlYG6vAL-Ac7h3HySY8q9A_68rY-L3y';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZXNzb2pxcmp3Ymh5dmptd3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTUzMTEsImV4cCI6MjA5MDA3MTMxMX0.NAsKwR3Yl_NdJHCqdx1uMRpOVCiW7Ci8rwqHNLelO1k';
const supabaseClient = (typeof supabase !== 'undefined') ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ===============================
// GLOBAL VARIABLES & ACTION DATA
// ===============================
let totalPoints = 0;



// sign up , in , mission//

async function showAuth(type) {
  const modal = document.getElementById('auth-modal');
  const title = document.getElementById('auth-title');
  const submitBtn = document.getElementById('auth-submit');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // 1. Show the modal
  modal.style.display = 'block';

  // 2. Update UI based on type
  if (type === 'signup') {
    title.innerText = "Join the Movement";
    submitBtn.innerText = "Create Account";
  } else {
    title.innerText = "Welcome Back";
    submitBtn.innerText = "Sign In";
  }

  // 3. Handle the actual Database call
  submitBtn.onclick = async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (type === 'signup') {
      const { data, error } = await supabaseClient.auth.signUp({ email, password });

      if (error) {
        alert("Sign Up Error: " + error.message);
      } else {
        // Change the modal content to show "Check Email" instructions
        const modal = document.getElementById('auth-modal');
        modal.innerHTML = `
            <div class="modal-glow"></div>
            <h3 style="color: var(--primary-neon);">📧 Check Your Inbox</h3>
            <p style="margin: 20px 0; color: #ccc;">
                We've sent a verification link to <strong>${email}</strong>.<br><br>
                Please click the link to activate your account and start earning points!
            </p>
            <button class="action-btn" onclick="location.reload()">Got it!</button>
        `;
      }
    }
  }
};

async function signInWithProvider(providerName) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: providerName, // 'google' or 'github'
  });

  if (error) alert("Social Login Error: " + error.message);
}

// Link them to your HTML buttons
document.querySelector('.google').onclick = () => signInWithProvider('google');
document.querySelector('.github').onclick = () => signInWithProvider('github');


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

  if (!query) return alert("Please enter a question! I am open to doubts");

  // UI Feedback: Show the user the AI is thinking
  responseDiv.style.color = "#00ff88"; // Keep it vibrant!
  responseDiv.innerText = "Consulting Sustainability AI...";

  try {
    const response = await fetch(`${getBaseUrl()}/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: query })
    });

    if (!response.ok) throw new Error("API Offline");

    const data = await response.json();
    responseDiv.innerText = data.reply;

  } catch (err) {
    // Smart Fallback: If the backend isn't ready, provide a simulated AI answer
    console.error("AI Error:", err);
    setTimeout(() => {
      const fallbacks = [
        `To optimize ${query}, consider life-cycle assessments and reducing carbon overhead.`,
        `Regarding ${query}: Minimalist consumption is the most effective sustainability strategy.`,
        `Interesting point on ${query}. Have you looked into the 'Circular Economy' approach for this?`
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      responseDiv.innerText = `${randomFallback} (Demo Mode)`;
      responseDiv.style.color = "#888";
    }, 1200);
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


// This runs automatically whenever the user's status changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log("User is now verified and signed in:", session.user);

    // Update the UI: Hide Sign In buttons, show Profile
    document.querySelector('.nav-buttons').innerHTML = `
            <span style="color: var(--primary-neon); margin-right: 15px;">Welcome, Hero!</span>
            <button class="action-btn" onclick="supabaseClient.auth.signOut()">Sign Out</button>
        `;
  }
  if (event === 'SIGNED_OUT') {
    location.reload(); // Refresh to show Login buttons again
  }
});

// on login badge points nottodisturb //
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    // Fetch the user's saved points from the database
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('points')
      .eq('id', session.user.id)
      .single();

    if (data) {
      totalPoints = data.points;
      document.getElementById("points").innerText = totalPoints;
      document.getElementById("badge").innerText = getBadge(totalPoints);
    }
  }
});

