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
const express_validator_1 = require("express-validator");
class ChatManager {
    constructor() { }
    joinChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("idRoom").notEmpty().withMessage("idRoom is required").run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "you have these errors",
                    errors: result.array(),
                });
            }
            const { idRoom } = req.params;
            const { participants } = req.body;
            try {
                const chat = yield main_1.Chat.findOne({
                    participants: { $all: participants },
                }).exec();
                if (chat) {
                    return res
                        .status(200)
                        .json({ msg: "The chat already exist", roomId: chat });
                }
                const newChat = new main_1.Chat({
                    idRoom: idRoom,
                    messages: [],
                    participants: participants,
                    type: "private",
                });
                yield newChat.save();
                return res.status(200).json({ msg: "Chat created", roomId: newChat });
            }
            catch (error) {
                return res.status(500).json({
                    message: "server error",
                    errors: [
                        {
                            type: "server",
                            value: error,
                            msg: "there was an error when finding/creatin the chat",
                            path: "ChatManager",
                            location: "joinChat",
                        },
                    ],
                });
            }
        });
    }
    createPrivateChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("participants")
                .notEmpty()
                .withMessage("participants are required")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "you have these errors",
                    errors: result.array(),
                });
            }
            const { participants } = req.body;
            try {
                const chat = yield main_1.Chat.findOne({
                    participants: { $all: participants },
                }).exec();
                if (chat) {
                    return res
                        .status(200)
                        .json({ msg: "The chat already exist", roomId: chat });
                }
                const newChat = new main_1.Chat({
                    messages: [],
                    participants: participants,
                    type: "private",
                });
                yield newChat.save();
                return res
                    .status(200)
                    .json({ msg: "Private chat created", roomId: newChat });
            }
            catch (error) {
                return res.status(500).json({
                    message: "server error",
                    errors: [
                        {
                            type: "server",
                            value: error,
                            msg: "there was an error when creating the private chat",
                            path: "ChatManager",
                            location: "createPrivateChat",
                        },
                    ],
                });
            }
        });
    }
    getPublicChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publicChats = yield main_1.Chat.find({ type: "public" }).exec();
                return res.status(200).json({ msg: "Chats found", chats: publicChats });
            }
            catch (error) {
                return res.status(500).json({
                    message: "server error",
                    errors: [
                        {
                            type: "server",
                            value: error,
                            msg: "there was an error when finding the chats",
                            path: "ChatManager",
                            location: "getPublicChats",
                        },
                    ],
                });
            }
        });
    }
    getPrivateChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const privateChats = yield main_1.Chat.find({ type: "private" }).exec();
                return res.status(200).json({ msg: "Chats found", chats: privateChats });
            }
            catch (error) {
                return res.status(500).json({
                    message: "server error",
                    errors: [
                        {
                            type: "server",
                            value: error,
                            msg: "there was an error when finding the chats",
                            path: "ChatManager",
                            location: "getPrivateChats",
                        },
                    ],
                });
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("idRoom").notEmpty().withMessage("idRoom is required").run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "you have these errors",
                    errors: result.array(),
                });
            }
            try {
                const { idRoom } = req.params;
                const messages = yield main_1.Chat.findOne({ idRoom: idRoom }).exec();
                if (!messages) {
                    return res.status(404).json({
                        message: "not found",
                        errors: [
                            {
                                type: "Messages not found",
                                value: idRoom,
                                msg: "the messages not found or the chat does not exist",
                                path: "ChatManager",
                                location: "getMessages",
                            },
                        ],
                    });
                }
                return res
                    .status(200)
                    .json({ msg: "Messages found", messages: messages });
            }
            catch (error) {
                return res.status(500).json({
                    message: "server error",
                    errors: [
                        {
                            type: "server",
                            value: error,
                            msg: "there was an error when finding the messages",
                            path: "ChatManager",
                            location: "getMessages",
                        },
                    ],
                });
            }
        });
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, express_validator_1.check)("idRoom").notEmpty().withMessage("idRoom is required").run(req);
            yield (0, express_validator_1.check)("message")
                .notEmpty()
                .withMessage("message is required")
                .run(req);
            let result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({
                    message: "you have these errors",
                    errors: result.array(),
                });
            }
            try {
                const { idRoom } = req.params;
                const { message } = req.body;
                const chat = yield main_1.Chat.findOne({ idRoom: idRoom }).exec();
                chat.messages.push(message);
                yield chat.save();
                return res.status(200).json({ msg: "Message sent", chat: chat });
            }
            catch (error) {
                return res.status(500).json({
                    message: "server error",
                    errors: [
                        {
                            type: "server",
                            value: error,
                            msg: "there was an error when sending the message",
                            path: "ChatManager",
                            location: "sendMessage",
                        },
                    ],
                });
            }
        });
    }
}
exports.default = ChatManager;
