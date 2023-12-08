"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaControllers_1 = require("../controllers/mediaControllers");
const router = express_1.default.Router();
router.route("/general/:name").get(mediaControllers_1.searchMedia);
router.route("/movie/:id").get(mediaControllers_1.getMovie);
router.route("/admin/uploadGenres").post(mediaControllers_1.uploadGenres);
router.route("/admin/deleteGenres").delete(mediaControllers_1.deleteGenres);
exports.default = router;
