"use client"

import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { useDebounce } from "@/lib/hooks/use-debounce"

export function SearchInput({
    defaultValue,
    redirectPath
}: {
    defaultValue?: string;
    redirectPath?: string;
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [value, setValue] = useState(defaultValue || "")
    const debouncedValue = useDebounce(value, 500)

    useEffect(() => {
        // Only trigger if value changes and it's not the initial mount with defaultValue
        if (value === (defaultValue || "")) return;

        const params = new URLSearchParams(searchParams)
        if (debouncedValue) {
            params.set("search", debouncedValue)
        } else {
            params.delete("search")
        }

        const targetPath = redirectPath || pathname

        startTransition(() => {
            router.push(`${targetPath}?${params.toString()}`)
        })
    }, [debouncedValue, pathname, router, searchParams, redirectPath, defaultValue])

    return (
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search by title or content..."
                className="pl-10 h-11"
            />
            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
            )}
        </div>
    )
}
