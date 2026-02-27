"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs"
import { ModeToggle } from "./ModeToggle"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, Home, Menu, ShieldCheck } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Blog", href: "/blog", icon: BookOpen },
]

export function Navbar() {
    const pathname = usePathname()
    const { user } = useUser()

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
                            AI Blog
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-muted-foreground"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <SignedIn>
                        {user?.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID && (
                            <Button variant="ghost" size="sm" asChild className="hidden md:flex text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                <Link href="/dashboard/admin/posts">
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Admin
                                </Link>
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button size="sm">Login</Button>
                        </SignInButton>
                    </SignedOut>

                    <ModeToggle />

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[380px] p-0 border-l border-indigo-500/20 backdrop-blur-2xl bg-background/98">
                                <div className="flex flex-col h-full">
                                    <SheetHeader className="p-8 pb-6">
                                        <SheetTitle className="text-left text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent tracking-tight">
                                            AI Blog
                                        </SheetTitle>
                                        <p className="text-left text-sm text-muted-foreground mt-2 font-medium opacity-80">Premium AI-Powered Insights</p>
                                    </SheetHeader>

                                    <div className="px-8">
                                        <Separator className="opacity-20" />
                                    </div>

                                    <div className="flex-1 px-6 py-8">
                                        <div className="grid gap-4">
                                            {navLinks.map((link) => {
                                                const isActive = pathname === link.href;
                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        className={`flex items-center gap-6 px-6 py-5 rounded-[2rem] text-xl font-bold transition-all duration-300 ${isActive
                                                            ? "bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/20 shadow-lg shadow-indigo-500/5 translate-x-1"
                                                            : "text-muted-foreground hover:bg-muted/80 hover:translate-x-1 hover:text-foreground"
                                                            }`}
                                                    >
                                                        <link.icon className={`h-6 w-6 ${isActive ? "text-indigo-600" : "group-hover:text-foreground"}`} />
                                                        {link.name}
                                                    </Link>
                                                );
                                            })}

                                            <SignedIn>
                                                <div className="mt-6 pt-6 border-t border-dashed border-muted/50">
                                                    <Link
                                                        href="/dashboard"
                                                        className={`flex items-center gap-6 px-6 py-5 rounded-[2rem] text-xl font-bold transition-all duration-300 ${pathname.startsWith("/dashboard")
                                                            ? "bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/20 shadow-lg shadow-indigo-500/5 translate-x-1"
                                                            : "text-muted-foreground hover:bg-muted/80 hover:translate-x-1 hover:text-foreground"
                                                            }`}
                                                    >
                                                        <LayoutDashboard className={`h-6 w-6 ${pathname.startsWith("/dashboard") ? "text-indigo-600" : ""}`} />
                                                        Dashboard
                                                    </Link>
                                                </div>
                                            </SignedIn>
                                        </div>
                                    </div>

                                    <div className="p-8 mt-auto">
                                        <div className="rounded-[2rem] bg-indigo-500/5 p-6 border border-indigo-500/10 backdrop-blur-sm">
                                            <p className="text-[10px] font-black text-center text-muted-foreground/60 tracking-[0.2em] uppercase">
                                                AI BLOG • DESIGNED FOR YOU
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}
