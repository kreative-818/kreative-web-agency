
import { NextRequest } from 'next/server'
import { createConversation, updateConversation, addMessage, getConversation } from '@/lib/conversation-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Load OpenPhone credentials from environment variables
function getOpenPhoneCredentials() {
  return {
    apiKey: process.env.OPENPHONE_API_KEY,
    phoneNumber: process.env.OPENPHONE_PHONE_NUMBER
  }
}

// Send SMS via OpenPhone API
async function sendSMS(message: string) {
  const { apiKey, phoneNumber } = getOpenPhoneCredentials()
  
  console.log('OpenPhone API Key exists:', !!apiKey)
  console.log('OpenPhone Phone Number exists:', !!phoneNumber)
  console.log('Environment check:', {
    hasApiKey: !!process.env.OPENPHONE_API_KEY,
    hasPhoneNumber: !!process.env.OPENPHONE_PHONE_NUMBER
  })
  
  if (!apiKey || !phoneNumber) {
    console.error('OpenPhone credentials not configured')
    return { success: false, error: 'SMS credentials not configured' }
  }

  try {
    // First, get the list of phone numbers to find the phoneNumberId
    const numbersResponse = await fetch('https://api.openphone.com/v1/phone-numbers', {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    })

    if (!numbersResponse.ok) {
      throw new Error(`Failed to fetch phone numbers: ${numbersResponse.statusText}`)
    }

    const numbersData = await numbersResponse.json()
    
    // Use the first available phone number as the sender
    const fromPhoneNumberId = numbersData.data?.[0]?.id
    
    if (!fromPhoneNumberId) {
      throw new Error('No OpenPhone numbers found in account')
    }

    // Send the SMS message
    const response = await fetch('https://api.openphone.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromPhoneNumberId,
        to: [phoneNumber],
        content: message
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenPhone API error: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log('✅ SMS sent successfully via OpenPhone:', data)
    
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send SMS:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// This endpoint sends notifications when users message or request live support
export async function POST(request: NextRequest) {
  try {
    const { type, messages, userRequest, conversationId } = await request.json()
    
    // Format the conversation for the notification
    let conversationSummary = ''
    if (messages && messages.length > 0) {
      conversationSummary = messages
        .slice(-3) // Last 3 messages to keep SMS short
        .map((msg: any) => `${msg.role === 'user' ? 'Visitor' : 'AI'}: ${msg.content}`)
        .join('\n')
    }

    // Create SMS content (keep it concise for SMS)
    const smsMessage = type === 'live_support_request'
      ? `🚨 LIVE SUPPORT REQUEST!\n\nVisitor needs help now!\n\n${userRequest ? `Request: ${userRequest}\n\n` : ''}Recent chat:\n${conversationSummary}\n\nRespond at: creative-web-agency-udkh1b.abacusai.app`
      : `💬 New website visitor chat!\n\n${conversationSummary}\n\nView at: creative-web-agency-udkh1b.abacusai.app`

    // Send SMS notification
    const smsResult = await sendSMS(smsMessage)

    if (!smsResult.success) {
      console.warn('SMS notification failed, but continuing...')
    }

    // If this is a live support request, create/update conversation
    if (type === 'live_support_request' && conversationId) {
      const { phoneNumber } = getOpenPhoneCredentials()
      
      let conversation = getConversation(conversationId)
      if (!conversation) {
        conversation = createConversation(conversationId)
      }
      
      // Update conversation status and link phone number
      updateConversation(conversationId, {
        status: 'live_support',
        phoneNumber: phoneNumber || undefined
      })
      
      // Add all messages to the conversation store
      if (messages && messages.length > 0) {
        messages.forEach((msg: any) => {
          addMessage(conversationId, msg.role, msg.content)
        })
      }
      
      // Add the support request message
      addMessage(conversationId, 'assistant', '🔴 Live support requested. Our team has been notified and will respond shortly.')
      
      console.log(`Created/updated conversation ${conversationId} for live support`)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Notification sent successfully',
        sms: smsResult.success ? 'sent' : 'failed',
        conversationId
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Notification error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to send notification' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
