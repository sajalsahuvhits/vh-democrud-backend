import mongoose from "mongoose";

const PlatformSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    { timestamps: true }
);

export const Platform = mongoose.model("platform", PlatformSchema);