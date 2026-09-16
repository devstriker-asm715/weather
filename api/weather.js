import axios from "axios";

export default async function handler(req, res) {
  const city = req.query.city || "Delhi";

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    res.status(200).json(response.data);
 } catch (error) {
  console.error("Weather error:", error.response?.data || error.message);
  res.status(error.response?.status || 500).json({ 
    error: error.response?.data?.message || "Weather fetch failed." 
  });
  }
}