function calculateSolar() {
    const panels = document.getElementById('panelInput').value;
    const resultDiv = document.getElementById('roiResult');

    if (!panels || panels <= 0) {
        return alert("Please enter the number of panels.");
    }

    // Assumptions: 1 panel (300W) generates ~1.2kWh/day. 
    // Avg cost saved: ₹7 per unit.
    const annualEnergy = panels * 1.2 * 365;
    const annualSavings = (annualEnergy * 7).toLocaleString('en-IN');

    resultDiv.style.opacity = 0;
    setTimeout(() => {
        resultDiv.innerHTML = `
            <h3 style="color: #ffcc00;">Yearly Impact</h3>
            <p>Potential Energy: <strong>${annualEnergy.toFixed(0)} kWh</strong></p>
            <p>Money Saved: <strong>₹${annualSavings}</strong></p>
            <p style="font-size: 0.8rem; color: #aaa;">*Based on average sunny days and utility rates.</p>
        `;
        resultDiv.style.opacity = 1;
    }, 300);
}