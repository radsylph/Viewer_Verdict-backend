import mongoose from "mongoose";
import { ReviewInterface } from "../interfaces/main";

const ReviewSchema = new mongoose.Schema<ReviewInterface>({
  userId: {
    type: String,
    required: true,
  },
  mediaId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
