import { PostForm } from "@/components/dashboard/PostForm"

export default function CreatePostPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
                <p className="text-muted-foreground">Draft your next masterpiece or let AI help you out.</p>
            </div>
            <PostForm />
        </div>
    )
}
