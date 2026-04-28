"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LockKeyhole, Mail, UserRound, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  whatsapp?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);

  // Resend timer countdown
  useEffect(() => {
    if (step === "verify" && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, resendTimer]);

  async function onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, whatsapp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.requiresVerification) {
        setRegistrationData(data.registrationData);
        setStep("verify");
        setResendTimer(60);
      } else {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    setLoading(true);
    setError("");

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registrationData,
          otp: otpCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      router.push("/login?verified=true");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    if (!registrationData || resendTimer > 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registrationData.email,
          name: registrationData.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  }

  if (step === "verify") {
    return (
      <StorefrontCanvas>
        <SiteHeader />

        <main className="pb-16 pt-10">
          <StorefrontContainer>
            <div className="mx-auto max-w-[500px] rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-10">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f2e5]">
                  <ShieldCheck className="h-8 w-8 text-[#d0b57a]" />
                </div>
                <h2 className="font-sans text-[2rem] font-semibold text-slate-950">
                  Verify Your Email
                </h2>
                <p className="mt-2 font-sans text-[1rem] text-slate-600">
                  We&apos;ve sent a 6-digit verification code to
                  <br />
                  <strong className="text-[#1f3763]">{registrationData?.email}</strong>
                </p>
              </div>

              {error ? (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <div className="mt-8 flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="h-14 w-12 rounded-xl border border-[#e6dbc4] bg-white text-center text-xl font-semibold text-[#1f3763] outline-none transition-all focus:border-[#d0b57a] focus:ring-2 focus:ring-[#d0b57a]/20"
                    disabled={loading}
                  />
                ))}
              </div>

              <Button
                onClick={verifyOTP}
                disabled={loading || otp.join("").length !== 6}
                className="mt-8 h-12 w-full rounded-full bg-[#1f3763] text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53] disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <p className="mt-6 text-center text-sm text-slate-600">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={resendOTP}
                  disabled={resendTimer > 0 || loading}
                  className="font-semibold text-[#1f3763] hover:text-[#172c53] disabled:text-slate-400"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </p>

              <p className="mt-4 text-center text-sm text-slate-600">
                <button
                  onClick={() => setStep("form")}
                  className="font-semibold text-[#1f3763] hover:text-[#172c53]"
                >
                  Go back
                </button>
              </p>
            </div>
          </StorefrontContainer>
        </main>

        <SiteFooter />
      </StorefrontCanvas>
    );
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-10">
        <StorefrontContainer>
          <div className="mx-auto max-w-[1100px] rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[linear-gradient(135deg,#1f3763_0%,#2b8b68_100%)] p-8 text-white sm:p-10">
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-[#f5cf83]">
                Create Account
              </p>
              <h1 className="mt-4 font-sans text-[2.2rem] font-semibold leading-tight">
                Join the Symphony storefront.
              </h1>
              <p className="mt-4 max-w-md font-sans text-[1rem] leading-7 text-white/85">
                Save addresses, track orders, manage personalized gifting, and move through checkout
                faster on future purchases.
              </p>
            </div>

            <div className="p-8 sm:p-10">
              <h2 className="font-sans text-[2rem] font-semibold text-slate-950">
                Start Your Account
              </h2>
              <p className="mt-2 font-sans text-[1rem] text-slate-600">
                Create a customer profile for a smoother gifting experience.
              </p>

              <form onSubmit={onSubmitForm} className="mt-8 space-y-5">
                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="h-12 rounded-xl border-[#e6dbc4] pl-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 rounded-xl border-[#e6dbc4] pl-11"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="h-12 rounded-xl border-[#e6dbc4] pl-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="h-12 rounded-xl border-[#e6dbc4] pl-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        minLength={8}
                        className="h-12 rounded-xl border-[#e6dbc4] pl-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        minLength={8}
                        className="h-12 rounded-xl border-[#e6dbc4] pl-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="h-12 w-full rounded-full bg-[#1f3763] text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]"
                  disabled={loading}
                >
                  {loading ? "Sending Verification..." : "Create Account"}
                </Button>
              </form>

              <p className="mt-6 text-sm text-slate-600">
                Already registered?{" "}
                <Link href="/login" className="font-semibold text-[#1f3763] hover:text-[#172c53]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
