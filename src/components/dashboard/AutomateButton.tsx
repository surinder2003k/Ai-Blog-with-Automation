"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { automateTrendingPosts } from "@/actions/autoActions"
import { toast } from "sonner"

export function AutomateButton() {
    const [isPending, setIsPending] = useState(false)

    const handleAutomate = async () => {
        setIsPending(true)
        try {
            const result = await automateTrendingPosts()
            if (result.success) {
                toast.success("AI Automation complete!", {
                    description: `Successfully generated ${result.results?.filter(r => r.status === 'success').length} trending posts.`
                })
            } else {
                toast.error("Automation failed", {
                    description: result.error
                })
            }
        } catch (error) {
            toast.error("Something went wrong during automation.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Button
            onClick={handleAutomate}
            disabled={isPending}
            variant="outline"
            className="border-indigo-600/20 hover:bg-indigo-600/10 text-indigo-700 dark:text-indigo-300"
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
                    Run AI Automation
                </>
            )}
        </Button>
    )
}
