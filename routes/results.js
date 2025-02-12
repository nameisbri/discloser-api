import express from "express";
import {
  createResult,
  getResultsByRecord,
  getResult,
} from "../controllers/resultController.js";

const router = express.Router();

// Create new test result(s)
router.post("/", createResult);

// Get all results for a test record
router.get("/record/:test_record_id", getResultsByRecord);

// Get specific test result
router.get("/:id", getResult);

export default router;
