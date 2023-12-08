import mongoose from "mongoose";
import { ReviewInterface } from "../interfaces/main";

const ReviewSchema = new mongoose.Schema<ReviewInterface>({
  owner: {
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
  review: {
    type: String,
    required: false,
  },
  edited: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
