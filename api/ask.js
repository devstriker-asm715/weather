import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiPrompts } from "./prompts.js";

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  // 2. Validate API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ reply: "API Key missing in Environment Variables." });
  }

  try {
    // 3. Validate User Input
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ reply: "Please provide a prompt." });
    }

    // 4. Initialize AI with System Instructions from prompts.js
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: aiPrompts.sustainabilityGuide 
    });

    // 5. Generate content using ONLY the user's raw question
    const result = await model.generateContent(prompt);
    
    // 6. Extract and return the text
    const response = await result.response;
    res.status(200).json({ reply: response.text() });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ reply: "AI is currently offline. Please try again later." });
  }
}