const MongoStore = require("connect-mongo");

const config = {
  sessionCookieSecret: "38afes7J#l!ao!32sdLJ@l1$fd&sD*12",
  sessionCookieName: "connect.sid",
  sessionStore: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/sessions",
    ttl: 300,
    stringify: false,
  }),
};

module.exports = { config };
