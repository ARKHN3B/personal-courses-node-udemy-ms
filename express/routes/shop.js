const express = require("express");
const path = require("path");

// The router is like a mini express app tied to our main express app
const router = express.Router();

// The req and res arguments extend classical methods from http core node module
router.get("/", function (req, res, next) {
  // console.log("In another middleware!");
  // The default Content-Type header for the send method is "text/html"
  /**
   * res.send("<h1>Hello from Express!</h1>");
   **/
  // The sendFile method sets automatically the Content-Type header of the response
  res.sendFile(path.join(__dirname, "../", "views", "shop.html")); // __dirname is a global variable that gives us the absolute OS path to the current folder of this file (e.g. here "routes")
});

module.exports = router;
