import express from "express";
import { getLatestResults } from "../controllers/shareController.js";

const router = express.Router();

router.get("/:userId", getLatestResults);

export default router;
