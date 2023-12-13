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
import mongoose from "mongoose";

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
              publicVoteAverage: 0,
              publicVoteCount: 0,
              publicVoteTotalPoints: 0,
              criticVoteAverage: 0,
              criticVoteCount: 0,
              criticVoteTotalPoints: 0,
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
      const movieReviews = await Review.find({ mediaId: movie._id }).populate(
        "owner"
      );

      if (!movieReviews) {
        return res.status(200).json({ msg: "Movie from db", movie });
      }
      return res
        .status(200)
        .json({ msg: "Movie from db with reviews", movie, movieReviews });
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
      const serieReviews = await Review.find({ mediaId: serie._id }).populate(
        "owner"
      );
      if (!serieReviews) {
        return res.status(200).json({ msg: "Serie from db", serie });
      }

      return res
        .status(200)
        .json({ msg: "Serie from db with reviews", serie, serieReviews });
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
    const owner = await Usuario.findById(req.user_id);
    if (!owner) {
      return res.status(404).json({ msg: "User not found" });
    }
    const reviewExists = await Review.findOne({
      mediaId: serie._id,
      owner: req.user_id,
    });
    if (reviewExists) {
      return res.status(400).json({ msg: "you already reviewed this movie" });
    }
    if (owner.isCritic) {
      console.log("is critic");
      try {
        const newReview = await Review.create({
          review,
          rating,
          mediaId: serie._id,
          owner: req.user_id,
          type: "critic",
        });
        await Movie.updateOne(
          { idApi: id },
          {
            $inc: { criticVoteCount: 1, criticVoteTotalPoints: rating },
          }
        );
        const updatedMovie = await Movie.findOne({ idApi: id });
        if (
          !updatedMovie ||
          updatedMovie.publicVoteTotalPoints === undefined ||
          updatedMovie.publicVoteCount === undefined ||
          updatedMovie.criticVoteTotalPoints === undefined ||
          updatedMovie.criticVoteCount === undefined
        ) {
          return res.status(404).json({
            msg: "Updated movie not found or voteTotalPoints/voteCount is undefined",
          });
        }
        updatedMovie.criticVoteAverage =
          updatedMovie.criticVoteTotalPoints / updatedMovie.criticVoteCount;
        await updatedMovie.save();
        await newReview.save();
        return res
          .status(200)
          .json({ msg: "Review created", review: newReview });
      } catch (error) {
        return res.status(500).json({
          message: "server error",
          errors: [
            {
              type: "server",
              value: error,
              msg: "there was an error when finding the movie",
              path: "MovieManager",
              location: "reviewMovie",
            },
          ],
        });
      }
    }
    if (!owner.isCritic) {
      console.log("is not critic");
      try {
        const newReview = await Review.create({
          review,
          rating,
          mediaId: serie._id,
          owner: req.user_id,
          type: "public",
        });

        await Movie.updateOne(
          { idApi: id },
          {
            $inc: { publicVoteCount: 1, publicVoteTotalPoints: rating },
          }
        );

        const updatedMovie = await Movie.findOne({ idApi: id });
        if (
          !updatedMovie ||
          updatedMovie.publicVoteTotalPoints === undefined ||
          updatedMovie.publicVoteCount === undefined ||
          updatedMovie.criticVoteTotalPoints === undefined ||
          updatedMovie.criticVoteCount === undefined
        ) {
          return res.status(404).json({
            msg: "Updated movie not found or voteTotalPoints/voteCount is undefined",
          });
        }
        updatedMovie.publicVoteAverage =
          updatedMovie.publicVoteTotalPoints / updatedMovie.publicVoteCount;
        await updatedMovie.save();

        await newReview.save();

        return res
          .status(200)
          .json({ msg: "Review created", review: newReview });
      } catch (error) {
        return res.status(500).json({
          message: "server error",
          errors: [
            {
              type: "server",
              value: error,
              msg: "there was an error when finding the movie",
              path: "MovieManager",
              location: "reviewMovie",
            },
          ],
        });
      }
    }
  }

  async editReviewMovie(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const { review, rating } = req.body;

    const movie = await Movie.findOne({ idApi: id });

    if (!movie) {
      return res.status(404).json({ msg: "Serie not found" });
    }

    const owner = await Usuario.findById(req.user_id);

    if (!owner) {
      return res.status(404).json({ msg: "User not found" });
    }

    const reviewExists = await Review.findOne({
      mediaId: movie._id,
      owner: req.user_id,
    });

    if (!reviewExists) {
      return res.status(400).json({ msg: "you haven't reviewed this movie" });
    }

    if (owner.isCritic) {
      console.log("is critic");
      try {
        const updatedReview = await Review.updateOne(
          { mediaId: movie._id, owner: req.user_id },
          { review, rating }
        );

        const updatedMovie = await Movie.findOne({ idApi: id });

        if (
          updatedMovie &&
          updatedMovie.criticVoteTotalPoints !== undefined &&
          updatedMovie.criticVoteCount !== undefined
        ) {
          console.log(updatedMovie.criticVoteTotalPoints);
          console.log(typeof reviewExists.rating);
          console.log(typeof rating);
          updatedMovie.criticVoteTotalPoints =
            updatedMovie.criticVoteTotalPoints - reviewExists.rating + rating;

          updatedMovie.criticVoteAverage =
            updatedMovie.criticVoteTotalPoints / updatedMovie.criticVoteCount;

          await updatedMovie.save();
          return res.status(200).json({
            msg: "Review updated",
            review: updatedReview,
          });
        } else {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }
      } catch (error) {
        return res.status(500).json({
          message: "server error",
          errors: [
            {
              type: "server",
              value: error,
              msg: "there was an error when finding the serie",
              path: "MovieManager",
              location: "editReviewSerie",
            },
          ],
        });
      }
    }
    if (!owner.isCritic) {
      console.log("is not critic");
      try {
        const updatedReview = await Review.updateOne(
          { mediaId: movie._id, owner: req.user_id },
          { review, rating }
        );

        const updatedMovie = await Movie.findOne({ idApi: id });

        if (
          updatedMovie &&
          updatedMovie.publicVoteTotalPoints !== undefined &&
          updatedMovie.publicVoteCount !== undefined
        ) {
          updatedMovie.publicVoteTotalPoints =
            updatedMovie.publicVoteTotalPoints - reviewExists.rating + rating;

          updatedMovie.publicVoteAverage =
            updatedMovie.publicVoteTotalPoints / updatedMovie.publicVoteCount ||
            0;

          await updatedMovie.save();

          return res
            .status(200)
            .json({ msg: "Review updated", review: updatedReview });
        } else {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }
      } catch (error) {
        return res.status(500).json({
          message: "server error",
          errors: [
            {
              type: "server",
              value: error,
              msg: "there was an error when finding the serie",
              path: "MovieManager",
              location: "editReviewSerie",
            },
          ],
        });
      }
    }
  }

  async deleteReviewMovie(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const movie = await Movie.findOne({ idApi: id });
    if (!movie) {
      return res.status(404).json({ msg: "Movie not found" });
    }
    const owner = await Usuario.findById(req.user_id);
    if (!owner) {
      return res.status(404).json({ msg: "User not found" });
    }
    const reviewExists = await Review.findOne({
      mediaId: movie._id,
      owner: req.user_id,
    });
    if (!reviewExists) {
      return res.status(400).json({ msg: "you haven't reviewed this movie" });
    }
    try {
      const existingReview = await Review.findOne({
        mediaId: movie._id,
        owner: req.user_id,
      });
      if (existingReview.type === "critic") {
        const updatedMovie = await Movie.findOneAndUpdate(
          { idApi: id },
          {
            $inc: { criticVoteTotalPoints: -existingReview.rating },
          },
          { new: true }
        );
        if (
          !updatedMovie ||
          updatedMovie.criticVoteTotalPoints === undefined ||
          updatedMovie.criticVoteCount === undefined
        ) {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }

        updatedMovie.criticVoteCount -= 1;

        if (updatedMovie.criticVoteCount !== 0) {
          updatedMovie.criticVoteAverage =
            updatedMovie.criticVoteTotalPoints / updatedMovie.criticVoteCount;
        } else {
          updatedMovie.criticVoteAverage = 0;
        }

        await existingReview.deleteOne();
        await updatedMovie.save();
        return res.status(200).json({ msg: "Review deleted" });
      }
      if (existingReview.type === "public") {
        const updatedMovie = await Movie.findOneAndUpdate(
          { idApi: id },
          {
            $inc: { publicVoteTotalPoints: -existingReview.rating },
          },
          { new: true }
        );
        if (
          !updatedMovie ||
          updatedMovie.publicVoteTotalPoints === undefined ||
          updatedMovie.publicVoteCount === undefined
        ) {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }
        updatedMovie.publicVoteCount -= 1;

        if (updatedMovie.publicVoteCount !== 0) {
          updatedMovie.publicVoteAverage =
            updatedMovie.publicVoteTotalPoints / updatedMovie.criticVoteCount;
        } else {
          updatedMovie.publicVoteAverage = 0;
        }

        await existingReview.deleteOne();
        await updatedMovie.save();
        return res.status(200).json({ msg: "Review deleted" });
      }
    } catch (error) {
      return res.status(500).json({ msg: "Server error", error });
    }
  }

  async reviewSerie(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const { review, rating } = req.body;
    const serie = await Serie.findOne({ idApi: id });
    if (!serie) {
      return res.status(404).json({ msg: "Serie not found" });
    }
    const owner = await Usuario.findById(req.user_id);
    if (!owner) {
      return res.status(404).json({ msg: "User not found" });
    }
    const reviewExists = await Review.findOne({
      mediaId: serie._id,
      owner: req.user_id,
    });
    if (reviewExists) {
      return res.status(400).json({ msg: "you already reviewed this serie" });
    }
    if (owner.isCritic) {
      console.log("is critic");
      try {
        const newReview = await Review.create({
          review,
          rating,
          mediaId: serie._id,
          owner: req.user_id,
          type: "critic",
        });
        await Serie.updateOne(
          { idApi: id },
          {
            $inc: { criticVoteCount: 1, criticVoteTotalPoints: rating },
          }
        );
        const updatedSerie = await Serie.findOne({ idApi: id });
        if (
          !updatedSerie ||
          updatedSerie.publicVoteTotalPoints === undefined ||
          updatedSerie.publicVoteCount === undefined ||
          updatedSerie.criticVoteTotalPoints === undefined ||
          updatedSerie.criticVoteCount === undefined
        ) {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }
        updatedSerie.criticVoteAverage =
          updatedSerie.criticVoteTotalPoints / updatedSerie.criticVoteCount;
        await updatedSerie.save();
        await newReview.save();
        return res
          .status(200)
          .json({ msg: "Review created", review: newReview });
      } catch (error) {
        return res.status(500).json({
          message: "server error",
          errors: [
            {
              type: "server",
              value: error,
              msg: "there was an error when finding the serie",
              path: "MovieManager",
              location: "reviewSerie",
            },
          ],
        });
      }
    }
    if (!owner.isCritic) {
      console.log("is not critic");
      try {
        const newReview = await Review.create({
          review,
          rating,
          mediaId: serie._id,
          owner: req.user_id,
          type: "public",
        });

        await Serie.updateOne(
          { idApi: id },
          {
            $inc: { publicVoteCount: 1, publicVoteTotalPoints: rating },
          }
        );

        const updatedSerie = await Serie.findOne({ idApi: id });
        if (
          !updatedSerie ||
          updatedSerie.publicVoteTotalPoints === undefined ||
          updatedSerie.publicVoteCount === undefined ||
          updatedSerie.criticVoteTotalPoints === undefined ||
          updatedSerie.criticVoteCount === undefined
        ) {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }
        updatedSerie.publicVoteAverage =
          updatedSerie.publicVoteTotalPoints / updatedSerie.publicVoteCount;
        await updatedSerie.save();

        await newReview.save();

        return res
          .status(200)
          .json({ msg: "Review created", review: newReview });
      } catch (error) {
        return res.status(500).json({
          message: "server error",
          errors: [
            {
              type: "server",
              value: error,
              msg: "there was an error when finding the serie",
              path: "MovieManager",
              location: "reviewSerie",
            },
          ],
        });
      }
    }
  }

  async editReviewSerie(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const { review, rating } = req.body;
    const serie = await Serie.findOne({ idApi: id });
    if (!serie) {
      return res.status(404).json({ msg: "Serie not found" });
    }
    const owner = await Usuario.findById(req.user_id);
    if (!owner) {
      return res.status(404).json({ msg: "User not found" });
    }
    const reviewExists = await Review.findOne({
      mediaId: serie._id,
      owner: req.user_id,
    });
    if (!reviewExists) {
      return res.status(400).json({ msg: "you haven't reviewed this serie" });
    }
    if (owner.isCritic) {
      console.log("is critic");
      try {
        const updatedReview = await Review.updateOne(
          { mediaId: serie._id, owner: req.user_id },
          { review, rating }
        );
        const updatedSerie = await Serie.findOne({ idApi: id });
        if (
          updatedSerie &&
          updatedSerie.criticVoteTotalPoints !== undefined &&
          updatedSerie.criticVoteCount !== undefined
        ) {
          updatedSerie.criticVoteTotalPoints =
            updatedSerie.criticVoteTotalPoints - reviewExists.rating + rating;
          updatedSerie.criticVoteAverage =
            updatedSerie.criticVoteTotalPoints / updatedSerie.criticVoteCount;
          await updatedSerie.save();
          return res.status(200).json({
            msg: "Review updated",
            review: updatedReview,
            serie: updatedSerie,
          });
        } else {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }
      } catch (error) {
        return res.status(500).json({
          message: "server error",
          errors: [
            {
              type: "server",
              value: error,
              msg: "there was an error when finding the serie",
              path: "MovieManager",
              location: "editReviewSerie",
            },
          ],
        });
      }
    }
    if (!owner.isCritic) {
      console.log("is not critic");
      try {
        const updatedReview = await Review.updateOne(
          { mediaId: serie._id, owner: req.user_id },
          { review, rating }
        );

        const updatedSerie = await Serie.findOne({ idApi: id });
        if (
          updatedSerie &&
          updatedSerie.publicVoteTotalPoints !== undefined &&
          updatedSerie.publicVoteCount !== undefined
        ) {
          updatedSerie.publicVoteTotalPoints =
            updatedSerie.publicVoteTotalPoints - reviewExists.rating + rating;

          updatedSerie.publicVoteAverage =
            updatedSerie.publicVoteTotalPoints / updatedSerie.publicVoteCount;
          await updatedSerie.save();

          return res
            .status(200)
            .json({ msg: "Review updated", review: updatedReview });
        } else {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }
      } catch (error) {
        return res.status(500).json({
          message: "server error",
          errors: [
            {
              type: "server",
              value: error,
              msg: "there was an error when finding the serie",
              path: "MovieManager",
              location: "editReviewSerie",
            },
          ],
        });
      }
    }
  }

  async deleteReviewSerie(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const serie = await Serie.findOne({ idApi: id });
    if (!serie) {
      return res.status(404).json({ msg: "Serie not found" });
    }
    const owner = await Usuario.findById(req.user_id);
    if (!owner) {
      return res.status(404).json({ msg: "User not found" });
    }
    const reviewExists = await Review.findOne({
      mediaId: serie._id,
      owner: req.user_id,
    });
    if (!reviewExists) {
      return res.status(400).json({ msg: "you haven't reviewed this serie" });
    }
    try {
      const existingReview = await Review.findOne({
        mediaId: serie._id,
        owner: req.user_id,
      });
      if (existingReview.type === "critic") {
        const updatedSerie = await Serie.findOneAndUpdate(
          { idApi: id },
          {
            $inc: { criticVoteTotalPoints: -existingReview.rating },
          },
          { new: true }
        );
        if (
          !updatedSerie ||
          updatedSerie.criticVoteTotalPoints === undefined ||
          updatedSerie.criticVoteCount === undefined
        ) {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }

        updatedSerie.criticVoteCount -= 1;

        if (updatedSerie.publicVoteCount !== 0) {
          updatedSerie.publicVoteAverage =
            updatedSerie.publicVoteTotalPoints / updatedSerie.publicVoteCount;
        } else {
          updatedSerie.publicVoteAverage = 0;
        }

        await existingReview.deleteOne();
        await updatedSerie.save();
        return res.status(200).json({ msg: "Review deleted" });
      }
      if (existingReview.type === "public") {
        const updatedSerie = await Serie.findOneAndUpdate(
          { idApi: id },
          {
            $inc: { publicVoteTotalPoints: -existingReview.rating },
          },
          { new: true }
        );
        if (
          !updatedSerie ||
          updatedSerie.publicVoteTotalPoints === undefined ||
          updatedSerie.publicVoteCount === undefined
        ) {
          return res.status(404).json({
            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
          });
        }
        updatedSerie.publicVoteCount -= 1;

        if (updatedSerie.publicVoteCount !== 0) {
          updatedSerie.publicVoteAverage =
            updatedSerie.publicVoteTotalPoints / updatedSerie.criticVoteCount;
        } else {
          updatedSerie.publicVoteAverage = 0;
        }

        await existingReview.deleteOne();
        await updatedSerie.save();
        return res.status(200).json({ msg: "Review deleted" });
      }
    } catch (error) {
      return res.status(500).json({ msg: "Server error", error });
    }
  }

  async getReviews(req: CustomRequest, res: Response) {
    const { id } = req.params;
    const {comment} = req.body

    try {
      const reviews = await Review.find({ mediaId: id }).populate("owner");
      if (!reviews) {
        return res.status(404).json({ msg: "Reviews not found" });
      }
      return res.status(200).json({ msg: "Reviews found", reviews });
    } catch (error) {}
  }

  async addCommentToReview(req: CustomRequest, res: Response) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Review ID",
        status: 400,
      });
    }
    const { comment } = req.body;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }
    const owner = await Usuario.findById(req.user_id);
    if (!owner) {
      return res.status(404).json({ msg: "User not found" });
    }
    try {
      const Comment = await Review.create({
        rating: 0,
        review: comment,
        mediaId: review.mediaId,
        owner: req.user_id,
        type: owner.isCritic ? "critic" : "public",
        isComment: true,
      });
      return res.status(200).json({ msg: "Comment added", Comment });
    } catch (error) {
      return res.status(500).json({ msg: "Server error", error });
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
