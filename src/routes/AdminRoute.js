import { Router } from "express";
import { adminLogin, changePassword, forgotPassword, getUserById, getUserList, resetPassword, userActiveDeactive, verifyOtp } from "../controller/admin/AdminController.js";
import { auth } from "../middleware/Auth.js";
import { addEditGame, addEditGenre, deleteGame, deleteGenre, getGame, getGameById, getGenre, getGenreById } from "../controller/admin/GameController.js";
import Uploads from "../middleware/ImageUpload.js";
import { addEditPlatform, deletePlatform, getPlatform, getPlatformById } from "../controller/admin/PlatformController.js";
import { addEditNews, deleteNews, getNews, getNewsById } from "../controller/admin/NewsController.js";
import { sendResponse } from "../services/CommonServices.js";

const AdminRouter = Router();

AdminRouter.route("/login").post(adminLogin);
AdminRouter.route("/active-de-active-user").put(auth, userActiveDeactive)
AdminRouter.route("/verify").get(auth, (req, res)=> {sendResponse(res, 200, "Authorized.")})
AdminRouter.route("/change-password").post(auth, changePassword)
AdminRouter.post("/forgot-password", forgotPassword);
AdminRouter.post("/verify-otp",auth, verifyOtp);
AdminRouter.post("/reset-password", auth, resetPassword);

// user routes
AdminRouter.route("/get-user-list").get(auth, getUserList)
AdminRouter.route("/get-user-by-id/:id").get(auth, getUserById)

// genre routes
AdminRouter.route("/add-edit-genre").post(auth, addEditGenre);
AdminRouter.route("/get-genre").get(auth, getGenre);
AdminRouter.route("/delete-genre").post(auth, deleteGenre)
AdminRouter.route("/get-genre-by-id/:id").get(auth, getGenreById)

// game routes
AdminRouter.route("/add-edit-game").post(auth, Uploads,addEditGame);
AdminRouter.route("/get-game").get(auth, getGame);
AdminRouter.route("/delete-game").post(auth, deleteGame);
AdminRouter.route("/get-game-by-id/:id").get(auth, getGameById);

// platformm routes
AdminRouter.route("/add-edit-platform").post(auth, Uploads,addEditPlatform);
AdminRouter.route("/get-platform").get(auth, getPlatform);
AdminRouter.route("/delete-platform").post(auth, deletePlatform);
AdminRouter.route("/get-platform-by-id/:id").get(auth, getPlatformById);

// news routes
AdminRouter.route("/add-edit-news").post(auth, Uploads,addEditNews);
AdminRouter.route("/get-news").get(auth, getNews);
AdminRouter.route("/delete-news").post(auth, deleteNews);
AdminRouter.route("/get-news-by-id/:id").get(auth, getNewsById);

export { AdminRouter };
