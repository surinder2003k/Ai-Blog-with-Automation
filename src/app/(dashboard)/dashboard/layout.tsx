"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs"
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    LogOut,
    Home,
    Menu,
    ChevronLeft,
    ShieldCheck
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Posts", href: "/dashboard/posts", icon: FileText },
    { name: "Create Post", href: "/dashboard/create", icon: PlusCircle },
]

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const { user } = useUser()
    const isAdmin = user?.id === ADMIN_ID

    const NavContent = () => {
        return (
            <div className="flex flex-col h-full py-6">
                <div className="px-6 mb-10">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <span>AI Dashboard</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {link.name}
                            </Link>
                        )
                    })}

                    {isAdmin && (
                        <div className="pt-4 mt-4 border-t border-border/50">
                            <p className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Administration</p>
                            <Link
                                href="/dashboard/admin/posts"
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === "/dashboard/admin/posts"
                                    ? "bg-purple-600/10 text-purple-600 dark:text-purple-400"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <ShieldCheck className="w-4 h-4" />
                                AI Post Manager
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="px-4 mt-auto pt-6 border-t font-medium">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Back to Site
                    </Link>
                    <div className="mt-4 px-3 flex items-center gap-3">
                        <UserButton afterSignOutUrl="/" showName />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-background shrink-0">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            <main className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 p-6 md:p-10 container mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
