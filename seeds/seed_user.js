export async function seed(knex) {
  await knex("users").del();
  const timestamp = new Date();

  return knex("users").insert([
    {
      name: "Maya Chen",
      screen_name: "mayac",
      email: "maya@example.com",
      birth_date: "1996-03-15",
      bio: "Software dev, poly, clear communication advocate",
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      name: "Marcus Johnson",
      screen_name: "marcusj",
      email: "marcus@example.com",
      birth_date: "1989-07-22",
      bio: "Educator, getting back into dating",
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      name: "Alex Rivera",
      screen_name: "alexr",
      email: "alex@example.com",
      birth_date: "1993-11-30",
      bio: "Artist, open relationship, kink-friendly",
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      name: "Sarah O'Connor",
      screen_name: "saraho",
      email: "sarah@example.com",
      birth_date: "1982-09-12",
      bio: "Healthcare professional, promoting good practices",
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      name: "Raj Patel",
      screen_name: "rajp",
      email: "raj@example.com",
      birth_date: "2000-05-28",
      bio: "Grad student, new to regular testing",
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    },
  ]);
}
