// knex migrate:latest --esm --env development
// knex seed:run --esm
import { join } from "path";

const findPath = (source) => {
  const currentDirectory = process.cwd();
  return currentDirectory.includes("data")
    ? join(currentDirectory, source)
    : join(currentDirectory, "data", source);
};

export default {
  development: {
    client: "sqlite3",
    connection: {
      filename: findPath("dev.db"),
    },
    useNullAsDefault: true,
    migrations: {
      directory: findPath("migrations"),
      loadExtensions: [".mjs"],
    },
    seeds: {
      directory: findPath("seeds"),
      loadExtensions: [".mjs"],
    },
  },

  test: {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
    migrations: {
      directory: findPath("migrations"),
      loadExtensions: [".mjs"],
    },
    seeds: {
      directory: findPath("seeds"),
      loadExtensions: [".mjs"],
    },
  },
};
