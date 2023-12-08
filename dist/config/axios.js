"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = exports.AII = void 0;
const axios_1 = __importDefault(require("axios"));
const AII = axios_1.default.create({
    baseURL: "https://api.themoviedb.org/3/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${process.env.API_MOVIE_TOKEN}`,
    },
});
exports.AII = AII;
const API = axios_1.default.create({
    baseURL: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
});
exports.API = API;
