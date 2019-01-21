const express = require("express"),
  app = express(),
  market = require("./src/stocks"),
  profile = require("./src/profile"),
  bodyParser = require("body-parser"),
  PORT = process.env.PORT || 1337;

app.use(express.static("static"));
app.use(bodyParser.json());

app.get("/api/stocks", (req, res, next) => {
  const history = market.history;
  res.send(history);
});

app.post("/api/profile/create", async (req, res, next) => {
  let newProfile = {};
  try {
    newProfile = await profile.registerNew({ ...req.body });
    res.send(newProfile.toJSON());
  } catch (e) {
    console.error(e);
    res.status(e.code || 500);
    res.send(e);
  }
});

app.post("/api/profile/check-password", async (req, res, next) => {
  let resp = {};
  try {
    resp = await profile.checkPassword({ ...req.body });
    res.send(resp);
  } catch (e) {
    console.error(e);
    res.status(e.code || 500);
    res.send(e);
  }
});

app.post("/api/profile/convert", async (req, res, next) => {
  // TODO: make call authorization-based
  const user = await profile.findOne({ username: req.body.username });

  try {
    const resp = await user.convertCurrency({
      ...req.body,
      stocks: market.history[market.history.length - 1]
    });
    res.send(resp.toJSON());
  } catch (e) {
    console.error(e);
    res.status(e.code || 500);
    res.send(e);
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
