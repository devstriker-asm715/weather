function calculateWater() {
    const area = document.getElementById('roofArea').value;
    const rain = document.getElementById('rainfall').value;
    // Basic formula: Area * Rainfall * Runoff coefficient (0.8)
    const yield = (area * rain * 0.8).toFixed(2);

    document.getElementById('calcResult').innerText = `Potential Yield: ${yield} Litres`;
    document.getElementById('savedLitres').innerText = yield;
    document.getElementById('waterLevel').style.height = '70%'; // Simulation fill
}