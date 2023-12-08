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

export { searchMedia, uploadGenres, deleteGenres, getMovie };
