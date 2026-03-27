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

    const emails = await prisma.generatedEmail.findMany({
      where: { userId: (session.user as any).id },
      include: {
        followUps: {
          orderBy: { day: "asc" },
        },
      },
      orderBy: { sentAt: "desc" },
    });

    return NextResponse.json({ emails });
  } catch (error: any) {
    console.error("History error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch history" },
      { status: 500 }
    );
  }
}
