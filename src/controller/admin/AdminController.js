import { StatusCodes } from "http-status-codes";
import { Admin } from "../../model/Admin.js";
import { ResponseMessage } from "../../utils/ResponseMessage.js";
import bcrypt from "bcryptjs";
import {
  encryptPassword,
  generateOtp,
  genrateToken,
  sendResponse,
} from "../../services/CommonServices.js";
import { User } from "../../model/User.js";
import { transport } from "../../config/Email.config.js";

export const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return sendResponse(res, 400, ResponseMessage.ALL_FIELDS_REQUIRED);
    }
    const findAdmin = await Admin.findOne({ email }).select("+password -otp");
    if (findAdmin) {
      const passwordMatch = await bcrypt.compare(password, findAdmin.password);
      if (passwordMatch) {
        const payload = { admin: { id: findAdmin._id } };
        const token = genrateToken({
          payload,
          ExpiratioTime: "60d",
        });
        let user = JSON.parse(JSON.stringify(findAdmin));
        delete user.password;
        sendResponse(res, StatusCodes.OK, ResponseMessage.ADMIN_LOGGED_IN, {
          user,
          token,
        });
      } else {
        sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          ResponseMessage.INVALID_PASSWORD
        );
      }
    } else {
      sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.ADMIN_NOT_FOUND
      );
    }
  } catch (err) {
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [err.message],
    });
  }
};

export const userActiveDeactive = async (req, res) => {
  try {
    const { userId, isActive } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive } },
      { new: true }
    );
    // sendEmail(
    //   updatedUser.email,
    //   "Account status changed",
    //   `Account ${updatedUser.isActive ? "activated" : "deactivated"}`
    // );
    sendResponse(
      res,
      StatusCodes.OK,
      updatedUser.isActive
        ? ResponseMessage.USER_ACTIVATED
        : ResponseMessage.USER_IN_ACTIVATED,
      updatedUser
    );
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      ResponseMessage.INTERNAL_SERVER_ERROR,
      [error.message]
    );
  }
};

export const changePassword = async (req, res) => {
  try {
    let { newPassword, oldPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.OLD_NEW_PASSWORD_REQUIRED
      );
    }
    const findPassword = await Admin.findById(req.admin).select("+password");
    if (findPassword) {
      const matchOldPassword = await bcrypt.compare(
        oldPassword,
        findPassword.password
      );
      if (!matchOldPassword) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.OLD_PASSWORD_INVALID,
          data: [],
        });
      } else {
        const matchPassword = await bcrypt.compare(
          newPassword,
          findPassword.password
        );
        if (matchPassword) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: ResponseMessage.OLD_AND_NEW_PASSWORD_SAME,
            data: [],
          });
        } else {
          newPassword = await encryptPassword(newPassword);
          const updatePassword = await Admin.findByIdAndUpdate(
            req.admin,
            { $set: { password: newPassword } },
            { new: true }
          );
          if (updatePassword) {
            return res.status(200).json({
              status: StatusCodes.OK,
              message: ResponseMessage.PASSWORD_CHANGED,
              data: updatePassword,
            });
          } else {
            return res.status(400).json({
              status: StatusCodes.BAD_REQUEST,
              message: ResponseMessage.RESET_PASSWORD_ERROR,
              data: err,
            });
          }
        }
      }
    } else {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: ResponseMessage.ADMIN_NOT_EXIST,
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [error.message],
    });
  }
};

export const getUserList = async (req, res) => {
  try {
    const findUser = await User.find().sort({ createdAt: -1 });
    if (findUser) {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.USER_FETCHED,
        data: findUser,
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.USER_NOT_FOUND,
        data: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [error.message],
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.USER_NOT_FOUND,
        data: [],
      });
    }
    res.status(200).send({
      status: StatusCodes.OK,
      message: ResponseMessage.USER_FETCHED,
      data: findUser,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    let admin = await Admin.findOne({ email });
    if (admin) {
      const updateOtp = await Admin.findOneAndUpdate(
        { email },
        { $set: { otp: generateOtp() } },
        { new: true }
      );
      if (!updateOtp) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.SOMETHING_WENT_WRONG
        );
      } else {
        let mailInfo = `OTP: ${updateOtp.otp}`;
        const emailResp = await transport(
          admin.email,
          "Forgot Password",
          mailInfo
        );

        if (emailResp) {
          const payload = { admin: { id: updateOtp._id } };
          const token = genrateToken({
            payload,
            ExpiratioTime: "1d",
          });
          sendResponse(
            res,
            StatusCodes.OK,
            ResponseMessage.RESET_PASSWORD_MAIL,
            { token }
          );
        } else {
          sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            ResponseMessage.SOMETHING_WENT_WRONG
          );
        }
      }
    } else {
      sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        ResponseMessage.ADMIN_NOT_FOUND
      );
    }
  } catch (err) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [err.message],
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let id = req.admin;
    let { otp } = req.body;
    let admin = await Admin.findById({ _id: id });
    if (admin.otp != otp) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.INVALID_OTP,
        daa: [],
      });
    } else {
      await Admin.findByIdAndUpdate(
        { _id: id },
        { $set: { otp: null, isVerified: true } },
        { new: true }
      );
      res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.VERIFICATION_COMPLETED,
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    let adminId = req.admin;
    let { newPassword, confirmPassword } = req.body;
    let exist = await Admin.findOne({ _id: adminId }).select("+password");
    if (exist) {
      const validPassword = await bcrypt.compare(newPassword, exist.password);
      if (!validPassword) {
        if (newPassword == confirmPassword) {
          const password = await encryptPassword(newPassword);
          let resetPassword = await Admin.findByIdAndUpdate(
            { _id: adminId },
            { $set: { password: password } },
            { new: true }
          );
          if (!resetPassword) {
            return res.status(400).json({
              status: StatusCodes.BAD_REQUEST,
              message: ResponseMessage.SOMETHING_WENT_WRONG,
            });
          } else {
            return res.status(200).json({
              status: StatusCodes.OK,
              message: ResponseMessage.RESET_PASSWORD,
              data: resetPassword,
            });
          }
        } else {
          res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: ResponseMessage.PASSWORD_NOT_MATCH,
            data: [],
          });
        }
      } else {
        res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.OLD_NEW_PASSWORD_ARE_MATCH,
          data: [],
        });
      }
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.ADMIN_NOT_FOUND,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};
