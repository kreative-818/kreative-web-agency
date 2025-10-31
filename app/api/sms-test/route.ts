
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tests = {
    timestamp: new Date().toISOString(),
    env_check: {
      database_url: !!process.env.DATABASE_URL,
      openphone_api_key: !!process.env.OPENPHONE_API_KEY,
      abacus_api_key: !!process.env.ABACUSAI_API_KEY,
    },
    tests: {} as any,
  };

  // Test 1: Database connection
  try {
    const { db } = await import("@/lib/db");
    const { leads } = await import("@/lib/db/schema");
    const result = await db.select().from(leads).limit(1);
    tests.tests.database = { success: true, rows: result.length };
  } catch (error: any) {
    tests.tests.database = { success: false, error: error.message };
  }

  // Test 2: OpenAI API
  try {
    const openai = (await import("openai")).default;
    const client = new openai({
      apiKey: process.env.ABACUSAI_API_KEY,
      baseURL: "https://apis.abacus.ai/v1",
    });
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Say test" }],
      max_tokens: 5,
    });
    tests.tests.ai = { success: true, response: response.choices[0].message.content };
  } catch (error: any) {
    tests.tests.ai = { success: false, error: error.message };
  }

  // Test 3: OpenPhone API
  try {
    const response = await fetch("https://api.openphone.com/v1/phone-numbers", {
      headers: {
        Authorization: process.env.OPENPHONE_API_KEY || "",
      },
    });
    tests.tests.openphone = { 
      success: response.ok, 
      status: response.status,
      statusText: response.statusText 
    };
  } catch (error: any) {
    tests.tests.openphone = { success: false, error: error.message };
  }

  return NextResponse.json(tests, { status: 200 });
}
