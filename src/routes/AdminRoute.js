import { Router } from "express";
import { adminLogin, changePassword, forgotPassword, getUserById, getUserList, resetPassword, userActiveDeactive, verifyOtp } from "../controller/admin/AdminController.js";
import { auth } from "../middleware/Auth.js";
import { addEditGame, addEditGenre, deleteGame, deleteGenre, getGame, getGameById, getGenre, getGenreById } from "../controller/admin/GameController.js";
import Uploads from "../middleware/ImageUpload.js";
import { addEditPlatform, deletePlatform, getPlatform, getPlatformById } from "../controller/admin/PlatformController.js";

const AdminRouter = Router();

AdminRouter.route("/admin/login").post(adminLogin);
AdminRouter.route("/admin/active-de-active-user").put(auth, userActiveDeactive)
AdminRouter.route("/admin/change-password").post(auth, changePassword)
AdminRouter.post("/admin/forgot-password", forgotPassword);
AdminRouter.post("/admin/verify-otp", verifyOtp);
AdminRouter.post("/admin/reset-password", resetPassword);

// user routes
AdminRouter.route("/admin/get-user-list").get(auth, getUserList)
AdminRouter.route("/admin/get-user-by-id/:id").get(auth, getUserById)

// genre routes
AdminRouter.route("/admin/add-edit-genre").post(auth, addEditGenre);
AdminRouter.route("/admin/get-genre").get(auth, getGenre);
AdminRouter.route("/admin/delete-genre").post(auth, deleteGenre)
AdminRouter.route("/admin/get-genre-by-id/:id").get(auth, getGenreById)

// game routes
AdminRouter.route("/admin/add-edit-game").post(auth, Uploads,addEditGame);
AdminRouter.route("/admin/get-game").get(auth, getGame);
AdminRouter.route("/admin/delete-game").post(auth, deleteGame);
AdminRouter.route("/admin/get-game-by-id/:id").get(auth, getGameById);

// platformm routes
AdminRouter.route("/admin/add-edit-platform").post(auth, Uploads,addEditPlatform);
AdminRouter.route("/admin/get-platform").get(auth, getPlatform);
AdminRouter.route("/admin/delete-platform").post(auth, deletePlatform);
AdminRouter.route("/admin/get-platform-by-id/:id").get(auth, getPlatformById);

// news routes

export { AdminRouter };
