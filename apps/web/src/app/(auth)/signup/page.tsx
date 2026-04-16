import Input from "@/components/input";
import { AuthLayout } from "../authLayout";
import Button from "@/components/button";
import Link from "next/link";

const Singup = () => {
  return (
    <div>
      <AuthLayout>
        <div className="flex gap-2">
          <div className="w-1/2">
            <Input
              htmlFor="text"
              placeholder="First Name"
              type="text"
              label="First Name"
            />
          </div>
          <div className="w-1/2">
            <Input
              htmlFor="text"
              placeholder="First Name"
              type="text"
              label="First Name"
            />
          </div>
        </div>
        <div>
          <Input
            htmlFor="text"
            placeholder="Email"
            type="email"
            label="Email"
          />
        </div>
        <div>
          <Input
            htmlFor="text"
            placeholder="Username"
            type="text"
            label="Username"
          />
        </div>
        <div>
          <Input
            htmlFor="password"
            placeholder="Password"
            type="password"
            label="Password"
          />
        </div>
        <div className="flex items-center justify-center mt-2">
          <Button size="lg" children="Signup"/>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium">Already have account?</span>
          {" "}
          <span>
            <Link className="text-blue-900" href={"/signin"}>Signup</Link>
          </span>
        </div>
      </AuthLayout>
    </div>
  );
};

export default Singup;
