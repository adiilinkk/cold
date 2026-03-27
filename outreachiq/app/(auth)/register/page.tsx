"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { Zap, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

const FEATURES = [
  "Apollo.io prospect enrichment",
  "Claude AI email generation",
  "Follow-up sequence builder",
  "Sent email history & tracking",
];

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || "Registration failed", "error");
        return;
      }

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        addToast("Account created. Please sign in.", "success");
        router.push("/login");
      } else {
        addToast("Account created! Welcome to OutreachIQ.", "success");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2563eb]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2563eb] shadow-[0_0_30px_rgba(37,99,235,0.4)]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#e2e8f0] tracking-tight">
            OutreachIQ
          </span>
        </div>

        {/* Card */}
        <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#e2e8f0]">Create account</h1>
            <p className="text-sm text-[#475569] mt-1">
              Start generating personalized cold emails instantly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#e2e8f0] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2"
              size="lg"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Feature list */}
          <ul className="mt-6 space-y-2 border-t border-[#1a2d4a] pt-5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-[#475569]">
                <Check className="h-3.5 w-3.5 text-[#22c55e] shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <p className="text-sm text-center text-[#475569] mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#2563eb] hover:text-blue-400 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
