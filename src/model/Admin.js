import mongoose from "mongoose";
const AdminSchema = mongoose.Schema(
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
      default: true,
    },
    otp: {
      type: Number,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("admins", AdminSchema);
