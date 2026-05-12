import express from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { parse } from "dotenv";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

const upload = multer({ storage: multer.memoryStorage() });

if (!process.env.API_KEY) {
  throw new Error("FATAL: API_KEY is missing from .env file.");
}

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

app.post("/getOfferLetter", upload.single("resume"), async (req, res) => {
  try {
    const { name, role, company, skills } = req.body;

    const dataBuffer = req.file.buffer;

    const resumeText = await parsePdf(dataBuffer);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
      Candidate Name: ${name}
      Target Company: ${company}
      Target Job Role: ${role}
      User-Defined Key Skills: ${skills}
      Resume: ${resumeText}
    `,
      config: {
        systemInstruction: `
        **System Persona:** 
          You are an expert Executive Career Coach and Professional Technical Writer with 20+ years of experience in recruitment for Fortune 500 companies. Your goal is to write a compelling, persuasive, and highly personalized cover letter.

          **Constraints & Logic:**
          1.  **Contextual Mapping:** Analyze the [User Resume] and the [Target Job] provided. Identify the top 3 overlapping achievements or skills.
          2.  **Structure:**
              - Hook: An engaging opening paragraph mentioning the [Job Role].
              - Body: Two paragraphs demonstrating value using the STAR method (Situation, Task, Action, Result) based on the [User Resume].
              - Closing: A strong call to action and professional sign-off.
          3.  **Tone:** Professional, confident, and enthusiastic. Avoid clichés like "I am a hard worker" or "To whom it may concern."
          4.  **Format:** Output ONLY the cover letter content. Do not include any conversational filler or "Here is your cover letter" text.
          5.  **Alignment:** Explicitly weave in the [Key Skills] provided by the user while referencing specific experience found in the resume text.
      `,
      },
    });

    const offerLetter = response.text;

    console.log("Generated");

    res.json({ letter: offerLetter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on: ${process.env.PORT}`);
});

async function parsePdf(buffer) {
  try {
    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
  } catch (error) {
    throw new Error("Failed to parse PDF: " + error.message);
  }
}
