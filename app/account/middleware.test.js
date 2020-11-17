import test from "ava";
import { arrange } from "../../test/helper/arrange-middleware.js";
import { getDateFromDatetime } from "../common/helper/get-date-from-datetime.js";
import { create } from "./middleware.js";

const defaultPostRequest = {
  method: "POST",
  url: "/accounts",
  body: {
    name: "Charles",
  },
};

test("should create a new account when requested", async (t) => {
  const { db, request, response, next } = await arrange(t, defaultPostRequest);

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
