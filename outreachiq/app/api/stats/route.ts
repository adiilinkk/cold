import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const [totalEmails, sentEmails, repliedEmails] = await Promise.all([
      prisma.generatedEmail.count({ where: { userId } }),
      prisma.generatedEmail.count({ where: { userId, status: "SENT" } }),
      prisma.generatedEmail.count({ where: { userId, status: "REPLIED" } }),
    ]);

    const avgReplyRate =
      sentEmails > 0
        ? Math.round((repliedEmails / sentEmails) * 100)
        : 0;

    return NextResponse.json({
      stats: {
        totalGenerated: totalEmails,
        totalSent: sentEmails,
        avgReplyRate: `${avgReplyRate}%`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
