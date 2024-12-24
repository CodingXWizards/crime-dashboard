import "dotenv/config";

import cors from "cors";
import express, { Application, Response } from "express";
import morgan from "morgan";

import logger from "./logger";
import { checkSupabaseConnection } from "./supabase-client";
import tableRouter from "./routes/table";
import entriesRouter from "./routes/entries";

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173", "https://crime-dashboard-beta.vercel.app"];

const app: Application = express();

app.use(express.json());
app.use(morgan("dev"));

// Update CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

checkSupabaseConnection();

// ---- Routes ----

app.use("/api/table", tableRouter);
app.use("/api", entriesRouter);

// ---- Routes ----

app.get("/", (_, res: Response) => {
  res.status(200).send("Server Running correctly");
});

const port = process.env.PORT || 5000;

// Only listen to port if not running on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
  });
}

// Export the Express app for Vercel
export default app;
