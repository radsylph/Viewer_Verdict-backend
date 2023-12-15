import mongoose from "mongoose";
import { MediaInterface } from "../interfaces/main";

const mediaSchema = new mongoose.Schema<MediaInterface>({
  title: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  overview: {
    type: String,
    required: false,
  },
  poster: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: String,
    required: false,
  },
  popularity: {
    type: Number,
    required: false,
  },

  idApi: {
    type: Number,
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
});

const Media = mongoose.model<MediaInterface>("Media", mediaSchema);
export default Media;
