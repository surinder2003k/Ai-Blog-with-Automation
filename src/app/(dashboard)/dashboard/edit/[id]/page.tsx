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

    if (!post) {
        return <div className="p-10 bg-red-50 text-red-600 rounded-lg">Post with ID {id} not found in DB.</div>
    }

    if (post.authorId !== userId && post.authorId !== "system-ai-automated") {
        return <div className="p-10 bg-yellow-50 text-yellow-600 rounded-lg">
            Unauthorized. Post Author: {post.authorId}, Current User: {userId}
        </div>
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
