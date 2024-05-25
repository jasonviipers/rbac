import { ResetPassword } from "@/components/form/reset-password";
import { Icons } from "@/components/icons";
import { Suspense } from "react";


export const metadata = {
  title: "Reset Password",
  description: "Reset Password Page",
};

interface IResetPassword {
  params: {
    token: string;
  };
}

export default function Page({ params }: IResetPassword) {
  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto size-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Login to your account
          </p>
        </div>
        <Suspense>
          <ResetPassword token={params.token} />
        </Suspense>
      </div>
    </div>
  );
}