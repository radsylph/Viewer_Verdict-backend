"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrivateChat = exports.sendMessage = exports.getMessages = exports.getPrivateChats = exports.getPublicChats = exports.joinChat = void 0;
const ChatManager_1 = __importDefault(require("../components/ChatManager"));
const chatManager = new ChatManager_1.default();
const joinChat = (req, res) => {
    chatManager.joinChat(req, res);
};
exports.joinChat = joinChat;
const getPublicChats = (req, res) => {
    chatManager.getPublicChats(req, res);
};
exports.getPublicChats = getPublicChats;
const getPrivateChats = (req, res) => {
    chatManager.getPrivateChats(req, res);
};
exports.getPrivateChats = getPrivateChats;
const getMessages = (req, res) => {
    chatManager.getMessages(req, res);
};
exports.getMessages = getMessages;
const sendMessage = (req, res) => {
    chatManager.sendMessage(req, res);
};
exports.sendMessage = sendMessage;
const createPrivateChat = (req, res) => {
    chatManager.createPrivateChat(req, res);
};
exports.createPrivateChat = createPrivateChat;
