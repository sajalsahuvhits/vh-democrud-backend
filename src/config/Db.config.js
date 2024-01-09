import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then((e) => {
      console.log("connected to database.");
    })
    .catch((e) => {
      console.log(e);
    });
};
