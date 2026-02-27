import { getPosts, deletePost, togglePublish, getAuthorNames } from "@/actions/postActions"
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
    Pencil,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Bot
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { SearchInput } from "@/components/blog/SearchInput"
import { Suspense } from "react"
import { isMasterAdmin } from "@/actions/adminAuth"

export default async function AdminPostsPage({
    searchParams
}: {
    searchParams: Promise<{ search?: string }>
}) {
    const { userId } = await auth()
    const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
    const isMaster = await isMasterAdmin();

    if (!isMaster && (!userId || userId !== ADMIN_ID)) {
        redirect("/dashboard")
    }

    const { search } = await searchParams
    // Fetch posts specifically from the AI author
    const posts = await getPosts({
        search: search || "",
        authorId: "system-ai-automated"
    })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Bot className="w-8 h-8 text-indigo-600" />
                        AI Post Manager
                    </h1>
                    <p className="text-muted-foreground">Admin: Review and edit AI-generated blog content.</p>
                </div>
                <div className="flex gap-3">
                    <Suspense fallback={<div className="h-10 w-64 bg-muted animate-pulse rounded-md" />}>
                        <SearchInput defaultValue={search} />
                    </Suspense>
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
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
                                    <TableCell>
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border bg-muted shrink-0">
                                            {post.image ? (
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase">
                                                    NI
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
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
                                            <Button variant="ghost" size="icon" asChild title="Edit AI Post">
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
                                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                                    No AI posts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
