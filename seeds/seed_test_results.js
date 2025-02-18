/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clear existing entries
  await knex("test_result").del();

  // Get test records
  const records = await knex("test_record").select("id", "test_date");

  if (!records || records.length === 0) {
    return;
  }

  // Common test types
  const testTypes = [
    "HIV",
    "Syphilis",
    "Gonorrhea",
    "Chlamydia",
    "Hepatitis B",
    "Hepatitis C",
    "HSV-1",
    "HSV-2",
  ];

  // Insert seed data - more diverse results
  return knex("test_result").insert([
    // First user's recent results - showing newly positive HSV-1
    {
      test_record_id: records[0].id,
      test_type: "HSV-1",
      result: "Positive",
      notes: "New diagnosis, treatment plan discussed",
    },
    {
      test_record_id: records[0].id,
      test_type: "HIV",
      result: "Negative",
      notes: "Regular screening",
    },
    {
      test_record_id: records[0].id,
      test_type: "Syphilis",
      result: "Negative",
      notes: "Regular screening",
    },

    // First user's previous results - all negative
    {
      test_record_id: records[1].id,
      test_type: "HSV-1",
      result: "Negative",
      notes: "Regular screening",
    },
    {
      test_record_id: records[1].id,
      test_type: "HIV",
      result: "Negative",
      notes: "Regular screening",
    },

    // Second user's results - managed chronic condition
    {
      test_record_id: records[3].id,
      test_type: "HSV-2",
      result: "Positive",
      notes: "Continued management, viral load undetectable",
    },
    {
      test_record_id: records[3].id,
      test_type: "HIV",
      result: "Negative",
      notes: "Regular screening",
    },
    {
      test_record_id: records[3].id,
      test_type: "Syphilis",
      result: "Negative",
      notes: "Regular screening",
    },

    // Third user's results - all negative
    {
      test_record_id: records[5].id,
      test_type: "HIV",
      result: "Negative",
      notes: "Regular screening",
    },
    {
      test_record_id: records[5].id,
      test_type: "Syphilis",
      result: "Negative",
      notes: "Regular screening",
    },
    {
      test_record_id: records[5].id,
      test_type: "Gonorrhea",
      result: "Negative",
      notes: "Regular screening",
    },

    // Fourth user's recent results - treated and cleared
    {
      test_record_id: records[6].id,
      test_type: "Chlamydia",
      result: "Negative",
      notes: "Follow-up after treatment, cleared",
    },
    {
      test_record_id: records[6].id,
      test_type: "HIV",
      result: "Negative",
      notes: "Regular screening",
    },

    // Fourth user's previous results - showing treatment success
    {
      test_record_id: records[7].id,
      test_type: "Chlamydia",
      result: "Positive",
      notes: "Treatment prescribed",
    },
    {
      test_record_id: records[7].id,
      test_type: "HIV",
      result: "Negative",
      notes: "Regular screening",
    },
  ]);
};
