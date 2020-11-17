import http from "http";
import listen from "test-listen";
import { createApp } from "../../app/index.js";
import { initDatabase } from "../../data/init-database.js";

const setupDatabase = async (t) => {
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

const setupServer = async (t) => {
  const server = http.createServer(createApp(t.context.db));
  t.context.prefixUrl = await listen(server);
  t.teardown(() => server.close());
};

export { setupDatabase, setupServer };
