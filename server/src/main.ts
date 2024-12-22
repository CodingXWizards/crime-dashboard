import "module-alias/register";
import "dotenv/config"; // Load environment variables

import cors from "cors";
import express, { Application, Response } from "express";
import morgan from "morgan";

import logger from "@src/logger";
import { checkSupabaseConnection } from "@src/supabase-client";
import tableRouter from "@src/routes/table";

const allowedOrigins = ["http://localhost:5173"];

const App: Application = express();

App.use(express.json());
App.use(morgan("dev"));

// Configure CORS middleware
App.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

checkSupabaseConnection();

// ---- Routes ----

App.use("/api/table", tableRouter);

// ---- Routes ----

App.get("/", (_, res: Response) => {
  res.status(200).send("Server Running correctly");
});

App.listen(5000, () => {
  logger.info("Server running at http://localhost:5000");
});
