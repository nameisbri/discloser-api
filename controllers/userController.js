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
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Attempting to retrieve user with ID: ${id}`); // Log user ID

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

    console.log("SQL Query executed successfully"); // Log success

    if (!user) {
      console.log(`User with ID: ${id} not found`); // Log user not found
      return res.status(404).json({ error: "User not found" });
    }

    // Only return active users
    if (!user.is_active) {
      console.log(`User with ID: ${id} is not active`); // Log inactive user
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Error retrieving user" });
  }
};
