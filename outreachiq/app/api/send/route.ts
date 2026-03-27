import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/resend";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      to,
      subject,
      body,
      fromName,
      fromEmail,
      prospectData,
      generatedEmailData,
      linkedinUrl,
      tone,
      goal,
    } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, body" },
        { status: 400 }
      );
    }

    // Get user's Resend API key if they have one
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { resendKey: true },
    });

    // Send the email
    await sendEmail({
      to,
      subject,
      body,
      fromName: fromName || session.user.name || "OutreachIQ User",
      fromEmail,
      apiKey: user?.resendKey || undefined,
    });

    // Save to database
    const savedEmail = await prisma.generatedEmail.create({
      data: {
        userId: (session.user as any).id,
        prospectName: prospectData?.name || "Unknown",
        prospectEmail: to,
        prospectTitle: prospectData?.title || null,
        prospectCompany: prospectData?.company || null,
        prospectPhone: prospectData?.phone || null,
        linkedinUrl: linkedinUrl || null,
        tone: tone || null,
        goal: goal || null,
        subject,
        body,
        hooks: generatedEmailData?.hooks || [],
        personalizationScore: generatedEmailData?.personalization_score || null,
        openEstimate: generatedEmailData?.open_estimate || null,
        replyEstimate: generatedEmailData?.reply_estimate || null,
        status: "SENT",
      },
    });

    return NextResponse.json({ success: true, emailId: savedEmail.id });
  } catch (error: any) {
    console.error("Send error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
