/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// seed_test_records.js
export async function seed(knex) {
  // Clear tables in correct order
  await knex("test_result").del();
  await knex("test_record").del();

  const users = await knex("users").select("id");
  const timestamp = new Date();

  if (!users || users.length === 0) {
    console.log("No users found. Please run users seed first.");
    return;
  }

  return knex("test_record").insert([
    // Maya's records - Consistent quarterly testing
    {
      user_id: users[0].id,
      test_date: "2024-03-15",
      file_path: "test_results/maya_march2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[0].id,
      test_date: "2023-12-15",
      file_path: null, // Manual entry from Planned Parenthood
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[0].id,
      test_date: "2023-09-15",
      file_path: "test_results/maya_sept2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[0].id,
      test_date: "2023-06-15",
      file_path: "test_results/maya_june2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },

    // Marcus's records - Recently returned to testing
    {
      user_id: users[1].id,
      test_date: "2024-02-01",
      file_path: "test_results/marcus_feb2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[1].id,
      test_date: "2023-08-01",
      file_path: "test_results/marcus_aug2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },

    // Alex's records - Regular testing for events
    {
      user_id: users[2].id,
      test_date: "2024-03-01",
      file_path: "test_results/alex_march2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[2].id,
      test_date: "2023-12-01",
      file_path: "test_results/alex_dec2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[2].id,
      test_date: "2023-09-01",
      file_path: "test_results/alex_sept2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },

    // Sarah's records - Healthcare worker comprehensive screening
    {
      user_id: users[3].id,
      test_date: "2024-02-15",
      file_path: "test_results/sarah_feb2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[3].id,
      test_date: "2023-08-15",
      file_path: "test_results/sarah_aug2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },

    // Raj's records - New to testing
    {
      user_id: users[4].id,
      test_date: "2024-03-01",
      file_path: "test_results/raj_march2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
  ]);
}
