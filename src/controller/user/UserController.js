import { StatusCodes } from "http-status-codes";
import {
  encryptPassword,
  generateOtp,
  genrateToken,
} from "../../services/CommonServices.js";
import { User } from "../../model/User.js";
import { ResponseMessage } from "../../utils/ResponseMessage.js";
import bcrypt from "bcryptjs";
import { transport } from "../../config/Email.config.js";

//register user or update user info
export const addEditUser = async (req, res) => {
  try {
    const checkUser = await User.find({
      email: req.body.email,
    });
    if (checkUser.length) {
      return res.status(409).json({
        status: StatusCodes.CONFLICT,
        message: ResponseMessage.USER_ALREADY_CREATED,
        data: [],
      });
    } else {
      req.body.email = req.body.email.toLowerCase();
      req.body.password = await encryptPassword(req.body.password);
      const saveUser = await User.create(req.body);
      if (saveUser) {
        return res.status(201).json({
          status: StatusCodes.CREATED,
          message: ResponseMessage.USER_CREATED,
          data: { saveUser },
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.OK,
          message: ResponseMessage.USER_NOT_CREATED,
          data: [],
        });
      }
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

export const userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.ALL_FIELDS_REQUIRED,
        data: [],
      });
    }
    const findUser = await User.findOne({ email }).select("+password -otp");
    if (findUser) {
      if (findUser.isVerified == true) {
        if (findUser.isActive == true) {
          const passwordMatch = await bcrypt.compare(
            password,
            findUser.password
          );
          if (passwordMatch) {
            const payload = { user: { id: findUser._id } };
            const token = genrateToken({
              payload,
              ExpiratioTime: "7d",
            });
            let user = JSON.parse(JSON.stringify(findUser))
            delete user.password;
            res.status(200).json({
              status: StatusCodes.OK,
              message: ResponseMessage.USER_LOGGED_IN,
              data: { user, token: token },
            });
          } else {
            res.status(401).json({
              status: StatusCodes.UNAUTHORIZED,
              message: ResponseMessage.INVALID_PASSWORD,
            });
          }
        } else {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: ResponseMessage.ACCOUNT_IS_INACTIVE,
            data: [],
          });
        }
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.YOUR_ACCOUNT_NOT_VERIFIED,
          data: [],
        });
      }
    } else {
      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.USER_NOT_FOUND,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [],
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    let { newPassword, oldPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Old and new Password required!",
        data: [],
      });
    }
    const findPassword = await User.findById(req.user).select("+password");
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
          const updatePassword = await User.findByIdAndUpdate(
            req.user,
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

export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      const updateOtp = await User.findOneAndUpdate(
        { email },
        { $set: { otp: generateOtp() } },
        { new: true }
      );
      if (!updateOtp) {
        return res.json(error);
      } else {
        let mailInfo = `OTP: ${updateOtp.otp}`;

        transport(user.email, "Forgot Password", mailInfo)
          .then((data) => {
            if (data == 0) {
              return res.status(400).json({
                status: StatusCodes.BAD_REQUEST,
                message: ResponseMessage.SOMETHING_WENT_WRONG,
                data: [],
              });
            } else {
              const payload = { user: { id: updateOtp._id } };
              const token = genrateToken({
                payload,
                ExpiratioTime: "1d",
              });
              return res.status(200).json({
                status: StatusCodes.OK,
                message: ResponseMessage.RESET_PASSWORD_MAIL,
                data: { token },
              });
            }
          })
          .catch((error) => {
            return res.status(500).json({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              message: ResponseMessage.INTERNAL_SERVER_ERROR,
              data: error,
            });
          });
      }
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.USER_NOT_FOUND,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: [err.message],
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let id = req.user;
    let { otp } = req.body;
    let user = await User.findById({ _id: id });
    if (user.otp != otp) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.INVALID_OTP,
        daa: [],
      });
    } else {
      await User.findByIdAndUpdate(
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
      data: [err.message],
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    let id = req.user;
    let { newPassword, confirmPassword } = req.body;
    let exist = await User.findOne({ _id: id }).select("+password");
    if (exist) {
      const validPassword = await bcrypt.compare(newPassword, exist.password);
      if (!validPassword) {
        if (newPassword == confirmPassword) {
          const password = await encryptPassword(newPassword);
          let resetPassword = await User.findByIdAndUpdate(
            { _id: id },
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
        message: ResponseMessage.USER_NOT_FOUND,
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
