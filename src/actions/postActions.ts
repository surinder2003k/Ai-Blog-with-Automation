'use server';

import { revalidatePath /*, revalidateTag */ } from 'next/cache';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { z } from 'zod';
import { auth, clerkClient } from '@clerk/nextjs/server';
import slugify from 'slugify';

export async function getAuthorNames(authorIds: string[]) {
    const uniqueIds = [...new Set(authorIds)].filter(id =>
        id && id !== "system-ai-automated" && id !== "user_dummy_admin"
    );

    const nameMap: Record<string, string> = {
        "system-ai-automated": "AI Assistant",
        "user_dummy_admin": "AI Assistant"
    };

    if (uniqueIds.length === 0) return nameMap;

    try {
        const client = await clerkClient();
        const users = await client.users.getUserList({ userId: uniqueIds });

        users.data.forEach(user => {
            const name = [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.emailAddresses[0]?.emailAddress?.split('@')[0] ||
                "User";
            nameMap[user.id] = name;
        });
    } catch (error) {
        console.error("Error fetching author names:", error);
    }

    return nameMap;
}

const PostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().max(160, "Excerpt must be under 160 characters"),
    image: z.string().url().optional().or(z.literal('')),
    category: z.string().default('Uncategorized'),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(false),
});

const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

async function checkAdmin(userId: string | null) {
    return userId && userId === ADMIN_USER_ID;
}

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

    const isAdmin = await checkAdmin(userId);
    await dbConnect();

    const validatedData = PostSchema.parse(data);
    const slug = slugify(validatedData.title, { lower: true, strict: true });

    const query: any = { _id: id };
    if (!isAdmin) {
        query.authorId = userId;
    }

    const post = await Post.findOneAndUpdate(
        query,
        { ...validatedData, slug, updatedAt: new Date() },
        { new: true }
    );

    if (!post) throw new Error("Post not found or unauthorized");

    revalidatePath(`/blog/${slug}`);
    revalidatePath('/dashboard/posts');
    revalidatePath('/dashboard/admin/posts');
    // revalidateTag('posts');

    return { success: true, data: JSON.parse(JSON.stringify(post)) };
}

export async function deletePost(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const isAdmin = await checkAdmin(userId);
    await dbConnect();

    const query: any = { _id: id };
    if (!isAdmin) {
        query.authorId = userId;
    }

    await Post.findOneAndDelete(query);

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/dashboard/posts');
    revalidatePath('/dashboard/admin/posts');
    // revalidateTag('posts');

    return { success: true };
}

export async function togglePublish(id: string, published: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const isAdmin = await checkAdmin(userId);
    await dbConnect();

    const query: any = { _id: id };
    if (!isAdmin) {
        query.authorId = userId;
    }

    await Post.findOneAndUpdate(
        query,
        { published }
    );

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/dashboard/posts');
    revalidatePath('/dashboard/admin/posts');
    // revalidateTag('posts');

    return { success: true };
}

export async function getPosts(filters: { category?: string; search?: string; published?: boolean; authorId?: string } = {}) {
    await dbConnect();

    const query: any = {};
    if (filters.category) query.category = filters.category;
    if (filters.published !== undefined) query.published = filters.published;
    if (filters.authorId) query.authorId = filters.authorId;
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

    const isAdmin = await checkAdmin(userId);
    await dbConnect();

    // For Admin, total means all AI posts + their own posts (or just all?)
    // User requested "admin dashboard... jaha se ai se genrated blog ko edit kr ske"
    // So for admin view, maybe we show global stats or just AI stats.
    // Let's stick to the current user's stats for now, but the Admin Panel page will have its own logic.

    const total = await Post.countDocuments({
        authorId: userId
    });
    const published = await Post.countDocuments({
        authorId: userId,
        published: true
    });
    const drafts = total - published;

    return { total, published, drafts };
}
