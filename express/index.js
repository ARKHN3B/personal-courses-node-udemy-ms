const express     = require("express");
const bodyParser  = require("body-parser");
const path        = require("path");
const adminRoutes = require("./routes/admin");
const shopRoutes  = require("./routes/shop");

const app = express();

// Do the body parsing before calling next internally but will not parse all kinds of possible bodies such as files or json
// See https://expressjs.com/en/resources/middleware/body-parser.html
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));

// The method "use()" allows us to add a new middleware function
// The req and res arguments extend classical methods from http core node module
app.use(function (req, res, next) {
  console.log("In the middleware!");
  next(); // Next argument is a function that allows us to travel on the next middleware
});

// We use a path filter to preset the beginning of the path (e.g. "/admin/something" here)
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(function (req, res) {
  // res
  //   .status(404)
  //   .send("<h1>404 - Page not found</h1>");
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
