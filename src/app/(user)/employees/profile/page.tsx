import { useAuth } from "@/lib/validators/useAuth"

export default async function Page() {
    const { user } = await useAuth()
    if (!user) return <div>Loading...</div>

    console.log(user)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-3xl font-bold mb-4">Welcome, {user.email}!</div>

        </div>
    )
}