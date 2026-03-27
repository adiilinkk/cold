"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  User,
  Building2,
  Mail,
  Calendar,
} from "lucide-react";

interface FollowUp {
  id: string;
  day: number;
  subject: string;
  body: string;
  sent: boolean;
}

interface EmailRecord {
  id: string;
  prospectName: string;
  prospectEmail: string;
  prospectTitle: string | null;
  prospectCompany: string | null;
  subject: string;
  body: string;
  status: string;
  sentAt: string;
  hooks: string[];
  personalizationScore: number | null;
  tone: string | null;
  goal: string | null;
  followUps: FollowUp[];
}

interface EmailTableProps {
  emails: EmailRecord[];
  loading?: boolean;
}

const STATUS_VARIANTS: Record<string, any> = {
  SENT: "sent",
  OPENED: "opened",
  REPLIED: "replied",
  BOUNCED: "bounced",
  DRAFT: "draft",
};

function EmailRow({ email }: { email: EmailRecord }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-[#1a2d4a] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#2563eb]/30">
      {/* Row */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-4 p-4 bg-[#0a1628] hover:bg-[#0d1e38] transition-colors text-left"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2563eb]/10 shrink-0">
          <User className="h-4 w-4 text-[#2563eb]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[#e2e8f0]">
              {email.prospectName}
            </span>
            {email.prospectCompany && (
              <span className="text-xs text-[#475569] flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {email.prospectCompany}
              </span>
            )}
          </div>
          <p className="text-xs text-[#475569] mt-0.5 truncate">
            {email.subject}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs text-[#475569] flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(email.sentAt)}
            </p>
          </div>
          <Badge variant={STATUS_VARIANTS[email.status] || "default"}>
            {email.status.charAt(0) + email.status.slice(1).toLowerCase()}
          </Badge>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[#475569]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#475569]" />
          )}
        </div>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-[#1a2d4a] bg-[#050d1a] p-5 space-y-4 animate-fade-in">
          {/* Prospect info */}
          <div className="flex items-center gap-4 flex-wrap text-sm">
            {email.prospectEmail && (
              <div className="flex items-center gap-1.5 text-[#94a3b8]">
                <Mail className="h-3.5 w-3.5 text-[#475569]" />
                {email.prospectEmail}
              </div>
            )}
            {email.tone && (
              <Badge variant="outline" className="text-xs">
                {email.tone}
              </Badge>
            )}
            {email.goal && (
              <Badge variant="outline" className="text-xs">
                {email.goal}
              </Badge>
            )}
          </div>

          {/* Email body */}
          <div>
            <p className="text-xs font-medium text-[#475569] uppercase tracking-wider mb-2">
              Email Body
            </p>
            <div className="bg-[#0a1628] rounded-lg p-4 border border-[#1a2d4a]">
              <p className="text-sm text-[#cbd5e1] whitespace-pre-wrap leading-relaxed font-mono">
                {email.body}
              </p>
            </div>
          </div>

          {/* Hooks */}
          {email.hooks && email.hooks.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#475569] uppercase tracking-wider mb-2">
                Personalization Hooks
              </p>
              <ul className="space-y-1">
                {email.hooks.map((hook, i) => (
                  <li key={i} className="text-xs text-[#475569] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0" />
                    {hook}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-ups */}
          {email.followUps && email.followUps.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#475569] uppercase tracking-wider mb-2">
                Follow-up Sequence
              </p>
              <div className="space-y-3">
                {email.followUps.map((fu) => (
                  <div
                    key={fu.id}
                    className="bg-[#0a1628] rounded-lg p-3 border border-[#1a2d4a]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="text-xs">
                        Day {fu.day}
                      </Badge>
                      <p className="text-xs text-[#94a3b8] font-medium">
                        {fu.subject}
                      </p>
                    </div>
                    <p className="text-xs text-[#475569] whitespace-pre-wrap leading-relaxed">
                      {fu.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function EmailTable({ emails, loading }: EmailTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-[#1a2d4a] rounded-xl p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0a1628] border border-[#1a2d4a] mb-4">
          <Mail className="h-7 w-7 text-[#475569]" />
        </div>
        <h3 className="text-base font-semibold text-[#e2e8f0] mb-1">
          No emails sent yet
        </h3>
        <p className="text-sm text-[#475569] max-w-xs">
          Head to Compose to generate your first hyper-personalized cold email.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <EmailRow key={email.id} email={email} />
      ))}
    </div>
  );
}
