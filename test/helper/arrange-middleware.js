import httpMocks from "node-mocks-http";
import { sendError, sendPayload } from "../../app/common/middleware/send.js";
import { setupDatabase } from "./setup.js";

export const arrange = async (t, defaultRequest) => {
  const db = await setupDatabase(t);
  const request = httpMocks.createRequest(defaultRequest);
  let response = httpMocks.createResponse();
  response = {
    ...response,
    ...{ sendError: sendError(response), sendPayload: sendPayload(response) },
  };
  const next = () => {};

  return { db, request, response, next };
};
