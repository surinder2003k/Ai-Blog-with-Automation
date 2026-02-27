"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Loader2,
    Sparkles,
    Save,
    Send,
    Image as ImageIcon,
    Tags as TagsIcon,
    Layout
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { createPost, updatePost } from "@/actions/postActions"
import { generateBlogPost } from "@/lib/ai"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().max(160, "Excerpt must be under 160 characters"),
    image: z.string().url().optional().or(z.literal('')),
    category: z.string().min(1, "Category is required"),
    tags: z.string(),
    published: z.boolean().default(false),
})

interface PostFormProps {
    initialData?: any
    isEditing?: boolean
}

export function PostForm({ initialData, isEditing = false }: PostFormProps) {
    const router = useRouter()
    const [isAiGenerating, setIsAiGenerating] = useState(false)
    const [aiPrompt, setAiPrompt] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            tags: initialData.tags.join(', ')
        } : {
            title: "",
            content: "",
            excerpt: "",
            image: "",
            category: "Tech",
            tags: "",
            published: false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formattedValues = {
            ...values,
            tags: values.tags.split(',').map(s => s.trim()).filter(s => s)
        }
        try {
            if (isEditing) {
                await updatePost(initialData._id, formattedValues)
                toast.success("Post updated successfully!")
            } else {
                await createPost(formattedValues)
                toast.success("Post created successfully!")
            }
            router.push("/dashboard/posts")
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        }
    }

    const handleAiGenerate = async () => {
        if (!aiPrompt) {
            toast.error("Please enter a topic or prompt for AI generation.")
            return
        }

        setIsAiGenerating(true)
        toast.info("AI Assistant is crafting your blog post...")

        try {
            const result = await generateBlogPost(aiPrompt)
            if (result.success && result.data) {
                const { title, content, excerpt, category, tags } = result.data
                form.setValue("title", title)
                form.setValue("content", content)
                form.setValue("excerpt", excerpt)
                if (category) form.setValue("category", category)
                if (tags) form.setValue("tags", tags.join(', '))

                toast.success("AI Content generated! Review and edit before saving.")
            } else {
                toast.error(result.error || "Failed to generate content")
            }
        } catch (error) {
            toast.error("AI generation failed. Check your API key.")
        } finally {
            setIsAiGenerating(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-indigo-600" />
                                    General Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter a catchy title" {...field} className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="excerpt"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Excerpt (SEO Description)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="A short summary for search engines and social media"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>Max 160 characters</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Markdown Content</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write your story in Markdown..."
                                                    className="min-h-[400px] font-mono"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                onClick={() => form.setValue("published", false)}
                                variant="outline"
                                className="flex-1"
                                disabled={form.formState.isSubmitting}
                            >
                                <Save className="mr-2 h-4 w-4" /> Save as Draft
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => form.setValue("published", true)}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                                disabled={form.formState.isSubmitting}
                            >
                                <Send className="mr-2 h-4 w-4" />
                                {isEditing ? "Update & Publish" : "Publish Now"}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* AI Generator Card */}
                        <Card className="border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                                    <Sparkles className="w-5 h-5" />
                                    AI Assistant
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-indigo-600/80 dark:text-indigo-400/80">
                                    Enter a topic and AI will generate a full blog post for you.
                                </p>
                                <Textarea
                                    placeholder="e.g. Benefits of Next.js 15, My trip to Himalayas, Recipe of Butter Chicken..."
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="bg-background border-indigo-200 focus-visible:ring-indigo-500"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAiGenerate}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                    disabled={isAiGenerating}
                                >
                                    {isAiGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Generate with AI
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Settings Card */}
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <TagsIcon className="w-4 h-4" />
                                    Post Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Tech">Tech</SelectItem>
                                                    <SelectItem value="Coding">Coding</SelectItem>
                                                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                                                    <SelectItem value="AI">AI</SelectItem>
                                                    <SelectItem value="Travel">Travel</SelectItem>
                                                    <SelectItem value="General">General</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <Input placeholder="nextjs, react, ai (comma separated)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }: { field: any }) => (
                                        <FormItem>
                                            <FormLabel>Feature Image URL</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-2">
                                                    <Input placeholder="https://unsplash.com/..." {...field} />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Link to an Unsplash or custom image</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    )
}
