import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Uses the SERVICE_KEY so the backend can award points securely without RLS blocking it
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Accepts variables from both code versions so you don't have to change your frontend script
    const { 
        image, imageBase64, 
        category = "", type, actionText = "", 
        pointsToAward = 0, userId 
    } = req.body;

    const rawImage = image || imageBase64;
    if (!rawImage) {
        return res.status(400).json({ error: "Missing image data" });
    }

    // Safely strip the base64 prefix if the frontend sent it
    const base64Data = rawImage.replace(/^data:image\/\w+;base64,/, "");
    const effectiveType = type || (category.toLowerCase().includes("bill") ? "bill-check" : "proof_validation");

    let prompt = "";

    if (effectiveType === "bill_analysis") {
        prompt = `You are an Energy Auditor AI.
        - Extract 'Units Advanced' or 'Current Consumption'.
        - Extract 'Total Amount Due'.
        - Assess if usage is high/low for a typical household.
        Respond strictly with this JSON schema: {"verified": true, "units": 0, "amount": 0, "analysis": "string"}`;
    } else if (effectiveType === "bill-check") {
        prompt = `You are an Indian Electricity Auditor AI.
        - Identify 'DIV' or 'Division' in title case. Watch for regional DISCOM formats (e.g., TPCODL/TPSODL).
        - Extract 'Present' and 'Previous' readings as numbers.
        - Extract 'CD' or 'Connected Load' as a number.
        - Confirm authenticity of the bill (detect if it is a photo of a screen rather than physical paper).
        Respond strictly with this JSON schema: {"verified": true, "present_rdg": 0, "prev_rdg": 0, "units_advanced": 0, "division": "", "is_authentic": true, "analysis": "string"}`;
    } else {
        prompt = `You are a Sustainability Validator AI.
        - Assess whether the submitted image is a genuine action for: ${actionText || category || "sustainability"}.
        - Detect fraud (e.g., screenshots, stock internet images, digital manipulations).
        Respond strictly with this JSON schema: {"verified": true, "analysis": "string", "confidence": 0}`;
    }

    try {
        // Forces native JSON output so JSON.parse() never crashes
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const data = JSON.parse(result.response.text());
        let newTotal = 0;

        // Securely update Supabase ONLY if the AI verifies it and the user is logged in
        if (data.verified && userId && pointsToAward > 0) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('points')
                .eq('id', userId)
                .single();

            newTotal = (profile?.points || 0) + pointsToAward;

            await supabase
                .from('profiles')
                .update({ points: newTotal })
                .eq('id', userId);
        }

        return res.status(200).json({ 
            success: data.verified, 
            ...data,
            newTotal: newTotal
        });

    } catch (error) {
        console.error("verify-proof error:", error);
        return res.status(500).json({ error: "AI Processing Error", details: error.message });
    }
}