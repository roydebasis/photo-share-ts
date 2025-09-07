export interface Like {
  id: number;
  user_id: number;
  post_id: number;
  comment_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export type PostLikePayload = Partial<Omit<Like, "id" | "comment_id">>;

export type CommentLikePayload = Partial<Omit<Like, "id" | "post_id">>;
