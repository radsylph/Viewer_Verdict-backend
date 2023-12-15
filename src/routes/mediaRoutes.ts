import express from "express";
import {
  searchMedia,
  uploadGenres,
  deleteGenres,
  getMovie,
  getSerie,
  reviewMovie,
  editReviewMovie,
  deleteReviewMovie,
  reviewSerie,
  editReviewSerie,
  deleteReviewSerie,
  CommentReview,
  editCommentReview,
} from "../controllers/mediaControllers";
import getUserInfo from "../middlewares/ProtectRutes";

const router = express.Router();

router.route("/general/:name").get(searchMedia);

router.route("/movie/:id").get(getMovie);
router.route("/movie/:id/review").post(getUserInfo, reviewMovie);
router.route("/movie/:id/review").put(getUserInfo, editReviewMovie);
router.route("/movie/:id/review").delete(getUserInfo, deleteReviewMovie);

router.route("/serie/:id").get(getSerie);
router.route("/serie/:id/review").post(getUserInfo, reviewSerie);
router.route("/serie/:id/review").put(getUserInfo, editReviewSerie);
router.route("/serie/:id/review").delete(getUserInfo, deleteReviewSerie);

router.route("/review/:id").post(getUserInfo, CommentReview);
router.route("/response/:id").put(getUserInfo, editCommentReview);

router.route("/admin/uploadGenres").post(uploadGenres);
router.route("/admin/deleteGenres").delete(deleteGenres);

export default router;
