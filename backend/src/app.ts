import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import envVars from "./config";
import { apiRateLimiter } from "./middlewares/apiRateLimiter";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { checkMaintenanceMode } from "./middlewares/maintenanceMode";
import { notFound } from "./middlewares/notFound";
import router from "./routes";

const app: Application = express();

// CORS configuration
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://rbac-platform.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Brute-force protection for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased for development
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limit to auth routes
app.use("/api/v1/auth", authLimiter);

// Maintenance mode check
app.use(checkMaintenanceMode);

// Dynamic rate limiting based on system settings
app.use("/api/v1", apiRateLimiter);

// Application routes
app.use("/api/v1", router);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Dynamic RBAC Platform API",
  });
});

// Error handling
app.use(globalErrorHandler);

// Handle Not Found
app.use(notFound);

export default app;
