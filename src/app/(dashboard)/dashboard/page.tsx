import { getDashboardStats } from "@/actions/postActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, Clock, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AutomateButton } from "@/components/dashboard/AutomateButton"
import Link from "next/link"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    const statCards = [
        {
            title: "Total Posts",
            value: stats.total,
            icon: FileText,
            color: "text-blue-600",
            bgColor: "bg-blue-600/10",
        },
        {
            title: "Published",
            value: stats.published,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-600/10",
        },
        {
            title: "Drafts",
            value: stats.drafts,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-600/10",
        },
    ]

    return (
        <div className="space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with your blog.</p>
                </div>
                <div className="flex gap-3">
                    <AutomateButton />
                    <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                        <Link href="/dashboard/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Post
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground pt-1">
                                Articles in your library
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-indigo-600/5 border border-indigo-600/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">New: AI Content Generation</h2>
                    <p className="text-indigo-600/80 dark:text-indigo-400/80 max-w-md">
                        Out of ideas? Use our Gemini-powered AI to draft a complete, SEO-friendly blog post in seconds.
                    </p>
                </div>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 px-8" asChild>
                    <Link href="/dashboard/create">Try AI Generator</Link>
                </Button>
            </div>
        </div>
    )
}
