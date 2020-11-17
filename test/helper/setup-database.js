import { initDatabase } from "../../data/init-database.js";

export const setupDatabase = async (t) => {
  try {
    const db = initDatabase();
    t.teardown(async () => await db.migrate.down());

    await db.migrate.latest();
    await db.seed.run();

    return db;
  } catch (e) {
    console.error(e);
  }
};
