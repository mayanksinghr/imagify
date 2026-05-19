import Groq from "groq-sdk"

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const generateBlog = async (req, res) => {
  try {
    const { topic, tone = "Professional", length = "Medium (600 words)", keywords = "" } = req.body

    if (!topic) return res.status(400).json({ success: false, message: "Topic is required" })

    const wordTarget = length.includes("300") ? 300 : length.includes("1000") ? 1000 : 600

    const prompt = `You are an expert blog writer. Write a ${tone.toLowerCase()} blog post about: "${topic}".
${keywords ? `Include these SEO keywords naturally: ${keywords}.` : ""}
Target length: approximately ${wordTarget} words.

Respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "title": "<engaging blog title>",
  "metaDescription": "<SEO meta description under 160 chars>",
  "content": "<full blog post content with proper paragraphs>",
  "wordCount": <approximate word count as number>,
  "tags": ["<tag1>", "<tag2>", "<tag3>", "<tag4>"]
}`

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    })

    const raw = response.choices[0].message.content.trim()
    const blog = JSON.parse(raw)

    return res.json({ success: true, blog })
  } catch (error) {
    console.error("Blog error:", error)
    return res.status(500).json({ success: false, message: "Blog generation failed" })
  }
}