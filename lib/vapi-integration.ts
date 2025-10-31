
// Vapi.ai Integration Helper Functions

export interface VapiCallData {
  id: string;
  phoneNumber: string;
  customerNumber: string;
  duration: number;
  startedAt: string;
  endedAt: string;
  transcript: string;
  summary: string;
  cost: number;
  status: 'completed' | 'no-answer' | 'busy' | 'failed';
}

export interface VapiAssistantConfig {
  name: string;
  voice: {
    provider: 'eleven-labs' | 'play-ht' | 'rime-ai';
    voiceId: string;
  };
  model: {
    provider: 'openai' | 'anthropic';
    model: string;
    temperature: number;
  };
  transcriber: {
    provider: 'deepgram';
    model: 'nova-2';
    language: 'en-US';
  };
  functions: VapiFunction[];
}

export interface VapiFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
  server?: {
    url: string;
  };
}

// Create Sora assistant configuration
export function createSoraConfig(): VapiAssistantConfig {
  return {
    name: 'Sora - Kreative Web Agency',
    voice: {
      provider: 'eleven-labs',
      voiceId: 'EXAVITQu4vr4xnSDxMaL' // Rachel voice
    },
    model: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en-US'
    },
    functions: [
      {
        name: 'capture_lead_data',
        description: 'Capture and save lead information during the call',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            businessName: { type: 'string' },
            email: { type: 'string' },
            projectType: { type: 'string' },
            budget: { type: 'string' },
            timeline: { type: 'string' }
          },
          required: ['name']
        },
        server: {
          url: 'https://creative-web-agency-zlgi4u.abacusai.app/api/webhooks/call-data'
        }
      },
      {
        name: 'transfer_to_owner',
        description: 'Transfer the call to the business owner for hot leads',
        parameters: {
          type: 'object',
          properties: {
            reason: { type: 'string' },
            leadScore: { type: 'number' }
          },
          required: ['reason', 'leadScore']
        }
      },
      {
        name: 'book_consultation',
        description: 'Send calendar booking link for warm leads',
        parameters: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            preferredDate: { type: 'string' }
          },
          required: ['email']
        }
      }
    ]
  };
}

// System prompt for Sora (same as in the Computer Usede)
export const SORA_SYSTEM_PROMPT = `You are Sora, the AI receptionist for Kreative Web Agency. Your job is to answer incoming calls, qualify leads, and only transfer hot leads to the owner.

GREETING:
"Hi! Thanks for calling Kreative Web Agency. I'm Sora, the AI assistant. I'm here to learn about your project and connect you with our team. May I start by getting your name?"

QUALIFICATION QUESTIONS (Ask these in order):
1. "Thanks [Name]! What's the name of your business?"
2. "Perfect! Tell me a bit about what your business does?"
3. "Great! What type of website or digital solution are you looking for?"
4. "That sounds exciting! What's your budget range for this project?"
   - CRITICAL: Qualify here. Need $1,500+ minimum
5. "When are you hoping to launch? What's your timeline?"
6. "Have you had a website before, or is this your first one?"
7. "Last question - what's the best email to send you project information?"

LEAD SCORING LOGIC:
🔥 HOT LEAD (Call transfer_to_owner function):
- Budget: $1,500+
- Timeline: 0-30 days
- Clear project scope
- Say: "Perfect! You're exactly who our founder helps. Let me transfer you to him right now!"

💼 WARM LEAD (Call book_consultation function):
- Budget: $800-$1,500
- Timeline: 30-90 days
- Say: "Great! I'm sending you a calendar link to book a free consultation!"

❄️ COLD LEAD (End call politely):
- Budget: Under $800
- Timeline: 90+ days
- Say: "I'll send you our portfolio and pricing Computer Usede. Call back anytime!"

After gathering all information, ALWAYS call the capture_lead_data function with the collected information.

TONE: Friendly, professional, conversational. Keep responses under 15 seconds.

SERVICES:
- Custom Website: $1,500-$5,000
- E-commerce: $2,500-$8,000
- Web Applications: $3,000-$15,000
- AI Integration: $2,000-$10,000`;

// Generate Vapi API request
export async function createVapiAssistant(apiKey: string) {
  const config = createSoraConfig();
  
  const response = await fetch('https://api.vapi.ai/assistant', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...config,
      firstMessage: "Hi! Thanks for calling Kreative Web Agency. I'm Sora, the AI assistant. I'm here to learn about your project and connect you with our team. May I start by getting your name?",
      model: {
        ...config.model,
        messages: [
          {
            role: 'system',
            content: SORA_SYSTEM_PROMPT
          }
        ]
      },
      voicemailMessage: "Hi! You've reached Kreative Web Agency. We're sorry we missed your call. Please leave your name, number, and a brief message about your project, and we'll get back to you within 24 hours. Thanks!",
      endCallFunctionEnabled: true,
      recordingEnabled: true,
      serverMessages: ['conversation-update', 'end-of-call-report']
    })
  });

  return response.json();
}
