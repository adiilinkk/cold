import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface EmailGenerationParams {
  prospectName: string;
  prospectTitle: string | null;
  prospectCompany: string | null;
  linkedinUrl: string;
  tone: string;
  goal: string;
  senderName: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  hooks: string[];
  personalization_score: number;
  open_estimate: string;
  reply_estimate: string;
}

export interface FollowUpEmail {
  day: number;
  subject: string;
  body: string;
}

const TONE_DESCRIPTIONS: Record<string, string> = {
  Direct: "concise, no fluff, straight to value",
  Warm: "friendly, genuine, conversational",
  Witty: "clever, slightly humorous, memorable",
  Executive: "polished, high-level, peer-to-peer tone",
  Consultative: "thought-leader, insights-driven, advisory",
  Bold: "confident, assertive, pattern-interrupting",
};

const GOAL_DESCRIPTIONS: Record<string, string> = {
  "Book a demo": "get them to schedule a 15-min demo call",
  "Start a conversation": "open a dialogue, no pressure ask",
  "Share a resource": "provide value with a relevant piece of content",
  "Partnership pitch": "propose a mutually beneficial collaboration",
};

export async function generateColdEmail(
  params: EmailGenerationParams
): Promise<GeneratedEmail> {
  const toneDesc = TONE_DESCRIPTIONS[params.tone] || params.tone;
  const goalDesc = GOAL_DESCRIPTIONS[params.goal] || params.goal;

  const systemPrompt = `You are an elite B2B cold email copywriter. You write hyper-personalized cold emails that get replies.

RULES:
- Subject line: max 8 words, curiosity-driven, no clickbait
- Body: exactly 3-4 sentences, no fluff
- One clear CTA at the end
- Reference specific details about the prospect
- Tone: ${toneDesc}
- Goal: ${goalDesc}

ALWAYS respond with valid JSON only, no markdown, no code blocks:
{
  "subject": "subject line under 8 words",
  "body": "3-4 sentence email body with clear CTA",
  "hooks": ["hook1", "hook2", "hook3"],
  "personalization_score": 85,
  "open_estimate": "42%",
  "reply_estimate": "12%"
}

hooks = specific personalization angles you used (e.g., "Referenced their recent funding", "Mentioned their tech stack")
personalization_score = 1-100 based on how personalized the email is
open_estimate = estimated open rate percentage
reply_estimate = estimated reply rate percentage`;

  const userMessage = `Write a cold email for:
- Prospect: ${params.prospectName}
- Title: ${params.prospectTitle || "Unknown"}
- Company: ${params.prospectCompany || "Unknown"}
- LinkedIn: ${params.linkedinUrl}
- From: ${params.senderName}
- Tone: ${params.tone}
- Goal: ${params.goal}

Research their LinkedIn profile and company to find personalization angles. Make it feel like you actually know them.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 3,
      } as any,
    ],
    tool_choice: { type: "auto" },
  });

  // Extract text content from the response
  let emailJson = "";
  for (const block of response.content) {
    if (block.type === "text") {
      emailJson = block.text;
      break;
    }
  }

  // If we got tool use results but no final text, make another call
  if (!emailJson && response.stop_reason === "tool_use") {
    const toolResults = response.content
      .filter((b) => b.type === "tool_use")
      .map((b: any) => ({
        type: "tool_result" as const,
        tool_use_id: b.id,
        content: "Search completed",
      }));

    const followUp = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: "user", content: userMessage },
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults },
      ],
    });

    for (const block of followUp.content) {
      if (block.type === "text") {
        emailJson = block.text;
        break;
      }
    }
  }

  // Clean and parse JSON
  emailJson = emailJson.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    const parsed = JSON.parse(emailJson);
    return {
      subject: parsed.subject || "Quick question",
      body: parsed.body || "",
      hooks: parsed.hooks || [],
      personalization_score: parsed.personalization_score || 70,
      open_estimate: parsed.open_estimate || "35%",
      reply_estimate: parsed.reply_estimate || "8%",
    };
  } catch {
    // Fallback if JSON parsing fails
    return {
      subject: "Quick question for you",
      body: emailJson,
      hooks: ["Based on LinkedIn profile"],
      personalization_score: 60,
      open_estimate: "30%",
      reply_estimate: "6%",
    };
  }
}

export async function generateFollowUpSequence(
  originalEmail: { subject: string; body: string },
  prospect: { name: string; company: string | null; title: string | null },
  senderName: string
): Promise<FollowUpEmail[]> {
  const systemPrompt = `You are an expert at writing cold email follow-up sequences.

Write Day 3 and Day 7 follow-ups that are:
- Short (2-3 sentences max)
- Add new value, don't just "bump" the thread
- Reference the original email context
- Progressively more direct

Respond with valid JSON only:
{
  "followups": [
    { "day": 3, "subject": "Re: [original subject]", "body": "follow up body" },
    { "day": 7, "subject": "Re: [original subject]", "body": "follow up body" }
  ]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Original email:
Subject: ${originalEmail.subject}
Body: ${originalEmail.body}

Prospect: ${prospect.name}, ${prospect.title || "Unknown"} at ${prospect.company || "Unknown"}
From: ${senderName}

Generate Day 3 and Day 7 follow-ups.`,
      },
    ],
  });

  let json = "";
  for (const block of response.content) {
    if (block.type === "text") {
      json = block.text;
      break;
    }
  }

  json = json.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    const parsed = JSON.parse(json);
    return parsed.followups || [];
  } catch {
    return [
      {
        day: 3,
        subject: `Re: ${originalEmail.subject}`,
        body: `Hi ${prospect.name}, just wanted to follow up on my previous email. Would love to connect briefly — does this week work for you?\n\nBest,\n${senderName}`,
      },
      {
        day: 7,
        subject: `Re: ${originalEmail.subject}`,
        body: `${prospect.name}, last follow-up from me. Happy to share more context or connect whenever the timing is right.\n\n${senderName}`,
      },
    ];
  }
}
