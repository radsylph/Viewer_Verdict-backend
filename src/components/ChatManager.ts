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

  async joinChat(req: CustomRequest, res: Response) {
    await check("idRoom").notEmpty().withMessage("idRoom is required").run(req);
    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "you have these errors",
        errors: result.array(),
      });
    }
    const { idRoom } = req.params;
    const { participants } = req.body;
    try {
      const chat = await Chat.findOne({
        participants: { $all: participants },
      }).exec();
      if (chat) {
        return res
          .status(200)
          .json({ msg: "The chat already exist", roomId: chat });
      }
      const newChat = new Chat({
        idRoom: idRoom,
        messages: [],
        participants: participants,
        type: "private",
      });

      await newChat.save();
      return res.status(200).json({ msg: "Chat created", roomId: newChat });
    } catch (error) {
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
  }

  async createPrivateChat(req: CustomRequest, res: Response) {
    await check("participants")
      .notEmpty()
      .withMessage("participants are required")
      .run(req);
    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "you have these errors",
        errors: result.array(),
      });
    }
    const { participants } = req.body;
    try {
      const chat = await Chat.findOne({
        participants: { $all: participants },
      }).exec();
      if (chat) {
        return res
          .status(200)
          .json({ msg: "The chat already exist", roomId: chat });
      }
      const newChat = new Chat({
        messages: [],
        participants: participants,
        type: "private",
      });

      await newChat.save();
      return res
        .status(200)
        .json({ msg: "Private chat created", roomId: newChat });
    } catch (error) {
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
  }

  async getPublicChats(req: CustomRequest, res: Response) {
    try {
      const publicChats = await Chat.find({ type: "public" }).exec();
      return res.status(200).json({ msg: "Chats found", chats: publicChats });
    } catch (error) {
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
  }

  async getPrivateChats(req: CustomRequest, res: Response) {
    try {
      const privateChats = await Chat.find({ type: "private" }).exec();
      return res.status(200).json({ msg: "Chats found", chats: privateChats });
    } catch (error) {
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
  }

  async getMessages(req: CustomRequest, res: Response) {
    await check("idRoom").notEmpty().withMessage("idRoom is required").run(req);
    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "you have these errors",
        errors: result.array(),
      });
    }
    try {
      const { idRoom } = req.params;
      const messages = await Chat.findOne({ idRoom: idRoom }).exec();
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
    } catch (error) {
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
  }

  async sendMessage(req: CustomRequest, res: Response) {
    await check("idRoom").notEmpty().withMessage("idRoom is required").run(req);
    await check("message")
      .notEmpty()
      .withMessage("message is required")
      .run(req);
    let result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        message: "you have these errors",
        errors: result.array(),
      });
    }
    try {
      const { idRoom } = req.params;
      const { message } = req.body;

      const chat = await Chat.findOne({ idRoom: idRoom }).exec();
      chat.messages.push(message);
      await chat.save();

      return res.status(200).json({ msg: "Message sent", chat: chat });
    } catch (error) {
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
  }
}

export default ChatManager;
