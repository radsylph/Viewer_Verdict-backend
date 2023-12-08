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
    required: true,
  },
  type: {
    type: String,
    required: true,
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
