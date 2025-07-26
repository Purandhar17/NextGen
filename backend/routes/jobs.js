import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Job from "../models/Job.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, location, jobType, tags } = req.query;
    let filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (tags) {
      const tagArray = tags.split(",");
      filter.tags = { $in: tagArray };
    }

    const jobs = await Job.find(filter)
      .populate("postedBy", "firstName lastName company")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "firstName lastName company"
    );

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

router.post("/", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user || user.role !== "recruiter") {
      return res.status(403).json({ error: "Only recruiters can post jobs" });
    }

    const { title, company, location, salary, description, jobType, tags } =
      req.body;

    const job = new Job({
      title,
      company,
      location,
      salary,
      description,
      jobType,
      tags: tags || [],
      postedBy: user._id,
    });

    await job.save();
    await job.populate("postedBy", "firstName lastName company");

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to create job" });
  }
});

router.get("/my/posted", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user || user.role !== "recruiter") {
      return res.status(403).json({ error: "Only recruiters can access this" });
    }

    const jobs = await Job.find({ postedBy: user._id })
      .populate("postedBy", "firstName lastName company")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posted jobs" });
  }
});

router.put("/:id", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (!user || user.role !== "recruiter" || !job.postedBy.equals(user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("postedBy", "firstName lastName company");

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
});

router.delete("/:id", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (!user || user.role !== "recruiter" || !job.postedBy.equals(user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

export default router;
