export const up = function (knex) {
  return knex.schema.alterTable("test_record", function (table) {
    table.dateTime("test_date").alter();
  });
};

export const down = function (knex) {
  return knex.schema.alterTable("test_record", function (table) {
    table.date("test_date").alter();
  });
};
