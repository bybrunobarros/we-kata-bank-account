import test from "ava";
import httpMocks from "node-mocks-http";
import { setupDatabase } from "../../test/helper/setup-database.js";
import { getDateFromDatetime } from "../common/get-date-from-datetime.js";
import { create } from "./middleware.js";

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
        date: getDateFromDatetime(),
      },
    },
    response._getJSONData(),
  );
});
