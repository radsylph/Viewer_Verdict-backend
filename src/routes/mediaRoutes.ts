import express from "express";
import {
  searchMedia,
  uploadGenres,
  deleteGenres,
  getMovie,
} from "../controllers/mediaControllers";
import getUserInfo from "../middlewares/ProtectRutes";

const router = express.Router();

router.route("/general/:name").get(searchMedia);
router.route("/movie/:id").get(getMovie);

router.route("/admin/uploadGenres").post(uploadGenres);
router.route("/admin/deleteGenres").delete(deleteGenres);

export default router;
