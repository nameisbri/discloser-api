import express from "express";
import {
  uploadRecords,
  getAllRecords,
  getRecord,
} from "../controllers/recordController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Add error handling middleware
router.post(
  "/upload",
  (req, res, next) => {
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({
          error: err.message,
          code: err.code,
          field: err.field,
        });
      }
      next();
    });
  },
  uploadRecords
);

router.get("/", getAllRecords);
router.get("/:id", getRecord);

export default router;
