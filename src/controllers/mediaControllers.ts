import { Request, Response } from "express";
import { MediaManager } from "../components/MediaManager";
interface CustomRequest extends Request {
  user?: any;
  user_id?: any;
}
const mediaManager = new MediaManager();

const searchMedia = (req: CustomRequest, res: Response): void => {
  mediaManager.searchMedia(req, res);
};

const uploadGenres = (req: CustomRequest, res: Response): void => {
  mediaManager.uploadGenres(res);
};

const deleteGenres = (req: CustomRequest, res: Response): void => {
  mediaManager.deleteGenres(res);
};

const getMovie = (req: CustomRequest, res: Response): void => {
  mediaManager.getMovie(req, res);
};

const getSerie = (req: CustomRequest, res: Response): void => {
  mediaManager.getSerie(req, res);
};

const reviewMovie = (req: CustomRequest, res: Response): void => {
  mediaManager.reviewMovie(req, res);
};

const editReviewMovie = (req: CustomRequest, res: Response): void => {
  mediaManager.editReviewMovie(req, res);
};

const deleteReviewMovie = (req: CustomRequest, res: Response): void => {
  mediaManager.deleteReviewMovie(req, res);
};

const reviewSerie = (req: CustomRequest, res: Response): void => {
  mediaManager.reviewSerie(req, res);
};

const editReviewSerie = (req: CustomRequest, res: Response): void => {
  mediaManager.editReviewSerie(req, res);
};

const deleteReviewSerie = (req: CustomRequest, res: Response): void => {
  mediaManager.deleteReviewSerie(req, res);
};

const CommentReview = (req: CustomRequest, res: Response): void => {
  mediaManager.addCommentToReview(req, res);
};

export {
  searchMedia,
  uploadGenres,
  deleteGenres,
  getMovie,
  getSerie,
  reviewMovie,
  editReviewMovie,
  deleteReviewMovie,
  reviewSerie,
  editReviewSerie,
  deleteReviewSerie,
  CommentReview,
};
