/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
  await knex("test_result").del();
  await knex("test_record").del();

  const users = await knex("users").select("id");
  const timestamp = new Date();

  if (!users || users.length === 0) {
    console.log("No users found. Please run users seed first.");
    return;
  }

  const [alex, marcus, maya, raj, sarah] = users;

  return knex("test_record").insert([
    {
      user_id: maya.id,
      test_date: "2024-03-15",
      file_path: "test_results/maya_march2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: maya.id,
      test_date: "2023-12-15",
      file_path: null, // Manual entry
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: maya.id,
      test_date: "2023-09-15",
      file_path: "test_results/maya_sept2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: maya.id,
      test_date: "2023-06-15",
      file_path: "test_results/maya_june2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },

    {
      user_id: marcus.id,
      test_date: "2024-02-01",
      file_path: "test_results/marcus_feb2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: marcus.id,
      test_date: "2023-08-01",
      file_path: "test_results/marcus_aug2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },

    // Alex's records - Non-binary artist, kink-friendly
    {
      user_id: alex.id,
      test_date: "2024-03-01",
      file_path: "test_results/alex_march2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: alex.id,
      test_date: "2023-12-01",
      file_path: "test_results/alex_dec2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: alex.id,
      test_date: "2023-09-01",
      file_path: "test_results/alex_sept2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },

    // Sarah's records - Healthcare worker
    {
      user_id: sarah.id,
      test_date: "2024-02-15",
      file_path: "test_results/sarah_feb2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: sarah.id,
      test_date: "2023-08-15",
      file_path: "test_results/sarah_aug2023.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },

    {
      user_id: raj.id,
      test_date: "2024-03-01",
      file_path: "test_results/raj_march2024.pdf",
      created_at: timestamp,
      updated_at: timestamp,
    },
  ]);
}
