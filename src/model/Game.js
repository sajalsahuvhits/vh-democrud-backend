import mongoose from "mongoose";
import { Genre } from "./Genre.js";
const GameSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false
    },
    genre: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: Genre,
      required: false,
    }],
    isDeleted: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true }
);

export const Game = mongoose.model("games", GameSchema);
