const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY 
});

async function generateResponse(chatHistory) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: chatHistory,
    });

    return response.text;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "Error generating response";
  }
}

module.exports = generateResponse;
