"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export const providers = [
    {
        id: "github",
        name: "GitHub",
        icon: <Icons.gitHub className="mr-2 size-4" />,
    },
];

export const OAuthButtons: React.FC = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const handleSignIn = (provider: typeof providers[number]) => {
        const url = new URL(`/api/auth/${provider.id}/`, window.location.origin);
        url.searchParams.set("callbackUrl", callbackUrl ?? "/");
        window.location.href = url.toString();
      };

    return (
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            {providers.map((provider) => (
                <Button
                    key={provider.id}
                    aria-label={`Sign in with ${provider.name}`}
                    variant="outline"
                    onClick={() => handleSignIn(provider)}
                    className="w-full sm:w-auto"
                >
                    {provider.icon}
                    {provider.name}
                </Button>
            ))}
        </div>
    )
}