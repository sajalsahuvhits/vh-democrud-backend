import { Router } from "express";
import { addEditUser, changePassword, forgotPassword, resetPassword, userLogin, verifyOtp } from "../controller/user/UserController.js";
import { auth } from "../middleware/Auth.js";

// const { verifyUser } = require("../middleware/auth.middleware");
const UserRouter = Router();

UserRouter.route("/user/add-edit-user").post(addEditUser);
UserRouter.route("/user/login").post(userLogin);
UserRouter.route("/user/change-password").post(auth, changePassword)
UserRouter.post("/user/forgot-password", forgotPassword);
UserRouter.post("/user/verify-otp", verifyOtp);
UserRouter.post("/user/reset-password", resetPassword);


export { UserRouter };
