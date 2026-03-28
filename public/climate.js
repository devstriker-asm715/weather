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


/**
 * CLIMATE MONITORING LOGIC
 * Handles AQI visualization, health warnings, and dynamic UI shifts.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Configuration - In a real app, these values would come from an Weather API
    const climateData = {
        aqi: 142,        // Current Air Quality Index
        temp: 32,       // Celsius
        humidity: 65    // Percentage
    };

    updateClimateUI(climateData);
    initParticleCanvas(climateData.aqi);
});

function updateClimateUI(data) {
    const body = document.getElementById('climateBody');
    const aqiText = document.getElementById('aqiVal');
    const warningBox = document.getElementById('healthWarning');

    // Update Numerical Value
    if (aqiText) aqiText.innerText = data.aqi;

    // 2. SMART FEATURE: Health Impact Calculation [Blueprint Source 4]
    // Formula: (AQI / 20) approximates the equivalent cigarette intake or lung efficiency drop
    const lungLoss = (data.aqi / 20).toFixed(1);

    if (warningBox) {
        warningBox.innerHTML = `<strong>Health Alert:</strong> Air quality today reduces lung efficiency by approx. <span>${lungLoss}%</span>. Mask recommended.`;
    }

    // 3. DYNAMIC UI: Sky Color Shift [Blueprint Source 4]
    if (data.aqi <= 50) {
        // Healthy - Clean Blue
        body.style.background = "linear-gradient(to bottom, #00d2ff, #3a7bd5)";
    } else if (data.aqi <= 100) {
        // Moderate - Yellowish Tint
        body.style.background = "linear-gradient(to bottom, #f7971e, #ffd200)";
    } else if (data.aqi <= 200) {
        // Unhealthy - Polluted Grey/Orange
        body.style.background = "linear-gradient(to bottom, #4b6cb7, #182848)";
        body.style.filter = "saturate(0.6)"; // Mute colors to look "polluted"
    } else {
        // Hazardous - Deep Grey/Purple
        body.style.background = "linear-gradient(to bottom, #2c3e50, #000000)";
    }
}

// 4. VISUAL EFFECTS: Animated Pollution Particles [Blueprint Source 4]
function initParticleCanvas(aqi) {
    const canvasContainer = document.getElementById('particleCanvas');
    if (!canvasContainer) return;

    // Adjust particle count based on AQI (Higher AQI = more "dust" particles)
    const particleCount = Math.floor(aqi / 2);

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'pollution-particle';

        // Randomize starting positions and animation duration
        const size = Math.random() * 3 + 1 + 'px';
        particle.style.width = size;
        particle.style.height = size;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.opacity = Math.random() * 0.5;
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';

        canvasContainer.appendChild(particle);
    }
}