"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Send,
  TrendingUp,
  PenLine,
  ArrowRight,
  Zap,
  History,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalGenerated: number;
  totalSent: number;
  avgReplyRate: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-r from-[#0a1628] to-[#0d1e38] border border-[#1a2d4a] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#2563eb]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-[#2563eb]" />
              <span className="text-xs font-medium text-[#2563eb] uppercase tracking-wider">
                AI Powered
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#e2e8f0] mb-1">
              Ready to close more deals?
            </h2>
            <p className="text-sm text-[#475569] mb-4 max-w-md">
              Generate hyper-personalized cold emails in seconds. Paste a LinkedIn
              URL, pick your tone, and let Claude write emails that get replies.
            </p>
            <Button asChild size="sm">
              <Link href="/dashboard/compose" className="flex items-center gap-2">
                <PenLine className="h-4 w-4" />
                Compose Email
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-sm font-medium text-[#475569] mb-3">
            Your Stats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              title="Emails Generated"
              value={stats?.totalGenerated ?? 0}
              icon={Mail}
              description="Total emails created"
              loading={loading}
              accentColor="blue"
            />
            <StatsCard
              title="Emails Sent"
              value={stats?.totalSent ?? 0}
              icon={Send}
              description="Successfully delivered"
              loading={loading}
              accentColor="green"
            />
            <StatsCard
              title="Avg Reply Rate"
              value={stats?.avgReplyRate ?? "0%"}
              icon={TrendingUp}
              description="Based on replies tracked"
              loading={loading}
              accentColor="purple"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-sm font-medium text-[#475569] mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/compose">
              <Card className="border-[#1a2d4a] hover:border-[#2563eb]/40 hover:shadow-glow-blue cursor-pointer transition-all duration-200 group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2563eb]/10 group-hover:bg-[#2563eb]/15 transition-colors">
                    <PenLine className="h-5 w-5 text-[#2563eb]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#e2e8f0]">
                      New Email
                    </p>
                    <p className="text-xs text-[#475569]">
                      Generate from LinkedIn URL
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#475569] ml-auto group-hover:text-[#2563eb] group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/history">
              <Card className="border-[#1a2d4a] hover:border-[#22c55e]/40 cursor-pointer transition-all duration-200 group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#22c55e]/10 group-hover:bg-[#22c55e]/15 transition-colors">
                    <History className="h-5 w-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#e2e8f0]">
                      View History
                    </p>
                    <p className="text-xs text-[#475569]">
                      All sent emails & follow-ups
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#475569] ml-auto group-hover:text-[#22c55e] group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
