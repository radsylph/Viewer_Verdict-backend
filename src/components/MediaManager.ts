import { Request, Response } from "express";
import {
  Movie,
  Review,
  Usuario,
  Genres,
  genres_list,
  Serie,
  Media,
} from "../models/main";
import { AII, API } from "../config/axios";
import { endpoints } from "../helpers/endpoints";
import { check, validationResult } from "express-validator";
import {
  MovieInterface,
  SerieInterface,
  MediaInterface,
  ReviewInterface,
} from "../interfaces/main";

interface CustomRequest extends Request {
  user?: any;
  user_id?: any;
}
class MediaManager {
  constructor() {}

  async searchMedia(req: CustomRequest, res: Response) {
    const { name } = req.params;
    try {
      const media = await Media.find({ title: new RegExp(name, "i") });

      if (!media || media.length === 0) {
        const Medias: any = [];
        const allMedia = await AII.get(endpoints.searchGeneralMedia, {
          params: {
            api_key: process.env.API_MOVIE_TOKEN,
            query: name,
          },
        }).then(async (res) => {
          const medias = res.data.results.filter((media: any) => {
            const mediaTitle = media.title ? media.title.toLowerCase() : "";
            const mediaName = media.name ? media.name.toLowerCase() : "";
            const type = media.media_type;
            if (type === "movie" || type === "tv") {
              return (
                mediaTitle.includes(name.toLowerCase()) ||
                mediaName.includes(name.toLowerCase())
              );
            }
            return false;
          });
          for (const media of medias) {
            const media_genres = await Genres.find({
              id: { $in: media.genre_ids },
            });
            const existingMedia = await Media.findOne({ id: media.id });
            if (!existingMedia) {
              try {
                const newMedia: MediaInterface = {
                  title: media.title || media.name.toLowerCase(),
                  overview: media.overview,
                  poster: media.poster_path,
                  type: media.media_type,
                  idApi: media.id,
                  genres: media_genres.map((genre) => genre.name),
                };
                await Media.create(newMedia);
                Medias.push(newMedia);
              } catch (error) {
                console.log(error);
                return error;
              }
            }
          }
          return Medias;
        });
        return res
          .status(200)
          .json({ msg: "movies retrieved from the api", media: allMedia });
      }
      return res
        .status(200)
        .json({ msg: "media retrieved from the db", media });
    } catch (error) {
      return res.status(500).json({
        message: "server error",
        errors: [
          {
            type: "server",
            value: error,
            msg: "there was an error when finding the movies",
            path: "MediaManager",
            location: "searchMedia",
          },
        ],
      });
    }
  }

  async getMovie(req: CustomRequest, res: Response) {
    const { id } = req.params;
    try {
      const movie = await Movie.findOne({ idApi: id });
      if (!movie) {
        const movieDetails = await AII.get(endpoints.getMovieDetails + id).then(
          async (movieDetailed) => {
            const movie_trailers = await AII.get(
              endpoints.getMovieDetails + id + endpoints.getMovieVideo
            ).then((trailer) => {
              const trailers = trailer.data.results.map(
                (trailer: any) => endpoints.showVideo + trailer.key
              );
              return trailers;
            });
            const movie_genres = await Genres.find({
              id: {
                $in: movieDetailed.data.genres.map((genre: any) => genre.id),
              },
            });
            const movie: MovieInterface = {
              idApi: movieDetailed.data.id,
              title: movieDetailed.data.title,
              overview: movieDetailed.data.overview,
              tagline: movieDetailed.data.tagline,
              genres: movie_genres.map((genre) => genre.name),
              posters: [
                endpoints.showImages + movieDetailed.data.poster_path,
                endpoints.showImages + movieDetailed.data.backdrop_path,
              ],
              releaseDate: movieDetailed.data.release_date,
              runtime: movieDetailed.data.runtime,
              adult: movieDetailed.data.adult,
              trailers: movie_trailers ? movie_trailers : "",
              language: movieDetailed.data.original_language,
              voteAverage: 0,
              voteCount: 0,
            };
            try {
              await Movie.create(movie);
              return movie;
            } catch (error) {
              console.log(error);
            }
            return movie;
          }
        );

        return res
          .status(200)
          .json({ msg: "Movie form api", movie: movieDetails });
      }

      return res.status(200).json({ msg: "Movie from db", movie });
    } catch (error) {
      return res.status(500).json({
        message: "server error",
        errors: [
          {
            type: "server",
            value: error,
            msg: "there was an error when finding the movie",
            path: "MovieManager",
            location: "getMovie",
          },
        ],
      });
    }
  }

  async getSerie(req: CustomRequest, res: Response) {
    const { id } = req.params;
    try {
      const serie = await Serie.findOne({ idApi: id });
      if (!serie) {
        const serieDetails = await AII.get(endpoints.getSerieDetails + id).then(
          async (serieDetailed) => {
            const serie_trailers = await AII.get(
              endpoints.getSerieDetails + id + endpoints.getSerieVideo
            ).then((trailers) => {
              const serieTrailers = trailers.data.results.map(
                (trailer: any) => endpoints.showVideo + trailer.key
              );
              return serieTrailers;
            });
            const serie_genres = await Genres.find({
              id: {
                $in: serieDetailed.data.genres.map((genre: any) => genre.id),
              },
            });
            const serie: SerieInterface = {
              idApi: serieDetailed.data.id,
              name: serieDetailed.data.name,
              overview: serieDetailed.data.overview,
              tagline: serieDetailed.data.tagline,
              posters: [
                endpoints.showImages + serieDetailed.data.poster_path,
                endpoints.showImages + serieDetailed.data.backdrop_path,
              ],
              firstAir: serieDetailed.data.first_air_date,
              lastAir: serieDetailed.data.last_air_date,
              totalEpisodes: serieDetailed.data.number_of_episodes,
              totalSeasons: serieDetailed.data.number_of_seasons,
              genres: serie_genres.map((genre) => genre.name),
              trailers: serie_trailers ? serie_trailers : "",
              status: serieDetailed.data.status,
            };
            console.log(serie);
            try {
              await Serie.create(serie);
              return serie;
            } catch (error) {
              console.log(error);
              return error;
            }
          }
        );
        return res
          .status(200)
          .json({ msg: "Serie from api", serie: serieDetails });
      }
      return res.status(200).json({ msg: "Serie from db", serie });
    } catch (error) {
      return res.status(500).json({
        message: "server error",
        errors: [
          {
            type: "server",
            value: error,
            msg: "there was an error when finding the serie",
            path: "MovieManager",
            location: "getSerie",
          },
        ],
      });
    }
  }

  async reviewMovie(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const { review, rating } = req.body;

    const serie = await Movie.findOne({ idApi: id });
    if (!serie) {
      return res.status(404).json({ msg: "Movie not found" });
    }

    try {
      const newReview = await Review.create({
        review,
        rating,
        mediaId: serie._id,
        owner: req.user_id,
      });

      await Movie.updateOne(
        { idApi: id },
        {
          $inc: { voteCount: 1, voteTotalPoints: rating },
        }
      );

      const updatedMovie = await Movie.findOne({ idApi: id });
      if (
        !updatedMovie ||
        updatedMovie.voteTotalPoints === undefined ||
        updatedMovie.voteCount === undefined
      ) {
        return res
          .status(404)
          .json({
            msg: "Updated movie not found or voteTotalPoints/voteCount is undefined",
          });
      }
      updatedMovie.voteAverage =
        updatedMovie.voteTotalPoints / updatedMovie.voteCount;
      await updatedMovie.save();

      await newReview.save();

      return res.status(200).json({ msg: "Review created", review: newReview });
    } catch (error) {
      return res.status(500).json({
        message: "server error",
        errors: [
          {
            type: "server",
            value: error,
            msg: "there was an error when finding the serie",
            path: "MovieManager",
            location: "reviewMovie",
          },
        ],
      });
    }
  }

  async uploadGenres(res: Response) {
    try {
      await Genres.insertMany(genres_list);
      return res.json({ msg: "Genres", genres: genres_list });
    } catch (error) {
      return res.json({ msg: "Error uploading genres" });
    }
  }

  async deleteGenres(res: Response) {
    try {
      await Genres.deleteMany({});
      return res.status(200).json({
        message: "Genres deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error",
        errors: [
          {
            type: "server",
            value: error,
            msg: "there was an error when deleting the genres",
            path: "",
            location: "",
          },
        ],
      });
    }
  }
}

export { MediaManager };
