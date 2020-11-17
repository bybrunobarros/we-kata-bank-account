import httpMocks from "node-mocks-http";
import { setupDatabase } from "./setup.js";

export const arrange = async (t, defaultRequest) => {
  const db = await setupDatabase(t);
  const request = httpMocks.createRequest(defaultRequest);
  const response = httpMocks.createResponse();
  const next = () => {};

  return { db, request, response, next };
};
