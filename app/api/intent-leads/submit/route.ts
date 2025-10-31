
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validatePhone } from "@/lib/phone-validation";
import { calculateIntentLeadScore, getBudgetAmount, getUrgencyScore } from "@/lib/lead-scoring";
import { sendOpenPhoneSMS, sendOwnerNotification } from "@/lib/openphone";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      businessName,
      businessType,
      currentWebsite,
      projectType,
      projectDescription,
      features,
      budgetRange,
      timeline,
      timeToComplete,
      landingPage
    } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !projectType || !budgetRange || !timeline) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneValidation = await validatePhone(phone);

    // Calculate lead score
    const scoring = calculateIntentLeadScore({
      budgetRange,
      timeline,
      projectType,
      hasBusinessName: !!businessName,
      hasWebsite: !!currentWebsite,
      phoneType: phoneValidation.phoneType,
      formCompletionTime: timeToComplete
    });

    // Create lead in database
    const lead = await prisma.intentLead.create({
      data: {
        fullName,
        email,
        phone: phoneValidation.formatted,
        phoneType: phoneValidation.phoneType,
        phoneCarrier: phoneValidation.carrier,
        phoneValid: phoneValidation.valid,
        businessName: businessName || null,
        businessType: businessType || null,
        currentWebsite: currentWebsite || null,
        projectType,
        projectDescription: projectDescription || null,
        features: features || [],
        budgetRange,
        budgetAmount: getBudgetAmount(budgetRange),
        timeline,
        urgencyScore: getUrgencyScore(timeline),
        leadScore: scoring.score,
        qualificationStatus: scoring.qualificationStatus,
        disqualifyReason: scoring.disqualifyReason,
        landingPage: landingPage || "/get-quote",
        formStartedAt: new Date(Date.now() - timeToComplete * 1000),
        formCompletedAt: new Date(),
        timeToComplete
      }
    });

    // Send automated confirmation email
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Kreative Web Agency <support@kreativewebagency.com>",
          to: email,
          subject: "We received your project request!",
          html: `
            <h1>Thank you, ${fullName}!</h1>
            <p>We've received your request for a ${projectType.replace(/_/g, ' ').toLowerCase()} project.</p>
            <p><strong>What happens next:</strong></p>
            <ul>
              <li>Our team is reviewing your requirements</li>
              <li>You'll receive a custom proposal within 24 hours</li>
              <li>We'll reach out via ${phoneValidation.canReceiveSMS ? 'text and email' : 'email'}</li>
            </ul>
            <p>Budget: $${budgetRange.replace('-', ' - ')}<br/>
            Timeline: ${timeline.replace(/_/g, ' ')}</p>
            <p>Thanks,<br/>Kreative Web Agency Team</p>
          `
        });
      }
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    // Send SMS confirmation if mobile
    if (phoneValidation.canReceiveSMS) {
      try {
        await sendOpenPhoneSMS({
          to: phoneValidation.formatted,
          message: `Hi ${fullName}! Thanks for reaching out to Kreative Web Agency. We've received your ${projectType.replace(/_/g, ' ')} project request and will contact you within 24 hours with a custom quote!`
        });
      } catch (smsError) {
        console.error("SMS send error:", smsError);
      }
    }

    // Notify owner if lead is qualified
    if (scoring.qualificationStatus === 'QUALIFIED') {
      try {
        await sendOwnerNotification({
          name: fullName,
          businessName: businessName || 'N/A',
          phone: phoneValidation.formatted,
          email,
          budget: budgetRange,
          project: projectType.replace(/_/g, ' '),
          timeline: timeline.replace(/_/g, ' '),
          score: scoring.score
        });

        // Mark notification as sent
        await prisma.intentLead.update({
          where: { id: lead.id },
          data: { notificationSent: true }
        });
      } catch (notifyError) {
        console.error("Owner notification error:", notifyError);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      score: scoring.score,
      category: scoring.category,
      qualified: scoring.qualificationStatus === 'QUALIFIED'
    });

  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process lead" },
      { status: 500 }
    );
  }
}
