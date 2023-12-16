import mongoose from "mongoose";
import { MessageInterface } from "../interfaces/main";

const messageSchema = new mongoose.Schema<MessageInterface>({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  idSender: {
    type: String,
    required: false,
  },
});

const Message = mongoose.model<MessageInterface>("Message", messageSchema);
export default Message;
