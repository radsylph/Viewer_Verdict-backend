import mongoose from "mongoose";
import { MovieInterface } from "../interfaces/main";

const moviewSchema = new mongoose.Schema<MovieInterface>({
  title: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: false,
  },
  genres: {
    type: [String],
    required: true,
  },
  posters: {
    type: [String],
    required: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  trailers: {
    type: [String] || String,
    required: true,
  },
  runtime: {
    type: Number,
    required: true,
  },
  voteAverage: {
    type: Number,
    required: false,
    default: 0,
  },
  voteCount: {
    type: Number,
    required: false,
    default: 0,
  },
  adult: {
    type: Boolean,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  idApi: {
    type: Number,
    required: false,
  },
});

const Movie = mongoose.model<MovieInterface>("Movie", moviewSchema);

export default Movie;
