import nodemailer from "nodemailer";

// Create SMTP transporter for Microsoft 365
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.office365.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });
};

// Generic email sending function
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: from || `Joey - Kreative Intelligence <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

export async function sendLeadNotificationEmail(
  leadData: {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    businessName?: string | null;
    projectType?: string | null;
    budget?: string | null;
    timeline?: string | null;
    source: string;
    score: number;
  }
) {
  const isHotLead = leadData.score >= 8;

  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: ${isHotLead ? "#ef4444" : "#3b82f6"};
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 14px;
              font-weight: 600;
              margin-right: 8px;
            }
            .hot {
              background: #fee2e2;
              color: #991b1b;
            }
            .warm {
              background: #fed7aa;
              color: #9a3412;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 140px 1fr;
              gap: 12px;
              margin: 20px 0;
            }
            .label {
              font-weight: 600;
              color: #6b7280;
            }
            .value {
              color: #111827;
            }
            .cta {
              background: #3b82f6;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">
              ${isHotLead ? "🔥 HOT LEAD ALERT!" : "📞 New Lead from Sophia"}
            </h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; margin-top: 0;">
              ${
                isHotLead
                  ? "This is a high-priority lead! Drop everything and call them ASAP!"
                  : "A new lead just came in through Sophia (your AI assistant)."
              }
            </p>

            <div style="margin: 20px 0;">
              <span class="badge ${isHotLead ? "hot" : "warm"}">
                Urgency Score: ${leadData.score}/10
              </span>
              <span class="badge" style="background: #dbeafe; color: #1e40af;">
                ${leadData.source.toUpperCase()}
              </span>
            </div>

            <div class="info-grid">
              <div class="label">Name:</div>
              <div class="value">${leadData.name}</div>

              ${
                leadData.businessName
                  ? `
                <div class="label">Business:</div>
                <div class="value">${leadData.businessName}</div>
              `
                  : ""
              }

              ${
                leadData.email
                  ? `
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${leadData.email}">${leadData.email}</a></div>
              `
                  : ""
              }

              ${
                leadData.phone
                  ? `
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${leadData.phone}">${leadData.phone}</a></div>
              `
                  : ""
              }

              ${
                leadData.projectType
                  ? `
                <div class="label">Project Type:</div>
                <div class="value">${leadData.projectType}</div>
              `
                  : ""
              }

              ${
                leadData.budget
                  ? `
                <div class="label">Budget:</div>
                <div class="value">${leadData.budget}</div>
              `
                  : ""
              }

              ${
                leadData.timeline
                  ? `
                <div class="label">Timeline:</div>
                <div class="value">${leadData.timeline}</div>
              `
                  : ""
              }
            </div>

            <a href="https://kreativeaiagency.com/admin/leads" class="cta">
              View Full Lead Details →
            </a>

            <p style="margin-top: 30px; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              <strong>Next Steps:</strong><br>
              ${
                isHotLead
                  ? "1. Call them within 5 minutes (hot leads convert 10x better!)<br>2. Reference their specific project needs<br>3. Send a quick quote to seal the deal"
                  : "1. Review their full details in the admin dashboard<br>2. Automated follow-ups are already scheduled<br>3. Reach out within 24 hours for best results"
              }
            </p>
          </div>
        </body>
      </html>
    `;

    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `Joey - Kreative Intelligence <${process.env.EMAIL_USER}>`,
      to: process.env.BUSINESS_EMAIL || process.env.EMAIL_USER,
      subject: isHotLead
        ? `🔥 HOT LEAD: ${leadData.name} (${leadData.score}/10)`
        : `📞 New Lead: ${leadData.name} from ${leadData.source}`,
      html: emailHtml,
    });

    console.log("✅ Lead notification email sent successfully");
  } catch (error) {
    console.error("❌ Error sending lead notification email:", error);
    // Don't throw - we don't want to fail the webhook if email fails
  }
}

export async function sendFollowUpEmail(
  to: string,
  subject: string,
  content: string
) {
  try {
    // Convert plain text content to HTML with line breaks
    const htmlContent = content.replace(/\n/g, "<br>");

    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `Joey - Kreative Intelligence <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p><strong>Joey</strong> - Kreative Intelligence Agency<br>
              Building websites & automation that drive real results<br>
              <a href="https://kreativeaiagency.com">kreativeaiagency.com</a><br>
              <a href="mailto:support@kreativewebagency.com">support@kreativewebagency.com</a></p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("✅ Follow-up email sent to:", to);
  } catch (error) {
    console.error("❌ Error sending follow-up email:", error);
    throw error;
  }
}
