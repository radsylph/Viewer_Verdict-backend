import mongoose from "mongoose";
import { SerieInterface } from "../interfaces/main";

const SerieSchema = new mongoose.Schema<SerieInterface>({
  name: {
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
  posters: {
    type: [String],
    required: true,
  },
  firstAir: {
    type: String,
    required: true,
  },
  lastAir: {
    type: String,
    required: true,
  },
  totalEpisodes: {
    type: Number,
    required: true,
  },
  totalSeasons: {
    type: Number,
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  voteAverage: {
    type: Number,
    required: true,
    default: 0,
  },
  voteCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Serie = mongoose.model("Serie", SerieSchema);
export default Serie;
