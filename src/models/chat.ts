import mongoose from "mongoose";
import { ChatInterface } from "../interfaces/main";

const chatSchema = new mongoose.Schema<ChatInterface>({
  idRoom: {
    type: String,
    required: true,
  },
  messages: {
    type: [String],
    required: true,
  },
  participants: {
    type: [String],
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.model<ChatInterface>("Chat", chatSchema);
export default Chat;
