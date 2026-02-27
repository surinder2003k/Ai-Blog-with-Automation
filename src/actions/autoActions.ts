'use server';

import { generateBlogPost } from "@/lib/ai";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import slugify from "slugify";
import { revalidatePath, revalidateTag } from "next/cache";

// High-quality category-based images from Unsplash
const CATEGORY_IMAGES: Record<string, string> = {
    Tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    Coding: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000",
    Lifestyle: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000",
    Gadgets: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000",
    Default: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000"
};

export async function automateTrendingPosts() {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) throw new Error("Missing Groq API Key");

    await dbConnect();

    try {
        // 1. Get Trending Topics (AI simulation of trending news in Feb 2026)
        const topicPrompt = `As an expert trend analyst for February 2026, provide 2 specific and trending tech/AI topics that would make viral blog posts today. 
        Focus on real innovations like: Agentic AI, Autonomous Mobility, SLMs, or new gadget leaks.
        Return as JSON: { "topics": ["topic 1", "topic 2"] }`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: topicPrompt }],
                model: "llama-3.3-70b-versatile",
                temperature: 0.8,
                response_format: { type: "json_object" },
            }),
        });

        const topicData = await response.json();
        const rawContent = topicData.choices[0].message.content;
        const parsed = JSON.parse(rawContent);
        const topics = parsed.topics || [];

        const results = [];

        for (const topic of topics) {
            console.log(`Automating post generation for: ${topic}`);

            const generationResult = await generateBlogPost(topic);

            if (generationResult.success && generationResult.data) {
                const blogData = generationResult.data;
                const slug = slugify(blogData.title, { lower: true, strict: true });

                const existing = await Post.findOne({ slug });
                if (existing) {
                    results.push({ topic, status: 'skipped (already exists)' });
                    continue;
                }

                // Image Strategy: Using Unsplash category mapping
                const category = blogData.category || "Tech";
                blogData.image = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Default;

                // Create post with a system author
                const post = await Post.create({
                    ...blogData,
                    slug,
                    published: true,
                    authorId: "system-ai-automated",
                });

                results.push({ topic, title: post.title, status: 'success' });
            }
        }

        revalidatePath('/', 'layout');
        revalidatePath('/blog', 'page');
        // revalidateTag('posts'); // Removing due to Next.js 16 build error

        return { success: true, results };
    } catch (error: any) {
        console.error("Automation Error:", error);
        return { success: false, error: error.message };
    }
}
