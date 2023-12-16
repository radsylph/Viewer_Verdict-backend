"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../models/main");
class ChatManager {
    constructor() { }
    getGroupChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getChatMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idRoom } = req.params;
            const { participants } = req.body;
            try {
                const chatMessages = yield main_1.Message.find({ idRoom });
                if (!chatMessages) {
                    console.log(participants);
                    const newChat = new main_1.Chat({
                        idRoom,
                        messages: [],
                        participants: participants,
                        type: "private",
                    });
                    yield newChat.save();
                    return res.status(200).json({
                        message: "Chat created",
                        messages: newChat,
                    });
                }
                return res.status(200).json({
                    message: "messages found",
                    chatMessages,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "server error",
                    errors: [
                        {
                            type: "server",
                            value: error,
                            msg: "there was an error when finding the movies",
                            path: "MediaManager",
                            location: "searchMedia",
                        },
                    ],
                });
            }
        });
    }
    saveChatMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idRoom } = req.params;
            const { idSender, idSentTo, message, sendTo, sender } = req.body;
            try {
                const newMessage = new main_1.Message({
                    idRoom,
                    idSender,
                    idSentTo,
                    message,
                    sendTo,
                    sender,
                });
                yield newMessage.save();
                return res.status(200).json({
                    message: "message saved",
                    newMessage,
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: "server error",
                    errors: [
                        {
                            type: "server",
                            value: error,
                            msg: "there was an error when saving the message",
                            path: "ChatManager",
                            location: "saveChatMessages",
                        },
                    ],
                });
            }
        });
    }
}
exports.default = ChatManager;
