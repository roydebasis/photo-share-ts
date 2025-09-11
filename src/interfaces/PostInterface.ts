export interface Post {
  id: number;
  user_id: number;
  caption: string;
  filename: string;
  original_filename: string;
  media_type?: "image" | "video" | "gif";
  mime_type?: string | null;
  size?: number;
  likes_count?: number;
  comments_count?: number;
  visibility: "public" | "private" | "friends" | "custom";
  created_at?: Date;
  updated_at?: Date;
}

export type PostPublic = Partial<Omit<Post, "filename" | "original_filename">>;
