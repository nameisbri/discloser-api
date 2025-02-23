/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
  await knex("testing_reminders").del();

  const users = await knex("users").select("id");
  const timestamp = new Date();

  if (!users || users.length === 0) {
    console.log("No users found. Please run users seed first.");
    return;
  }

  return knex("testing_reminders").insert([
    {
      user_id: users[0].id, // Maya - Strict quarterly testing
      frequency: "3_months",
      next_test_date: "2024-06-15",
      last_notified_date: null,
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[1].id, // Marcus - Semi-annual testing
      frequency: "6_months",
      next_test_date: "2024-08-01",
      last_notified_date: null,
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[2].id, // Alex - Quarterly for events
      frequency: "3_months",
      next_test_date: "2024-06-01",
      last_notified_date: null,
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[3].id, // Sarah - Healthcare worker schedule
      frequency: "6_months",
      next_test_date: "2024-08-15",
      last_notified_date: null,
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      user_id: users[4].id, // Raj - New quarterly schedule
      frequency: "3_months",
      next_test_date: "2024-06-01",
      last_notified_date: null,
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
  ]);
}
