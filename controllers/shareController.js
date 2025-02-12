import initKnex from "knex";
import configuration from "../knexfile.js";
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

    // Get the most recent result for each test type
    const latestResults = await knex("test_result as tr")
      .join("test_record as rec", "tr.test_record_id", "rec.id")
      .where({
        "rec.user_id": userId,
        "tr.is_active": 1,
      })
      .select(["tr.test_type", "tr.result", "tr.notes", "rec.test_date"])
      // Group by test type and get the most recent for each
      .orderBy("rec.test_date", "desc")
      .then((results) => {
        // Use object to keep only most recent result for each test type
        const latestByType = {};
        results.forEach((result) => {
          if (!latestByType[result.test_type]) {
            latestByType[result.test_type] = result;
          }
        });
        return Object.values(latestByType);
      });

    res.json({
      screen_name: user.screen_name,
      results: latestResults.map((result) => ({
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
