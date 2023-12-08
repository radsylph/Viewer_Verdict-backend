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
                    const endpoint = endpoints_1.endpoints.getMovieDetails + id;
                    console.log(endpoint);
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
