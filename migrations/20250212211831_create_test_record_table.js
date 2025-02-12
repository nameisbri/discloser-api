/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("test_record", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id").onDelete("CASCADE");

    table.date("test_date").notNullable();
    table.string("file_path");

    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table.index("user_id");
    table.index("test_date");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("test_record");
};
