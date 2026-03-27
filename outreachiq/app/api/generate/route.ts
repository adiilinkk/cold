import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateColdEmail } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkedinUrl, tone, goal, prospectData, userName } =
      await request.json();

    if (!linkedinUrl || !tone || !goal || !prospectData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const email = await generateColdEmail({
      prospectName: prospectData.name,
      prospectTitle: prospectData.title,
      prospectCompany: prospectData.company,
      linkedinUrl,
      tone,
      goal,
      senderName: userName || session.user.name || "Your Name",
    });

    return NextResponse.json({ email });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate email" },
      { status: 500 }
    );
  }
}
