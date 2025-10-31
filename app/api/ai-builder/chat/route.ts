
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const message = formData.get("message") as string;
    const files = formData.getAll("files") as File[];

    // Get the Abacus AI API key from environment
    const apiKey = process.env.ABACUSAI_API_KEY;
    
    if (!apiKey) {
      console.error("ABACUSAI_API_KEY not found in environment");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    // For now, we'll use a simple OpenAI-compatible endpoint
    // In production, this would call the actual Abacus AI Deep Agent API
    const response = await fetch("https://api.abacus.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert web developer and AI assistant integrated into Kreative Web Agency's proprietary platform. You help clients build professional websites, landing pages, and web applications.

Your capabilities:
- Build complete Next.js websites from descriptions
- Design responsive landing pages
- Add features and functionality
- Modify existing projects
- Provide technical guidance
- Generate code snippets

Always respond in a professional, helpful manner. When building websites, provide detailed step-by-step guidance. Format responses using markdown for better readability.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API Error:", errorText);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("AI Builder error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
