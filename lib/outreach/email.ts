
/**
 * Email Outreach System
 * Sends automated emails to leads
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const { to, subject, html, text } = options;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('Resend API key not configured');
    return { success: false, error: 'Email API not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kreative Web Agency <hello@kreative.abacusai.app>',
        to: [to],
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email API error:', error);
      return { success: false, error: `API error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: String(error) };
  }
}

// Email templates
export function getInitialOutreachEmail(
  businessName: string,
  contactName: string,
  websiteUrl?: string
): { subject: string; html: string } {
  const subject = websiteUrl
    ? `Quick website audit for ${businessName}`
    : `Professional website for ${businessName} - $79/month`;

  const html = websiteUrl
    ? `
      <h2>Hi ${contactName},</h2>
      <p>I came across ${businessName} online and wanted to reach out with something that might interest you.</p>
      <p>I ran a quick analysis on your website (${websiteUrl}) and noticed some opportunities that could help you:</p>
      <ul>
        <li>Improve your Google ranking</li>
        <li>Get more leads from your website</li>
        <li>Increase conversions</li>
      </ul>
      <p><strong>Would you like the full audit?</strong> It's completely free and takes just 15 minutes to review together.</p>
      <p>Best regards,<br/>
      The Kreative Web Agency Team</p>
      <p style="font-size: 12px; color: #666;">
        P.S. We specialize in helping local businesses like yours. Reply to this email or call us at (555) 123-4567.
      </p>
    `
    : `
      <h2>Hi ${contactName},</h2>
      <p>I noticed ${businessName} doesn't have a website yet, and I wanted to reach out with an opportunity.</p>
      <p>We're offering <strong>professional websites for just $79/month</strong> with no upfront costs. This includes:</p>
      <ul>
        <li>Custom design</li>
        <li>Mobile-responsive</li>
        <li>Hosting & SSL included</li>
        <li>Monthly updates & support</li>
      </ul>
      <p>Most of our clients see more customers within the first month of launching.</p>
      <p><strong>Interested in learning more?</strong> Just reply to this email and I'll send you some examples.</p>
      <p>Best regards,<br/>
      The Kreative Web Agency Team</p>
    `;

  return { subject, html };
}

export function getFollowUpEmail(
  businessName: string,
  contactName: string
): { subject: string; html: string } {
  return {
    subject: `Following up - ${businessName} website`,
    html: `
      <h2>Hi ${contactName},</h2>
      <p>I wanted to follow up on my previous message about creating a professional website for ${businessName}.</p>
      <p>I know you're busy, so I'll keep this short. We have a limited-time offer:</p>
      <ul>
        <li><strong>$79/month</strong> with $0 upfront</li>
        <li>Includes hosting, updates, and support</li>
        <li>Mobile-responsive design</li>
        <li>Launch in 2 weeks</li>
      </ul>
      <p>Would you have 10 minutes this week for a quick call? I'd love to show you what we can do.</p>
      <p>Best regards,<br/>
      The Kreative Web Agency Team</p>
      <p style="font-size: 12px; color: #666;">
        Not interested? Just reply "NO" and I won't follow up again.
      </p>
    `,
  };
}
