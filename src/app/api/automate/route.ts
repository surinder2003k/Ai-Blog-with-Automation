import { automateTrendingPosts } from "@/actions/autoActions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "aiblog-secret-123";

    if (authHeader !== `Bearer ${cronSecret}` && token !== cronSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await automateTrendingPosts();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
