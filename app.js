const express = require("express"),
  app = express(),
  market = require("./src/stocks"),
  profile = require("./src/profile"),
  jwt = require("./src/jwt"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  PORT = process.env.PORT || 1337;

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.authorization;
    const user = await jwt.verify(token);
    req._user = await profile.findById(user._doc._id);
    next();
  } catch (e) {
    console.error(e);
    res.status(403).send({
      code: 403,
      message: "Authentication failure"
    });
  }
};

app.use(express.static("static"));
app.use(bodyParser.json());
app.use(cookieParser());

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

app.post("/api/profile/login", async (req, res, next) => {
  try {
    await profile.checkPassword({ ...req.body });
    const user = await profile.findOne({ username: req.body.username });
    const token = await jwt.sign({ ...user });
    res.setHeader("Set-Cookie", `authorization=${token}`);
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(e.code || 500);
    res.send(e);
  }
});

app.post("/api/profile/convert", authenticate, async (req, res, next) => {
  const user = req._user;

  try {
    const resp = await user.convertCurrency({
      ...req.body,
      ...user,

      stocks: market.history[market.history.length - 1]
    });
    res.send(resp.toJSON());
  } catch (e) {
    console.error(e);
    res.status(e.code || 500);
    res.send(e);
  }
});

app.post("/api/profile/transfer", authenticate, async (req, res, next) => {
  const user = req._user;

  try {
    const resp = await user.transfer({ ...req.body });
    res.send(resp);
  } catch (e) {
    console.error(e);
    res.status(e.code || 500);
    res.send(e);
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
