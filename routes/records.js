import express from "express";
import {
  uploadRecord,
  getAllRecords,
  getRecord,
} from "../controllers/recordController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Update the upload route to use multer
router.post("/upload", upload.single("file"), uploadRecord);

// Keep existing routes
router.get("/", getAllRecords);
router.get("/:id", getRecord);

export default router;
