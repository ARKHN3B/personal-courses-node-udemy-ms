const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        prods    : products,
        pageTitle: "All Products",
        path     : "/products"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const {productId} = req.params;
  Product.findById(productId)
    .then(product => {
      res.render("shop/product-detail", {
        product  : product,
        pageTitle: product.title,
        path     : "/products"
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/index", {
        prods    : products,
        pageTitle: "Shop",
        path     : "/"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render("shop/cart", {
        path     : "/cart",
        pageTitle: "Your Cart",
        products,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const {productId} = req.body;
  Product.findById(productId)
    .then(product => req.user.addToCart(product))
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const {productId} = req.body;
  req.user
    .deleteItemFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
