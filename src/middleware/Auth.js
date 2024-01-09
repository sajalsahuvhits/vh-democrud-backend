import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { ResponseMessage } from "../utils/ResponseMessage.js";
import { Admin } from "../model/Admin.js";
import { User } from "../model/User.js";

export const auth = async (req, res, next) => {
  const bearertoken = req.headers.authorization;
  if (!bearertoken) {
    res.status(401).json({ message: "Token not authorized" });
  } else {
    try {
      const token = bearertoken.split(" ").pop();
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      if (decode.user) {
        const validUser = await User.findById(decode.user.id);
        if (validUser) {
          if (validUser.isActive) {
            req.user = decode.user.id;
            next();
          } else {
            res.status(400).json({
              status: 400,
              message: ResponseMessage.ACCOUNT_DEACTIVATED,
              data: [],
            });
          }
        } else {
          res.status(400).json({
            status: 400,
            message: ResponseMessage.TOKEN_NOT_VALID,
            data: [],
          });
        }
      } else if (decode.admin) {
        const validAdmin = await Admin.findById(decode.admin.id);
        if (validAdmin) {
          req.admin = decode.admin.id;
          next();
        } else {
          res.status(400).json({
            status: 400,
            message: ResponseMessage.TOKEN_NOT_VALID,
            data: [],
          });
        }
      } else {
        res.status(400).json({
          status: 400,
          message: ResponseMessage.TOKEN_NOT_VALID,
          data: [],
        });
      }
      // next();
    } catch (err) {
      return res.status(500).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }
};
