function calculateWater() {
    const area = document.getElementById('roofArea').value;
    const rain = document.getElementById('rainfall').value;
    // Basic formula: Area * Rainfall * Runoff coefficient (0.8)
    const yield = (area * rain * 0.8).toFixed(2);

    document.getElementById('calcResult').innerText = `Potential Yield: ${yield} Litres`;
    document.getElementById('savedLitres').innerText = yield;
    document.getElementById('waterLevel').style.height = '70%'; // Simulation fill
    if (rain > 50) {
        video.playbackRate = 2.0; // Double speed for "Heavy Rain"
        video.style.filter = "brightness(0.2) contrast(1.5)"; // Darker, stormier look
        console.log("Storm mode activated ⛈️");
    } else {
        video.playbackRate = 1.0; // Normal speed
        video.style.filter = "brightness(0.4)"; // Standard look
    }
}

// Display filename when a file is selected
document.getElementById('rainProof').addEventListener('change', function () {
    const fileName = this.files[0] ? this.files[0].name : "No file chosen";
    document.getElementById('fileNameDisplay').innerText = fileName;
});

// verify image //

async function submitRainAction() {
    const fileInput = document.getElementById('rainProof');
    const statusText = document.getElementById('fileNameDisplay');

    if (fileInput.files.length === 0) return alert("Please upload an image first!");

    statusText.innerText = "Gemini is validating your image... 🛡️";
    const file = fileInput.files[0];

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];

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

            if (data.verified && data.confidence > 70) {
                alert(`✅ Verified! ${data.analysis}. +500 Points!`);
                // Update your global points variable here
                totalPoints += 500;
                document.getElementById("points").innerText = totalPoints;
            } else {
                alert(`❌ Rejected: ${data.analysis} (Confidence: ${data.confidence}%)`);
            }
        } catch (err) {
            alert("Connection error. Try again later.");
        } finally {
            statusText.innerText = "Upload complete.";
        }
    };
}
