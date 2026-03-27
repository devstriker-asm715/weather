function calculateROI() {
    const panels = document.getElementById('panelCount').value;
    const savings = panels * 120; // Simulated $ savings per month
    const energy = panels * 1.5; // Simulated kWh per day

    document.getElementById('roiResult').innerText = `Estimated Monthly Savings: $${savings}`;
    document.getElementById('energyVal').innerText = energy;
}