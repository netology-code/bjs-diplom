const express = require("express"),
  app = express(),
  market = require("./src/stocks"),
  PORT = process.env.PORT || 1337;

app.use(express.static("static"));

app.get("/api/stocks", (req, res, next) => {
  const history = market.history;
  res.send(history);
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
