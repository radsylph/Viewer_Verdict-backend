"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCommentReview = exports.CommentReview = exports.deleteReviewSerie = exports.editReviewSerie = exports.reviewSerie = exports.deleteReviewMovie = exports.editReviewMovie = exports.reviewMovie = exports.getSerie = exports.getMovie = exports.deleteGenres = exports.uploadGenres = exports.getMedias = exports.searchMedia = void 0;
const MediaManager_1 = require("../components/MediaManager");
const mediaManager = new MediaManager_1.MediaManager();
const searchMedia = (req, res) => {
    mediaManager.searchMedia(req, res);
};
exports.searchMedia = searchMedia;
const getMedias = (req, res) => {
    mediaManager.getMedias(req, res);
};
exports.getMedias = getMedias;
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
const getSerie = (req, res) => {
    mediaManager.getSerie(req, res);
};
exports.getSerie = getSerie;
const reviewMovie = (req, res) => {
    mediaManager.reviewMovie(req, res);
};
exports.reviewMovie = reviewMovie;
const editReviewMovie = (req, res) => {
    mediaManager.editReviewMovie(req, res);
};
exports.editReviewMovie = editReviewMovie;
const deleteReviewMovie = (req, res) => {
    mediaManager.deleteReviewMovie(req, res);
};
exports.deleteReviewMovie = deleteReviewMovie;
const reviewSerie = (req, res) => {
    mediaManager.reviewSerie(req, res);
};
exports.reviewSerie = reviewSerie;
const editReviewSerie = (req, res) => {
    mediaManager.editReviewSerie(req, res);
};
exports.editReviewSerie = editReviewSerie;
const deleteReviewSerie = (req, res) => {
    mediaManager.deleteReviewSerie(req, res);
};
exports.deleteReviewSerie = deleteReviewSerie;
const CommentReview = (req, res) => {
    mediaManager.addCommentToReview(req, res);
};
exports.CommentReview = CommentReview;
const editCommentReview = (req, res) => {
    mediaManager.editComment(req, res);
};
exports.editCommentReview = editCommentReview;
