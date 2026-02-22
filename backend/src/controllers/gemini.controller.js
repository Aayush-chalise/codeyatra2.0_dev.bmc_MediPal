import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env.js";
import { json } from "express";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const analyzeSymptoms = async (req, res) => {
  console.log(GEMINI_API_KEY);
  const symptom = req.body.symptom;
  console.log("message received:", req.body);
  console.log("symptom:", symptom);
  const userMessage = symptom;
  console.log("userMessage:", userMessage);

  let prompt = `
You are a helpful medical assistant chatbot.

1) Normally, respond in plain text if it's a regular conversation. output ONLY JSON in the following format
{
  text: "Your response here"
}

2) If the user shares symptoms and you are confident, output ONLY JSON in the following format:
{
  "department":  "Cardiology" | "Pulmonology" |"Neurology" | "General Medicine" | "Orthopedics" | "Emergency" | "Ophthalmology" | "Dermatology" | "Dentistry", #  departement simlar but it  must be only one that is most relevant to the symptoms
  "urgency": "low|medium|high", # must be enum only one that is most relevant to the symptoms
  "isEmergency": true | false, # bool value 
  "time": "Today | Immediate | this week " , # How immediate | long time gap for the checkup .Eg : "time" : "Immediate"  means check within 2hrs 
}

Do not include any text outside JSON if symptoms are detected and you are confident.

User message: "${userMessage}"
`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  let jsonResponse = response.text
    .replace(/^\s*```json\s*|\s*```\s*$/g, "")
    .trim();
  let jsonData = JSON.parse(jsonResponse);
  console.log({ analysis: jsonData });
  res.json({ analysis: jsonData });
};
