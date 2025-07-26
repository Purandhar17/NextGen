import express from "express";
import { requireAuth, getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";

const router = express.Router();

router.post("/complete-profile", requireAuth(), async (req, res) => {
  try {
    const { role, company } = req.body;
    const { userId } = getAuth(req);

    if (!role || (role === "recruiter" && !company)) {
      return res.status(400).json({
        error: "Role is required. Company is also required for recruiters.",
      });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const firstName = clerkUser.firstName;
    const lastName = clerkUser.lastName;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        error:
          "Missing required user details (email, first name, or last name)",
      });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = new User({
        clerkId: userId,
        email,
        firstName,
        lastName,
        role,
        company: role === "recruiter" ? company : undefined,
        profileCompleted: true,
      });
    } else {
      user.role = role;
      user.company = role === "recruiter" ? company : undefined;
      user.profileCompleted = true;
    }

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Profile completion error:", error);
    res.status(500).json({
      error: "Failed to complete profile",
      details: error.message,
    });
  }
});

export default router;
