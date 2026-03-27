// Important: Ensure you have run 'npm install @google/generative-ai'
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use NEXT_PUBLIC_ if calling from browser, 
// but for an API route, process.env.GEMINI_API_KEY is correct.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;

    // Check if prompt exists to prevent empty API calls
    if (!prompt) {
      return res.status(400).json({ reply: "Please provide a prompt." });
    }

    // 2. Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Generate content with a system instruction
    const result = await model.generateContent([
      `You are a sustainability expert for a college campus. 
       Provide actionable, green-tech focused advice.
       Question: ${prompt}`
    ]);

    // 4. Extract the text response
    const response = await result.response;
    const text = response.text();

    // 5. Send back as JSON
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini API Error:", error);

    // Provide a detailed error message if the key is missing
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ reply: "API Key missing in Vercel Environment Variables." });
    }

    res.status(500).json({ reply: "AI is currently offline. Please try again later." });
  }
}