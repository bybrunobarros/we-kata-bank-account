export const getDateFromDatetime = (date = Date.now()) =>
  new Date(date).toISOString().split("T")[0];
