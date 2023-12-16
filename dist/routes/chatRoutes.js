"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatControllers_1 = require("../controllers/chatControllers");
const router = express_1.default.Router();
router.route("/join/:idRoom").post(chatControllers_1.joinChat); //privateChats
router.route("/public").get(chatControllers_1.getPublicChats); //chat/public
router.route("/private").get(chatControllers_1.getPrivateChats); //
router.route("/private").post(chatControllers_1.createPrivateChat); //
router.route("/messages/:idRoom").get(chatControllers_1.getMessages).post(chatControllers_1.sendMessage); //getMessges y sendMessages
exports.default = router;
