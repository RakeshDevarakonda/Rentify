import express from "express";
import { likepost, unlikepost } from "../Controllers/LikesController.js";

const LikeRouter = express.Router();

LikeRouter.put("/likepost", likepost);

LikeRouter.put("/unlikepost", unlikepost);

export default LikeRouter;
