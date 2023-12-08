import mongoose from "mongoose";
import { GenreInterface } from "../interfaces/main";

const genreSchema = new mongoose.Schema<GenreInterface>({
  id: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
});

const Genres = mongoose.model<GenreInterface>("Genres", genreSchema);

export default Genres;
