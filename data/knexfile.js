// knex migrate:latest --esm --env development
// knex seed:run --esm
import { join } from "path";

export default {
  development: {
    client: "sqlite3",
    connection: {
      filename: join(process.cwd(), "dev.db"),
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(process.cwd(), "./migrations"),
      loadExtensions: [".mjs"],
    },
    seeds: {
      directory: join(process.cwd(), "./seeds"),
      loadExtensions: [".mjs"],
    },
  },

  test: {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
    migrations: {
      directory: join(process.cwd(), "./migrations"),
      loadExtensions: [".mjs"],
    },
    seeds: {
      directory: join(process.cwd(), "./seeds"),
      loadExtensions: [".mjs"],
    },
  },
};
