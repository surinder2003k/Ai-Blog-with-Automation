import { getPosts, deletePost, togglePublish } from "@/actions/postActions"
import { auth } from "@clerk/nextjs/server"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import {
    MoreHorizontal,
    PlusCircle,
    Pencil,
    Trash2,
    Eye,
    CheckCircle,
    XCircle
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPostsPage() {
    const { userId } = await auth()
    if (!userId) redirect("/")

    const posts = await getPosts()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Posts</h1>
                    <p className="text-muted-foreground">Manage and organize your blog articles here.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                    <Link href="/dashboard/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Post
                    </Link>
                </Button>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length > 0 ? (
                            posts.map((post: any) => (
                                <TableRow key={post._id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="line-clamp-1">{post.title}</span>
                                            <span className="text-xs text-muted-foreground font-normal">/{post.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {post.published ? (
                                            <Badge className="bg-green-600/10 text-green-600 hover:bg-green-600/20 border-green-600/20">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Published
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-orange-600/10 text-orange-600 hover:bg-orange-600/20 border-orange-600/20">
                                                <XCircle className="w-3 h-3 mr-1" /> Draft
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{post.category}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/blog/${post.slug}`} target="_blank">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/edit/${post._id}`}>
                                                    <Pencil className="h-4 w-4 text-blue-600" />
                                                </Link>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <form action={async () => {
                                                            'use server'
                                                            await togglePublish(post._id, !post.published)
                                                        }}>
                                                            <button className="w-full text-left">
                                                                {post.published ? "Unpublish" : "Publish Now"}
                                                            </button>
                                                        </form>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" asChild>
                                                        <form action={async () => {
                                                            'use server'
                                                            await deletePost(post._id)
                                                        }}>
                                                            <button className="w-full text-left flex items-center">
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete Post
                                                            </button>
                                                        </form>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                                    No posts yet. Click "New Post" to start blogging!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
