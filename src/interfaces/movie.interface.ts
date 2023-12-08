export interface MovieInterface {
  title: string;
  overview: string;
  tagline: string;
  genres: string[];
  posters: string[];
  releaseDate: string;
  trailers: string[] | string;
  runtime: number;
  voteAverage?: number;
  voteCount?: number;
  adult: boolean;
  language: string;
  media_type?: string;
  poster_path?: string;
  backdrop_path?: string;
  idApi?: number;
}
