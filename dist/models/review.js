"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    owner: {
        type: String,
        required: true,
    },
    mediaId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: false,
    },
    edited: {
        type: Boolean,
        required: false,
        default: false,
    },
    type: {
        type: String,
        required: true,
    },
    isComment: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const Review = mongoose_1.default.model("Review", ReviewSchema);
exports.default = Review;
