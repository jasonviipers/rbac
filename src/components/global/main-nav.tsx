"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/admin",
      label: "Overview",
      active: pathname === "/admin"
    },
    {
      href: "/admin/users",
      label: "Users",
      active: pathname === "/admin/users"
    },
    {
      href: "/admin/teams",
      label: "Teams",
      active: pathname === "/admin/teams"
    },
    {
      href: "/admin/permissions",
      label: "Permissions",
      active: pathname === "/admin/permissions"
    },
    {
      href: "/admin/roles",
      label: "Roles",
      active: pathname === "/admin/roles"
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
};