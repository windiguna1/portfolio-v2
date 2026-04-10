import mongoose from "mongoose";

const techSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a technology name"],
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Tech || mongoose.model("Tech", techSchema);
