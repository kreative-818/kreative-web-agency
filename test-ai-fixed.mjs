import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: '1969a2ac7e4d4d79bc642aeb10853e40',
  baseURL: "https://apps.abacus.ai/v1", // FIXED: apps instead of apis
});

async function test() {
  try {
    console.log("Testing AI generation with CORRECT endpoint...");
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are Alex, a sales consultant. Respond naturally to customer greetings." },
        { role: "user", content: "Hi" }
      ],
      temperature: 0.8,
      max_tokens: 100,
    });
    
    console.log("\n✅ SUCCESS! AI is now working!");
    console.log("Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("Status:", error.status);
  }
}

test();
