import mongoose from "mongoose";
import { Genre } from "./Genre.js";
import { Platform } from "./Platform.js";
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
    platform: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: Platform,
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
