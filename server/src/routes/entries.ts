import { supabase } from "@src/supabase-client";
import { Router } from "express";
import logger from "@src/logger";

const router = Router();

router.post("/case-entry", async (req, res) => {
  try {
    logger.info("Received case entry request");

    if (!req.body) {
      logger.error("No request body provided");
      return res.status(400).json({
        success: false,
        message: "No request body provided",
      });
    }

    logger.info("Case entry data received:", req.body);

    const requiredFields = ["district", "thana", "crimeNumber"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    const {
      district,
      thana,
      crimeNumber,
      incidentDate,
      dateOfArrest,
      chargeSheetReadyDate,
      chargeSheetFileDate,
      stage,
      totalAccused,
      totalArrested,
      section,
      act,
    } = req.body;

    const insertData = {
      district,
      thana,
      crimeNumber,
      incidentDate,
      dateOfArrest,
      chargeSheetReadyDate,
      chargeSheetFileDate,
      stage,
      totalAccused,
      totalArrested,
      section,
      act,
    };

    logger.info("Attempting to insert case entry:", insertData);
    const { data, error } = await supabase.from("crime").insert([insertData]).select();

    if (error) {
      logger.error("Failed to insert case entry:", error);
      throw error;
    }

    logger.info("Case entry created successfully:", data);
    res.status(201).json({
      success: true,
      message: "Case entry created successfully",
      data,
    });
  } catch (err) {
    const error = err as Error;
    logger.error("Error in case entry creation:", error);
    res.status(500).json({
      success: false,
      message: "Error creating case entry",
      error: error.message || "Unknown error occurred",
    });
  }
});

export default router;
