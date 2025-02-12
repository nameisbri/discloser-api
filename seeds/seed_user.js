/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clear existing entries
  await knex("users").del();

  // Seed users
  return knex("users").insert([
    {
      name: "Alex Chen",
      screen_name: "alexc",
      email: "alex@example.com",
      birth_date: "1990-05-15",
      bio: "Health conscious and proactive about testing",
    },
    {
      name: "Sam Taylor",
      screen_name: "samt",
      email: "sam@example.com",
      birth_date: "1988-12-03",
      bio: "Regular tester, advocate for health awareness",
    },
    {
      name: "Jordan Lee",
      screen_name: "jlee",
      email: "jordan@example.com",
      birth_date: "1992-08-21",
      bio: "New to regular testing",
    },
    {
      name: "Morgan Smith",
      screen_name: "msmith",
      email: "morgan@example.com",
      birth_date: "1995-03-30",
      bio: "Passionate about sexual health education",
    },
    {
      name: "Pat Johnson",
      screen_name: "pjohnson",
      email: "pat@example.com",
      birth_date: "1991-11-08",
      bio: "Advocate for regular testing",
    },
  ]);
};
