"use client";

import { FormEvent, useState } from "react";

type Rule = {
  key: string;
  label: string;
  test: (pw: string) => boolean;
};

const RULES: Rule[] = [
  { key: "length", label: "be at least 8 characters long.", test: (pw) => pw.length >= 8 },
  { key: "upper", label: "contain at least one uppercase letter.", test: (pw) => /[A-Z]/.test(pw) },
  { key: "lower", label: "contain at least one lowercase letter.", test: (pw) => /[a-z]/.test(pw) },
  { key: "number", label: "contain at least one numeric character (0-9).", test: (pw) => /[0-9]/.test(pw) },
  {
    key: "special",
    label: 'contain at least one special character (e.g., !, @, #, $).',
    test: (pw) => /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/.test(pw),
  },
];

export default function SetupPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [success, setSuccess] = useState(false);

  const results = RULES.map((rule) => ({ ...rule, passed: rule.test(password) }));
  const allValid = results.every((r) => r.passed);

  // Neutral checklist appears as soon as there's input.
  // It only turns "invalid/red" once the field has been touched (blurred,
  // or a submit was attempted) and requirements are still unmet.
  const showChecklist = password.length > 0 || passwordTouched;
  const showRedState = passwordTouched && !allValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConfirmError("");
    setPasswordTouched(true);

    if (!allValid) return;

    if (confirmPassword !== password) {
      setConfirmError("Passwords do not match");
      return;
    }

    // TODO: call your API to actually set the password
    setSuccess(true);
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
            Set Up Password
          </h1>
          <p className="mb-[30px] text-[14px] leading-[18px] text-[#68686f]">
            Please enter a strong password, then click &quot;Confirm&quot;.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Password */}
            <div className="mb-[20px]">
              <label
                htmlFor="password"
                className="mb-[10px] block text-[16px] leading-[19px] font-medium text-[#36363f]"
              >
                Password
              </label>

              <div className="relative">
                <LockIcon className="absolute left-[18px] top-1/2 h-[20px] w-[20px] -translate-y-1/2" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Type Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  aria-invalid={showRedState}
                  aria-describedby="password-requirements"
                  className={`h-[48px] w-full rounded-[4px] border bg-white pl-[50px] pr-[52px] text-[14px] text-[#333] outline-none transition ${
                    showRedState
                      ? "border-[#e02020] focus:border-[#e02020]"
                      : "border-[#bcbcbc] focus:border-[#33318b]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-[14px] top-1/2 flex -translate-y-1/2 items-center justify-center p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeOffIcon />}
                </button>
              </div>

              {showChecklist && (
                <div
                  id="password-requirements"
                  className={`mt-[10px] rounded-[4px] px-[14px] py-[12px] text-[13px] leading-[19px] transition-colors ${
                    showRedState ? "bg-[#fdecec]" : "bg-[#f5f5f6]"
                  }`}
                >
                  <p className="mb-[4px] font-medium text-[#55555d]">
                    New password must:
                  </p>
                  <ul className="space-y-[2px]">
                    {results.map((rule) => (
                      <li key={rule.key} className="flex items-center gap-[8px]">
                        {rule.passed ? (
                          <CheckIcon className="h-[12px] w-[12px] shrink-0 text-[#1f9254]" strokeWidth={3} />
                        ) : showRedState ? (
                          <CrossIcon className="h-[12px] w-[12px] shrink-0 text-[#e02020]" />
                        ) : (
                          <span className="ml-[2px] mr-[3px] h-[4px] w-[4px] shrink-0 rounded-full bg-[#9a9aa2]" />
                        )}
                        <span
                          className={
                            rule.passed
                              ? "text-[#1f9254]"
                              : showRedState
                              ? "text-[#e02020]"
                              : "text-[#68686f]"
                          }
                        >
                          {rule.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-[34px]">
              <label
                htmlFor="confirmPassword"
                className="mb-[10px] block text-[16px] leading-[19px] font-medium text-[#36363f]"
              >
                Confirm Password
              </label>

              <div className="relative">
                <LockIcon className="absolute left-[18px] top-1/2 h-[20px] w-[20px] -translate-y-1/2" />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Retype Your Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmError) setConfirmError("");
                  }}
                  aria-invalid={!!confirmError}
                  aria-describedby={confirmError ? "confirm-error" : undefined}
                  className={`h-[48px] w-full rounded-[4px] border bg-white pl-[50px] pr-[52px] text-[14px] text-[#333] outline-none transition ${
                    confirmError
                      ? "border-[#e02020] focus:border-[#e02020]"
                      : "border-[#bcbcbc] focus:border-[#33318b]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-[14px] top-1/2 flex -translate-y-1/2 items-center justify-center p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOpenIcon /> : <EyeOffIcon />}
                </button>
              </div>

              {confirmError && (
                <p
                  id="confirm-error"
                  role="alert"
                  className="mt-[8px] rounded-[4px] bg-[#fdecec] px-[12px] py-[8px] text-[13px] leading-[17px] text-[#e02020]"
                >
                  {confirmError}
                </p>
              )}
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              className="h-[46px] w-full rounded-[4px] bg-[#33318b] text-[14px] font-semibold text-white transition hover:bg-[#292775]"
            >
              Confirm
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

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
          <div className="mx-[20px] w-full max-w-[380px] rounded-[8px] bg-white p-[32px] text-center shadow-2xl">
            <div className="mx-auto mb-[20px] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#33318b]">
              <CheckIcon className="h-[28px] w-[28px] text-white" strokeWidth={3} />
            </div>

            <p className="mb-[24px] text-[18px] font-semibold text-[#202020]">
              Password Set Successfully!
            </p>

            <a
              href="/"
              className="flex h-[46px] w-full items-center justify-center rounded-[4px] bg-[#33318b] text-[14px] font-semibold text-white transition hover:bg-[#292775]"
            >
              Start Exploring
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="#8a8a94" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 118 0v3" stroke="#8a8a94" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 12.5L9.5 18L20 6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L21 21" stroke="#8a8a94" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M10.58 10.59A2 2 0 0012 14a2 2 0 001.41-.59M9.36 5.3A9.77 9.77 0 0112 5c5 0 9 4.5 10 7-.42 1.06-1.14 2.28-2.14 3.4M6.6 6.6C4.2 8 2.6 10.2 2 12c.64 1.6 1.86 3.4 3.6 4.8A9.9 9.9 0 0012 19c1.06 0 2.08-.16 3-.46"
        stroke="#8a8a94"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeOpenIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 12C3 9 6.5 5 12 5s9 4 10 7c-1 3-4.5 7-10 7S3 15 2 12z"
        stroke="#8a8a94"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="#8a8a94" strokeWidth="1.6" />
    </svg>
  );
}