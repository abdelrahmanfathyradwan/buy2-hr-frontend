"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

// TODO: replace with your real auth call.
const REGISTERED_EMAILS = ["user@example.com"];

export default function ResetPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");

    if (!REGISTERED_EMAILS.includes(email.trim().toLowerCase())) {
      setEmailError("The email address you provided is not registered");
      return;
    }

    setIsSending(true);
    // TODO: call your API to actually send the OTP
    router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* Left Side */}
      <section className="flex w-full lg:w-[40%] bg-white">
        <div className="w-full max-w-[600px] p-[54px]">
          {/* Logo */}
          <div className="mb-[37px]">
            <img
              src="/images/logo.svg"
              alt="Buy2"
              className="block w-[170px] h-auto"
            />
          </div>

          {/* Title */}
          <h1 className="mb-[8px] text-[25px] leading-[30px] font-bold text-[#202020]">
            Reset Password
          </h1>
          <p className="mb-[30px] text-[14px] leading-[18px] text-[#68686f]">
            Enter the email to receive the verification code, then press
            &quot;Send Code&quot;.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-[34px]">
              <label
                htmlFor="email"
                className="mb-[10px] block text-[16px] leading-[19px] font-medium text-[#36363f]"
              >
                Email
              </label>

              <div className="relative">
                <MailIcon className="absolute left-[17px] top-1/2 h-[19px] w-[19px] -translate-y-1/2" />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={`h-[48px] w-full rounded-[4px] border bg-white pl-[50px] pr-4 text-[14px] text-[#333] outline-none transition ${
                    emailError
                      ? "border-[#e02020] focus:border-[#e02020]"
                      : "border-[#bcbcbc] focus:border-[#33318b]"
                  }`}
                />
              </div>

              {emailError && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-[8px] rounded-[4px] bg-[#fdecec] px-[12px] py-[8px] text-[13px] leading-[17px] text-[#e02020]"
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Send Code Button */}
            <button
              type="submit"
              disabled={isSending}
              className="h-[46px] w-full rounded-[4px] bg-[#33318b] text-[14px] font-semibold text-white transition hover:bg-[#292775] disabled:opacity-60"
            >
              {isSending ? "Sending..." : "Send Code"}
            </button>
          </form>
        </div>
      </section>

      {/* Right Side */}
      <section
        className="hidden min-h-screen lg:block lg:w-[60%] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/background.jpg')",
        }}
      />
    </main>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#8a8a94" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="#8a8a94" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
