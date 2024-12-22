import { getAllTableData, getTableData } from "@src/controllers/table";
import { Router } from "express";

const router = Router();

router.get("/:tableName", getTableData);
router.get("/:tableName/all", getAllTableData);

export default router;
