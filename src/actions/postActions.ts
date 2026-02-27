'use server';

import { revalidatePath /*, revalidateTag */ } from 'next/cache';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import slugify from 'slugify';

const PostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().max(160, "Excerpt must be under 160 characters"),
    image: z.string().url().optional().or(z.literal('')),
    category: z.string().default('Uncategorized'),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(false),
});

export async function createPost(data: z.infer<typeof PostSchema>) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await dbConnect();

    const validatedData = PostSchema.parse(data);
    const slug = slugify(validatedData.title, { lower: true, strict: true });

    const post = await Post.create({
        ...validatedData,
        slug,
        authorId: userId,
    });

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/dashboard/posts');
    // revalidateTag('posts');

    return { success: true, data: JSON.parse(JSON.stringify(post)) };
}

export async function updatePost(id: string, data: z.infer<typeof PostSchema>) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await dbConnect();

    const validatedData = PostSchema.parse(data);
    const slug = slugify(validatedData.title, { lower: true, strict: true });

    const post = await Post.findOneAndUpdate(
        {
            _id: id,
            authorId: { $in: [userId, "system-ai-automated"] }
        },
        { ...validatedData, slug, updatedAt: new Date() },
        { new: true }
    );

    if (!post) throw new Error("Post not found or unauthorized");

    revalidatePath(`/blog/${slug}`);
    revalidatePath('/dashboard/posts');
    // revalidateTag('posts');

    return { success: true, data: JSON.parse(JSON.stringify(post)) };
}

export async function deletePost(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await dbConnect();
    await Post.findOneAndDelete({
        _id: id,
        authorId: { $in: [userId, "system-ai-automated", "user_dummy_admin"] }
    });

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/dashboard/posts');
    // revalidateTag('posts');

    return { success: true };
}

export async function togglePublish(id: string, published: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await dbConnect();
    await Post.findOneAndUpdate(
        {
            _id: id,
            authorId: { $in: [userId, "system-ai-automated", "user_dummy_admin"] }
        },
        { published }
    );

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/dashboard/posts');
    // revalidateTag('posts');

    return { success: true };
}

export async function getPosts(filters: { category?: string; search?: string; published?: boolean } = {}) {
    await dbConnect();

    const query: any = {};
    if (filters.category) query.category = filters.category;
    if (filters.published !== undefined) query.published = filters.published;
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { content: { $regex: filters.search, $options: 'i' } },
        ];
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(posts));
}

export async function getPostBySlug(slug: string) {
    await dbConnect();
    const post = await Post.findOne({ slug });
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

export async function getDashboardStats() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await dbConnect();
    const total = await Post.countDocuments({
        authorId: { $in: [userId, "system-ai-automated", "user_dummy_admin"] }
    });
    const published = await Post.countDocuments({
        authorId: { $in: [userId, "system-ai-automated", "user_dummy_admin"] },
        published: true
    });
    const drafts = total - published;

    return { total, published, drafts };
}
