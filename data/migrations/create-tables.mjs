const up = (knex) =>
  knex.schema
    .createTable("user", (table) => {
      table.increments().unsigned().primary();
      table.string("name").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("account", (table) => {
      table.increments().unsigned().primary();
      table.integer('user_id').unsigned();
      table.foreign("user_id").references("id").inTable("user");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("operation", (table) => {
      table.increments().unsigned().primary();
      table.integer('account_id').unsigned();
      table.foreign("account_id").references("id").inTable("account");
      table.integer('user_id').unsigned();
      table.foreign("user_id").references("id").inTable("user");
      table.string("type").notNullable();
      table.integer("amount").notNullable();
      table.integer("balance").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });

const down = (knex) => knex.schema.dropTable("operation").dropTable("account").dropTable("user");

export {up, down}
