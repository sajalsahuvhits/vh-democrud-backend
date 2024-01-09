import mongoose from "mongoose";
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    contact: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
      required: false,
    },
    otp: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("users", UserSchema);
