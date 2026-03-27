import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { lookupProspect } from "@/lib/apollo";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkedinUrl } = await request.json();

    if (!linkedinUrl || !linkedinUrl.includes("linkedin.com")) {
      return NextResponse.json(
        { error: "Valid LinkedIn URL required" },
        { status: 400 }
      );
    }

    // Get user's Apollo API key if they have one
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { apolloKey: true },
    });

    const prospect = await lookupProspect(linkedinUrl, user?.apolloKey || undefined);

    return NextResponse.json({ prospect });
  } catch (error: any) {
    console.error("Apollo lookup error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to lookup prospect" },
      { status: 500 }
    );
  }
}
