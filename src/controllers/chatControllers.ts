import { Request, Response } from "express";
import ChatManager from "../components/ChatManager";

interface CustomRequest extends Request {
  user?: any;
  user_id?: any;
}

const chatManager = new ChatManager();

const getGroupChats = async (req: CustomRequest, res: Response) => {
  await chatManager.getGroupChats(req, res);
};

const getChatMessages = async (req: CustomRequest, res: Response) => {
  await chatManager.getChatMessages(req, res);
};

const saveChatMessages = async (req: CustomRequest, res: Response) => {
  await chatManager.saveChatMessages(req, res);
};

export { getGroupChats, getChatMessages, saveChatMessages };
