import { redirect } from "next/navigation";

import { ThemeToggle } from "@/components/global/theme-toggle";
import { useAuth } from "@/lib/validators/useAuth";
import UserButton from "./user-button";
import MainNav from "@/components/global/main-nav";

export default async function Navbar() {
  const { user } = await useAuth();

  if (!user) {
    redirect('/sign-in');
  }


  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {user && <UserButton email={user.email} avatar={user.avatar} className="ml-auto"/>}
        </div>
      </div>
    </div>
  );
};