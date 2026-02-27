'use server';

import { generateBlogPost } from "@/lib/ai";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import slugify from "slugify";
import { revalidatePath, revalidateTag } from "next/cache";

// High-quality category-based images from Unsplash
// Keywords for dynamic Unsplash images
const CATEGORY_KEYWORDS: Record<string, string> = {
    Tech: "technology,innovation",
    AI: "artificial intelligence,robot",
    Coding: "programming,software",
    Lifestyle: "modern lifestyle,minimal",
    Gadgets: "gadgets,devices",
    Default: "tech,innovation"
};

export async function automateTrendingPosts() {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) throw new Error("Missing Groq API Key");

    await dbConnect();

    try {
        // 1. Get Trending Topics (AI simulation of trending news in Feb 2026)
        const topicPrompt = `As an expert trend analyst for February 2026, provide EXACTLY 2 distinct and trending tech/AI topics that would make viral blog posts today. 
        Focus on real innovations like: Agentic AI, Autonomous Mobility, SLMs, or new gadget leaks.
        Ensure both topics are unique and interesting.
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

                // Image Strategy: Using loremflickr for reliable keyword-based images
                const category = blogData.category || "Tech";
                const keyword = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.Default;
                // Using loremflickr which is a reliable free alternative to deprecated source.unsplash
                blogData.image = `https://loremflickr.com/1200/600/${keyword.split(',')[0]}`;

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
