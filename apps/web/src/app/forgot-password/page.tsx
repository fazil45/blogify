"use client"
import Button from "@/components/button";
import CardModal from "@/components/cardModal";
import Input from "@/components/input";
import api from "@/lib/axios";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "sonner";

const ForgotPasswordCard = () => {
  const [send, setSend] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const forgotPassword = async () => {
    try {
      if (emailRef.current === null) {
        return toast.error("Enter Email");
      }
      const email = emailRef.current?.value;
      setSend(true);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_HTTP_URL}/auth/forgot-password`, {
        email,
      },{
        withCredentials:true
      });
      console.log(response.data.error)
      setSend(false);
      toast.success("Password Reset Mail sent")
    } catch (error) {
      setSend(false);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <CardModal>
        <div className="flex flex-col">
          <div className="mt-2 mb-4 lg:mt-8 xl:mt-8 lg:mb-16 xl:mb-16 text-lg lg:text-2xl xl:text-2xl font-medium">
            Enter Email to Reset Password
          </div>
          <div className="flex flex-col items-center justify-center mb-8 gap-8">
            <Input
              htmlFor="email"
              label="Enter Email"
              placeholder="Email"
              type="email"
              ref={emailRef}
            />
            <Button  onClick={forgotPassword} children={send ? "Sending...": "Send Reset Mail" } size="lg" />
          </div>
        </div>
      </CardModal>
    </div>
  );
};

export default ForgotPasswordCard;
