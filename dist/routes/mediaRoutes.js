"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaControllers_1 = require("../controllers/mediaControllers");
const ProtectRutes_1 = __importDefault(require("../middlewares/ProtectRutes"));
const router = express_1.default.Router();
router.route("/general/:name").get(mediaControllers_1.searchMedia);
router.route("/general").get(mediaControllers_1.getMedias);
router.route("/movie/:id").get(mediaControllers_1.getMovie);
router.route("/movie/:id/review").post(ProtectRutes_1.default, mediaControllers_1.reviewMovie);
router.route("/movie/:id/review").put(ProtectRutes_1.default, mediaControllers_1.editReviewMovie);
router.route("/movie/:id/review").delete(ProtectRutes_1.default, mediaControllers_1.deleteReviewMovie);
router.route("/serie/:id").get(mediaControllers_1.getSerie);
router.route("/serie/:id/review").post(ProtectRutes_1.default, mediaControllers_1.reviewSerie);
router.route("/serie/:id/review").put(ProtectRutes_1.default, mediaControllers_1.editReviewSerie);
router.route("/serie/:id/review").delete(ProtectRutes_1.default, mediaControllers_1.deleteReviewSerie);
router.route("/review/:id").post(ProtectRutes_1.default, mediaControllers_1.CommentReview);
router.route("/response/:id").put(ProtectRutes_1.default, mediaControllers_1.editCommentReview);
router.route("/admin/uploadGenres").post(mediaControllers_1.uploadGenres);
router.route("/admin/deleteGenres").delete(mediaControllers_1.deleteGenres);
exports.default = router;
