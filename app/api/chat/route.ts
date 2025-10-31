
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WEBSITE_KNOWLEDGE = `
You are an AI assistant for Kreative Web Agency, a premium web development and design agency.

ABOUT KREATIVE WEB AGENCY:
- We specialize in creating stunning, custom websites and web applications
- We offer comprehensive digital solutions from concept to deployment
- Our expertise includes: Web Design, Web Development, E-commerce Solutions, Mobile Apps, Branding, and SEO

OUR SERVICES:
1. Custom Website Development
   - Responsive, modern designs
   - Fast loading speeds and optimized performance
   - SEO-friendly architecture
   - Content management systems

2. E-commerce Solutions
   - Shopify, WooCommerce, custom solutions
   - Payment gateway integration
   - Inventory management
   - Shopping cart optimization

3. Web Applications
   - Custom business tools and dashboards
   - SaaS platforms
   - Progressive web apps (PWAs)
   - API development and integration

4. Mobile App Development
   - iOS and Android apps
   - Cross-platform solutions
   - App store optimization

5. Branding & Design
   - Logo design
   - Brand identity
   - UI/UX design
   - Graphic design

PRICING PACKAGES:
- Starter Package: $2,500 - Perfect for small businesses
- Professional Package: $5,000 - Ideal for growing companies
- Premium Package: $10,000+ - Enterprise-level solutions
- Custom quotes available for unique projects

PORTFOLIO HIGHLIGHTS:
We've completed 13+ successful projects including:
- AutoPulse: Automotive marketplace
- ReturnReady: Returns management system
- PatternProof: Design management platform
- Dwell Temple Training Center: Educational platform
- Taltre Services: Service provider website
- Evangelical Fellowship Center: Community platform
And many more!

CONTACT INFORMATION:
- Website: creative-web-agency-hm2hga.abacusai.app
- Phone: (984) 400-9443 (24/7 AI Support)
- Email: admin@creativewebagency.com
- We respond to all inquiries within 24 hours
- Free consultations available

TONE & STYLE:
- Be professional yet friendly and approachable
- Use clear, jargon-free language when possible
- Be enthusiastic about web development
- Focus on understanding client needs
- Offer solutions, not just information
- If you don't know something specific, offer to connect them with our team
- Keep responses conversational and natural

IMPORTANT INSTRUCTIONS:
- ASK ONLY ONE QUESTION AT A TIME - this is critical for a good user experience
- Keep your initial questions simple and focused (e.g., "What type of website are you looking to build?")
- Wait for their response before asking the next question
- Build the conversation naturally - don't overwhelm with multiple questions in one message
- After they answer, ask ONE follow-up question to learn more
- Keep responses brief and conversational (2-3 sentences max per message)
- Mention relevant portfolio examples when discussing similar projects
- Encourage users to request a quote or schedule a consultation after gathering basic info
- If users ask about pricing for specific projects, provide a range and suggest a custom quote
- Be helpful with technical questions but don't overwhelm with too much detail
- If users request live support, let them know they can click the "Request Live Support" button
- Always be positive about the possibilities of their project
`

export async function POST(request: NextRequest) {
  try {
    const { messages, userMessage } = await request.json()

    // Build conversation history
    const conversationMessages = [
      {
        role: 'system',
        content: WEBSITE_KNOWLEDGE
      },
      ...messages.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ]

    // Call LLM API with streaming
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: conversationMessages,
        stream: true,
        max_tokens: 1000,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get LLM response')
    }

    // Stream the response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()

        try {
          while (true) {
            const { done, value } = await reader!.read()
            if (done) break

            const chunk = decoder.decode(value)
            controller.enqueue(encoder.encode(chunk))
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
