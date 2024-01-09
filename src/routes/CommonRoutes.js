import { Router } from "express";
import {
  getGame,
  getGameById,
  getGenre,
  getGenreById,
} from "../controller/admin/GameController.js";

const CommonRouter = Router();

CommonRouter.route("/common/get-genre").get(getGenre);
CommonRouter.route("/common/get-genre-by-id/:id").get(getGenreById);
CommonRouter.route("/common/get-game").get(getGame);
CommonRouter.route("/common/get-game-by-id/:id").get(getGameById);

export { CommonRouter };
