const express     = require("express");
const bodyParser  = require("body-parser");
const path        = require("path");
const adminRouter = require("./routes/admin");
const shopRoutes  = require("./routes/shop");

const app = express();

// The set method allows us to configure the behavior of our server, moreover that method allows us to set global values too (see https://expressjs.com/en/4x/api.html#app.set)
app.set("view engine", "ejs"); // The default engine extension to use when omitted
app.set("views", "views"); // A directory or an array of directories for the application's views. If an array, the views are looked up in the order they occur in the array

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  console.log("In the middleware!");
  next();
});

app.use("/admin", adminRouter.routes);
app.use(shopRoutes);

app.use(function (req, res) {
  // Render method renders a view and sends the rendered HTML string to the client (check: https://expressjs.com/en/4x/api.html#res.render)
  res.status(404).render("404", { pageTitle: "404 - Page not found" });
});

app.listen(3000);
