const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path     : "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const {title, imageUrl, price, description} = req.body;

  // The create() method creates a new element based on that model and immediately adds it to our database (we can do the same build() and save it manually)
  // Product
  //   .create({title, price, description, imageUrl, userId: req.user.id})
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch(console.error);

  // Special methods/mixins added to instances
  //
  // When an association is defined between two models, the instances of those models gain special
  // methods to interact with their associated counterparts.
  // cf. https://sequelize.org/v6/manual/assocs.html#special-methods-mixins-added-to-instances
  //
  // Important, if we want to use this special methods/mixins, we need to use/mix the correct Sequelize associations.
  // e.g. here we need to use User.hasMany(Product) and not just Product.belongsTo(User)
  console.log(req.user);
  req.user
    .createProduct({title, price, description, imageUrl})
    .then(() => {
      res.redirect("/");
    })
    .catch(console.error);
};

exports.getEditProduct = (req, res, next) => {
  const {edit} = req.query; // A query parameter is always returned under a string format

  if (edit !== "true") {
    return res.redirect("/");
  }

  const {id} = req.params;

  // getProducts is a special method/mixin.
  // We use it to retrieve a product with a specific id attached to a specific user.
  req.user
    .getProducts({where: {id}})
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path     : "/admin/edit-product",
        editing  : true,
        product,
      });
    })
    .catch(console.error);
};

exports.postEditProduct = (req, res, next) => {
  const {id, title, imageUrl, description, price} = req.body;

  Product.update({title, imageUrl, description, price}, {
    where: {
      id
    }
  })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(console.error);
};

exports.postDeleteProduct = (req, res, next) => {
  const {id} = req.params;
  if (!id) {
    return res.redirect("/admin/products");
  }
  Product.destroy({where: {id}})
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(console.error);
};

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user.getProducts()
    .then(products => {
      res.render("admin/products", {
        products : products,
        pageTitle: "Admin Products",
        path     : "/admin/products"
      });
    })
    .catch(console.error);
};
