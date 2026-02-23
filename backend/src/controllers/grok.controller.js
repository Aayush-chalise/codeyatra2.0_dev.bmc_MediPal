import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
});

export const analyzeSymptomsgrok = async (req, res) => {
  try {
    const symptom = req.body.symptom;
    console.log("Received symptom for analysis:", symptom);
    const userMessage = symptom;

    const systemPrompt =`
You are a helpful medical assistant chatbot called MediPal. Your task is to analyze the user's symptoms and provide a recommendation on which department they should visit, how urgent their condition is, and whether it's an emergency.


1) Normally, respond in plain text if it's a regular conversation. output ONLY JSON in the following format
{
  text: "Your response here"
}

2) If the user shares symptoms and you are confident, output ONLY JSON in the following format:
{
  "department":  "Cardiology" | "Pulmonology" |"Neurology" | "General Medicine" | "Orthopedics" | "Orthopedics" | "Dermatology", # must be enum only one that is most relevant to the symptoms
  "urgency": "low|medium|high", # must be enum only one that is most relevant to the symptoms
  "isEmergency": true | false, # bool value
  "time": "Today  | Immediate  | this week  " , # How immediate  | long time gap for the checkup  .Eg  :  "time"  :  "Immediate"  means check within 2hrs
 | "Ophthalmology" | "Dermatology" | "Dentistry", #  departement simlar but it  must be only one that is most relevant to the symptoms
  "urgency": "low|medium|high", # must be enum only one that is most relevant to the symptoms
  "isEmergency": true | false, # bool value 
  "time": "Today | Immediate | this week " , # How immediate | long time gap for the checkup .Eg : "time" : "Immediate"  means check within 2hrs 
}

Do not include any text outside JSON if symptoms are detected and you are confident.`;


    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "openai/gpt-oss-20b",
    });

    let aiResponse =
      completion.choices[0]?.message?.content || "";

    // Remove markdown if model adds ```json
    aiResponse = aiResponse
      .replace(/^\s*```json\s*|\s*```\s*$/g, "")
      .trim();

    let jsonData;

    try {
      jsonData = JSON.parse(aiResponse);
    } catch (err) {
      jsonData = { text: aiResponse };
    }

    console.log({ analysis: jsonData });

    res.json({ analysis: jsonData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI Error" });
  }
};