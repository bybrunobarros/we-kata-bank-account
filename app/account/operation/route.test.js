import test from "ava";
import fetch from "node-fetch";
import { setupDatabase, setupServer } from "../../../test/helper/setup.js";
import { getDateFromDatetime } from "../../common/helper/get-date-from-datetime.js";

const arrange = async (t) => {
  t.context.db = await setupDatabase(t);
  await setupServer(t);
};

const defaultPostRequest = {
  method: "post",
  headers: {
    Authorization: "Bearer QWxiZXJ0",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: "deposit",
    amount: 20,
  }),
};

test("should return 401 when authentication token is not recognized", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/1/operations`, {
    headers: { Authorization: "Bearer BadToken" },
  });

  t.is(response.status, 401);
});

test("should return 403 when user id and account id don't match", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/2/operations`, {
    headers: { Authorization: "Bearer QWxiZXJ0" },
  });

  t.is(response.status, 403);
});

test("should return 422 when the body is malformed", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/1/operations`, {
    ...defaultPostRequest,
    body: JSON.stringify({
      type: "deposit",
    }),
  });

  t.is(response.status, 422);
  t.deepEqual(
    {
      status: "failed",
      body: { message: `"amount" is required` },
    },
    await response.json(),
  );
});

test("should return 422 when the operation is not recognized", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/1/operations`, {
    ...defaultPostRequest,
    body: JSON.stringify({
      type: "transfer",
      amount: 20,
    }),
  });

  t.is(response.status, 422);
  t.deepEqual(
    {
      status: "failed",
      body: { message: `"type" must be one of [deposit, withdrawal]` },
    },
    await response.json(),
  );
});

test("should return 422 when the amount is negative", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/1/operations`, {
    ...defaultPostRequest,
    body: JSON.stringify({
      type: "deposit",
      amount: -20,
    }),
  });

  t.is(response.status, 422);
  t.deepEqual(
    {
      status: "failed",
      body: { message: `"amount" must be greater than 0` },
    },
    await response.json(),
  );
});

test("should add 20 when the user makes a deposit of 20", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/1/operations`, {
    ...defaultPostRequest,
    body: JSON.stringify({
      type: "deposit",
      amount: 20,
    }),
  });

  t.is(response.status, 200);
  t.deepEqual(
    {
      status: "succeed",
      body: {
        operation: "deposit",
        amount: 20,
        balance: 100,
        date: getDateFromDatetime(),
      },
    },
    await response.json(),
  );
});

test("should subtract 20 when the user makes a withdrawal of 20", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/1/operations`, {
    ...defaultPostRequest,
    body: JSON.stringify({
      type: "withdrawal",
      amount: 20,
    }),
  });

  t.is(response.status, 200);
  t.deepEqual(
    {
      status: "succeed",
      body: {
        operation: "withdrawal",
        amount: 20,
        balance: 60,
        date: getDateFromDatetime(),
      },
    },
    await response.json(),
  );
});

test("should return 422 when balance is not enough to withdraw", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/1/operations`, {
    ...defaultPostRequest,
    body: JSON.stringify({
      type: "withdrawal",
      amount: 100,
    }),
  });

  t.is(response.status, 422);
  t.deepEqual(
    {
      status: "failed",
      body: { message: "Insufficient balance" },
    },
    await response.json(),
  );
});

test("should return a list of operations when user id and account id match", async (t) => {
  await arrange(t);

  const response = await fetch(`${t.context.prefixUrl}/accounts/1/operations`, {
    headers: { Authorization: "Bearer QWxiZXJ0" },
  });

  t.is(response.status, 200);
  t.deepEqual(
    {
      status: "succeed",
      body: [
        {
          operation: "deposit",
          amount: 100,
          balance: 100,
          date: "2020-11-01",
        },
        {
          operation: "deposit",
          amount: 20,
          balance: 120,
          date: "2020-11-02",
        },
        {
          operation: "withdrawal",
          amount: 40,
          balance: 80,
          date: "2020-11-03",
        },
      ],
    },
    await response.json(),
  );
});
