/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("testing_reminders", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id").onDelete("CASCADE");

    table.string("frequency").notNullable(); // e.g., '3_months', '6_months', '1_year'
    table.date("next_test_date").notNullable();
    table.date("last_notified_date");

    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index("user_id");
    table.index("next_test_date");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("testing_reminders");
};
