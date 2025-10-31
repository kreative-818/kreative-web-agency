
import { NextRequest } from 'next/server'
import { getConversation, addMessage, updateConversation } from '@/lib/conversation-store'

export const dynamic = 'force-dynamic'

// Get conversation updates
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversation = getConversation(params.id)
    
    if (!conversation) {
      return new Response(
        JSON.stringify({ error: 'Conversation not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        conversation
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch conversation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Post message to conversation (for live support)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { message, role } = await request.json()
    
    if (!message || !role) {
      return new Response(
        JSON.stringify({ error: 'Message and role are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const conversation = getConversation(params.id)
    
    if (!conversation) {
      return new Response(
        JSON.stringify({ error: 'Conversation not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add message to conversation (this also updates lastActivity automatically)
    addMessage(params.id, role, message)

    // If user sent a message, notify via SMS
    if (role === 'user') {
      const { phoneNumber } = conversation
      
      if (phoneNumber) {
        // Send SMS notification to support agent
        const smsMessage = `💬 New message from visitor:\n\n"${message}"\n\nReply at: creative-web-agency-hm2hga.abacusai.app`
        
        try {
          const apiKey = process.env.OPENPHONE_API_KEY
          
          if (apiKey) {
            // Get phone numbers
            const numbersResponse = await fetch('https://api.openphone.com/v1/phone-numbers', {
              method: 'GET',
              headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json'
              }
            })
            
            if (numbersResponse.ok) {
              const numbersData = await numbersResponse.json()
              const fromPhoneNumberId = numbersData.data?.[0]?.id
              
              if (fromPhoneNumberId) {
                // Send SMS
                await fetch('https://api.openphone.com/v1/messages', {
                  method: 'POST',
                  headers: {
                    'Authorization': apiKey,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    from: fromPhoneNumberId,
                    to: [phoneNumber],
                    content: smsMessage
                  })
                })
              }
            }
          }
        } catch (error) {
          console.error('Failed to send SMS notification:', error)
          // Continue anyway - don't fail the message post
        }
      }
    }

    const updatedConversation = getConversation(params.id)

    return new Response(
      JSON.stringify({
        success: true,
        conversation: updatedConversation
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error posting message:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to post message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
