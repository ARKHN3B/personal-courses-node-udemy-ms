const Product = require("../models/product");
const Cart    = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path     : "/products"
      });
    })
    .catch(console.error);
};

exports.getProduct = (req, res, next) => {
  const {id} = req.params;
  Product.findByPk(id)
    .then(product => {
      res.render("shop/product-detail", {
        product,
        pageTitle: "Product detail",
        path     : "/products"
      });
    })
    .catch(console.error);
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path     : "/"
      });
    })
    .catch(console.error)
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const detailedCart = [];
      for (const product of products) {
        const cartProduct = cart.products.find(({id}) => id === product.id);
        if (cartProduct) {
          detailedCart.push({...product, quantity: cartProduct.quantity});
        }
      }
      res.render("shop/cart", {
        path     : "/cart",
        pageTitle: "Your Cart",
        cart     : detailedCart,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const {productId} = req.body;

  Product.findById(productId, product => {
    Cart.addProduct(product.id, product.price);
  });

  res.redirect("/cart");
};

exports.postCardDeleteProduct = (req, res, next) => {
  const {id} = req.body;
  Product.findById(id, product => {
    Cart.deleteProduct(id, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path     : "/orders",
    pageTitle: "Your Orders"
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path     : "/checkout",
    pageTitle: "Checkout"
  });
};
