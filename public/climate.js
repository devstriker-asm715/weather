const aqi = 142; // Dynamic value from API
const body = document.getElementById('climateBody');
const warning = document.getElementById('healthWarning');

// Smart Feature Logic
const lungEfficiencyLoss = (aqi / 20).toFixed(1);
warning.innerText = `Health Alert: Air quality today reduces lung efficiency by ${lungEfficiencyLoss}%`;

// UI: Dynamic sky color
if (aqi > 100) {
    body.style.background = "linear-gradient(to bottom, #4a4a4a, #2c3e50)"; // Polluted grey
} else {
    body.style.background = "linear-gradient(to bottom, #00d2ff, #3a7bd5)"; // Clean blue
}