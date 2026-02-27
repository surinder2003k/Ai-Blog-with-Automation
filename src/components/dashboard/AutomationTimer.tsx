"use client"

import { useEffect, useState } from "react"
import { Timer, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AutomationTimer() {
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null)
    const [nextPostTime, setNextPostTime] = useState<string>("")

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()

            // Current time in IST (User specified 8 AM/8 PM IST)
            // We'll calculate the next occurrence of 08:00 or 20:00 IST
            const istOffset = 5.5 * 60 * 60 * 1000
            const utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
            const istNowDate = new Date(utcNow + istOffset)

            const times = [8, 20] // 8am and 8pm
            let nextTarget = new Date(istNowDate)
            nextTarget.setSeconds(0)
            nextTarget.setMinutes(0)

            let found = false
            for (const hour of times) {
                nextTarget.setHours(hour)
                if (nextTarget > istNowDate) {
                    found = true
                    break
                }
            }

            if (!found) {
                nextTarget.setDate(nextTarget.getDate() + 1)
                nextTarget.setHours(times[0])
            }

            const diff = nextTarget.getTime() - istNowDate.getTime()

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeLeft({ hours, minutes, seconds })
            setNextPostTime(nextTarget.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(timer)
    }, [])

    if (!timeLeft) return null

    // Only show if it's within 5 hours of the next post as requested, 
    // but for the sake of dashboard "premium" feel, we can show it always with a subtle style 
    // OR strictly follow the "5 hours" rule. The user said: 
    // "5 ghante bta de ki ye blog upload hone wala hai and time lga hoga"

    const showTimer = timeLeft.hours < 5

    if (!showTimer) {
        return (
            <Card className="border-border/40 bg-muted/20">
                <CardContent className="py-3 px-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Timer className="w-3 h-3" />
                        <span>Next Auto-Post Scheduled: {nextPostTime} IST</span>
                    </div>
                    <span className="font-medium">Scheduled</span>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <CardContent className="py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Zap className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Automation Imminent</h4>
                        <p className="text-xs text-muted-foreground">Next trending blog post scheduled for {nextPostTime} IST</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center min-w-[3rem]">
                        <span className="text-xl font-bold text-indigo-600">{timeLeft.hours.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Hrs</span>
                    </div>
                    <span className="text-xl font-bold text-indigo-300">:</span>
                    <div className="flex flex-col items-center min-w-[3rem]">
                        <span className="text-xl font-bold text-indigo-600">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Min</span>
                    </div>
                    <span className="text-xl font-bold text-indigo-300">:</span>
                    <div className="flex flex-col items-center min-w-[3rem]">
                        <span className="text-xl font-bold text-indigo-600">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sec</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
