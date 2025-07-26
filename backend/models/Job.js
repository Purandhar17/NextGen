import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Remote", "Internship"],
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);
