import { Router } from "express";
import { addEditUser, changePassword, forgotPassword, resetPassword, userLogin, verifyOtp } from "../controller/user/UserController.js";
import { auth } from "../middleware/Auth.js";

// const { verifyUser } = require("../middleware/auth.middleware");
const UserRouter = Router();

UserRouter.route("/add-edit-user").post(addEditUser);
UserRouter.route("/login").post(userLogin);
UserRouter.route("/change-password").post(auth, changePassword)
UserRouter.post("/forgot-password", forgotPassword);
UserRouter.post("/verify-otp", auth, verifyOtp);
UserRouter.post("/reset-password", auth, resetPassword);


export { UserRouter };
