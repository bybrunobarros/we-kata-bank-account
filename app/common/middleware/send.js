import httpStatus from "http-status";

const sendError = (res) => (httpCode, message = "") => {
  res.status(httpCode);
  return res.json({
    status: "failed",
    body: { message: message || httpStatus[httpCode] },
  });
};

const sendPayload = (res) => (format, data) => {
  if (Array.isArray(data)) {
    return res.status(httpStatus.OK).json({
      status: "succeed",
      body: data.map(format),
    });
  }

  return res.status(httpStatus.OK).json({
    status: "succeed",
    body: format(data),
  });
};

export { sendError, sendPayload };
