import test from "ava";
import { arrange } from "../../test/helper/arrange-middleware.js";
import { authenticate } from "./middleware.js";

const defaultGetRequest = {
  method: "GET",
  url: "/accounts/1/operations",
  headers: {
    Authorization: "Bearer QWxiZXJ0",
  },
  params: {
    accountId: 1,
  },
  context: {},
};

test("should return 401 when authentication token is not recognized", async (t) => {
  const { db, request, response, next } = await arrange(t, {
    ...defaultGetRequest,
    ...{ headers: { Authorization: "BadToken" } },
  });

  await authenticate(db)(request, response, next);

  t.is(response._getStatusCode(), 401);
});

test("should add the user to the request context when the user exists", async (t) => {
  const { db, request, response, next } = await arrange(t, defaultGetRequest);

  await authenticate(db)(request, response, next);

  t.is(request.context.user.id, 1);
});
