import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: '1969a2ac7e4d4d79bc642aeb10853e40',
  baseURL: "https://apis.abacus.ai/v1",
});

async function test() {
  try {
    console.log("Testing AI generation with Abacus API...");
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello in one sentence!" }
      ],
      temperature: 0.8,
      max_tokens: 100,
    });
    
    console.log("✅ SUCCESS! AI is working!");
    console.log("Response:", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.error("Status:", error.status);
    console.error("Type:", error.type);
  }
}

test();
