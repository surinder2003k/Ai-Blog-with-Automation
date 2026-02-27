import { PostForm } from "@/components/dashboard/PostForm"
import dbConnect from "@/lib/db"
import Post from "@/models/Post"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isMasterAdmin } from "@/actions/adminAuth"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const isMaster = await isMasterAdmin()
    const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID

    // Safely get Clerk userId — may be null if master admin is logged in without Clerk
    let userId: string | null = null
    try {
        const session = await auth()
        userId = session.userId
    } catch {
        // No Clerk session — perfectly fine if master admin cookie is set
    }

    if (!isMaster && !userId) redirect("/")

    await dbConnect()

    // Admin or Master Admin can fetch any post
    const isAdmin = isMaster || (userId && userId === ADMIN_ID)

    const query: any = { _id: id }
    if (!isAdmin) {
        query.authorId = userId
    }

    const post = await Post.findOne(query)

    if (!post) {
        redirect("/dashboard")
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
