"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { EmailTable } from "@/components/history/email-table";

export default function HistoryPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((d) => {
        setEmails(d.emails || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Topbar title="History" />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#e2e8f0]">Sent Emails</h2>
            <p className="text-sm text-[#475569] mt-0.5">
              All emails sent via OutreachIQ. Click any row to expand.
            </p>
          </div>
          <EmailTable emails={emails} loading={loading} />
        </div>
      </div>
    </>
  );
}
