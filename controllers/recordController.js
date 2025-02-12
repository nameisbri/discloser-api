import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const uploadRecord = async (req, res) => {
  try {
    const { user_id, test_date } = req.body;
    // Temporarily hardcode a file path for testing
    const file_path = "test_file_path";

    // Validate required fields
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!test_date) {
      return res.status(400).json({ error: "Test date is required" });
    }

    // Create new record
    const [newRecordId] = await knex("test_record").insert({
      user_id,
      test_date,
      file_path,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    // Fetch the newly created record
    const newRecord = await knex("test_record")
      .where({ id: newRecordId })
      .first();

    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading test record" });
  }
};

export const getAllRecords = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const records = await knex("test_record")
      .where({ user_id })
      .orderBy("test_date", "desc")
      .select(["id", "test_date", "file_path", "created_at"]);

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving test records" });
  }
};

export const getRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const record = await knex("test_record")
      .where({
        id,
        user_id,
      })
      .first();

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving test record" });
  }
};
