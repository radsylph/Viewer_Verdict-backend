export interface ReviewInterface {
  userId: string;
  mediaId: string;
  rating: number;
  comment?: string;
  timestamp: Date;

}
