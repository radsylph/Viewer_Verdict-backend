export interface ReviewInterface {
  owner: string;
  mediaId: string;
  rating: number;
  review?: string;
  edited?: boolean;
  timestamp?: Date;
}
