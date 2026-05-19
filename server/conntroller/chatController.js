import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Messages array is required" });
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",  // free & very capable
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages,
      ],
      max_tokens: 1024,
    });

    return res.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ success: false, message: "AI request failed" });
  }
};