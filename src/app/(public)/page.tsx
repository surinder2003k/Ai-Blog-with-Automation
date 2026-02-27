import { getPosts } from "@/actions/postActions"
import { PostCard } from "@/components/blog/PostCard"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/blog/SearchInput"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Suspense } from "react"

export default async function HomePage() {
    const posts = await getPosts({ published: true })
    const latestPosts = posts.slice(0, 6)

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
                <div className="container relative z-10 px-8 flex flex-col items-center text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Content Generation</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                        Discover the Future of <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent italic">
                            AI Blogging
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        A minimalist blog platform where AI meets human creativity. Explore insights on tech,
                        coding, and life, all generated with advanced Google Gemini integration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4">
                        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20" asChild>
                            <Link href="/blog">Explore All Posts</Link>
                        </Button>
                        <Suspense fallback={<div className="h-11 w-full flex-1 bg-slate-950/50 border border-slate-800 rounded-md animate-pulse" />}>
                            <SearchInput redirectPath="/blog" />
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* Latest Posts */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Latest Stories</h2>
                    <Button variant="ghost" asChild>
                        <Link href="/blog">View All Articles</Link>
                    </Button>
                </div>

                {latestPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestPosts.map((post: any) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/30">
                        <p className="text-muted-foreground">No posts found. Start writing something amazing!</p>
                    </div>
                )}
            </section>
        </div>
    )
}
