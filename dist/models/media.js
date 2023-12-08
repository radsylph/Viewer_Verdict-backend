"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mediaSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    overview: {
        type: String,
        required: false,
    },
    poster: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    idApi: {
        type: Number,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
});
const Media = mongoose_1.default.model("Media", mediaSchema);
exports.default = Media;
