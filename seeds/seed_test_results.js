/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
  await knex("test_result").del();

  const records = await knex("test_record").select(
    "id",
    "user_id",
    "test_date"
  );
  const timestamp = new Date();

  if (!records || records.length === 0) {
    console.log("No test records found. Please run test_record seeds first.");
    return;
  }

  const users = await knex("users").select("id", "name");
  const [maya, marcus, alex, sarah, raj] = users;

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

  const getUserRecords = (userId) =>
    records.filter((r) => r.user_id === userId);

  getUserRecords(maya.id).forEach((record) => {
    testTypes.forEach((type) => {
      results.push({
        test_record_id: record.id,
        test_type: type,
        result: "Negative",
        notes: "Regular quarterly screening for poly lifestyle",
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      });
    });
  });

  getUserRecords(marcus.id).forEach((record) => {
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

  getUserRecords(alex.id).forEach((record) => {
    testTypes.forEach((type) => {
      results.push({
        test_record_id: record.id,
        test_type: type,
        result: type === "HSV-2" ? "Positive" : "Negative",
        notes:
          type === "HSV-2"
            ? "Managed with antivirals, maintaining for event requirements"
            : "Regular testing for community events",
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      });
    });
  });

  getUserRecords(sarah.id).forEach((record) => {
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

  getUserRecords(raj.id).forEach((record) => {
    testTypes.slice(0, 4).forEach((type) => {
      results.push({
        test_record_id: record.id,
        test_type: type,
        result: "Negative",
        notes: "Initial screening panel",
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      });
    });
  });

  return knex("test_result").insert(results);
}
