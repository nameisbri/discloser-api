exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.string("avatar_file_path");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("avatar_file_path");
  });
};
