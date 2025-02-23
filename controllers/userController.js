import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const createUser = async (req, res) => {
  try {
    const { name, screen_name, avatar_file_path, email, birth_date, bio } =
      req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!screen_name) {
      return res.status(400).json({ error: "Screen name is required" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingEmail = await knex("users").where({ email }).first();

    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const existingScreenName = await knex("users")
      .where({ screen_name })
      .first();

    if (existingScreenName) {
      return res.status(409).json({ error: "Screen name already exists" });
    }

    const [newUser] = await knex("users")
      .insert({
        name,
        screen_name,
        email,
        birth_date: birth_date || null,
        bio: bio || null,
        avatar_file_path,
        is_active: 1,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      })
      .returning([
        "id",
        "name",
        "screen_name",
        "avatar_file_path",
        "email",
        "birth_date",
        "bio",
        "is_active",
      ]);

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await knex("users")
      .select([
        "id",
        "name",
        "screen_name",
        "avatar_file_path",
        "email",
        "birth_date",
        "bio",
        "is_active",
        "created_at",
        "updated_at",
      ])
      .where({ id })
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only return active users
    if (!user.is_active) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving user" });
  }
};
