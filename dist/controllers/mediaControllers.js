"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovie = exports.deleteGenres = exports.uploadGenres = exports.searchMedia = void 0;
const MediaManager_1 = require("../components/MediaManager");
const mediaManager = new MediaManager_1.MediaManager();
const searchMedia = (req, res) => {
    mediaManager.searchMedia(req, res);
};
exports.searchMedia = searchMedia;
const uploadGenres = (req, res) => {
    mediaManager.uploadGenres(res);
};
exports.uploadGenres = uploadGenres;
const deleteGenres = (req, res) => {
    mediaManager.deleteGenres(res);
};
exports.deleteGenres = deleteGenres;
const getMovie = (req, res) => {
    mediaManager.getMovie(req, res);
};
exports.getMovie = getMovie;
