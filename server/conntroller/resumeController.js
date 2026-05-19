import Groq from "groq-sdk"
import multer from "multer"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const pdfParse = require("pdf-parse")
import mammoth from "mammoth"
import fs from "fs"

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const upload = multer({ dest: "uploads/" })

export const analyseResume = async (req, res) => {
  try {
    const { jobRole } = req.body
    const file = req.file

    if (!file) return res.status(400).json({ success: false, message: "No file uploaded" })

    // Extract text from PDF or Word
    let resumeText = ""
    if (file.mimetype === "application/pdf") {
      const buffer = fs.readFileSync(file.path)
      const parsed = await pdfParse(buffer)
      resumeText = parsed.text
    } else {
      const result = await mammoth.extractRawText({ path: file.path })
      resumeText = result.value
    }

    // Cleanup uploaded file
    fs.unlinkSync(file.path)

    const prompt = `You are an expert resume reviewer. Analyse the following resume${jobRole ? ` for the role of ${jobRole}` : ""}.

Resume:
${resumeText}

Respond ONLY with a valid JSON object in this exact format (no markdown, no backticks):
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>"],
  "tip": "<one actionable pro tip>"
}`

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    })

    const raw = response.choices[0].message.content.trim()
    const analysis = JSON.parse(raw)

    return res.json({ success: true, analysis })
  } catch (error) {
    console.error("Resume error:", error)
    return res.status(500).json({ success: false, message: "Analysis failed" })
  }
}