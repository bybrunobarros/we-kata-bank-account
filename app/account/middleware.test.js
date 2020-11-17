import test from "ava";
import httpMocks from "node-mocks-http";
import { initDatabase } from "../../data/init-database.js";
import { create } from "./middleware.js";

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

const defaultPostRequest = {
  method: "POST",
  url: "/accounts",
  body: {
    name: "Charles",
  },
};

test("should create a new account when requested", async (t) => {
  const db = await setupDatabase(t);
  const request = httpMocks.createRequest(defaultPostRequest);
  let response = httpMocks.createResponse();
  const next = () => {};

  await create(db)(request, response, next);

  t.deepEqual(
    {
      status: "succeed",
      body: {
        id: 3,
        date: new Date().toISOString().split("T")[0],
      },
    },
    response._getJSONData(),
  );
});
