"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaManager = void 0;
const main_1 = require("../models/main");
const axios_1 = require("../config/axios");
const endpoints_1 = require("../helpers/endpoints");
const mongoose_1 = __importDefault(require("mongoose"));
class MediaManager {
    constructor() { }
    searchMedia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            try {
                const media = yield main_1.Media.find({ title: new RegExp(name, "i") });
                if (!media || media.length === 0) {
                    const Medias = [];
                    const allMedia = yield axios_1.AII.get(endpoints_1.endpoints.searchGeneralMedia, {
                        params: {
                            api_key: process.env.API_MOVIE_TOKEN,
                            query: name,
                        },
                    }).then((res) => __awaiter(this, void 0, void 0, function* () {
                        const medias = res.data.results.filter((media) => {
                            const mediaTitle = media.title ? media.title.toLowerCase() : "";
                            const mediaName = media.name ? media.name.toLowerCase() : "";
                            const type = media.media_type;
                            if (type === "movie" || type === "tv") {
                                return (mediaTitle.includes(name.toLowerCase()) ||
                                    mediaName.includes(name.toLowerCase()));
                            }
                            return false;
                        });
                        for (const media of medias) {
                            const media_genres = yield main_1.Genres.find({
                                id: { $in: media.genre_ids },
                            });
                            const existingMedia = yield main_1.Media.findOne({ id: media.id });
                            if (!existingMedia) {
                                try {
                                    const newMedia = {
                                        title: media.title || media.name.toLowerCase(),
                                        overview: media.overview,
                                        poster: media.poster_path,
                                        type: media.media_type,
                                        idApi: media.id,
                                        genres: media_genres.map((genre) => genre.name),
                                    };
                                    yield main_1.Media.create(newMedia);
                                    Medias.push(newMedia);
                                }
                                catch (error) {
                                    console.log(error);
                                    return error;
                                }
                            }
                        }
                        return Medias;
                    }));
                    return res
                        .status(200)
                        .json({ msg: "movies retrieved from the api", media: allMedia });
                }
                return res
                    .status(200)
                    .json({ msg: "media retrieved from the db", media });
            }
            catch (error) {
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
        });
    }
    getMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const movie = yield main_1.Movie.findOne({ idApi: id });
                if (!movie) {
                    const movieDetails = yield axios_1.AII.get(endpoints_1.endpoints.getMovieDetails + id).then((movieDetailed) => __awaiter(this, void 0, void 0, function* () {
                        const movie_trailers = yield axios_1.AII.get(endpoints_1.endpoints.getMovieDetails + id + endpoints_1.endpoints.getMovieVideo).then((trailer) => {
                            const trailers = trailer.data.results.map((trailer) => endpoints_1.endpoints.showVideo + trailer.key);
                            return trailers;
                        });
                        const movie_genres = yield main_1.Genres.find({
                            id: {
                                $in: movieDetailed.data.genres.map((genre) => genre.id),
                            },
                        });
                        const movie = {
                            idApi: movieDetailed.data.id,
                            title: movieDetailed.data.title,
                            overview: movieDetailed.data.overview,
                            tagline: movieDetailed.data.tagline,
                            genres: movie_genres.map((genre) => genre.name),
                            posters: [
                                endpoints_1.endpoints.showImages + movieDetailed.data.poster_path,
                                endpoints_1.endpoints.showImages + movieDetailed.data.backdrop_path,
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
                            yield main_1.Movie.create(movie);
                            return movie;
                        }
                        catch (error) {
                            console.log(error);
                        }
                        return movie;
                    }));
                    return res
                        .status(200)
                        .json({ msg: "Movie form api", movie: movieDetails });
                }
                const movieReviews = yield main_1.Review.find({ mediaId: movie._id }).populate("owner");
                const criticReviews = movieReviews.filter((review) => review.type === "critic");
                const publicReviews = movieReviews.filter((review) => review.type === "public");
                if (!movieReviews) {
                    return res.status(200).json({ msg: "Movie from db", movie });
                }
                return res
                    .status(200)
                    .json({
                    msg: "Movie from db with reviews",
                    movie,
                    publicReviews,
                    criticReviews,
                });
            }
            catch (error) {
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
        });
    }
    getSerie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const serie = yield main_1.Serie.findOne({ idApi: id });
                if (!serie) {
                    const serieDetails = yield axios_1.AII.get(endpoints_1.endpoints.getSerieDetails + id).then((serieDetailed) => __awaiter(this, void 0, void 0, function* () {
                        const serie_trailers = yield axios_1.AII.get(endpoints_1.endpoints.getSerieDetails + id + endpoints_1.endpoints.getSerieVideo).then((trailers) => {
                            const serieTrailers = trailers.data.results.map((trailer) => endpoints_1.endpoints.showVideo + trailer.key);
                            return serieTrailers;
                        });
                        const serie_genres = yield main_1.Genres.find({
                            id: {
                                $in: serieDetailed.data.genres.map((genre) => genre.id),
                            },
                        });
                        const serie = {
                            idApi: serieDetailed.data.id,
                            name: serieDetailed.data.name,
                            overview: serieDetailed.data.overview,
                            tagline: serieDetailed.data.tagline,
                            posters: [
                                endpoints_1.endpoints.showImages + serieDetailed.data.poster_path,
                                endpoints_1.endpoints.showImages + serieDetailed.data.backdrop_path,
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
                            yield main_1.Serie.create(serie);
                            return serie;
                        }
                        catch (error) {
                            console.log(error);
                            return error;
                        }
                    }));
                    return res
                        .status(200)
                        .json({ msg: "Serie from api", serie: serieDetails });
                }
                const serieReviews = yield main_1.Review.find({ mediaId: serie._id }).populate("owner");
                if (!serieReviews) {
                    return res.status(200).json({ msg: "Serie from db", serie });
                }
                return res
                    .status(200)
                    .json({ msg: "Serie from db with reviews", serie, serieReviews });
            }
            catch (error) {
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
        });
    }
    reviewMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { review, rating } = req.body;
            const serie = yield main_1.Movie.findOne({ idApi: id });
            if (!serie) {
                return res.status(404).json({ msg: "Movie not found" });
            }
            const owner = yield main_1.Usuario.findById(req.user_id);
            if (!owner) {
                return res.status(404).json({ msg: "User not found" });
            }
            const reviewExists = yield main_1.Review.findOne({
                mediaId: serie._id,
                owner: req.user_id,
            });
            if (reviewExists) {
                return res.status(400).json({ msg: "you already reviewed this movie" });
            }
            if (owner.isCritic) {
                console.log("is critic");
                try {
                    const newReview = yield main_1.Review.create({
                        review,
                        rating,
                        mediaId: serie._id,
                        owner: req.user_id,
                        type: "critic",
                    });
                    yield main_1.Movie.updateOne({ idApi: id }, {
                        $inc: { criticVoteCount: 1, criticVoteTotalPoints: rating },
                    });
                    const updatedMovie = yield main_1.Movie.findOne({ idApi: id });
                    if (!updatedMovie ||
                        updatedMovie.publicVoteTotalPoints === undefined ||
                        updatedMovie.publicVoteCount === undefined ||
                        updatedMovie.criticVoteTotalPoints === undefined ||
                        updatedMovie.criticVoteCount === undefined) {
                        return res.status(404).json({
                            msg: "Updated movie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                    updatedMovie.criticVoteAverage =
                        updatedMovie.criticVoteTotalPoints / updatedMovie.criticVoteCount;
                    yield updatedMovie.save();
                    yield newReview.save();
                    return res
                        .status(200)
                        .json({ msg: "Review created", review: newReview });
                }
                catch (error) {
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
                    const newReview = yield main_1.Review.create({
                        review,
                        rating,
                        mediaId: serie._id,
                        owner: req.user_id,
                        type: "public",
                    });
                    yield main_1.Movie.updateOne({ idApi: id }, {
                        $inc: { publicVoteCount: 1, publicVoteTotalPoints: rating },
                    });
                    const updatedMovie = yield main_1.Movie.findOne({ idApi: id });
                    if (!updatedMovie ||
                        updatedMovie.publicVoteTotalPoints === undefined ||
                        updatedMovie.publicVoteCount === undefined ||
                        updatedMovie.criticVoteTotalPoints === undefined ||
                        updatedMovie.criticVoteCount === undefined) {
                        return res.status(404).json({
                            msg: "Updated movie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                    updatedMovie.publicVoteAverage =
                        updatedMovie.publicVoteTotalPoints / updatedMovie.publicVoteCount;
                    yield updatedMovie.save();
                    yield newReview.save();
                    return res
                        .status(200)
                        .json({ msg: "Review created", review: newReview });
                }
                catch (error) {
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
        });
    }
    editReviewMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { review, rating } = req.body;
            const movie = yield main_1.Movie.findOne({ idApi: id });
            if (!movie) {
                return res.status(404).json({ msg: "Serie not found" });
            }
            const owner = yield main_1.Usuario.findById(req.user_id);
            if (!owner) {
                return res.status(404).json({ msg: "User not found" });
            }
            const reviewExists = yield main_1.Review.findOne({
                mediaId: movie._id,
                owner: req.user_id,
            });
            if (!reviewExists) {
                return res.status(400).json({ msg: "you haven't reviewed this movie" });
            }
            if (owner.isCritic) {
                console.log("is critic");
                try {
                    const updatedReview = yield main_1.Review.updateOne({ mediaId: movie._id, owner: req.user_id }, { review, rating, edited: true });
                    const updatedMovie = yield main_1.Movie.findOne({ idApi: id });
                    if (updatedMovie &&
                        updatedMovie.criticVoteTotalPoints !== undefined &&
                        updatedMovie.criticVoteCount !== undefined) {
                        console.log(updatedMovie.criticVoteTotalPoints);
                        console.log(typeof reviewExists.rating);
                        console.log(typeof rating);
                        updatedMovie.criticVoteTotalPoints =
                            updatedMovie.criticVoteTotalPoints - reviewExists.rating + rating;
                        updatedMovie.criticVoteAverage =
                            updatedMovie.criticVoteTotalPoints / updatedMovie.criticVoteCount;
                        yield updatedMovie.save();
                        return res.status(200).json({
                            msg: "Review updated",
                            review: updatedReview,
                        });
                    }
                    else {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                }
                catch (error) {
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
                    const updatedReview = yield main_1.Review.updateOne({ mediaId: movie._id, owner: req.user_id }, { review, rating, edited: true });
                    const updatedMovie = yield main_1.Movie.findOne({ idApi: id });
                    if (updatedMovie &&
                        updatedMovie.publicVoteTotalPoints !== undefined &&
                        updatedMovie.publicVoteCount !== undefined) {
                        updatedMovie.publicVoteTotalPoints =
                            updatedMovie.publicVoteTotalPoints - reviewExists.rating + rating;
                        updatedMovie.publicVoteAverage =
                            updatedMovie.publicVoteTotalPoints / updatedMovie.publicVoteCount ||
                                0;
                        yield updatedMovie.save();
                        return res
                            .status(200)
                            .json({ msg: "Review updated", review: updatedReview });
                    }
                    else {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                }
                catch (error) {
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
        });
    }
    deleteReviewMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const movie = yield main_1.Movie.findOne({ idApi: id });
            if (!movie) {
                return res.status(404).json({ msg: "Movie not found" });
            }
            const owner = yield main_1.Usuario.findById(req.user_id);
            if (!owner) {
                return res.status(404).json({ msg: "User not found" });
            }
            const reviewExists = yield main_1.Review.findOne({
                mediaId: movie._id,
                owner: req.user_id,
            });
            if (!reviewExists) {
                return res.status(400).json({ msg: "you haven't reviewed this movie" });
            }
            try {
                const existingReview = yield main_1.Review.findOne({
                    mediaId: movie._id,
                    owner: req.user_id,
                });
                if (existingReview.type === "critic") {
                    const updatedMovie = yield main_1.Movie.findOneAndUpdate({ idApi: id }, {
                        $inc: { criticVoteTotalPoints: -existingReview.rating },
                    }, { new: true });
                    if (!updatedMovie ||
                        updatedMovie.criticVoteTotalPoints === undefined ||
                        updatedMovie.criticVoteCount === undefined) {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                    updatedMovie.criticVoteCount -= 1;
                    if (updatedMovie.criticVoteCount !== 0) {
                        updatedMovie.criticVoteAverage =
                            updatedMovie.criticVoteTotalPoints / updatedMovie.criticVoteCount;
                    }
                    else {
                        updatedMovie.criticVoteAverage = 0;
                    }
                    yield existingReview.deleteOne();
                    yield updatedMovie.save();
                    return res.status(200).json({ msg: "Review deleted" });
                }
                if (existingReview.type === "public") {
                    const updatedMovie = yield main_1.Movie.findOneAndUpdate({ idApi: id }, {
                        $inc: { publicVoteTotalPoints: -existingReview.rating },
                    }, { new: true });
                    if (!updatedMovie ||
                        updatedMovie.publicVoteTotalPoints === undefined ||
                        updatedMovie.publicVoteCount === undefined) {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                    updatedMovie.publicVoteCount -= 1;
                    if (updatedMovie.publicVoteCount !== 0) {
                        updatedMovie.publicVoteAverage =
                            updatedMovie.publicVoteTotalPoints / updatedMovie.criticVoteCount;
                    }
                    else {
                        updatedMovie.publicVoteAverage = 0;
                    }
                    yield existingReview.deleteOne();
                    yield updatedMovie.save();
                    return res.status(200).json({ msg: "Review deleted" });
                }
            }
            catch (error) {
                return res.status(500).json({ msg: "Server error", error });
            }
        });
    }
    reviewSerie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { review, rating } = req.body;
            const serie = yield main_1.Serie.findOne({ idApi: id });
            if (!serie) {
                return res.status(404).json({ msg: "Serie not found" });
            }
            const owner = yield main_1.Usuario.findById(req.user_id);
            if (!owner) {
                return res.status(404).json({ msg: "User not found" });
            }
            const reviewExists = yield main_1.Review.findOne({
                mediaId: serie._id,
                owner: req.user_id,
            });
            if (reviewExists) {
                return res.status(400).json({ msg: "you already reviewed this serie" });
            }
            if (owner.isCritic) {
                console.log("is critic");
                try {
                    const newReview = yield main_1.Review.create({
                        review,
                        rating,
                        mediaId: serie._id,
                        owner: req.user_id,
                        type: "critic",
                    });
                    yield main_1.Serie.updateOne({ idApi: id }, {
                        $inc: { criticVoteCount: 1, criticVoteTotalPoints: rating },
                    });
                    const updatedSerie = yield main_1.Serie.findOne({ idApi: id });
                    if (!updatedSerie ||
                        updatedSerie.publicVoteTotalPoints === undefined ||
                        updatedSerie.publicVoteCount === undefined ||
                        updatedSerie.criticVoteTotalPoints === undefined ||
                        updatedSerie.criticVoteCount === undefined) {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                    updatedSerie.criticVoteAverage =
                        updatedSerie.criticVoteTotalPoints / updatedSerie.criticVoteCount;
                    yield updatedSerie.save();
                    yield newReview.save();
                    return res
                        .status(200)
                        .json({ msg: "Review created", review: newReview });
                }
                catch (error) {
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
                    const newReview = yield main_1.Review.create({
                        review,
                        rating,
                        mediaId: serie._id,
                        owner: req.user_id,
                        type: "public",
                    });
                    yield main_1.Serie.updateOne({ idApi: id }, {
                        $inc: { publicVoteCount: 1, publicVoteTotalPoints: rating },
                    });
                    const updatedSerie = yield main_1.Serie.findOne({ idApi: id });
                    if (!updatedSerie ||
                        updatedSerie.publicVoteTotalPoints === undefined ||
                        updatedSerie.publicVoteCount === undefined ||
                        updatedSerie.criticVoteTotalPoints === undefined ||
                        updatedSerie.criticVoteCount === undefined) {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                    updatedSerie.publicVoteAverage =
                        updatedSerie.publicVoteTotalPoints / updatedSerie.publicVoteCount;
                    yield updatedSerie.save();
                    yield newReview.save();
                    return res
                        .status(200)
                        .json({ msg: "Review created", review: newReview });
                }
                catch (error) {
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
        });
    }
    editReviewSerie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { review, rating } = req.body;
            const serie = yield main_1.Serie.findOne({ idApi: id });
            if (!serie) {
                return res.status(404).json({ msg: "Serie not found" });
            }
            const owner = yield main_1.Usuario.findById(req.user_id);
            if (!owner) {
                return res.status(404).json({ msg: "User not found" });
            }
            const reviewExists = yield main_1.Review.findOne({
                mediaId: serie._id,
                owner: req.user_id,
            });
            if (!reviewExists) {
                return res.status(400).json({ msg: "you haven't reviewed this serie" });
            }
            if (owner.isCritic) {
                console.log("is critic");
                try {
                    const updatedReview = yield main_1.Review.updateOne({ mediaId: serie._id, owner: req.user_id }, { review, rating, edited: true });
                    const updatedSerie = yield main_1.Serie.findOne({ idApi: id });
                    if (updatedSerie &&
                        updatedSerie.criticVoteTotalPoints !== undefined &&
                        updatedSerie.criticVoteCount !== undefined) {
                        updatedSerie.criticVoteTotalPoints =
                            updatedSerie.criticVoteTotalPoints - reviewExists.rating + rating;
                        updatedSerie.criticVoteAverage =
                            updatedSerie.criticVoteTotalPoints / updatedSerie.criticVoteCount;
                        yield updatedSerie.save();
                        return res.status(200).json({
                            msg: "Review updated",
                            review: updatedReview,
                            serie: updatedSerie,
                        });
                    }
                    else {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                }
                catch (error) {
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
                    const updatedReview = yield main_1.Review.updateOne({ mediaId: serie._id, owner: req.user_id }, { review, rating, edited: true });
                    const updatedSerie = yield main_1.Serie.findOne({ idApi: id });
                    if (updatedSerie &&
                        updatedSerie.publicVoteTotalPoints !== undefined &&
                        updatedSerie.publicVoteCount !== undefined) {
                        updatedSerie.publicVoteTotalPoints =
                            updatedSerie.publicVoteTotalPoints - reviewExists.rating + rating;
                        updatedSerie.publicVoteAverage =
                            updatedSerie.publicVoteTotalPoints / updatedSerie.publicVoteCount;
                        yield updatedSerie.save();
                        return res
                            .status(200)
                            .json({ msg: "Review updated", review: updatedReview });
                    }
                    else {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                }
                catch (error) {
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
        });
    }
    deleteReviewSerie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const serie = yield main_1.Serie.findOne({ idApi: id });
            if (!serie) {
                return res.status(404).json({ msg: "Serie not found" });
            }
            const owner = yield main_1.Usuario.findById(req.user_id);
            if (!owner) {
                return res.status(404).json({ msg: "User not found" });
            }
            const reviewExists = yield main_1.Review.findOne({
                mediaId: serie._id,
                owner: req.user_id,
            });
            if (!reviewExists) {
                return res.status(400).json({ msg: "you haven't reviewed this serie" });
            }
            try {
                const existingReview = yield main_1.Review.findOne({
                    mediaId: serie._id,
                    owner: req.user_id,
                });
                if (existingReview.type === "critic") {
                    const updatedSerie = yield main_1.Serie.findOneAndUpdate({ idApi: id }, {
                        $inc: { criticVoteTotalPoints: -existingReview.rating },
                    }, { new: true });
                    if (!updatedSerie ||
                        updatedSerie.criticVoteTotalPoints === undefined ||
                        updatedSerie.criticVoteCount === undefined) {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                    updatedSerie.criticVoteCount -= 1;
                    if (updatedSerie.publicVoteCount !== 0) {
                        updatedSerie.publicVoteAverage =
                            updatedSerie.publicVoteTotalPoints / updatedSerie.publicVoteCount;
                    }
                    else {
                        updatedSerie.publicVoteAverage = 0;
                    }
                    yield existingReview.deleteOne();
                    yield updatedSerie.save();
                    return res.status(200).json({ msg: "Review deleted" });
                }
                if (existingReview.type === "public") {
                    const updatedSerie = yield main_1.Serie.findOneAndUpdate({ idApi: id }, {
                        $inc: { publicVoteTotalPoints: -existingReview.rating },
                    }, { new: true });
                    if (!updatedSerie ||
                        updatedSerie.publicVoteTotalPoints === undefined ||
                        updatedSerie.publicVoteCount === undefined) {
                        return res.status(404).json({
                            msg: "Updated serie not found or voteTotalPoints/voteCount is undefined",
                        });
                    }
                    updatedSerie.publicVoteCount -= 1;
                    if (updatedSerie.publicVoteCount !== 0) {
                        updatedSerie.publicVoteAverage =
                            updatedSerie.publicVoteTotalPoints / updatedSerie.criticVoteCount;
                    }
                    else {
                        updatedSerie.publicVoteAverage = 0;
                    }
                    yield existingReview.deleteOne();
                    yield updatedSerie.save();
                    return res.status(200).json({ msg: "Review deleted" });
                }
            }
            catch (error) {
                return res.status(500).json({ msg: "Server error", error });
            }
        });
    }
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { comment } = req.body;
            try {
                const reviews = yield main_1.Review.find({ mediaId: id }).populate("owner");
                if (!reviews) {
                    return res.status(404).json({ msg: "Reviews not found" });
                }
                return res.status(200).json({ msg: "Reviews found", reviews });
            }
            catch (error) { }
        });
    }
    addCommentToReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid Review ID",
                    status: 400,
                });
            }
            const { comment } = req.body;
            const review = yield main_1.Review.findById(id);
            if (!review) {
                return res.status(404).json({ msg: "Review not found" });
            }
            const owner = yield main_1.Usuario.findById(req.user_id);
            if (!owner) {
                return res.status(404).json({ msg: "User not found" });
            }
            try {
                const Comment = yield main_1.Review.create({
                    rating: 0,
                    review: comment,
                    mediaId: review.mediaId,
                    owner: req.user_id,
                    type: owner.isCritic ? "critic" : "public",
                    isComment: true,
                });
                return res.status(200).json({ msg: "Comment added", Comment });
            }
            catch (error) {
                return res.status(500).json({ msg: "Server error", error });
            }
        });
    }
    uploadGenres(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield main_1.Genres.insertMany(main_1.genres_list);
                return res.json({ msg: "Genres", genres: main_1.genres_list });
            }
            catch (error) {
                return res.json({ msg: "Error uploading genres" });
            }
        });
    }
    deleteGenres(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield main_1.Genres.deleteMany({});
                return res.status(200).json({
                    message: "Genres deleted",
                });
            }
            catch (error) {
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
        });
    }
}
exports.MediaManager = MediaManager;
