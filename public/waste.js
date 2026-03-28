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

let selectedBin = '';

function setBin(type) {
    selectedBin = type;
    document.querySelectorAll('.bin-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

async function validateWaste() {
    const fileInput = document.getElementById('wasteProof');
    if (!selectedBin) return alert("Please select a bin type first!");
    if (fileInput.files.length === 0) return alert("Please upload a photo of your waste disposal.");

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];

        // Call the Gemini API Route we built earlier
        try {
            const response = await fetch('/api/verify-proof', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64Image,
                    category: "recycling",
                    type: "proof_validation" // This triggers the Validator prompt
                })

            });

            const data = await response.json();

            if (data.verified) {
                alert(`✅ Verified! AI confirmed ${selectedBin} disposal. +200 Points!`);
                // Update local garbage dumped display (Simulated)
                let current = parseFloat(document.getElementById('totalGarbage').innerText);
                document.getElementById('totalGarbage').innerText = (current + 0.5).toFixed(1);
            } else {
                alert(`❌ Rejected: ${data.analysis}`);
            }
        } catch (err) {
            alert("Verification error. Ensure GEMINI_API_KEY is set in Vercel.");
        }
    };
}