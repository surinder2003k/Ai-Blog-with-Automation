"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ModeToggle } from "./ModeToggle"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, Home, Menu } from "lucide-react"
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
                            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l border-indigo-500/10 backdrop-blur-xl bg-background/95">
                                <div className="flex flex-col h-full">
                                    <SheetHeader className="p-6 pb-4">
                                        <SheetTitle className="text-left text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
                                            AI Blog
                                        </SheetTitle>
                                        <p className="text-left text-xs text-muted-foreground mt-1">Premium AI-Powered Insights</p>
                                    </SheetHeader>

                                    <div className="px-4">
                                        <Separator className="opacity-50" />
                                    </div>

                                    <div className="flex-1 px-4 py-6">
                                        <div className="grid gap-2">
                                            {navLinks.map((link) => {
                                                const isActive = pathname === link.href;
                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-lg font-medium transition-all ${isActive
                                                            ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10"
                                                            : "text-muted-foreground hover:bg-muted"
                                                            }`}
                                                    >
                                                        <link.icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : ""}`} />
                                                        {link.name}
                                                    </Link>
                                                );
                                            })}

                                            <SignedIn>
                                                <div className="mt-2 pt-2 border-t border-dashed">
                                                    <Link
                                                        href="/dashboard"
                                                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-lg font-medium transition-all ${pathname.startsWith("/dashboard")
                                                            ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10"
                                                            : "text-muted-foreground hover:bg-muted"
                                                            }`}
                                                    >
                                                        <LayoutDashboard className={`h-5 w-5 ${pathname.startsWith("/dashboard") ? "text-indigo-600" : ""}`} />
                                                        Dashboard
                                                    </Link>
                                                </div>
                                            </SignedIn>
                                        </div>
                                    </div>

                                    <div className="p-6 mt-auto">
                                        <div className="rounded-2xl bg-indigo-500/5 p-4 border border-indigo-500/10">
                                            <p className="text-xs font-medium text-center text-muted-foreground">
                                                Version 1.0.4 • Latest Update
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
