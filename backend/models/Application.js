import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    coverLetter: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
