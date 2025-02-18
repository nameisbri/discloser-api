import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const createResult = async (req, res) => {
  try {
    const { test_record_id, test_type, result, notes } = req.body;

    if (!test_record_id) {
      return res.status(400).json({ error: "Test record ID is required" });
    }

    if (!test_type) {
      return res.status(400).json({ error: "Test type is required" });
    }

    if (!result) {
      return res.status(400).json({ error: "Result is required" });
    }

    const [newResultId] = await knex("test_result").insert({
      test_record_id,
      test_type,
      result,
      notes: notes || null,
      is_active: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    const newResult = await knex("test_result")
      .where({ id: newResultId })
      .first();

    res.status(201).json(newResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating test result" });
  }
};

export const getResultsByRecord = async (req, res) => {
  try {
    const { test_record_id } = req.params;

    const results = await knex("test_result")
      .where({
        test_record_id,
        is_active: 1,
      })
      .select(["id", "test_type", "result", "notes", "created_at"]);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving test results" });
  }
};

export const getResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await knex("test_result")
      .where({
        id,
        is_active: 1,
      })
      .first();

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving test result" });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await knex("test_result").where({ id }).first();

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    await knex("test_result").where({ id }).del();

    res.json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting test result" });
  }
};
