import Link from "next/link"
import { format } from "date-fns"
import { Calendar, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { IPost } from "@/models/Post"

interface PostCardProps {
    post: IPost
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg group">
            <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden">
                {post.image ? (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <Badge className="bg-indigo-600 hover:bg-indigo-700">{post.category}</Badge>
                </div>
            </Link>

            <CardHeader className="flex-1 space-y-2">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                </div>
                <Link href={`/blog/${post.slug}`} className="block group-hover:text-indigo-600 transition-colors">
                    <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
                </Link>
                <p className="text-muted-foreground line-clamp-3 text-sm">{post.excerpt}</p>
            </CardHeader>

            <CardFooter className="pt-0 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-indigo-600">
                        {post.authorId === "system-ai-automated" || post.authorId === "user_dummy_admin" ? "AI" : "Mohit"}
                    </span>
                    <span>•</span>
                    <span>{format(new Date(post.createdAt), "MMM d")}</span>
                </div>
                <Link
                    href={`/blog/${post.slug}`}
                    className="text-indigo-600 font-medium text-sm flex items-center group-hover:underline"
                >
                    Read <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </CardFooter>
        </Card>
    )
}
