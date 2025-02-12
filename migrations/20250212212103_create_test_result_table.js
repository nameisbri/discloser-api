/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("test_result", (table) => {
    table.increments("id").primary();
    table.integer("test_record_id").unsigned().notNullable();
    table
      .foreign("test_record_id")
      .references("test_record.id")
      .onDelete("CASCADE");

    table.string("test_type").notNullable(); // e.g., 'HIV', 'Syphilis', etc.
    table.string("result").notNullable(); // e.g., 'Negative', 'Positive', 'Inconclusive'
    table.text("notes"); // Any additional information

    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(true, true);

    table.index("test_record_id");
    table.index("test_type");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("test_result");
};
