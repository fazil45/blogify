"use client"
import Button from "@/components/button";
import CardModal from "@/components/cardModal";
import Input from "@/components/input";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import  {  useRef, useState } from "react";
import { toast } from "sonner";

const ResetPassword = () => {
  const [change, setChange] = useState(false);
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const params = useSearchParams()
  const token = params.get("token")

  const resetPassword = async () => {
    if (passwordRef.current === null) {
        return toast.error("Enter New Password")
    }

    const newPassword = passwordRef.current.value

    try {
        setChange(true)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HTTP_URL}/auth/reset-password`,{
            token,
            newPassword
        },{
            withCredentials:true
        })
        toast.success(response.data.message)
        setChange(false)
    } catch (error) {  
        setChange(false)
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data.error || "Something went Wrong")
        } else {
            toast.error("Something went wrong")
        }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <CardModal>
        <div>
          <div className="mt-12 mb-8 text-2xl flex items-center justify-center">Enter New Password</div>
          <div className="flex flex-col items-center justify-center mb-8 gap-8">
            <Input
              htmlFor="password"
              label="Enter New Password"
              placeholder="Password"
              type="password"
              ref={passwordRef}
            />
            <Button
              onClick={resetPassword}
              children={change ? "Reseting..." : "Reset Password"}
              size="lg"
            />
          </div>
        </div>
      </CardModal>
    </div>
  );
};

export default ResetPassword;
