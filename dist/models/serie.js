"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SerieSchema = new mongoose_1.default.Schema({
    name: {
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
    posters: {
        type: [String],
        required: true,
    },
    firstAir: {
        type: String,
        required: true,
    },
    lastAir: {
        type: String,
        required: true,
    },
    totalEpisodes: {
        type: Number,
        required: true,
    },
    totalSeasons: {
        type: Number,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    voteAverage: {
        type: Number,
        required: true,
        default: 0,
    },
    voteCount: {
        type: Number,
        required: true,
        default: 0,
    },
});
const Serie = mongoose_1.default.model("Serie", SerieSchema);
exports.default = Serie;
