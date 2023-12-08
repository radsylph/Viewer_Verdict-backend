import express from "express";
import {
  searchMedia,
  uploadGenres,
  deleteGenres,
  getMovie,
  getSerie,
  reviewMovie,
} from "../controllers/mediaControllers";
import getUserInfo from "../middlewares/ProtectRutes";

const router = express.Router();

router.route("/general/:name").get(searchMedia);
router.route("/movie/:id").get(getMovie);
router.route("/serie/:id").get(getSerie);
router.route("/movie/:id/review").post(getUserInfo, reviewMovie);

router.route("/admin/uploadGenres").post(uploadGenres);
router.route("/admin/deleteGenres").delete(deleteGenres);

export default router;
