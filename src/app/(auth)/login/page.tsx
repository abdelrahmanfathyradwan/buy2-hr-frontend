"use client";

import { FormEvent, useState } from "react";

// TODO: replace with your real auth call.
// These are only here so the error states in this file are demonstrable.
const REGISTERED_EMAILS = ["user@example.com"];
const CORRECT_PASSWORD = "Password123!";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    // 1. Check the email is registered
    if (!REGISTERED_EMAILS.includes(email.trim().toLowerCase())) {
      setEmailError("The email address you provided is not registered");
      return;
    }

    // 2. Check the password is correct
    if (password !== CORRECT_PASSWORD) {
      setPasswordError("The password provided is incorrect");
      return;
    }

    console.log({ email, password, rememberMe });
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
          <h1 className="mb-[40px] text-[25px] leading-[30px] font-bold text-[#202020]">
            Login
          </h1>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-[27px]">
              <label
                htmlFor="email"
                className="mb-[10px] block text-[16px] leading-[19px] font-medium text-[#36363f]"
              >
                Email
              </label>

              <div className="relative">
                <img
                  src="/images/email.svg"
                  alt=""
                  aria-hidden="true"
                  className="absolute left-[17px] top-1/2 h-[21px] w-[21px] -translate-y-1/2"
                />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter Your Mail"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={`h-[48px] w-full rounded-[4px] border bg-white pl-[55px] pr-4 text-[14px] text-[#333] outline-none transition ${
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

            {/* Password */}
            <div className="mb-[17px]">
              <label
                htmlFor="password"
                className="mb-[10px] block text-[16px] leading-[19px] font-medium text-[#36363f]"
              >
                Password
              </label>

              <div className="relative">
                <img
                  src="/images/password.svg"
                  alt=""
                  aria-hidden="true"
                  className="absolute left-[18px] top-1/2 h-[24px] w-[24px] -translate-y-1/2"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  className={`h-[48px] w-full rounded-[4px] border bg-white pl-[55px] pr-[52px] text-[14px] text-[#333] outline-none transition ${
                    passwordError
                      ? "border-[#e02020] focus:border-[#e02020]"
                      : "border-[#bcbcbc] focus:border-[#33318b]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-[14px] top-1/2 flex -translate-y-1/2 items-center justify-center p-1"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeOffIcon />}
                </button>
              </div>

              {passwordError && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-[8px] rounded-[4px] bg-[#fdecec] px-[12px] py-[8px] text-[13px] leading-[17px] text-[#e02020]"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="mb-[34px] flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-[10px] text-[14px] text-[#55555d]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-[18px] w-[18px] accent-[#33318b]"
                />

                <span>Remember me</span>
              </label>

              <a
                href="/forgot-password"
                className="text-[14px] text-[#30318c] underline"
              >
                Forget password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="h-[46px] w-full rounded-[4px] bg-[#33318b] text-[14px] font-semibold text-white transition hover:bg-[#292775]"
            >
              Login
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