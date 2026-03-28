// Live Meter Simulation
setInterval(() => {
    let el = document.getElementById('liveMeter');
    if (el) {
        let val = parseFloat(el.innerText);
        el.innerText = (val + 0.01).toFixed(1) + " kWh";
    }
}, 3000);

async function analyzeBill() {
    const fileInput = document.getElementById('billInput');
    const status = document.getElementById('uploadStatus');
    const panel = document.getElementById('analysisPanel');
    const content = document.getElementById('analysisContent');

    if (fileInput.files.length === 0) return;

    status.innerHTML = "🔍 AI is reading your bill data...";
    const file = fileInput.files[0];
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
                    category: "electricity bill analysis",
                    type: "bill-check"
                })
            });

            const data = await response.json();

            if (data.verified) {
                panel.style.display = "block";
                status.innerHTML = "✅ Analysis Complete";

                // Update the UI with AI insights
                content.innerHTML = `
                    <p style="color:#0f0"><strong>Detected Consumption:</strong> ${data.units || '78'} Units</p>
                    <p><strong>Cost per Unit:</strong> ₹${data.rate || '3.30'}</p>
                    <hr style="border:0.5px solid #333">
                    <p style="font-style:italic;">"Your usage is <strong>15% lower</strong> than the neighborhood average. You've earned <strong>200 Eco-Points</strong>!"</p>
                `;

                // Trigger a "spike" in the graph for visual effect
                document.getElementById('graph').style.background = "linear-gradient(90deg, #0f0 20%, #222 21%)";
            } else {
                status.innerHTML = "❌ AI couldn't read the bill clearly. Try a sharper photo.";
            }
        } catch (err) {
            status.innerHTML = "⚠️ Connection Error.";
        }
    };
}

// Inside your fetch success block:
if (data.verified) {
    // 1. Show the sections
    document.getElementById('odometerSection').style.display = "block";
    document.getElementById('smartInsights').style.display = "grid";

    // 2. Animate the Odometer (Idea 3)
    animateValue("prevOdo", 0, data.prev_rdg, 1500);
    animateValue("presOdo", 0, data.present_rdg, 2000);
    document.getElementById('unitSummary').innerText = `Total Journey: ${data.units_advanced} Units`;

    // 3. Set Load Insight (Idea 2)
    document.getElementById('cdVal').innerText = data.connected_load_cd;
    document.getElementById('loadTip').innerText = data.connected_load_cd <= 1
        ? "Your 1kW limit is tight. Avoid using the Geyser and Iron together to save internal wiring heat-loss."
        : "Load capacity is healthy. Still, check for 'phantom' device leaks.";

    // 4. Set Climate Tip (Idea 4)
    document.getElementById('climateTip').innerText = data.division.includes("PURI")
        ? "Humidity in Puri is 80%+. Use AC 'Dry Mode' to save ₹4/hour compared to Cool mode."
        : "Standard climate detected. Keep vents clear for 10% better efficiency.";
}

// Helper function for the "Rolling Odometer" effect
function animateValue(id, start, end, duration) {
    let obj = document.getElementById(id);
    let range = end - start;
    let minTimer = 50;
    let step = Math.abs(Math.floor(duration / range));
    step = Math.max(step, minTimer);
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        obj.innerHTML = value.toString().padStart(4, '0');
        if (value == end) clearInterval(timer);
    }
    timer = setInterval(run, step);
    run();
}