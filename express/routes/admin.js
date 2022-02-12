const express = require("express");
const path    = require("path");
const rootDir = require("../utils/path")

// The router is like a mini express app tied to our main express app
const router = express.Router();

// The path argument check if the path start with the following string only
// The filter path argument works in cascading
router.get("/add-product", function (req, res) {
  res.sendFile(path.join(rootDir, "views", "add-product.html"))
});

router.post("/add-product", function (req, res) {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
