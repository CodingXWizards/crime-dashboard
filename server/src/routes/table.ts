import { getTableData } from "@src/controllers/table";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/:tableName", getTableData);

export default router;
