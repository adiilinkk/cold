"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Typewriter } from "./typewriter";
import {
  Copy,
  Check,
  Send,
  RefreshCw,
  Mail,
  Sparkles,
  TrendingUp,
  Eye,
  MessageSquare,
  Target,
  Zap,
} from "lucide-react";

interface GeneratedEmail {
  subject: string;
  body: string;
  hooks: string[];
  personalization_score: number;
  open_estimate: string;
  reply_estimate: string;
}

interface FollowUpEmail {
  day: number;
  subject: string;
  body: string;
}

interface EmailResultProps {
  email: GeneratedEmail | null;
  loading?: boolean;
  onSend: () => void;
  onGenerateFollowUp: () => void;
  sending?: boolean;
  sent?: boolean;
  followUps?: FollowUpEmail[];
  loadingFollowUps?: boolean;
}

function ScoreRing({
  score,
  label,
}: {
  score: number | string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke="#1a2d4a"
            strokeWidth="4"
          />
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - (typeof score === "number" ? score / 100 : parseInt(score) / 100))}`}
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute text-xs font-bold text-[#e2e8f0]">
          {typeof score === "number" ? score : score}
        </span>
      </div>
      <p className="text-xs text-[#475569]">{label}</p>
    </div>
  );
}

export function EmailResult({
  email,
  loading,
  onSend,
  onGenerateFollowUp,
  sending,
  sent,
  followUps,
  loadingFollowUps,
}: EmailResultProps) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [typewriterDone, setTypewriterDone] = useState(false);

  const copySubject = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email.subject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const copyBody = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email.body);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="border-[#1a2d4a]">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 flex-1" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex gap-6 justify-center pt-2">
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-14 w-14 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!email) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Main email card */}
      <Card className="border-[#1a2d4a] hover:border-[#2563eb]/30 transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-[#475569] uppercase tracking-wider flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Generated Email
            </CardTitle>
            <Badge variant="default" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Personalized
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#475569] uppercase tracking-wider">
              Subject
            </label>
            <div className="flex items-center gap-2 bg-[#050d1a] rounded-lg px-3 py-2.5 border border-[#1a2d4a]">
              <p className="text-sm text-[#e2e8f0] font-medium flex-1">
                {email.subject}
              </p>
              <button
                onClick={copySubject}
                className="text-[#475569] hover:text-[#2563eb] transition-colors shrink-0"
              >
                {copiedSubject ? (
                  <Check className="h-3.5 w-3.5 text-[#22c55e]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#475569] uppercase tracking-wider">
              Body
            </label>
            <div className="relative bg-[#050d1a] rounded-lg p-4 border border-[#1a2d4a]">
              <p className="text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-wrap font-mono">
                <Typewriter
                  text={email.body}
                  speed={8}
                  onComplete={() => setTypewriterDone(true)}
                />
              </p>
              {typewriterDone && (
                <button
                  onClick={copyBody}
                  className="absolute top-3 right-3 text-[#475569] hover:text-[#2563eb] transition-colors"
                >
                  {copiedBody ? (
                    <Check className="h-3.5 w-3.5 text-[#22c55e]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Score cards */}
          <div className="flex justify-around py-2 border-t border-[#1a2d4a]">
            <ScoreRing score={email.personalization_score} label="Personalization" />
            <ScoreRing score={email.open_estimate} label="Est. Open Rate" />
            <ScoreRing score={email.reply_estimate} label="Est. Reply Rate" />
          </div>

          {/* Send button */}
          <div className="flex gap-3">
            {!sent ? (
              <Button
                onClick={onSend}
                disabled={sending}
                className="flex-1"
                size="lg"
              >
                {sending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] font-medium">
                <Check className="h-4 w-4" />
                Email Sent Successfully!
              </div>
            )}
          </div>

          {/* Generate Follow-up button */}
          {sent && (
            <Button
              variant="secondary"
              onClick={onGenerateFollowUp}
              disabled={loadingFollowUps}
              className="w-full"
            >
              {loadingFollowUps ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating Follow-ups...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Follow-up Sequence
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Hooks card */}
      {email.hooks && email.hooks.length > 0 && (
        <Card className="border-[#1a2d4a]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#475569] uppercase tracking-wider flex items-center gap-2">
              <Target className="h-4 w-4" />
              Personalization Hooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {email.hooks.map((hook, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-[#94a3b8]"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#2563eb]/15 text-[#2563eb] text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {hook}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Follow-up sequence */}
      {followUps && followUps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[#475569] uppercase tracking-wider px-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Follow-up Sequence
          </h3>
          {followUps.map((fu, i) => (
            <Card key={i} className="border-[#1a2d4a]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="text-xs">
                    Day {fu.day}
                  </Badge>
                  <p className="text-sm font-medium text-[#e2e8f0]">
                    {fu.subject}
                  </p>
                </div>
                <p className="text-sm text-[#94a3b8] leading-relaxed whitespace-pre-wrap">
                  {fu.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
