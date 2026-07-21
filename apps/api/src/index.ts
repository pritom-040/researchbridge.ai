import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

import authRoutes from "./routes/authRoutes";
import universityRoutes from "./routes/universityRoutes";
import scholarshipRoutes from "./routes/scholarshipRoutes";
import aiRoutes from "./routes/aiRoutes";
import profileRoutes from "./routes/profileRoutes";
import chatRoutes from "./routes/chatRoutes";
import adminRoutes from "./routes/adminRoutes";
import applicationRoutes from "./routes/applicationRoutes";

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "ResearchBridge API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
