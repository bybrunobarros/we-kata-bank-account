export const create = (/* db */) => (req, res) => {
  res.json({
    status: "succeed",
    body: {
      id: 3,
      date: new Date().toISOString().split("T")[0],
    },
  });
};
