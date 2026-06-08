import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";
const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Board",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    canvasData: {
      type: Array,
      default: [],
    },
    arrows: {
      type: Array,
      default: [],
    },
    thumbnail: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Board = mongoose.model("Board", boardSchema);
