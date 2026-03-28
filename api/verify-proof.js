import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    const { image, category = "", type } = req.body;

    if (!image) {
        return res.status(400).json({ error: "Missing image data" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const effectiveType = type || (category.toLowerCase().includes("bill") ? "bill-check" : "proof_validation");

    let prompt = "";

    if (effectiveType === "bill_analysis") {
        prompt = `You are an Energy Auditor AI.
- Extract 'Units Advanced' or 'Current Consumption'.
- Extract 'Total Amount Due'.
- Assess if usage is high/low for a typical household.
Respond strictly with valid JSON only:
{"verified": true, "units": 0, "amount": 0, "analysis": "string"}`;
    } else if (effectiveType === "bill-check") {
        prompt = `You are an Indian Electricity Auditor AI.
- Identify 'DIV' or 'Division' (e.g., Puri, Bhubaneswar, Cuttack) in title case.
- Extract 'Present' and 'Previous' readings as numbers.
- Extract 'CD' or 'Connected Load' as number.
- Confirm authenticity of the bill (not a digital screen photo).
Respond strictly with valid JSON only:
{"present_rdg": 0, "prev_rdg": 0, "units_advanced": 0, "connected_load_cd": 0, "division": "", "rebate_amount": 0, "is_authentic": true, "analysis": ""}`;
    } else if (effectiveType === "proof_validation") {
        prompt = `You are a Sustainability Validator AI.
- Assess whether the submitted image is a genuine ${category || "sustainability"} action.
- Detect fraud (screenshots, stock internet images, manipulations).
Respond strictly with valid JSON only:
{"verified": true, "analysis": "string", "confidence": 0}`;
    } else {
        prompt = `You are a generic proof validator AI.
- Analyze the submitted image for authenticity.
- Provide a short analysis and confidence score.
Respond strictly with valid JSON only:
{"verified": true, "analysis": "string", "confidence": 0}`;
    }

    try {
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: image, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        const data = JSON.parse(response.text().replace(/```json|```/g, ""));
        res.status(200).json(data);
    } catch (error) {
        console.error("verify-proof error", error);
        res.status(500).json({ error: "AI Processing Error" });
    }
}
