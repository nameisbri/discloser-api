/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// seed_test_results.js
export async function seed(knex) {
  await knex("test_result").del();

  const records = await knex("test_record").select("id", "test_date");
  const timestamp = new Date();

  if (!records || records.length === 0) {
    console.log("No test records found. Please run test_record seeds first.");
    return;
  }

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

  const results = [];

  // Maya's results - Comprehensive testing, all negative
  records.slice(0, 4).forEach((record) => {
    testTypes.forEach((type) => {
      results.push({
        test_record_id: record.id,
        test_type: type,
        result: "Negative",
        notes: "Regular quarterly screening",
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      });
    });
  });

  // Marcus's results - Basic panel as he returns to dating
  records.slice(4, 6).forEach((record) => {
    testTypes.slice(0, 4).forEach((type) => {
      results.push({
        test_record_id: record.id,
        test_type: type,
        result: "Negative",
        notes: "Returning to regular testing post-divorce",
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      });
    });
  });

  // Alex's results - Full panel, managed HSV-2
  records.slice(6, 9).forEach((record) => {
    testTypes.forEach((type) => {
      results.push({
        test_record_id: record.id,
        test_type: type,
        result: type === "HSV-2" ? "Positive" : "Negative",
        notes:
          type === "HSV-2"
            ? "Managed with antivirals, viral load undetectable"
            : "Regular testing for events",
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      });
    });
  });

  // Sarah's results - Healthcare worker comprehensive panel
  records.slice(9, 11).forEach((record) => {
    testTypes.forEach((type) => {
      results.push({
        test_record_id: record.id,
        test_type: type,
        result: "Negative",
        notes: "Healthcare worker comprehensive screening",
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      });
    });
  });

  // Raj's results - First-time testing basic panel
  testTypes.slice(0, 4).forEach((type) => {
    results.push({
      test_record_id: records[records.length - 1].id,
      test_type: type,
      result: "Negative",
      notes: "Initial screening panel",
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    });
  });

  return knex("test_result").insert(results);
}
