import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";

export const genrateToken = ({ payload, ExpiratioTime }) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: ExpiratioTime,
  });
};

export const generateOtp = () => {
  let otp = Math.floor(1000 + Math.random() * 9000);
  console.log("otp inside func", otp)
  return otp;
}

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  let encreptPassword = bcrypt.hash(password, salt);
  return encreptPassword;
}

export const sendResponse = (res, status, message, data = []) => {
  res.status(status).json({status, message, data});
}