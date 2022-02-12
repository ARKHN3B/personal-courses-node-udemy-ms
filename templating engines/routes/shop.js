const express = require("express");
const path = require("path");
const { data } = require("./admin");

const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("shop", { pageTitle: "The shop", products: data?.products, pathname: "/", });
});

module.exports = router;
