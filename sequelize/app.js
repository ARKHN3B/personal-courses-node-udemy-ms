require("dotenv").config();
const path = require("path");

const express    = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize       = require("./util/database");
const Product         = require("./models/product");
const User            = require("./models/user");
const Cart            = require("./models/cart");
const CartItem            = require("./models/cart-item");
const Order            = require("./models/order");
const OrderItem            = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes  = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // We set our user in the request each time a request passing by our middleware
  User
    .findByPk(1)
    .then(user => {
      req.user = user;
      next(); // don't forget to use the next() method to continue the process if we pass into this callback
    })
    .catch(console.error);
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// We defined some associations via sequelize
Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"}); // We set constraints on it, when we delete an user we delete his associated products too
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

// We use a junction table to make this Many to Many association
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });


// The sync method has a look at all the models we defined (with sequelize.define method) and basically creates tables
// for each of them. This method defines the relations in our database too.
sequelize
  .sync()
  // .sync({ force: true }) // overwrites the tables (warning: don't use in production!)
  .then(async result => {
    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({name: "Test", email: "test@test.com"});
    }
    console.log(user.getCart())
    const cart = await user.getCart();
    if (!cart) {
      await user.createCart();
    }
    app.listen(3000);
  })
  .catch(console.error);
