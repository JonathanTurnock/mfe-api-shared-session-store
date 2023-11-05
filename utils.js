const { config } = require("./config");
const { sign } = require("cookie-signature");
const createHttpError = require("http-errors");

const getSessionHeaders = (req) => {
  const signedSessionId = `s:${sign(
    req.sessionID,
    config.sessionCookieSecret,
  )}`;

  return {
    cookie: `${config.sessionCookieName}=${encodeURIComponent(
      signedSessionId,
    )}`,
  };
};

const withSession = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.send(createHttpError(401));
  }
};

module.exports = { getSessionHeaders, withSession };
