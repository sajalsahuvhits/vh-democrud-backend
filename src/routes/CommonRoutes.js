import { Router } from "express";
import {
  getGame,
  getGameById,
  getGenre,
  getGenreById,
  getNewGames,
} from "../controller/admin/GameController.js";

const CommonRouter = Router();

CommonRouter.route("/get-genre").get(getGenre);
CommonRouter.route("/get-genre-by-id/:id").get(getGenreById);
CommonRouter.route("/get-game").get(getGame);
CommonRouter.route("/get-game-by-id/:id").get(getGameById);
CommonRouter.route("/get-new-game").get(getNewGames);

export { CommonRouter };
