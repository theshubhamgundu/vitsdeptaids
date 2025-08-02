import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleLogout, handleVerifyToken } from "./routes/auth";
import {
  handleGetStudents,
  handleGetStudent,
  handleGetStudentAnalysis,
  handleGetStudentStats
} from "./routes/students";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/verify", handleVerifyToken);

  // Student routes
  app.get("/api/students", handleGetStudents);
  app.get("/api/students/stats", handleGetStudentStats);
  app.get("/api/students/:id", handleGetStudent);
  app.get("/api/students/:id/analysis", handleGetStudentAnalysis);

  // Faculty routes (placeholder)
  app.get("/api/faculty", (_req, res) => {
    res.json({ message: "Faculty routes coming soon" });
  });

  // Admin routes (placeholder)
  app.get("/api/admin/dashboard", (_req, res) => {
    res.json({ message: "Admin dashboard routes coming soon" });
  });

  // HOD routes (placeholder)
  app.get("/api/hod/analytics", (_req, res) => {
    res.json({ message: "HOD analytics routes coming soon" });
  });

  return app;
}
