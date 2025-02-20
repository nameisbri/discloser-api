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

    // Get all results with their record dates
    const results = await knex("test_result as tr")
      .join("test_record as rec", "tr.test_record_id", "rec.id")
      .where({
        "rec.user_id": userId,
        "tr.is_active": 1,
      })
      .select([
        "tr.test_type",
        "tr.result",
        "tr.notes",
        "rec.test_date",
        knex.raw(
          "ROW_NUMBER() OVER (PARTITION BY tr.test_type ORDER BY rec.test_date DESC) as rn"
        ),
      ])
      .orderBy("rec.test_date", "desc");

    // Filter to keep only the most recent result for each test type
    const latestResults = results.filter((result) => result.rn === 1);

    // Group test types that are related
    const groupedResults = latestResults.reduce((acc, result) => {
      // Remove any interpretation/antibody suffix if it exists
      const baseTestType = result.test_type
        .replace(/(Interpretation|Antibody|Screen|IgG).*$/, "")
        .trim();

      if (!acc[baseTestType]) {
        acc[baseTestType] = [];
      }
      acc[baseTestType].push(result);
      return acc;
    }, {});

    // Format results for response
    const formattedResults = Object.values(groupedResults)
      .flat()
      .map((result) => ({
        test_type: result.test_type,
        result: result.result,
        test_date: result.test_date,
        notes: result.notes,
      }));

    res.json({
      screen_name: user.screen_name,
      results: formattedResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving shared results" });
  }
};
