
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, type, callLog, lead } = await req.json();
    
    console.log('📧 Sending email:', { to, subject, type });
    
    // Email template based on type
    let htmlContent = '';
    let textContent = '';
    
    if (type === 'call_followup') {
      htmlContent = generateCallFollowUpEmail(callLog);
      textContent = generateCallFollowUpEmailText(callLog);
    } else if (type === 'quote_confirmation') {
      htmlContent = generateQuoteConfirmationEmail(lead);
      textContent = generateQuoteConfirmationEmailText(lead);
    }
    
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      // Send via Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Kreative Web Agency <support@kreativewebagency.com>',
          to: [to],
          subject,
          html: htmlContent,
          text: textContent,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Resend API error:', error);
        throw new Error('Failed to send email via Resend');
      }
      
      console.log('✅ Email sent successfully via Resend');
      return NextResponse.json({ success: true, provider: 'resend' });
    } else {
      // Log email (API key not configured)
      console.log('ℹ️ Resend API key not configured. Email would be sent to:', to);
      console.log('📧 Email content:', { subject, htmlContent: htmlContent.substring(0, 200) });
      
      return NextResponse.json({ 
        success: true, 
        provider: 'mock',
        message: 'Email logged (Resend API key not configured)' 
      });
    }
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Call Follow-up Email Template (HTML)
function generateCallFollowUpEmail(callLog: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thanks for calling us!</h1>
    </div>
    <div class="content">
      <p>Hi ${callLog.leadName || 'there'},</p>
      
      <p>Thank you for calling <strong>Kreative Web Agency</strong>! We're excited about the opportunity to work with you on your ${callLog.leadProjectType || 'web project'}.</p>
      
      ${callLog.sonaSummary ? `<p><strong>Call Summary:</strong><br>${callLog.sonaSummary}</p>` : ''}
      
      <p><strong>What's Next?</strong></p>
      <ul>
        <li>One of our web strategists will review your project requirements</li>
        <li>We'll prepare a customized proposal for you</li>
        <li>You'll receive a follow-up call within 24 hours</li>
      </ul>
      
      <p>In the meantime, feel free to explore our portfolio and recent projects:</p>
      
      <center>
        <a href="https://creative-web-agency-zlgi4u.abacusai.app" class="button">View Our Work</a>
      </center>
      
      <p>Have questions? Just reply to this email or call us at <strong>(984) 400-9443</strong>.</p>
      
      <p>Looking forward to bringing your vision to life!</p>
      
      <p>Best regards,<br>
      <strong>The Kreative Web Agency Team</strong><br>
      support@kreativewebagency.com<br>
      (984) 400-9443</p>
    </div>
    <div class="footer">
      <p>Kreative Web Agency | Building Digital Experiences That Matter</p>
      <p>If you no longer wish to receive emails from us, <a href="#">unsubscribe here</a>.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Call Follow-up Email Template (Plain Text)
function generateCallFollowUpEmailText(callLog: any): string {
  return `
Hi ${callLog.leadName || 'there'},

Thank you for calling Kreative Web Agency! We're excited about the opportunity to work with you on your ${callLog.leadProjectType || 'web project'}.

${callLog.sonaSummary ? `Call Summary:\n${callLog.sonaSummary}\n\n` : ''}

What's Next?
- One of our web strategists will review your project requirements
- We'll prepare a customized proposal for you
- You'll receive a follow-up call within 24 hours

In the meantime, feel free to explore our portfolio at:
https://creative-web-agency-zlgi4u.abacusai.app

Have questions? Just reply to this email or call us at (984) 400-9443.

Looking forward to bringing your vision to life!

Best regards,
The Kreative Web Agency Team
support@kreativewebagency.com
(984) 400-9443

---
Kreative Web Agency | Building Digital Experiences That Matter
  `.trim();
}

// Quote Confirmation Email Template (HTML)
function generateQuoteConfirmationEmail(lead: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .quote-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Custom Quote</h1>
    </div>
    <div class="content">
      <p>Hi ${lead.customerName || 'there'},</p>
      
      <p>Thank you for your interest in <strong>Kreative Web Agency</strong>! Based on our conversation, here's your customized quote:</p>
      
      <div class="quote-box">
        <h3>${lead.service}</h3>
        <p><strong>Investment:</strong> ${lead.price}</p>
        ${lead.description ? `<p>${lead.description}</p>` : ''}
      </div>
      
      <p><strong>What's Included:</strong></p>
      <ul>
        <li>Custom design tailored to your brand</li>
        <li>Mobile-responsive development</li>
        <li>SEO optimization</li>
        <li>30 days of free support</li>
      </ul>
      
      <center>
        <a href="https://creative-web-agency-zlgi4u.abacusai.app" class="button">Get Started</a>
      </center>
      
      <p>Questions? We're here to help! Call us at <strong>(984) 400-9443</strong> or reply to this email.</p>
      
      <p>Best regards,<br>
      <strong>The Kreative Web Agency Team</strong></p>
    </div>
    <div class="footer">
      <p>Kreative Web Agency | Building Digital Experiences That Matter</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Quote Confirmation Email Template (Plain Text)
function generateQuoteConfirmationEmailText(lead: any): string {
  return `
Hi ${lead.customerName || 'there'},

Thank you for your interest in Kreative Web Agency! Based on our conversation, here's your customized quote:

${lead.service}
Investment: ${lead.price}
${lead.description || ''}

What's Included:
- Custom design tailored to your brand
- Mobile-responsive development
- SEO optimization
- 30 days of free support

Ready to get started? Visit: https://creative-web-agency-zlgi4u.abacusai.app

Questions? We're here to help! Call us at (984) 400-9443 or reply to this email.

Best regards,
The Kreative Web Agency Team

---
Kreative Web Agency | Building Digital Experiences That Matter
  `.trim();
}
