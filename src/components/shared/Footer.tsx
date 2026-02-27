export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-6 mt-20">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                <p>© {new Date().getFullYear()} AI Blog. Built with Next.js 15, Tailwind CSS, & Gemini AI.</p>
            </div>
        </footer>
    )
}
