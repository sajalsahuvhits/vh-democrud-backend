import mongoose from "mongoose";
const GenreSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  { timestamps: true }
);

export const Genre = mongoose.model("genres", GenreSchema);
