const Product = require("../models/product");

function getAddProduct(req, res) {
  res.render("add-product", {
    pageTitle: "Add a product",
    pathname : "/admin/add-product",
  });
}

function postAddProduct(req, res) {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
}

function getProducts(req, res, next) {
  Product.fetchAll(products => {
    res.render("shop", {pageTitle: "The shop", products, pathname: "/",});
  });
}

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
};
