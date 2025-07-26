import express from "express";
import { Clerk } from "@clerk/clerk-sdk-node";
const router = express.Router();

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

router.post("/update-profile", async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });

    res.status(200).json({ message: "User metadata updated", user });
  } catch (err) {
    console.error("Error updating metadata:", err);
    res.status(500).json({ error: "Failed to update metadata" });
  }
});

export default router;
