import initKnex from "knex";
import configuration from "../knexfile.js";
import {
  normalizeTestType,
  getTestSortOrder,
} from "../utils/testNormalizer.js";

const knex = initKnex(configuration);

export const getLatestResults = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await knex("users")
      .where({ id: userId, is_active: 1 })
      .select(["screen_name"])
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get all results
    const results = await knex("test_result as tr")
      .join("test_record as rec", "tr.test_record_id", "rec.id")
      .where({
        "rec.user_id": userId,
        "tr.is_active": 1,
      })
      .select(["tr.test_type", "tr.result", "tr.notes", "rec.test_date"]);

    // Normalize and deduplicate results
    const normalizedResults = results.map((result) => ({
      ...result,
      test_type: normalizeTestType(result.test_type),
    }));

    // Group by normalized test type and keep most recent
    const latestByType = {};
    normalizedResults.forEach((result) => {
      const currentDate = new Date(result.test_date);
      const existingResult = latestByType[result.test_type];

      if (!existingResult || currentDate > new Date(existingResult.test_date)) {
        latestByType[result.test_type] = result;
      }
    });

    // Convert back to array and sort
    const finalResults = Object.values(latestByType).sort((a, b) => {
      // First sort by test category
      const categoryDiff =
        getTestSortOrder(a.test_type) - getTestSortOrder(b.test_type);
      if (categoryDiff !== 0) return categoryDiff;

      // Then by date (most recent first)
      return new Date(b.test_date) - new Date(a.test_date);
    });

    res.json({
      screen_name: user.screen_name,
      results: finalResults.map((result) => ({
        test_type: result.test_type,
        result: result.result,
        test_date: result.test_date,
        notes: result.notes,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving shared results" });
  }
};
