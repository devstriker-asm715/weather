// ECO WASTE LOGIC
document.addEventListener("DOMContentLoaded", () => {
    updateWasteStats();
    animateTransformation();
});

function updateWasteStats() {
    // Simulated data - in a real app, this comes from your Supabase 'contributions' table
    const stats = {
        segregationScore: 85,
        wastePrevented: 2.4, // kg
        organicCount: 12,
        recycleCount: 8
    };

    // Update UI Elements
    const scoreEl = document.getElementById("segScore");
    const weightEl = document.getElementById("landfillWeight");

    if (scoreEl) scoreEl.innerText = `${stats.segregationScore}%`;
    if (weightEl) weightEl.innerText = stats.wastePrevented;

    // Smart Feature: Emotional Push Logic 
    if (stats.wastePrevented < 1) {
        console.log("Tip: Starting a compost bin can double your landfill prevention score!");
    }
}

function animateTransformation() {
    const box = document.getElementById("transformAnim");
    if (!box) return;

    // Simple loop to show Trash turning into Greenery 
    const stages = ["🗑️", "♻️", "⚙️", "🌱", "🌳"];
    let i = 0;

    setInterval(() => {
        box.innerText = `Transformation: ${stages[i]}`;
        i = (i + 1) % stages.length;
    }, 2000);
}