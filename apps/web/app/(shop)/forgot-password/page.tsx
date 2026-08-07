"use client";

import Link from "@/components/ui/safe-link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck, LockKeyhole } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  async function requestCode(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not send the reset code.");
      }

      setNotice(data.message);
      setStep("reset");
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Could not send the reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitReset(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Those passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.join(""), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not reset your password.");
      }

      router.push("/login?reset=true");
    } catch (err: any) {
      setError(err.message || "Could not reset your password. Please try again.");
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    // Paste of a full code lands in one box; spread it across all six.
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      if (digits.length > 1) {
        const next = ["", "", "", "", "", ""];
        digits.forEach((d, i) => (next[i] = d));
        setOtp(next);
        document.getElementById(`otp-${Math.min(digits.length, 5)}`)?.focus();
      }
      return;
    }
    if (!/^\d*$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-10">
        <StorefrontContainer>
          <div className="mx-auto max-w-[500px] rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-10">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f2e5]">
                {step === "request" ? (
                  <LockKeyhole className="h-8 w-8 text-[#d0b57a]" />
                ) : (
                  <ShieldCheck className="h-8 w-8 text-[#d0b57a]" />
                )}
              </div>
              <h1 className="font-sans text-2xl font-semibold text-slate-950 sm:text-[2rem]">
                {step === "request" ? "Forgot your password?" : "Enter your reset code"}
              </h1>
              <p className="mt-2 font-sans text-[0.95rem] leading-7 text-slate-600 sm:text-[1rem]">
                {step === "request" ? (
                  "Enter the email address on your account and we'll send you a 6-digit code to reset your password."
                ) : (
                  <>
                    We sent a 6-digit code to
                    <br />
                    <strong className="break-all text-[#1f3763]">{email}</strong>
                  </>
                )}
              </p>
            </div>

            {error ? (
              <div
                role="alert"
                className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            ) : null}

            {notice && step === "reset" ? (
              <div className="mt-6 rounded-2xl border border-[#d0b57a] bg-[#fbf8f1] px-4 py-3 text-sm text-slate-700">
                {notice}
              </div>
            ) : null}

            {step === "request" ? (
              <form onSubmit={requestCode} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 rounded-xl border-[#e6dbc4] pl-11"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="h-12 w-full rounded-full bg-[#1f3763] text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53] disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send reset code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={submitReset} className="mt-8 space-y-5">
                {/* w-10 on phones keeps all six boxes + gaps inside a 375px
                    screen; inputMode/autoComplete give a numeric keypad and
                    let the OS offer the emailed code. */}
                <div className="flex justify-center gap-1.5 sm:gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      aria-label={`Digit ${index + 1} of 6`}
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="h-14 w-10 rounded-xl border border-[#e6dbc4] bg-white text-center text-xl font-semibold text-[#1f3763] outline-none transition-all focus:border-[#d0b57a] focus:ring-2 focus:ring-[#d0b57a]/20 sm:w-12"
                      disabled={loading}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <PasswordInput
                      id="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-[#e6dbc4] pl-11"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500">At least 6 characters.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <PasswordInput
                      id="confirmPassword"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-xl border-[#e6dbc4] pl-11"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6 || !password || !confirmPassword}
                  className="h-12 w-full rounded-full bg-[#1f3763] text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53] disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </Button>

                <p className="text-center text-sm text-slate-600">
                  Didn&apos;t get the code?{" "}
                  <button
                    type="button"
                    onClick={() => requestCode()}
                    disabled={resendTimer > 0 || loading}
                    className="font-semibold text-[#1f3763] hover:text-[#172c53] disabled:text-slate-400"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                  </button>
                </p>

                <p className="text-center text-sm text-slate-600">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("request");
                      setError("");
                      setNotice("");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    className="font-semibold text-[#1f3763] hover:text-[#172c53]"
                  >
                    Use a different email
                  </button>
                </p>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-slate-600">
              Remembered it?{" "}
              <Link href="/login" className="font-semibold text-[#1f3763] hover:text-[#172c53]">
                Back to sign in
              </Link>
            </p>
          </div>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
