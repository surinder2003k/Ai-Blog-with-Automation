import { getPosts } from "@/actions/postActions"
import { PostForm } from "@/components/dashboard/PostForm"
import dbConnect from "@/lib/db"
import Post from "@/models/Post"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { userId } = await auth()

    if (!userId) redirect("/")

    await dbConnect()
    const post = await Post.findById(id)

    if (!post || (post.authorId !== userId && post.authorId !== "system-ai-automated")) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
                <p className="text-muted-foreground">Make changes to your article before republishing.</p>
            </div>
            <PostForm initialData={JSON.parse(JSON.stringify(post))} isEditing />
        </div>
    )
}
