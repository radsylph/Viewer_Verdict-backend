import mongoose from "mongoose";
import { MessageInterface } from "../interfaces/main";

const messageSchema = new mongoose.Schema<MessageInterface>(
  {
    idRoom: {
      type: String,
      required: true,
    },
    idSender: {
      type: String,
      required: true,
    },
    idSentTo: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sendTo: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<MessageInterface>("Message", messageSchema);
export default Message;
