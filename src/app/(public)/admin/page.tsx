"use client"

import { useState } from "react"
import { adminLogin } from "@/actions/adminAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ShieldCheck, Lock, User, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await adminLogin(formData)

        if (result.success) {
            router.push("/dashboard/admin/posts")
            router.refresh()
        } else {
            setError(result.error || "Something went wrong")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-border/50 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="mx-auto w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Master Admin</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the admin panel
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    name="username"
                                    placeholder="Username"
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="pl-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Login to Dashboard"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
