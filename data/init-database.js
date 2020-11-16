import knex from "knex";
import configs from "./knexfile.js";

export const initDatabase = () => {
  return knex(configs[process.env.NODE_ENV]);
};
