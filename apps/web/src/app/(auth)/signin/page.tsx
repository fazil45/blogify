import Input from "@/components/input";
import { AuthLayout } from "../authLayout";
import Button from "@/components/button";
import Link from "next/link";

const Signin = () => {
  return (
    <AuthLayout>
      <div>
        <Input htmlFor="text" placeholder="Email" type="email" label="Email" />
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
        <Button size="lg" children="Signin" />
      </div>
      <div className="flex items-center justify-center gap-2">
        <span className="font-medium">Create an account</span>{" "}
        <span>
          <Link className="text-blue-900" href={"/signup"}>
            Signup
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
};

export default Signin;
