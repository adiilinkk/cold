"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Key,
  Mail,
  CheckCircle,
  Circle,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

interface UserSettings {
  id: string;
  name: string | null;
  email: string;
  apolloKey: string | null;
  resendKey: string | null;
  gmailConnected: boolean;
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-[#1a2d4a]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563eb]/10">
            <Icon className="h-4 w-4 text-[#2563eb]" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ApiKeyInput({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10 font-mono text-xs"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#e2e8f0] transition-colors"
        >
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [apolloKey, setApolloKey] = useState("");
  const [resendKey, setResendKey] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setSettings(d.user);
          setName(d.user.name || "");
          setEmail(d.user.email || "");
          setApolloKey(d.user.apolloKey || "");
          setResendKey(d.user.resendKey || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to save", "error");
      } else {
        addToast("Profile updated!", "success");
        setSettings(data.user);
      }
    } catch {
      addToast("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveApiKeys = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apolloKey: apolloKey || null,
          resendKey: resendKey || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Failed to save", "error");
      } else {
        addToast("API keys saved!", "success");
      }
    } catch {
      addToast("Failed to save API keys", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleConnectGmail = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmailConnected: !settings?.gmailConnected }),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data.user);
        addToast(
          data.user.gmailConnected ? "Gmail connected!" : "Gmail disconnected",
          "success"
        );
      }
    } catch {
      addToast("Failed to update Gmail connection", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Topbar title="Settings" />
        <div className="flex-1 p-6 max-w-2xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-[#1a2d4a]">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Settings" />
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile */}
          <SectionCard
            title="Profile"
            description="Update your display name and email address"
            icon={User}
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                size="sm"
                className="flex items-center gap-2"
              >
                {saving ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Save Profile
              </Button>
            </div>
          </SectionCard>

          {/* Gmail */}
          <SectionCard
            title="Gmail Integration"
            description="Connect your Gmail to send emails directly from your account"
            icon={Mail}
          >
            <div className="flex items-center justify-between p-4 bg-[#050d1a] rounded-xl border border-[#1a2d4a]">
              <div className="flex items-center gap-3">
                {settings?.gmailConnected ? (
                  <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                ) : (
                  <Circle className="h-5 w-5 text-[#475569]" />
                )}
                <div>
                  <p className="text-sm font-medium text-[#e2e8f0]">
                    {settings?.gmailConnected ? "Gmail Connected" : "Gmail Not Connected"}
                  </p>
                  <p className="text-xs text-[#475569]">
                    {settings?.gmailConnected
                      ? "You can send from your Gmail account"
                      : "Connect to send from your personal Gmail"}
                  </p>
                </div>
              </div>
              <Button
                variant={settings?.gmailConnected ? "outline" : "default"}
                size="sm"
                onClick={handleConnectGmail}
                disabled={saving}
              >
                {settings?.gmailConnected ? "Disconnect" : "Connect Gmail"}
              </Button>
            </div>
          </SectionCard>

          {/* API Keys */}
          <SectionCard
            title="API Keys"
            description="Add your own API keys to override the defaults"
            icon={Key}
          >
            <div className="space-y-4">
              <ApiKeyInput
                id="apollo-key"
                label="Apollo.io API Key"
                value={apolloKey}
                placeholder="Your Apollo API key"
                onChange={setApolloKey}
              />
              <ApiKeyInput
                id="resend-key"
                label="Resend API Key"
                value={resendKey}
                placeholder="re_..."
                onChange={setResendKey}
              />
              <div className="pt-1">
                <Button
                  onClick={handleSaveApiKeys}
                  disabled={saving}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {saving ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save API Keys
                </Button>
                <p className="text-xs text-[#475569] mt-2">
                  Keys are encrypted and stored securely. They override the
                  platform defaults.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
