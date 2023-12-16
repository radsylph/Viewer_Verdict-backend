import express from "express";
import {
  joinChat,
  getPublicChats,
  getPrivateChats,
  getMessages,
  sendMessage,
  createPrivateChat,
} from "../controllers/chatControllers";

const router = express.Router();

router.route("/join/:idRoom").post(joinChat);//privateChats
router.route("/public").get(getPublicChats); //chat/public
router.route("/private").get(getPrivateChats);//
router.route("/private").post(createPrivateChat)//
router.route("/messages/:idRoom").get(getMessages).post(sendMessage);//getMessges y sendMessages

export default router;
