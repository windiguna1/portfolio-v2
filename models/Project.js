import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
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
    images: {
      type: [String],
      default: [],
    },
    demoUrl: {
      type: String,
      trim: true,
    },
    repoUrl: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
