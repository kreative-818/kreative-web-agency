
/**
 * OpenPhone SMS Outreach Integration
 * Sends SMS messages via OpenPhone API
 */

interface SendSMSOptions {
  to: string;
  message: string;
  fromNumber?: string;
}

interface OpenPhoneResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendSMS(options: SendSMSOptions): Promise<OpenPhoneResponse> {
  const { to, message, fromNumber } = options;
  const apiKey = process.env.OPENPHONE_API_KEY;

  if (!apiKey) {
    console.error('OpenPhone API key not configured');
    return { success: false, error: 'API key not configured' };
  }

  try {
    // Clean phone number - remove non-digits
    const cleanedPhone = to.replace(/\D/g, '');
    
    // Ensure phone number has country code
    const phoneWithCountryCode = cleanedPhone.startsWith('1') 
      ? `+${cleanedPhone}` 
      : `+1${cleanedPhone}`;

    const response = await fetch('https://api.openphone.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromNumber || process.env.OPENPHONE_FROM_NUMBER,
        to: [phoneWithCountryCode],
        content: message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenPhone API error:', error);
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    
    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: String(error) };
  }
}

// Template messages for different lead types
export const SMS_TEMPLATES = {
  initial_contact_hot: (businessName: string) => 
    `Hi! I noticed ${businessName} could benefit from a website upgrade. We specialize in helping local businesses like yours get more customers online. Can we chat for 5 minutes? - Kreative Web Agency`,
    
  initial_contact_warm: (businessName: string) =>
    `Hello! We help local businesses like ${businessName} improve their online presence. Would you be interested in a free website evaluation? Reply YES for details.`,
    
  initial_contact_no_website: (businessName: string) =>
    `Hi! I see ${businessName} doesn't have a website yet. We're offering special pricing for local businesses - $79/month, no upfront costs. Interested? Reply YES.`,
    
  follow_up_no_response: (businessName: string) =>
    `Quick follow-up - still interested in discussing a website for ${businessName}? We have a special offer ending soon. Let me know! - Kreative Web Agency`,
    
  offer_free_audit: (businessName: string, websiteUrl: string) =>
    `Hi! I ran a quick analysis on ${websiteUrl} and found some opportunities to improve your ranking and conversions. Want the free report? Reply YES.`,
    
  pricing_inquiry_response: () =>
    `Great question! We have 2 options: 1) $79/mo with $0 upfront OR 2) One-time build starting at $1,500. Both include hosting, updates & support. Which interests you?`,
    
  qualified_lead_response: (businessName: string) =>
    `Awesome! I'd love to show you what we can do for ${businessName}. Do you have 15 minutes this week for a quick call? I can share some examples similar to your industry.`,
};

export async function sendInitialOutreach(
  businessName: string,
  phone: string,
  leadCategory: string,
  websiteUrl?: string
): Promise<OpenPhoneResponse> {
  let message = '';

  if (leadCategory === 'HOT') {
    message = SMS_TEMPLATES.initial_contact_hot(businessName);
  } else if (!websiteUrl) {
    message = SMS_TEMPLATES.initial_contact_no_website(businessName);
  } else {
    message = SMS_TEMPLATES.initial_contact_warm(businessName);
  }

  return sendSMS({ to: phone, message });
}

export async function sendFollowUp(
  businessName: string,
  phone: string,
  websiteUrl?: string
): Promise<OpenPhoneResponse> {
  const message = websiteUrl
    ? SMS_TEMPLATES.offer_free_audit(businessName, websiteUrl)
    : SMS_TEMPLATES.follow_up_no_response(businessName);

  return sendSMS({ to: phone, message });
}
