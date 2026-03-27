import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateFollowUpSequence } from "@/lib/claude";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emailId, originalEmail, prospect } = await request.json();

    if (!originalEmail || !prospect) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const followUps = await generateFollowUpSequence(
      originalEmail,
      prospect,
      session.user.name || "Your Name"
    );

    // Save follow-ups to database if emailId provided
    if (emailId && followUps.length > 0) {
      // Delete existing follow-ups for this email
      await prisma.followUp.deleteMany({
        where: { emailId },
      });

      // Create new follow-ups
      await prisma.followUp.createMany({
        data: followUps.map((fu) => ({
          emailId,
          day: fu.day,
          subject: fu.subject,
          body: fu.body,
        })),
      });
    }

    return NextResponse.json({ followUps });
  } catch (error: any) {
    console.error("Follow-up error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate follow-ups" },
      { status: 500 }
    );
  }
}
