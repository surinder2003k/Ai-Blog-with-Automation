import { getPosts } from "@/actions/postActions"
import { PostCard } from "@/components/blog/PostCard"
import { SearchInput } from "@/components/blog/SearchInput"
import { Search } from "lucide-react"
import { Suspense } from "react"

export default async function BlogListPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string }>
}) {
    const { search, category } = await searchParams
    const posts = await getPosts({
        published: true,
        search: search || "",
        category: category || ""
    })

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight">Our Blog</h1>
                    <p className="text-muted-foreground text-lg">
                        Explore {posts.length} articles about artificial intelligence and more.
                    </p>
                </div>

                <Suspense fallback={<div className="h-11 w-full md:w-96 bg-muted animate-pulse rounded-md" />}>
                    <SearchInput defaultValue={search} />
                </Suspense>
            </header>

            {category && (
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground uppercase text-xs font-bold tracking-widest">Filtered by category:</span>
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">{category}</span>
                </div>
            )}

            {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 space-y-4">
                    <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold">No posts found</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        We couldn't find any articles matching your search criteria. Try using different keywords or categories.
                    </p>
                </div>
            )}
        </div>
    )
}
