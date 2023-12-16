import express from "express";
import {
  getGroupChats,
  getChatMessages,
  saveChatMessages,
} from "../controllers/chatControllers";

const router = express.Router();

router.route("/getGroupChats").get(getGroupChats);
router.route("/getChatMessages/:idRoom").post(getChatMessages);
router.route("/saveChatMessages/:idRoom").post(saveChatMessages);

export default router;
