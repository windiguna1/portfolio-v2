import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
    },
    type: {
      type: String,
      enum: ["EVENT", "WORKSHOP", "ACHIEVEMENT", "CERTIFICATION", "OTHER"],
      default: "EVENT",
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model("Activity", activitySchema);
