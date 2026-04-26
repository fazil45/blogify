import VerifyEmailClient from "@/components/verifyEmailClient";
import { Suspense } from "react";


export default function EmailVerificationCard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailClient/>
    </Suspense>
  );
}
