const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");

const session = require("express-session");
const { config } = require("./config");
const { withSession } = require("./utils");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    name: config.sessionCookieName,
    secret: config.sessionCookieSecret,
    store: config.sessionStore,
    saveUninitialized: false,
    resave: false,
  }),
);

app.use("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api", withSession, (req, res) => {
  res.send({ status: "OK", views: req.session.views });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json(err);
});

app.listen(3001);
