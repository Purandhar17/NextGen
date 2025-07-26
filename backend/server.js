import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import applicationRoutes from "./routes/applications.js";
import userRoutes from "./routes/users.js";

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "https://nextgen-frontend-snd7.onrender.com",
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "JobHire API is running" });
});

// Server start
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
