export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  comment: string;
  parent_id?: number | null;
  likes_count?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type CommentPayload = Partial<Omit<Comment, "id">>;
