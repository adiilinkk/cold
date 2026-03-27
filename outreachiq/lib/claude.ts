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

async function callGemini(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key not configured");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

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

hooks = specific personalization angles you used
personalization_score = 1-100 based on how personalized the email is
open_estimate = estimated open rate percentage
reply_estimate = estimated reply rate percentage`;

  const userPrompt = `Write a cold email for:
- Prospect: ${params.prospectName}
- Title: ${params.prospectTitle || "Unknown"}
- Company: ${params.prospectCompany || "Unknown"}
- LinkedIn: ${params.linkedinUrl}
- From: ${params.senderName}
- Tone: ${params.tone}
- Goal: ${params.goal}

Make it feel hyper-personalized based on their role and company.`;

  const text = await callGemini(userPrompt, systemPrompt);
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      subject: parsed.subject || "Quick question",
      body: parsed.body || "",
      hooks: parsed.hooks || [],
      personalization_score: parsed.personalization_score || 70,
      open_estimate: parsed.open_estimate || "35%",
      reply_estimate: parsed.reply_estimate || "8%",
    };
  } catch {
    return {
      subject: "Quick question for you",
      body: cleaned,
      hooks: ["Based on your profile"],
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
Write Day 3 and Day 7 follow-ups that are short (2-3 sentences), add new value, and are progressively more direct.
Respond with valid JSON only:
{
  "followups": [
    { "day": 3, "subject": "Re: original subject", "body": "follow up body" },
    { "day": 7, "subject": "Re: original subject", "body": "follow up body" }
  ]
}`;

  const userPrompt = `Original email:
Subject: ${originalEmail.subject}
Body: ${originalEmail.body}

Prospect: ${prospect.name}, ${prospect.title || "Unknown"} at ${prospect.company || "Unknown"}
From: ${senderName}

Generate Day 3 and Day 7 follow-ups.`;

  const text = await callGemini(userPrompt, systemPrompt);
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return parsed.followups || [];
  } catch {
    return [
      {
        day: 3,
        subject: `Re: ${originalEmail.subject}`,
        body: `Hi ${prospect.name}, just following up on my previous email. Would love to connect briefly — does this week work?\n\nBest,\n${senderName}`,
      },
      {
        day: 7,
        subject: `Re: ${originalEmail.subject}`,
        body: `${prospect.name}, last follow-up from me. Happy to connect whenever the timing is right.\n\n${senderName}`,
      },
    ];
  }
}
