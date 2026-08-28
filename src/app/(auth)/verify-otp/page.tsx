"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 59;
const MAX_ATTEMPTS = 3;

// TODO: replace with your real API call.
const CORRECT_OTP = "123456";

type OtpStatus = "idle" | "wrong" | "locked";

export default function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "user@buy2stores.com";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [attempts, setAttempts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formattedTime = `00:${String(secondsLeft).padStart(2, "0")}`;

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) {
      updateDigit(index, "");
      return;
    }

    // Support pasting/typing more than one char into a single box
    const chars = value.split("");
    setDigits((prev) => {
      const next = [...prev];
      let i = index;
      for (const ch of chars) {
        if (i >= OTP_LENGTH) break;
        next[i] = ch;
        i++;
      }
      return next;
    });

    if (status !== "idle") setStatus("idle");

    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    focusInput(nextIndex);
  };

  const updateDigit = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (status !== "idle") setStatus("idle");
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    setDigits(next);
    setStatus("idle");
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleResend = () => {
    // TODO: call your API to actually resend the OTP
    setDigits(Array(OTP_LENGTH).fill(""));
    setStatus("idle");
    setSecondsLeft(RESEND_SECONDS);
    focusInput(0);
  };

  const handleConfirm = () => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) return;

    if (code === CORRECT_OTP) {
      // TODO: call your API to actually verify + proceed
      router.push("/setup-password");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (nextAttempts >= MAX_ATTEMPTS) {
      setStatus("locked");
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } else {
      setStatus("wrong");
    }
  };

  const boxBorderClass =
    status === "wrong"
      ? "border-[#e02020] text-[#e02020]"
      : status === "locked"
      ? "border-[#bcbcbc] text-[#333]"
      : "border-[#bcbcbc] text-[#333] focus:border-[#1f9254]";

  const filledBorderClass =
    status === "idle" ? "border-[#1f9254] text-[#1f9254]" : "";

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
            OTP Code
          </h1>
          <p className="mb-[6px] text-[14px] leading-[18px] text-[#68686f]">
            A 6-digit verification code has been sent to the email
          </p>
          <p className="mb-[26px] text-[14px] leading-[18px]">
            <span className="font-medium text-[#202020]">{email}</span>{" "}
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-[#30318c] underline"
            >
              Change Email
            </button>
          </p>

          {/* OTP Boxes */}
          <div className="mb-[18px] flex gap-[10px]">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${index + 1}`}
                className={`h-[52px] w-[46px] rounded-[4px] border bg-white text-center text-[20px] font-semibold outline-none transition ${boxBorderClass} ${
                  digit ? filledBorderClass : ""
                }`}
              />
            ))}
          </div>

          {/* Status row */}
          {status === "wrong" && (
            <div className="mb-[18px] flex items-center justify-between">
              <p role="alert" className="text-[13px] leading-[17px] text-[#e02020]">
                OTP entered is wrong!
              </p>
              <button
                type="button"
                onClick={handleResend}
                className="text-[13px] leading-[17px] text-[#30318c] underline"
              >
                Resend Code
              </button>
            </div>
          )}

          {status === "locked" && (
            <p
              role="alert"
              className="mb-[18px] rounded-[4px] bg-[#fdecec] px-[12px] py-[10px] text-[13px] leading-[18px] text-[#e02020]"
            >
              Please ensure email entered is correct. If email entered is
              valid, <span className="font-semibold">please contact HR</span>{" "}
              to resolve the issue.
            </p>
          )}

          {status === "idle" && (
            <p className="mb-[18px] text-[13px] leading-[17px] text-[#8a8a94]">
              OTP Code Not Sent?{" "}
              {secondsLeft > 0 ? (
                <>
                  <span className="text-[#8a8a94]">Resend Code</span> in{" "}
                  <span className="font-medium text-[#55555d]">
                    {formattedTime}
                  </span>{" "}
                  Seconds
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-[#30318c] underline"
                >
                  Resend Code
                </button>
              )}
            </p>
          )}

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={status === "locked"}
            className="h-[46px] w-full rounded-[4px] bg-[#33318b] text-[14px] font-semibold text-white transition hover:bg-[#292775] disabled:opacity-60"
          >
            Confirm
          </button>
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
