import axios from "axios";

export default async function handler(req, res) {
  const city = req.query.city || "Delhi";

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Weather fetch failed." });
  }
}