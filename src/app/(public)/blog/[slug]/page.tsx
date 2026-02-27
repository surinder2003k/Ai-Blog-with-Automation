import { getPostBySlug, getAuthorNames } from "@/actions/postActions"
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar, Tag, ChevronLeft, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) return { title: "Post Not Found" }

    return {
        title: `${post.title} | AI Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.image ? [post.image] : [],
        }
    }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post || (!post.published && !process.env.DEV_MODE)) {
        notFound()
    }

    const nameMap = await getAuthorNames([post.authorId])
    const authorName = nameMap[post.authorId] || "Unknown Author"
    const isAi = post.authorId === "system-ai-automated" || post.authorId === "user_dummy_admin"

    return (
        <article className="max-w-4xl mx-auto space-y-10 py-6">
            <Link
                href="/blog"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Blog
            </Link>

            <header className="space-y-6">
                <Badge className="bg-indigo-600 hover:bg-indigo-700">{post.category}</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground pt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200/50">
                            {isAi ? "AI" : authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">
                                {authorName}
                            </span>
                            <span className="text-xs">{isAi ? "System Bot" : "Author @ AI Blog"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(post.createdAt), "MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4" />
                        {post.category}
                    </div>
                </div>
            </header>

            {post.image && (
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-2xl border border-border/50">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}

            <div className="bg-card/50 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-border/50 shadow-sm">
                <MarkdownRenderer content={post.content} />
            </div>

            <footer className="pt-12 border-t mt-16">
                <div className="flex flex-col items-center text-center space-y-4">
                    <h3 className="text-xl font-bold">Enjoyed this article?</h3>
                    <p className="text-muted-foreground max-w-md">
                        Check out more interesting stories on my blog or follow along for more AI-powered insights.
                    </p>
                    <div className="pt-4 flex gap-4">
                        {post.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary">#{tag}</Badge>
                        ))}
                    </div>
                </div>
            </footer>
        </article>
    )
}
