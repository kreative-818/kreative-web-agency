
// OpenPhone SMS integration

type OpenPhoneSMSParams = {
  to: string;
  message: string;
  from?: string;
};

export async function sendOpenPhoneSMS({ to, message, from }: OpenPhoneSMSParams): Promise<boolean> {
  const apiKey = process.env.OPENPHONE_API_KEY;
  const defaultFrom = process.env.OPENPHONE_PHONE_NUMBER;

  if (!apiKey) {
    console.error('❌ OpenPhone API key not configured');
    return false;
  }

  if (!defaultFrom) {
    console.error('❌ OpenPhone phone number not configured');
    return false;
  }

  console.log('📤 Sending SMS via OpenPhone...');
  console.log('   To:', to);
  console.log('   From:', from || defaultFrom);
  console.log('   Message:', message.substring(0, 50) + '...');

  try {
    // OpenPhone API endpoint
    const response = await fetch('https://api.openphone.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': apiKey.startsWith('Bearer ') ? apiKey : `${apiKey}`, // OpenPhone uses direct API key
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: from || defaultFrom,
        to: [to], // Array of phone numbers
        content: message
      })
    });

    // Try to parse as JSON first, fall back to text
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    if (!response.ok) {
      console.error('❌ OpenPhone SMS failed!');
      console.error('   Status:', response.status, response.statusText);
      console.error('   Response:', JSON.stringify(responseData, null, 2));
      
      // Log additional debugging info
      if (response.status === 401) {
        console.error('   ⚠️  Authentication error - check OPENPHONE_API_KEY in .env');
      } else if (response.status === 402) {
        console.error('   ⚠️  Payment required - account may have insufficient balance or need activation');
      } else if (response.status === 403) {
        console.error('   ⚠️  Forbidden - check if US Carrier Registration is complete');
      }
      
      return false;
    }

    console.log('✅ SMS sent successfully via OpenPhone');
    console.log('   Response:', typeof responseData === 'string' ? responseData : JSON.stringify(responseData, null, 2));
    return true;
  } catch (error) {
    console.error('❌ OpenPhone SMS error:', error);
    return false;
  }
}

export async function sendOwnerNotification(leadData: {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  budget: string;
  project: string;
  timeline: string;
  score: number;
}): Promise<boolean> {
  const ownerPhone = process.env.OWNER_PHONE_NUMBER; // Your phone number

  if (!ownerPhone) {
    console.error('Owner phone number not configured');
    return false;
  }

  const message = `🔥 NEW QUALIFIED LEAD (Score: ${leadData.score})

${leadData.name} | ${leadData.businessName}
📞 ${leadData.phone}
📧 ${leadData.email}

💰 Budget: ${leadData.budget}
🎯 Project: ${leadData.project}
⏰ Timeline: ${leadData.timeline}

Ready to contact! Check dashboard for details.`;

  return sendOpenPhoneSMS({
    to: ownerPhone,
    message
  });
}

// Simple SMS reply function for webhook
export async function sendSMSReply({ to, message }: { to: string; message: string }): Promise<boolean> {
  return sendOpenPhoneSMS({ to, message });
}

// Simplified SMS function for easy use
export async function sendSMS(to: string, message: string): Promise<boolean> {
  return sendOpenPhoneSMS({ to, message });
}
