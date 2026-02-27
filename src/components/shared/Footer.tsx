import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-indigo-600">
                            AI Blog
                        </Link>
                        <p className="text-muted-foreground max-w-xs text-sm">
                            Sharing insights and stories powered by artificial intelligence and modern web technologies.
                        </p>
                    </div>

                    <div className="flex gap-6 items-center">
                        <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2026 AI Blog - Built with AI & Next.js</p>
                    <div className="flex gap-6">
                        <Link href="/" className="hover:text-foreground">Home</Link>
                        <Link href="/blog" className="hover:text-foreground">Blog</Link>
                        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
