"use server"

export async function generateBlogPost(userPrompt: string) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        return {
            success: false,
            error: "Groq API Key is missing. Please add it to your .env.local file.",
        };
    }

    const prompt = `Write an engaging, SEO-friendly blog post in a mix of Hindi and English (Hinglish) or pure English as suitable for a tech/lifestyle audience about: "${userPrompt}".
  
  Please provide the output strictly as a JSON object with the following structure:
  {
    "title": "Engaging Title",
    "content": "Full markdown content (800-1500 words). Use markdown headings, lists, and formatting. Include a mix of English and Hindi where natural.",
    "excerpt": "A short, catchy summary of the post (max 160 characters).",
    "category": "One suitable category (e.g., Tech, Lifestyle, Coding, Travel)",
    "tags": ["tag1", "tag2", "tag3", "tag4"],
    "imageSearchKeyword": "A precise English keyword for finding a professional image (e.g., 'artificial intelligence laboratory', 'minimalist workspace')"
  }

  Important: Return ONLY the JSON object, no other text or explanation. Ensure the JSON is valid.`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 4096,
                response_format: { type: "json_object" },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to generate content from Groq");
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const blogData = JSON.parse(content);

        return {
            success: true,
            data: blogData,
        };
    } catch (error: any) {
        console.error("Groq Generation Error:", error);
        return {
            success: false,
            error: error.message || "Failed to generate blog post content",
        };
    }
}
