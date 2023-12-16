import { Request, Response } from "express";
import ChatManager from "../components/ChatManager";

interface CustomRequest extends Request {
  user?: any;
  user_id?: any;
}

const chatManager = new ChatManager();

const joinChat = (req: CustomRequest, res: Response): void => {
  chatManager.joinChat(req, res);
};

const getPublicChats = (req: CustomRequest, res: Response): void => {
  chatManager.getPublicChats(req, res);
};

const getPrivateChats = (req: CustomRequest, res: Response): void => {
  chatManager.getPrivateChats(req, res);
};

const getMessages = (req: CustomRequest, res: Response): void => {
  chatManager.getMessages(req, res);
};

const sendMessage = (req: CustomRequest, res: Response): void => {
  chatManager.sendMessage(req, res);
};

const createPrivateChat = (req: CustomRequest, res: Response): void => {
  chatManager.createPrivateChat(req, res);
};

export {
  joinChat,
  getPublicChats,
  getPrivateChats,
  getMessages,
  sendMessage,
  createPrivateChat,
};
