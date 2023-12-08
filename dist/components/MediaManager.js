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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaManager = void 0;
const main_1 = require("../models/main");
const axios_1 = require("../config/axios");
const endpoints_1 = require("../helpers/endpoints");
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
                            voteAverage: 0,
                            voteCount: 0,
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
                return res.status(200).json({ msg: "Movie from db", movie });
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
                return res.status(200).json({ msg: "Serie from db", serie });
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
            try {
                const newReview = yield main_1.Review.create({
                    review,
                    rating,
                    mediaId: serie._id,
                    owner: req.user_id,
                });
                yield main_1.Movie.updateOne({ idApi: id }, {
                    $inc: { voteCount: 1, voteTotalPoints: rating },
                });
                const updatedMovie = yield main_1.Movie.findOne({ idApi: id });
                if (!updatedMovie ||
                    updatedMovie.voteTotalPoints === undefined ||
                    updatedMovie.voteCount === undefined) {
                    return res
                        .status(404)
                        .json({
                        msg: "Updated movie not found or voteTotalPoints/voteCount is undefined",
                    });
                }
                updatedMovie.voteAverage =
                    updatedMovie.voteTotalPoints / updatedMovie.voteCount;
                yield updatedMovie.save();
                yield newReview.save();
                return res.status(200).json({ msg: "Review created", review: newReview });
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
                            location: "reviewMovie",
                        },
                    ],
                });
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
