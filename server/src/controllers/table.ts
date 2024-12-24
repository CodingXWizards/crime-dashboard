import logger from "../logger";
import { supabase } from "../supabase-client";
import { Request, Response } from "express";

export const getTableData = async (req: Request, res: Response) => {
  const { tableName } = req.params;

  // Get the page and limit from query parameters, with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = 100; // Number of records per page

  const from = (page - 1) * limit; // Starting record index
  const to = from + limit - 1; // Ending record index

  try {
    // Fetch data with pagination
    const { data, error } = await supabase.from(tableName).select("*").range(from, to).order("id", { ascending: true });

    if (error) {
      logger.error(`Error fetching table fields: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No data found in table" });
    }

    const fields = Object.keys(data[0]);
    logger.info(`Fields retrieved from table ${tableName}: ${fields.join(", ")}`);

    // Get the total record count using a separate query
    const { count, error: countError } = await supabase.from(tableName).select("id", { count: "exact" }); // Using an arbitrary column (id) for count query

    if (countError && !count) {
      logger.error(`Error fetching total count for table ${tableName}: ${countError.message}`);
      return res.status(500).json({ error: "Failed to fetch total count" });
    }

    const totalCount: number = count as number;

    const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

    return res.status(200).json({
      fields,
      data,
      pagination: {
        page,
        totalPages,
        totalRecords: count,
        recordsPerPage: limit,
      },
    });
  } catch (err: any) {
    logger.error(`Error in /table-fields/: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllTableData = async (req: Request, res: Response) => {
  const { tableName } = req.params;

  try {
    const { data, error } = await supabase.from(tableName).select("*");

    if (error) {
      logger.error(`Error fetching table fields: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No data found in table" });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    logger.error(`Error in /table-fields/all: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getColumnData = async (req: Request, res: Response) => {
  const { tableName, columnName } = req.params;

  try {
    // Using 'is null' syntax instead of string comparison
    const { data, error } = await supabase.from(tableName).select(columnName).not(columnName, "is", null);
    // Removed the redundant .filter() call

    if (error) {
      logger.error(`Error fetching column data: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No data found for the specified column" });
    }

    // Extract the column values into an array using the column name as a string key
    const columnData = data.map((row: Record<string, any>) => row[columnName]);

    logger.info(`Retrieved ${columnData.length} non-null values from column ${columnName} in table ${tableName}`);

    return res.status(200).json({
      column: columnName,
      data: columnData,
    });
  } catch (err: any) {
    logger.error(`Error in /db/${columnName}: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
