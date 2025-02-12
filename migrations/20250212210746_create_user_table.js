/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();

    table.string("name").notNullable();
    table.string("screen_name").notNullable().unique();
    table.string("email").notNullable().unique();

    table.date("birth_date");
    table.text("bio");

    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table.index("email");
    table.index("screen_name");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
