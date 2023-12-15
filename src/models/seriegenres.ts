import mongoose from "mongoose";
import { GenreInterface } from "../interfaces/main";

const serieGenreSchema = new mongoose.Schema<GenreInterface>({
  id: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
});

const SerieGenres = mongoose.model<GenreInterface>(
  "SerieGenres",
  serieGenreSchema
);

export default SerieGenres;
