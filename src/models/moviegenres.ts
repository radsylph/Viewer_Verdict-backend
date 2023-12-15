import mongoose from "mongoose";
import { GenreInterface } from "../interfaces/main";

const movieGenreSchema = new mongoose.Schema<GenreInterface>({
  id: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
});

const MovieGenres = mongoose.model<GenreInterface>("MovieGenres", movieGenreSchema);

export default MovieGenres;
