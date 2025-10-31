
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'support@kreativewebagency.com';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kreativeaiagency.com';

export async function sendClientWelcomeEmail(data: {
  clientName: string;
  clientEmail: string;
  password: string;
  businessName?: string;
}) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Your Client Portal! 🎉</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.clientName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              We're excited to have you on board! Your dedicated client portal has been set up, 
              giving you 24/7 access to track your project progress in real-time.
            </p>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
              <h2 style="color: #667eea; margin-top: 0; font-size: 18px;">Your Login Credentials</h2>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${data.clientEmail}</p>
              <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background: #e9ecef; padding: 5px 10px; border-radius: 4px; font-size: 14px;">${data.password}</code></p>
              <p style="margin: 10px 0; color: #666; font-size: 14px;"><em>Please save these credentials in a safe place.</em></p>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${BASE_URL}/portal/login" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; 
                        font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Access Your Portal
              </a>
            </div>
            
            <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #667eea; margin-top: 0; font-size: 16px;">What You Can Do:</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li style="margin: 8px 0;">📊 Track your project progress in real-time</li>
                <li style="margin: 8px 0;">✅ View completed and upcoming milestones</li>
                <li style="margin: 8px 0;">💬 Read updates and notes from our team</li>
                <li style="margin: 8px 0;">📅 Monitor timelines and deliverables</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Think of it as your project's "pizza tracker" – you'll always know exactly where things stand! 
              We'll keep you updated as we make progress.
            </p>
            
            <p style="font-size: 16px; margin-top: 20px;">
              If you have any questions or need assistance, don't hesitate to reach out.
            </p>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong>The Kreative Web Agency Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 13px; color: #666; text-align: center; margin-top: 20px;">
              📧 <a href="mailto:support@kreativewebagency.com" style="color: #667eea; text-decoration: none;">support@kreativewebagency.com</a><br>
              📞 (704) 555-1234
            </p>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.clientEmail],
      subject: `Welcome to Your Client Portal - ${data.businessName || 'Kreative Web Agency'}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendProjectUpdateEmail(data: {
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  updateMessage: string;
  projectUrl: string;
}) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Project Update 📢</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.clientName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              We have a new update on your project: <strong>${data.projectTitle}</strong>
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6;">${data.updateMessage}</p>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${data.projectUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; 
                        font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                View Project Details
              </a>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong>The Kreative Web Agency Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 13px; color: #666; text-align: center;">
              📧 <a href="mailto:support@kreativewebagency.com" style="color: #667eea;">support@kreativewebagency.com</a>
            </p>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.clientEmail],
      subject: `Project Update: ${data.projectTitle}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Failed to send project update email:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending project update email:', error);
    return { success: false, error };
  }
}

export async function sendMilestoneCompletedEmail(data: {
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  milestoneName: string;
  projectUrl: string;
}) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Milestone Completed! ✅</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.clientName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! We've completed another milestone on your project.
            </p>
            
            <div style="background: #f0fdf4; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #059669; font-weight: 600;">PROJECT</p>
              <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #1f2937;">${data.projectTitle}</p>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #059669; font-weight: 600;">COMPLETED MILESTONE</p>
              <p style="margin: 0; font-size: 16px; color: #1f2937;">${data.milestoneName}</p>
            </div>
            
            <p style="font-size: 16px; margin: 25px 0;">
              We're making great progress! Login to your portal to see the updated status and what's coming next.
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${data.projectUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; 
                        font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
                View Progress
              </a>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong>The Kreative Web Agency Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 13px; color: #666; text-align: center;">
              📧 <a href="mailto:support@kreativewebagency.com" style="color: #667eea;">support@kreativewebagency.com</a>
            </p>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.clientEmail],
      subject: `✅ Milestone Completed: ${data.milestoneName}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Failed to send milestone email:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error sending milestone email:', error);
    return { success: false, error };
  }
}
