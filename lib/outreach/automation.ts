
/**
 * Automated Outreach Orchestration
 * Manages the full outreach workflow
 */

import { prisma } from '../db';
import { validatePhone } from '../phone-validation';
import { sendInitialOutreach, sendFollowUp } from './openphone';
import { sendEmail, getInitialOutreachEmail, getFollowUpEmail } from './email';

interface OutreachResult {
  success: boolean;
  smsSent: boolean;
  emailSent: boolean;
  leadId: string;
  error?: string;
}

export async function startOutreachCampaign(
  leadId: string,
  channel: 'SMS' | 'EMAIL' | 'BOTH' = 'BOTH'
): Promise<OutreachResult> {
  try {
    // Get lead from database
    const lead = await prisma.scrapedLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return {
        success: false,
        smsSent: false,
        emailSent: false,
        leadId,
        error: 'Lead not found',
      };
    }

    // Skip if already contacted recently (within 7 days)
    if (lead.lastContactedAt) {
      const daysSinceContact = Math.floor(
        (Date.now() - lead.lastContactedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceContact < 7) {
        return {
          success: false,
          smsSent: false,
          emailSent: false,
          leadId,
          error: `Already contacted ${daysSinceContact} days ago`,
        };
      }
    }

    let smsSent = false;
    let emailSent = false;

    // Send SMS if channel allows and phone is available
    if ((channel === 'SMS' || channel === 'BOTH') && lead.phone) {
      // Validate phone first
      const phoneValidation = await validatePhone(lead.phone);
      
      if (phoneValidation.valid && phoneValidation.phoneType === 'MOBILE') {
        const smsResult = await sendInitialOutreach(
          lead.businessName,
          lead.phone,
          lead.leadCategory || 'COLD',
          lead.websiteUrl || undefined
        );
        
        smsSent = smsResult.success;
      } else {
        console.log(`Skipping SMS for ${lead.businessName} - not a mobile number`);
      }
    }

    // Send Email if channel allows and email is available
    if ((channel === 'EMAIL' || channel === 'BOTH') && lead.email) {
      const emailTemplate = getInitialOutreachEmail(
        lead.businessName,
        lead.businessName, // Use business name as contact name if not available
        lead.websiteUrl || undefined
      );
      
      const emailResult = await sendEmail({
        to: lead.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
      
      emailSent = emailResult.success;
    }

    // Update lead status in database
    await prisma.scrapedLead.update({
      where: { id: leadId },
      data: {
        status: smsSent || emailSent ? 'CONTACTED' : 'NEW',
        firstContactedAt: !lead.firstContactedAt ? new Date() : undefined,
        lastContactedAt: new Date(),
        contactAttempts: { increment: 1 },
      },
    });

    return {
      success: smsSent || emailSent,
      smsSent,
      emailSent,
      leadId,
      error: !smsSent && !emailSent ? 'No valid contact methods' : undefined,
    };
  } catch (error) {
    console.error('Outreach campaign error:', error);
    return {
      success: false,
      smsSent: false,
      emailSent: false,
      leadId,
      error: String(error),
    };
  }
}

export async function startBulkOutreach(
  filters?: {
    minScore?: number;
    category?: string;
    city?: string;
    limit?: number;
  }
): Promise<{ total: number; successful: number; results: OutreachResult[] }> {
  const { minScore = 50, category, city, limit = 50 } = filters || {};

  // Get leads that match criteria and haven't been contacted in last 7 days
  const leads = await prisma.scrapedLead.findMany({
    where: {
      AND: [
        { leadScore: { gte: minScore } },
        { status: { in: ['NEW', 'COLD'] } },
        {
          OR: [
            { lastContactedAt: null },
            {
              lastContactedAt: {
                lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
              },
            },
          ],
        },
        category ? { leadCategory: category } : {},
        city ? { city } : {},
        {
          OR: [
            { phone: { not: null } },
            { email: { not: null } },
          ],
        },
      ],
    },
    take: limit,
    orderBy: { leadScore: 'desc' },
  });

  console.log(`Starting bulk outreach to ${leads.length} leads...`);

  const results: OutreachResult[] = [];
  let successful = 0;

  for (const lead of leads) {
    const result = await startOutreachCampaign(lead.id, 'BOTH');
    results.push(result);
    
    if (result.success) {
      successful++;
    }

    // Rate limiting - wait 2 seconds between messages
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return {
    total: leads.length,
    successful,
    results,
  };
}

export async function sendFollowUpCampaign(
  daysSinceLastContact: number = 7
): Promise<{ total: number; successful: number }> {
  // Get leads that were contacted but haven't responded
  const leads = await prisma.scrapedLead.findMany({
    where: {
      status: 'CONTACTED',
      responseReceived: false,
      lastContactedAt: {
        gte: new Date(Date.now() - daysSinceLastContact * 24 * 60 * 60 * 1000),
        lt: new Date(Date.now() - (daysSinceLastContact - 1) * 24 * 60 * 60 * 1000),
      },
    },
    take: 100,
  });

  console.log(`Sending follow-ups to ${leads.length} leads...`);

  let successful = 0;

  for (const lead of leads) {
    try {
      // Send follow-up via SMS if available
      if (lead.phone) {
        const smsResult = await sendFollowUp(
          lead.businessName,
          lead.phone,
          lead.websiteUrl || undefined
        );
        
        if (smsResult.success) {
          successful++;
        }
      }

      // Send follow-up via email if available
      if (lead.email) {
        const emailTemplate = getFollowUpEmail(
          lead.businessName,
          lead.businessName
        );
        
        await sendEmail({
          to: lead.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });
      }

      // Update contact tracking
      await prisma.scrapedLead.update({
        where: { id: lead.id },
        data: {
          lastContactedAt: new Date(),
          contactAttempts: { increment: 1 },
        },
      });

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Follow-up error for ${lead.businessName}:`, error);
    }
  }

  return {
    total: leads.length,
    successful,
  };
}
