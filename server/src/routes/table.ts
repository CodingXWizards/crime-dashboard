import { getAllTableData, getTableData, getColumnData } from "../controllers/table";
import { Router } from "express";

const router = Router();

router.get("/:tableName", getTableData);
router.get("/:tableName/all", getAllTableData);
router.get("/:tableName/:columnName", getColumnData);

export default router;
