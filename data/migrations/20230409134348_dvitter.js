/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("roles", (r) => {
      r.increments("role_id");
      r.string("rolename", 64).notNullable().unique();
    })
    .createTable("users", (u) => {
      u.increments("user_id");
      u.string("username", 255).notNullable().unique();
      u.string("email", 128).notNullable().unique();
      u.string("password", 255).notNullable();
      u.integer("role_id")
        .notNullable()
        .unsigned()
        .references("role_id")
        .inTable("roles")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("dwitler", (t) => {
      t.increments("dwit_id");
      t.string("dwit").notNullable();
      t.timestamp("dwit_date").defaultTo(knex.fn.now());
      t.integer("user_id")
        .notNullable()
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("dwit_comments", (t) => {
      t.increments("comment_id");
      t.string("dwit_comment").notNullable();
      t.timestamp("comment_date").defaultTo(knex.fn.now());
      t.integer("user_id")
        .notNullable()
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      t.integer("dwit_id")
        .notNullable()
        .unsigned()
        .references("dwit_id")
        .inTable("dwitler")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("dwit_comments")
    .dropTableIfExists("dwitler")
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};
