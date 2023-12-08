"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moviewSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    tagline: {
        type: String,
        required: false,
    },
    genres: {
        type: [String],
        required: true,
    },
    posters: {
        type: [String],
        required: true,
    },
    releaseDate: {
        type: String,
        required: true,
    },
    trailers: {
        type: [String] || String,
        required: true,
    },
    runtime: {
        type: Number,
        required: true,
    },
    voteAverage: {
        type: Number,
        required: false,
        default: 0,
    },
    voteCount: {
        type: Number,
        required: false,
        default: 0,
    },
    voteTotalPoints: {
        type: Number,
        required: false,
        default: 0,
    },
    adult: {
        type: Boolean,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    idApi: {
        type: Number,
        required: false,
    },
});
const Movie = mongoose_1.default.model("Movie", moviewSchema);
exports.default = Movie;
