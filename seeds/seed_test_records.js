/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("test_record").del();

  const users = await knex("users").select("id");

  if (!users || users.length === 0) {
    console.log(
      "No users found in the database. Make sure to run the users seed first."
    );
    return;
  }

  return knex("test_record").insert([
    {
      user_id: users[0].id,
      test_date: "2024-01-15",
      file_path: "test_results/alex_jan2024.pdf",
    },
    {
      user_id: users[0].id,
      test_date: "2023-10-15",
      file_path: "test_results/alex_oct2023.pdf",
    },
    {
      user_id: users[0].id,
      test_date: "2023-07-15",
      file_path: "test_results/alex_jul2023.pdf",
    },

    {
      user_id: users[1].id,
      test_date: "2024-02-01",
      file_path: "test_results/sam_feb2024.pdf",
    },
    {
      user_id: users[1].id,
      test_date: "2023-08-01",
      file_path: "test_results/sam_aug2023.pdf",
    },

    {
      user_id: users[2].id,
      test_date: "2024-01-21",
      file_path: "test_results/jordan_jan2024.pdf",
    },

    {
      user_id: users[3].id,
      test_date: "2024-02-15",
      file_path: "test_results/morgan_feb2024.pdf",
    },
    {
      user_id: users[3].id,
      test_date: "2023-11-15",
      file_path: "test_results/morgan_nov2023.pdf",
    },

    {
      user_id: users[4].id,
      test_date: "2024-01-08",
      file_path: "test_results/pat_jan2024.pdf",
    },
  ]);
};
