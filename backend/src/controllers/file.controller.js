import {GoogleGenAI} from '@google/genai';
import { GEMINI_API_KEY } from '../config/env.js';


export const sumarrizeMedicalReport = async (req, res) => {
    const file = req.file;
     try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files allowed" });
    }
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: req.file.buffer.toString("base64"),
              },
            },
            {
              text: `
              Analyze this report and return ONLY raw JSON:

              {
                "summary": "...",
                "key_points": ["..."],
                "risk_level": "low | medium | high"
              }

              Do not include markdown.
              `
            }
          ]
        }
      ]
    });

    const text = response.text.trim();
    const jsonData = JSON.parse(text);
    console.log("JSON Data:", jsonData);

    res.json(jsonData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Analysis failed" });
  }
}