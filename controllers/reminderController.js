import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all reminders for a user
export const getReminders = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Fetch reminders for the specified user
    const reminders = await knex("testing_reminders")
      .where({ user_id })
      .select("*");

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
};

// Create a new reminder for a user
export const createReminder = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { frequency, next_test_date, last_notified_date, is_active } =
      req.body;

    // Validate user_id
    const user = await knex("users").where({ id: user_id }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Insert the new reminder
    await knex("testing_reminders").insert({
      user_id,
      frequency,
      next_test_date,
      last_notified_date,
      is_active,
    });

    // Fetch the newly created reminder
    const [newReminder] = await knex("testing_reminders")
      .where({ user_id })
      .orderBy("created_at", "desc")
      .limit(1);

    res.status(201).json(newReminder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create reminder" });
  }
};

// Update a reminder for a user
export const updateReminder = async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const { frequency, next_test_date, last_notified_date, is_active } =
      req.body;

    // Validate user_id and reminder_id
    const reminder = await knex("testing_reminders")
      .where({ id, user_id })
      .first();

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    // Update the reminder
    await knex("testing_reminders").where({ id, user_id }).update({
      frequency,
      next_test_date,
      last_notified_date,
      is_active,
      updated_at: knex.fn.now(),
    });

    // Fetch the updated reminder
    const [updatedReminder] = await knex("testing_reminders").where({
      id,
      user_id,
    });

    res.status(200).json(updatedReminder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update reminder" });
  }
};

// Delete a reminder for a user
export const deleteReminder = async (req, res) => {
  try {
    const { user_id, id } = req.params;

    // Validate user_id and reminder_id
    const reminder = await knex("testing_reminders")
      .where({ id, user_id })
      .first();

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    // Delete the reminder
    await knex("testing_reminders").where({ id, user_id }).del();

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reminder" });
  }
};
