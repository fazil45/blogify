"use client";

import { motion } from "motion/react";
import { Mail, ArrowRight, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function EmailVerificationCard() {
  const params = useSearchParams();
  const route = useRouter();
  const token = params.get("token");
  const [status, setStatus] = useState("idle");
  const [resending,setResending] = useState(false)

  const openEmail = () => {
    // Try to open default mail client
    window.open("https://mail.google.com", "_blank"); // you can improve later
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_HTTP_URL}/auth/resend-verification`,
      );
      toast.message("Verification email resent. Please check your inbox.");
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const verify = async () => {
      try {
        setStatus("loading")
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_HTTP_URL}/auth/verify-email`,{
            verificationToken:token
          });
        setStatus("success");
        setTimeout(() => {
          route.push("/signin");
        }, 2000);
      } catch (error) {
        setStatus("error");
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.error || "Something went wrong");
        } else {
          toast.error("Something went wrong");
        }
      }
    };

    verify();
  }, [token, route]);

  const verifyActionButton = () => {
    switch (status) {
      case "idle":
        return (
          <button
            onClick={openEmail}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition"
          >
            Open Email
            <ArrowRight className="w-4 h-4" />
          </button>
        );
      case "loading":
        return (
          <button
            className="w-full flex items-center justify-center gap-2 bg-yellow-200 text-black py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition cursor-none"
          >
            <span className="text-sm">Verifying your email…</span>
            <Loader2 className=" w-4 h-4 animate-spin" />
          </button>
        );
      case "success":
        return (
          <button
            className="w-full flex items-center justify-center gap-2 bg-green-300 text-black py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition cursor-none"
          >
            <span className="text-sm">Email verified — redirecting…</span>
            <CheckCircle className=" w-4 h-4" />
          </button>
        );
      case "error":
        return (
          <button
            className="w-full flex items-center justify-center gap-2 bg-red-300 text-black py-2.5 rounded-lg font-medium hover:bg-zinc-200 transition cursor-none"
          >
            <span className="text-sm">Invalid or expired link</span>
            <XCircle className=" w-4 h-4" />
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-xl"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-zinc-800">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Verify your email
        </h2>

        {/* Description */}
        <p className="text-sm text-zinc-400 text-center mb-6">
          We’ve sent a verification link to your email. Please check your inbox
          and click the link to continue.
        </p>

        {/* Button */}
        {verifyActionButton()}
        {/* Footer */}
        <p className="text-xs text-zinc-500 text-center mt-4">
          Didn’t receive the email? Check spam
        </p>
        <span onClick={handleResend} className="text-blue-300 text-md flex items-center justify-center cursor-pointer">
          {resending ? "Send again" : "sending"}
        </span>
      </motion.div>
    </div>
  );
}
