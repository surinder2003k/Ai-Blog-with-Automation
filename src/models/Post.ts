import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image?: string;
    category: string;
    tags: string[];
    published: boolean;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, unique: true, required: true },
        content: { type: String, required: true },
        excerpt: { type: String, required: true, maxlength: 160 },
        image: { type: String },
        category: { type: String, default: 'Uncategorized' },
        tags: [{ type: String }],
        published: { type: Boolean, default: false },
        authorId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance and uniqueness
PostSchema.index({ slug: 1 }, { unique: true });
PostSchema.index({ published: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ authorId: 1 });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
