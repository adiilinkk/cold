"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { ToneSelector } from "@/components/compose/tone-selector";
import { GoalSelector } from "@/components/compose/goal-selector";
import { ProspectCard } from "@/components/compose/prospect-card";
import { EmailResult } from "@/components/compose/email-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";
import { Linkedin, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface ProspectData {
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  company: string | null;
  linkedinUrl: string | null;
  headline: string | null;
}

interface GeneratedEmail {
  subject: string;
  body: string;
  hooks: string[];
  personalization_score: number;
  open_estimate: string;
  reply_estimate: string;
}

interface FollowUp {
  day: number;
  subject: string;
  body: string;
}

export default function ComposePage() {
  const { data: session } = useSession();
  const { addToast } = useToast();

  // Form state
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [tone, setTone] = useState("Direct");
  const [goal, setGoal] = useState("Book a demo");

  // Data state
  const [prospect, setProspect] = useState<ProspectData | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [savedEmailId, setSavedEmailId] = useState<string | null>(null);

  // Loading state
  const [lookingUp, setLookingUp] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loadingFollowUps, setLoadingFollowUps] = useState(false);

  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [step, setStep] = useState<"form" | "result">("form");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!linkedinUrl.includes("linkedin.com")) {
      addToast("Please enter a valid LinkedIn URL", "error");
      return;
    }

    setLookingUp(true);
    setProspect(null);
    setGeneratedEmail(null);
    setFollowUps([]);
    setSent(false);
    setSavedEmailId(null);

    try {
      // Step 1: Apollo lookup
      const apolloRes = await fetch("/api/apollo/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl }),
      });

      const apolloData = await apolloRes.json();

      if (!apolloRes.ok) {
        addToast(apolloData.error || "Failed to lookup prospect", "error");
        setLookingUp(false);
        return;
      }

      setProspect(apolloData.prospect);
      setLookingUp(false);
      setGenerating(true);

      // Step 2: Generate email
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkedinUrl,
          tone,
          goal,
          prospectData: apolloData.prospect,
          userName: session?.user?.name,
        }),
      });

      const genData = await genRes.json();

      if (!genRes.ok) {
        addToast(genData.error || "Failed to generate email", "error");
        setGenerating(false);
        return;
      }

      setGeneratedEmail(genData.email);
      setStep("result");
    } catch (err) {
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setLookingUp(false);
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!generatedEmail || !prospect?.email) {
      addToast(
        prospect?.email
          ? "No email to send"
          : "No email address found for this prospect",
        "error"
      );
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: prospect.email,
          subject: generatedEmail.subject,
          body: generatedEmail.body,
          fromName: session?.user?.name || "OutreachIQ User",
          prospectData: prospect,
          generatedEmailData: generatedEmail,
          linkedinUrl,
          tone,
          goal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || "Failed to send email", "error");
        return;
      }

      setSent(true);
      setSavedEmailId(data.emailId);
      addToast(`Email sent to ${prospect.email}!`, "success");
    } catch (err) {
      addToast("Failed to send email. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!generatedEmail || !prospect) return;

    setLoadingFollowUps(true);

    try {
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailId: savedEmailId,
          originalEmail: {
            subject: generatedEmail.subject,
            body: generatedEmail.body,
          },
          prospect: {
            name: prospect.name,
            company: prospect.company,
            title: prospect.title,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || "Failed to generate follow-ups", "error");
        return;
      }

      setFollowUps(data.followUps);
      addToast("Follow-up sequence generated!", "success");
    } catch (err) {
      addToast("Failed to generate follow-ups.", "error");
    } finally {
      setLoadingFollowUps(false);
    }
  };

  const isLoading = lookingUp || generating;

  return (
    <>
      <Topbar title="Compose" />
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Form */}
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* LinkedIn URL */}
            <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-[#e2e8f0] mb-1">
                  Prospect LinkedIn URL
                </h2>
                <p className="text-sm text-[#475569]">
                  We&apos;ll enrich the prospect data via Apollo.io and personalize
                  with Claude AI.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Tone */}
            <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-[#e2e8f0] mb-1">
                  Writing Tone
                </h2>
                <p className="text-sm text-[#475569]">
                  How should the email sound?
                </p>
              </div>
              <ToneSelector value={tone} onChange={setTone} />
            </div>

            {/* Goal */}
            <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-[#e2e8f0] mb-1">
                  Email Goal
                </h2>
                <p className="text-sm text-[#475569]">
                  What do you want the prospect to do?
                </p>
              </div>
              <GoalSelector value={goal} onChange={setGoal} />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {lookingUp ? (
                <>
                  <span className="animate-pulse">Looking up prospect...</span>
                </>
              ) : generating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating email with Claude AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Email
                </>
              )}
            </Button>
          </form>

          {/* Prospect Card */}
          {(lookingUp || prospect) && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#475569] uppercase tracking-wider">
                Prospect
              </h3>
              <ProspectCard prospect={prospect} loading={lookingUp} />
            </div>
          )}

          {/* Email Result */}
          {(generating || generatedEmail) && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#475569] uppercase tracking-wider">
                Generated Email
              </h3>
              <EmailResult
                email={generatedEmail}
                loading={generating}
                onSend={handleSend}
                onGenerateFollowUp={handleGenerateFollowUp}
                sending={sending}
                sent={sent}
                followUps={followUps}
                loadingFollowUps={loadingFollowUps}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
