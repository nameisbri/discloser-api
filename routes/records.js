import express from "express";
import {
  uploadRecord,
  getAllRecords,
  getRecord,
} from "../controllers/recordController.js";

const router = express.Router();

// Upload new test record (PDF)
router.post("/upload", uploadRecord);

// Get all records for a user
router.get("/", getAllRecords);

// Get specific record details & PDF
router.get("/:id", getRecord);

export default router;
