const express = require("express");
const axios = require("axios");
const { getSessionHeaders } = require("../utils");
const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  req.session.views = (req.session.views || 0) + 1;
  req.session.save(() =>
    axios
      .get("http://localhost:3001/api", {
        headers: { ...getSessionHeaders(req) },
      })
      .then((it) =>
        res.render("index", {
          title: "Express",
          username: req.session.username,
          views: req.session.views,
          apiViews: it.data.views,
        }),
      ),
  );
});

module.exports = router;
