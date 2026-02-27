"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ModeToggle } from "./ModeToggle"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, PenTool, BookOpen, Home, Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

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
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle className="text-left text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
                                        AI Blog
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="grid gap-4 py-8">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-3 text-lg font-medium transition-colors hover:text-indigo-600 ${pathname === link.href ? "text-indigo-600" : "text-muted-foreground"
                                                }`}
                                        >
                                            <link.icon className="h-5 w-5" />
                                            {link.name}
                                        </Link>
                                    ))}
                                    <SignedIn>
                                        <Link
                                            href="/dashboard"
                                            className={`flex items-center gap-3 text-lg font-medium transition-colors hover:text-indigo-600 ${pathname.startsWith("/dashboard") ? "text-indigo-600" : "text-muted-foreground"
                                                }`}
                                        >
                                            <LayoutDashboard className="h-5 w-5" />
                                            Dashboard
                                        </Link>
                                    </SignedIn>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}
