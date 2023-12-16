"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatControllers_1 = require("../controllers/chatControllers");
const router = express_1.default.Router();
router.route("/getGroupChats").get(chatControllers_1.getGroupChats);
router.route("/getChatMessages/:idRoom").post(chatControllers_1.getChatMessages);
router.route("/saveChatMessages/:idRoom").post(chatControllers_1.saveChatMessages);
exports.default = router;
