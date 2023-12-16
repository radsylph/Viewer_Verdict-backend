import { Request, Response } from "express";
import { Chat, Message } from "../models/main";
import { ChatInterface, MessageInterface } from "../interfaces/main";
import { check, validationResult } from "express-validator";

interface CustomRequest extends Request {
  user?: any;
  user_id?: any;
}

class ChatManager {
  constructor() {}

  async getGroupChats(req: CustomRequest, res: Response) {}

  async getChatMessages(req: CustomRequest, res: Response) {
    const { idRoom } = req.params;
    const { participants } = req.body;
    try {
      const chatMessages = await Message.find({ idRoom });
      if (!chatMessages) {
        console.log(participants);
        const newChat = new Chat({
          idRoom,
          messages: [],
          participants: participants,
          type: "private",
        });
        await newChat.save();
        return res.status(200).json({
          message: "Chat created",
          messages: newChat,
        });
      }
      return res.status(200).json({
        message: "messages found",
        chatMessages,
      });
    } catch (error) {
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
  }

  async saveChatMessages(req: CustomRequest, res: Response) {
    const { idRoom } = req.params;
    const { idSender, idSentTo, message, sendTo, sender } = req.body;

    try {
      const newMessage = new Message({
        idRoom,
        idSender,
        idSentTo,
        message,
        sendTo,
        sender,
      });
      await newMessage.save();
      return res.status(200).json({
        message: "message saved",
        newMessage,
      });
    } catch (error) {
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
  }
}

export default ChatManager;
