import "module-alias/register";
import "dotenv/config"; // Load environment variables

import cors from "cors";
import express, { Application, Response } from "express";
import morgan from "morgan";

import logger from "@src/logger";
import { checkSupabaseConnection } from "@src/supabase-client";
import tableRouter from "@src/routes/table";
import entriesRouter from "@src/routes/entries";

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const App: Application = express();

App.use(express.json());
App.use(morgan("dev"));

// Update CORS configuration
App.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

checkSupabaseConnection();

// ---- Routes ----

App.use("/api/table", tableRouter);
App.use("/api", entriesRouter);

// ---- Routes ----

App.get("/", (_, res: Response) => {
  res.status(200).send("Server Running correctly");
});

const PORT = process.env.PORT || 5000;

App.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
