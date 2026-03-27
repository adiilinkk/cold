"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Building2,
  Mail,
  Phone,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";

interface ProspectData {
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  company: string | null;
  linkedinUrl: string | null;
  headline: string | null;
}

interface ProspectCardProps {
  prospect: ProspectData | null;
  loading?: boolean;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-[#475569] hover:text-[#2563eb] transition-colors ml-1"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[#22c55e]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function ProspectCard({ prospect, loading }: ProspectCardProps) {
  if (loading) {
    return (
      <Card className="border-[#1a2d4a]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
              <div className="space-y-1.5 mt-3">
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="h-3.5 w-36" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prospect) return null;

  return (
    <Card className="border-[#1a2d4a] hover:border-[#2563eb]/40 hover:shadow-glow-blue transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shrink-0">
            <User className="h-5 w-5 text-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-[#e2e8f0]">
                {prospect.name}
              </h3>
              {prospect.linkedinUrl && (
                <a
                  href={prospect.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563eb] hover:text-blue-400 transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {prospect.title && (
              <p className="text-sm text-[#94a3b8] mt-0.5">{prospect.title}</p>
            )}

            {prospect.company && (
              <div className="flex items-center gap-1.5 mt-1">
                <Building2 className="h-3.5 w-3.5 text-[#475569] shrink-0" />
                <span className="text-sm text-[#94a3b8]">
                  {prospect.company}
                </span>
              </div>
            )}

            {/* Contact details */}
            <div className="mt-3 space-y-1.5">
              {prospect.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#475569] shrink-0" />
                  <span className="text-sm text-[#94a3b8] font-mono">
                    {prospect.email}
                  </span>
                  <CopyButton value={prospect.email} />
                </div>
              )}
              {!prospect.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#475569] shrink-0" />
                  <span className="text-xs text-[#475569] italic">
                    Email not found
                  </span>
                </div>
              )}

              {prospect.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#475569] shrink-0" />
                  <span className="text-sm text-[#94a3b8] font-mono">
                    {prospect.phone}
                  </span>
                  <CopyButton value={prospect.phone} />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
