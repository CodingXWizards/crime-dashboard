import "module-alias/register";
import "dotenv/config"; // Load environment variables

import cors from "cors";
import { checkSupabaseConnection } from "./supabase-client";
import express, { Response } from "express";
import morgan from "morgan";
import logger from "./logger";

const allowedOrigins = ["http://localhost:5173"];

const App = express();

App.use(express.json());

checkSupabaseConnection();

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

App.get("/", (_, res: Response) => {
  res.status(200).send("Server Running correctly");
});

App.listen(5000, () => {
  logger.info("Server running at http://localhost:5000");
});
