import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    email: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    resumeLink: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// We generally only need one profile, but using standard collection logic
export default mongoose.models.Profile || mongoose.model("Profile", profileSchema);
