import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Application from "../models/Application.js";
import User from "../models/User.js";
import Job from "../models/Job.js";

const router = express.Router();

router.post("/", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user || user.role !== "candidate") {
      return res
        .status(403)
        .json({ error: "Only candidates can apply to jobs" });
    }

    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      candidateId: user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ error: "Already applied to this job" });
    }

    const application = new Application({
      jobId,
      candidateId: user._id,
      coverLetter,
    });

    await application.save();
    await application.populate([
      { path: "jobId", select: "title company location" },
      { path: "candidateId", select: "firstName lastName email" },
    ]);

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to apply to job" });
  }
});

router.get("/my", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user || user.role !== "candidate") {
      return res.status(403).json({ error: "Only candidates can access this" });
    }

    const applications = await Application.find({ candidateId: user._id })
      .populate("jobId", "title company location salary jobType")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.get("/job/:jobId", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (!user || user.role !== "recruiter" || !job.postedBy.equals(user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("candidateId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.put("/:id/status", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    const application = await Application.findById(req.params.id).populate(
      "jobId"
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const job = await Job.findById(application.jobId._id);
    if (!user || user.role !== "recruiter" || !job.postedBy.equals(user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { status } = req.body;
    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to update application status" });
  }
});

export default router;
