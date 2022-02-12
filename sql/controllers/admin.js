const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path     : "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const title       = req.body.title;
  const imageUrl    = req.body.imageUrl;
  const price       = req.body.price;
  const description = req.body.description;
  const product     = new Product(null, title, imageUrl, description, price);
  product.save()
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

  Product.findById(id, product => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path     : "/admin/edit-product",
      editing  : true,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const {id, title, imageUrl, description, price} = req.body;
  const updatedProduct                            = new Product(id, title, imageUrl, description, price);
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const {id} = req.params;
  if (!id) {
    return res.redirect("/admin/products");
  }
  Product.deleteById(id, () => {
    return res.redirect("/admin/products");
  })
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("admin/products", {
      products : products,
      pageTitle: "Admin Products",
      path     : "/admin/products"
    });
  });
};
