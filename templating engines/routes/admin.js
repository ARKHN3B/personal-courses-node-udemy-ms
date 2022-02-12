const express = require("express");
const path    = require("path");
const rootDir = require("../utils/path");

const router = express.Router();

const products = [];

router.get("/add-product", function (req, res) {
  res.render("add-product", {
    pageTitle: "Add a product",
    pathname: "/admin/add-product",
  });
});

router.post("/add-product", function (req, res) {
  products.push({title: req.body.title});
  res.redirect("/");
});

module.exports = {
  routes: router,
  data  : {
    products
  },
};
