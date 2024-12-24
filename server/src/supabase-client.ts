import { createClient } from "@supabase/supabase-js";
import logger from "@src/logger";

// Get Supabase URL and Anon Key from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY as string;

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if Supabase is connected
export async function checkSupabaseConnection() {
  const { data, error } = await supabase
    .from("crime") // You can replace this with any table that exists
    .select("uid")
    .limit(1);

  if (error) {
    logger.error("Error connecting to Supabase:", error.message);
  } else {
    logger.info("Successfully connected to Supabase!");
  }
}
