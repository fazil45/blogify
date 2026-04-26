
import ResetPasswordClient from "@/components/resetPassswordClient";
import { Suspense } from "react";

const ResetPassword = () => {
 

  return (
    <Suspense fallback={<div>Loading..</div>}>
      <ResetPasswordClient/>
    </Suspense>
  );
};

export default ResetPassword;
