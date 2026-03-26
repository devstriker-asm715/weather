import axios from "axios";

export default async function handler(req, res) {
  const city = req.query.city || "Delhi";

  try {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&q=${city}&language=en`
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "News fetch failed." });
  }
}