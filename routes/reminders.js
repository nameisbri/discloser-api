import express from "express";
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} from "../controllers/reminderController.js";

const router = express.Router();

// Get all reminders for a user
router.get("/:user_id/reminders", getReminders);

// Create a new reminder for a user
router.post("/:user_id/reminders", createReminder);

// Update a reminder for a user
router.put("/:user_id/reminders/:id", updateReminder);

// Delete a reminder for a user
router.delete("/:user_id/reminders/:id", deleteReminder);

export default router;
