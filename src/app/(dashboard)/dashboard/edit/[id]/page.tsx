import { getPosts } from "@/actions/postActions"
import { PostForm } from "@/components/dashboard/PostForm"
import dbConnect from "@/lib/db"
import Post from "@/models/Post"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"

import { isMasterAdmin } from "@/actions/adminAuth"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { userId } = await auth()
    const isMaster = await isMasterAdmin()
    const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID

    if (!isMaster && !userId) redirect("/")

    await dbConnect()

    // Admin or Master Admin can fetch any post (or specifically AI posts)
    // For now, let's allow them to fetch any post by ID for editing
    const isAdmin = isMaster || (userId && userId === ADMIN_ID)

    const query: any = { _id: id }
    if (!isAdmin) {
        query.authorId = userId
    }

    const post = await Post.findOne(query)

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
