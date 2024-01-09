import mongoose from "mongoose";
import { Admin } from "./Admin.js";
import { Game } from "./Game.js";

const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false
        },
        newsDescription: {
            type: String,
            required: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: Admin
        },
        gameId: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: Game
        }],
        isDeleted: {
            type: Boolean,
            default: false,
            required: false
        },
        isActive: {
            type: Boolean,
            default: true,
            required: false
        },
    },
    { timestamps: true }
);

export const News = mongoose.model("new", NewsSchema);