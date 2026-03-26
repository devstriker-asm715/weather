import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `You are a sustainability expert. Answer clearly.\nQuestion: ${prompt}`
    );

    const text = (await result.response).text();
    res.status(200).json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "AI Error occurred." });
  }
}
