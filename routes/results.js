import express from "express";
import {
  createResult,
  getResultsByRecord,
  getResult,
  deleteResult,
} from "../controllers/resultController.js";

const router = express.Router();

router.post("/", createResult);

router.get("/record/:test_record_id", getResultsByRecord);

router.get("/:id", getResult);

router.delete("/:id", deleteResult);

export default router;
