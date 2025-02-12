/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clear existing entries
  await knex("testing_reminders").del();

  // Get user IDs
  const users = await knex("users").select("id");

  // Available frequencies
  const frequencies = [
    "1_month", // Monthly
    "2_months", // Bi-monthly
    "3_months", // Quarterly
    "4_months", // Trimesterly
    "6_months", // Semi-annually
    "12_months", // Annually
  ];

  // Create reminders
  const reminders = [
    {
      user_id: users[0].id,
      frequency: "3_months",
      next_test_date: "2024-04-15",
      last_notified_date: "2024-04-01",
    },
    {
      user_id: users[1].id,
      frequency: "6_months",
      next_test_date: "2024-08-01",
      last_notified_date: null,
    },
    {
      user_id: users[2].id,
      frequency: "12_months",
      next_test_date: "2024-08-21",
      last_notified_date: null,
    },
    {
      user_id: users[3].id,
      frequency: "2_months",
      next_test_date: "2024-04-15",
      last_notified_date: null,
    },
    {
      user_id: users[4].id,
      frequency: "4_months",
      next_test_date: "2024-05-08",
      last_notified_date: null,
    },
  ];

  return knex("testing_reminders").insert(reminders);
};
