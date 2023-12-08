export interface CommentInterface {
  owner: string;
  content: string;
  mediaId?: string;
  createdAt: Date;
  updatedAt: Date;
  isResponse: boolean;
}
